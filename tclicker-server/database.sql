CREATE TABLE client(
    user_id BIGINT PRIMARY KEY,
    last_sync TIMESTAMP,
    ms_to_clicks REAL,
    available_clicks SMALLINT,
    max_available_clicks  SMALLINT,
    clicks_count BIGINT,
    clicks_ratio BIGINT,
    clicks_per_ms SMALLINT
);

CREATE TABLE upgrade(
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES client (user_id),
    upgrade_id SMALLINT,
    upgrade_level SMALLINT
);