import mariadb from "mariadb"
import dotenv from 'dotenv'

dotenv.config()

export const pool = mariadb.createPool({
    host: process.env.DB_URL,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    connectionLimit: 5,
    database: process.env.DB_NAME
})


