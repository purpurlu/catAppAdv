import express from 'express'
import { User } from './interfaces';
import crypto from 'crypto'
import { pool } from './db';
import cors from "cors";
import session from "express-session";
import passport from "passport"
import { Strategy as localStrategy } from 'passport-local';
import { PoolConnection } from 'mariadb';

export const app = express()

// http://127.0.0.1:5173 = http://localhost:5173 - allows front-end to send cookies to API
app.use(cors({
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
    optionsSuccessStatus: 200
}))

app.use(express.json())

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true, 
    cookie: {secure: false, sameSite: "lax"}
}))

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user:any, done: (err: any, id?: any) => void) => {
    done(null, user.username)
})

passport.deserializeUser(async (username: string, done:(err: any, user?: any) => void) => {
    let db: PoolConnection | undefined;

    try{
        db = await pool.getConnection()
        const res = await db.query("SELECT username FROM users WHERE username=?", [username])
        if (res.length === 0) {
            done(new Error("User does not exist"))
        } else {
            done (null, {username: res[0].username, password: ""})
        }
    } catch(err) {
        done(new Error("User is not found"))
    } finally {
        if (db) {
            await db.release()
        }
    }

})

app.get("/isAuth", (req, res) => {
    if (req.isAuthenticated()) {
        console.log(req.cookies)
        console.log("Is auth")
        res.status(200).json("Authenticated")
    } else {
        console.log(req.cookies)
        console.log("Is not auth")
        res.status(401).json("error")
    }
})

app.post("/signup", async (req, res) => {
    let db;

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
        console.log(error)
        res.status(500).json("There was an error!")
    } finally {
        if (db) await db.release()
    }
});

passport.use(new localStrategy(
    async (username: string, password: string, done: (error: any, user?: any, options?: any) => void) => {
        let db;

        try {
            if (!username || !password) {
                return done(new Error("Missing username or password"))
            } else {
                const hash = crypto.createHash("sha256");
                const hashedPassword = hash.update(password).digest("hex")
                db = await pool.getConnection()
                
                const res = await db.query("SELECT username FROM users WHERE username = ? AND password = ?", [username, hashedPassword])
                if (res.length === 0) {
                    return done(new Error("User does not exist"))
                } else {
                    return done (null, {username: res[0].username, password: ""})
                }
            }
        }
        catch (error: any) {
            return done(new Error(error))
        } finally {
            if (db) await db.release()
        }
    })
)


app.post("/login", passport.authenticate("local", {failureRedirect: "/login"}), (req, res) => {
    res.status(200).json("Logged In Successfully")
})

app.get('/logout', (req, res) => {
    try {
        // if (req.isAuthenticated()) {
        req.logout((err) => {
            if (err) {
                res.status(500).json("Unexpected Error")
                console.error(err);
            } else {
                res.clearCookie("sid.connect")
                console.log("clear the cookies")
                res.status(200).json("Sucessfully logged out")
            }
        }) 
            // res.redirect('/login'); // Redirect to the home page or any other page after logout
        // } else {
        //     res.status(400).json("Not authenticated")
        // }
    } catch (error) {
        console.log(error)
        res.status(500).json("Error")
    }
});

app.listen(8000, () => {
    console.log("running on port 8000")
})