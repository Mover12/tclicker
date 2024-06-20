class Clicker {
    constructor(options) {
        this.url = options.url;
        this.token = options.token;
    }

    async sync() {
        const res = this.send('/api/sync', {
            clicks_count: localStorage.getItem('clicks') || 0
        })
        localStorage.setItem('clicks', 0)
        return res
    }

    async buy(upgrade_id) {
        const res = this.send('/api/buy', {
            upgrade_id: upgrade_id
        })
        return res
    }

    async upgrades() {
        const res = this.send('/api/upgrades')
        return res
    }

    async send(router, body, method='post') {
        return fetch(this.url + router, {
            method: method,
            headers: {
                "authorization": this.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
    }
}

export default Clicker;