const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const db = require('./src/database');
const Clicker = require('./src/Clicker');

const init_data = require('./src/init_data');
const upgrades = require('./src/upgrades');

const SERVER_PORT = process.env.SERVER_PORT;
const BOT_TOKEN = process.env.BOT_TOKEN;

const clicker = new Clicker({
  database: db,
  init_data: init_data,
  upgrades: upgrades
});

const app = express();

app.use(express.json());
app.use(cors());

app.post('/api/upgrades', async (req, res) => {
  const initData = req.get("authorization");

  if (validate_user(initData)) {
    res.send(upgrades);
  } else {
    res.sendStatus(400);
  }
});

app.post('/api/sync', async (req, res) => {
  const initData = req.get("authorization");

  if (validate_user(initData)) {
    const initData_user = JSON.parse(decodeURIComponent(initData).split("&").filter(elem => elem.startsWith('user='))[0]?.replace('user=', ''));

    await clicker.sync(initData_user.id, req.body);

    const user = (await db.query('SELECT * FROM users WHERE user_id = $1', [initData_user.id])).rows[0];
    user.upgrades = (await db.query('SELECT * FROM upgrades WHERE user_id = $1', [initData_user.id])).rows;
    user.upgrades = Object.fromEntries(user.upgrades.map(upgrade => [upgrade.upgrade_id, upgrade]))

    res.send({
      user: user
    })
  } else {
    res.sendStatus(400);
  }
});

app.post('/api/buy', async (req, res) => {
  const initData = req.get("authorization");

  if (validate_user(initData)) {
    const initData_user = JSON.parse(decodeURIComponent(initData).split("&").filter(elem => elem.startsWith('user='))[0]?.replace('user=', ''));

    await clicker.buy(initData_user.id, req.body);

    const user = (await db.query('SELECT * FROM users WHERE user_id = $1', [initData_user.id])).rows[0];
    user.upgrades = (await db.query('SELECT * FROM upgrades WHERE user_id = $1', [initData_user.id])).rows;
    user.upgrades = Object.fromEntries(user.upgrades.map(upgrade => [upgrade.upgrade_id, upgrade]))

    res.send({
      user: user
    });
  } else {
    res.sendStatus(400);
  }
});

function validate_user(token) {
  const initData = token;
  if (typeof(initData) == 'string') {
    const hash = initData.split("&").filter(elem => elem.startsWith('hash='))[0]?.replace('hash=','');

    const data_check_string = decodeURIComponent(initData).split('&').sort().filter(elem => !elem.startsWith('hash=')).join('\n')

    const secret_key = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest()
    const real_hash = crypto.createHmac('sha256', secret_key).update(data_check_string).digest("hex")

    return hash == real_hash;
  }
  return false
}

app.listen(SERVER_PORT);