class Clicker {
    constructor(options) {
        this.db = options.database;
        this.init_data = options.init_data;
        this.upgrades = options.upgrades;
    }

    async sync(user_id, body) {
        const user = (await this.db.query('SELECT * FROM users WHERE user_id = $1', [user_id]))?.rows[0];
        if (user) {
            user.last_sync = new Date(user.last_sync).getTime();
        
            const current_time = Date.now();
            const last_sync = user.last_sync;
            const delta_time = current_time - last_sync;
        
            const max_clicks = Math.floor(delta_time * user.ms_to_clicks) + user.available_clicks;
            if(body.clicks_count > max_clicks) {
                body.clicks_count = max_clicks
            }
        
            const new_clicks_count = Number(user.clicks_count) + body.clicks_count * user.clicks_ratio + Math.floor(delta_time * user.clicks_per_ms)
            await this.db.query('UPDATE users SET last_sync=$1 WHERE user_id=$2', [new Date(current_time), user_id]);
            await this.db.query('UPDATE users SET clicks_count=$1 WHERE user_id=$2', [new_clicks_count, user_id]);
        
            user.available_clicks = max_clicks - body.clicks_count
            if(user.available_clicks > user.max_available_clicks) {
                user.available_clicks = user.max_available_clicks
            }
            await this.db.query('UPDATE users SET available_clicks=$1 WHERE user_id=$2', [user.available_clicks, user_id]);
        } else {
            await this.db.query('INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [user_id, new Date(), ...Object.values(this.init_data)]);
        }
    }

    async buy(user_id, body) {
        const user = (await this.db.query('SELECT * FROM users WHERE user_id = $1', [user_id])).rows[0];
        const new_clicks_count = user.clicks_count - this.upgrades[body.upgrade_id].price;

        if (new_clicks_count >= 0) {
            await this.db.query('UPDATE users SET clicks_count=$1 WHERE user_id=$2', [new_clicks_count, user_id]);
            const upgrade = (await this.db.query('SELECT * FROM upgrades WHERE user_id=$1 AND upgrade_id=$2', [user_id, body.upgrade_id])).rows[0];

            if (!upgrade) {
                await this.db.query('INSERT INTO upgrades VALUES ($1, $2, $3)', [user_id, body.upgrade_id, 1]);
            } else {
                const new_upgrade_level = upgrade.upgrade_level + 1;
                await this.db.query('UPDATE upgrades SET upgrade_level=$3 WHERE user_id=$1 AND upgrade_id=$2', [user_id, body.upgrade_id, new_upgrade_level]);
            }

            for (const effect in this.upgrades[body.upgrade_id].effects) {
                const new_effect = this.upgrades[body.upgrade_id].effects[effect](user[effect]);
                await this.db.query(`UPDATE users SET ${effect}=$2 WHERE user_id=$1`, [user_id, new_effect]);
            }
        }
    }
}

module.exports = Clicker