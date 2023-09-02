import express from 'express'
import { User } from './interfaces';
import crypto from 'crypto'
import { pool } from './db';
import cors from "cors";

export const app = express()

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
}))

app.use(express.json())

app.post("/signup", async (req, res) => {
    let db;

    console.log("Received", req.body)
    try {
        const user: User = req.body;
        const { username, password } = user;
        if (!username || !password) {
            res.status(400).json("Missing fields");
        } else {
            const hash = crypto.createHash("sha256");
            const hashedPassword = hash.update(password).digest("hex")
            db = await pool.getConnection()
            
            try {
                await db.query("INSERT INTO users VALUES (?, ?)", [username, hashedPassword])
                res.status(200).json("success")
                console.log("Saved")
            } catch (error: any) {
                if (error.code === "ER_DUP_ENTRY") {
                    res.status(400).json("This user already exists, please login instead.")
                    console.log("User already present")
                }
            }
            
        }
    }
    catch (error: any) {
        console.log("Error")
        console.log(error)
        res.status(500).json("There was an error!")
    } finally {
        console.log("Finally")
        if (db) await db.release()
    }
});

app.listen(8000, () => {
    console.log("running on port 8000")
})