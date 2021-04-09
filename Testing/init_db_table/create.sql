CREATE TABLE IF NOT EXISTS user_table (
    user_id SERIAL, /* Integer that is unique for each user, increments by 1 with each new user, counter for how many users are registered */
    username VARCHAR(30) UNIQUE NOT NULL, /* unique username for each user */
    password VARCHAR(30) NOT NULL, /* password for users account */
    scores REAL[5], /* array of 5 reals that will store the user's top 5 scores from the game */
    PRIMARY KEY(user_id, username) /* Users unique primary key consists of the user_id & the username making up a composite key */
);