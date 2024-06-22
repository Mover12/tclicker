class Clicker {
    constructor(options) {
        this.db = options.database
    }

    async sync(user_id, body) {
        const user = (await this.db.query(`SELECT * FROM ${body.schema}.users WHERE user_id=${user_id}`))?.rows[0]
        if (user) {
            user.last_sync = new Date(user.last_sync).getTime()
        
            const current_time = Date.now()
            const last_sync = user.last_sync
            const delta_time = current_time - last_sync
        
            const max_clicks = Math.floor(delta_time * user.ms_to_clicks) + user.available_clicks
            if(body.clicks_count > max_clicks) {
                body.clicks_count = max_clicks
            }
        
            const new_clicks_count = Number(user.clicks_count) + body.clicks_count * user.clicks_ratio + Math.floor(delta_time * user.clicks_per_ms)
            
            await this.db.query(`UPDATE ${body.schema}.users SET last_sync=$1 WHERE user_id=${user_id}`, [new Date(current_time)])
            await this.db.query(`UPDATE ${body.schema}.users SET clicks_count=${new_clicks_count} WHERE user_id=${user_id}`)
        
            user.available_clicks = max_clicks - body.clicks_count
            if(user.available_clicks > user.max_available_clicks) {
                user.available_clicks = user.max_available_clicks
            }

            await this.db.query(`UPDATE ${body.schema}.users SET available_clicks=${user.available_clicks} WHERE user_id=${user_id}`)
        } else {
            const init_data = (await this.db.query(`SELECT * FROM ${body.schema}.init_data`)).rows[0]
            await this.db.query(`INSERT INTO ${body.schema}.users VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [user_id, new Date(), ...Object.values(init_data)])
        }
    }

    async buy(user_id, body) {
        const user = (await this.db.query(`SELECT * FROM ${body.schema}.users WHERE user_id=${user_id}`)).rows[0]
        const upgrade_template = (await this.db.query(`SELECT * FROM ${body.schema}.upgrades_templates WHERE upgrade_id=${body.upgrade_id}`))?.rows[0]

        const new_clicks_count = user.clicks_count - upgrade_template?.price

        if (new_clicks_count >= 0) {
            await this.db.query(`UPDATE ${body.schema}.users SET clicks_count=${new_clicks_count} WHERE user_id=${user_id}`)
            const upgrade = (await this.db.query(`SELECT * FROM ${body.schema}.upgrades WHERE user_id=${user_id} AND upgrade_id=${body.upgrade_id}`)).rows[0]

            if (!upgrade) {
                await this.db.query(`INSERT INTO ${body.schema}.upgrades VALUES (${user_id}, ${body.upgrade_id}, ${1})`)
            } else {
                await this.db.query(`UPDATE ${body.schema}.upgrades SET upgrade_level=${upgrade.upgrade_level + 1} WHERE user_id=${user_id} AND upgrade_id=${body.upgrade_id}`)
            }

            const effects = JSON.parse(upgrade_template.effects)
            
            for (const value in effects) {
                const new_value = Function('value', effects[value])(user[value])
                await this.db.query(`UPDATE ${body.schema}.users SET ${value}=${new_value} WHERE user_id=${user_id}`)
            }
        }
    }
}

module.exports = Clicker