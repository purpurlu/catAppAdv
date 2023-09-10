CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    password TEXT NOT NULL
);

CREATE TABLE cuties (
    cat_id VARCHAR(255),
    username VARCHAR(255),
    cat_url TEXT,
    PRIMARY KEY (cat_id, username)
);


