CREATE TABLE users(
    user_id BIGINT PRIMARY KEY,
    last_sync TIMESTAMP,
    ms_to_clicks REAL,
    available_clicks SMALLINT,
    max_available_clicks  SMALLINT,
    clicks_count BIGINT,
    clicks_ratio SMALLINT,
    clicks_per_ms REAL
);

CREATE TABLE init_data(
    ms_to_clicks REAL,
    available_clicks SMALLINT,
    max_available_clicks  SMALLINT,
    clicks_count BIGINT,
    clicks_ratio SMALLINT,
    clicks_per_ms REAL
);

CREATE TABLE upgrades(
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    upgrade_id SMALLINT PRIMARY KEY,
    upgrade_level SMALLINT
);

CREATE TABLE upgrades_templates(
    upgrade_id SMALLINT PRIMARY KEY,
    name VARCHAR(255),
    description  VARCHAR(255),
    price BIGINT,
    effects VARCHAR(255)
);