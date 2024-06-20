const { Client } = require('pg')

const connectionString = `postgres://postgres.bpcgvwkjpjkrpnkkemxu:${process.env.PASSWORD}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`

const client = new Client({
  connectionString: connectionString
})

client.connect()

module.exports = client