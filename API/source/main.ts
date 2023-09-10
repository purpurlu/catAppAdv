import express from 'express'
import { Cat, User } from './interfaces';
import crypto from 'crypto'
import { pool } from './db';
import cors from "cors";
import session from "express-session";
import passport from "passport"
import { Strategy as localStrategy } from 'passport-local';
import { PoolConnection } from 'mariadb';
import MySQLStoreFactory from 'express-mysql-session';

// Create the express application app
export const app = express()

// Use CORS to allow the front-end to communicate with the backend 
// using the JS/TS in the browser
// http://127.0.0.1:5173 = http://localhost:5173 - allows front-end 
// to send cookies to API
app.use(cors({
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
    optionsSuccessStatus: 200
}))

// Returns middleware that only parses json and only looks 
// at requests where the Content-Type header matches the type option.
app.use(express.json())

// to store sessions to the db
const MySQLStore = MySQLStoreFactory(session as any)
const options = {
    host: process.env.DB_URL!,
    user: process.env.DB_USERNAME!, 
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    port: 3306,
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 86400000,
    createDatabaseTable: true,
    connectionLimit: 1,
    endConnectionOnClose: true,
    charset: 'utf8mb4_bin',
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}

// create a new instance of MySQLStore passing the options
const sessionStore = new MySQLStore(options)

// use the middleware to handle the sessions (create cookies, save cookies,
// check if the user is authenticated, store the session in the db)
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true, 
    store: sessionStore,
    cookie: {secure: false, sameSite: "lax", maxAge: 3600000 * 10 }
}))

// use the passport middleware to handle sessions
app.use(passport.initialize())
app.use(passport.session())

// determines which data will be stored in the session (username)
passport.serializeUser((user:any, done: (err: any, id?: any) => void) => {
    done(null, user.username)
})

// determines which data will be extracted from the stored session and checks
// that the cookie is valid
passport.deserializeUser(async (username: string, done:(err: any, user?: any) => void) => {
    let db: PoolConnection | undefined;

    try{
        db = await pool.getConnection()
        const res = await db.query("SELECT username FROM users WHERE username=?", [username])
        if (res.length === 0) {
            done(new Error("User does not exist"))
        } else {
            done (null, res[0].username)
        }
    } catch(err) {
        done(new Error("User is not found"))
    } finally {
        if (db) {
            await db.release()
        }
    }
})

// get request checks if the use is authenticated 
// via passport and exporess sessions
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

// post request to sign up a new user and prevent signing up
//the user who is already registered
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

// executes on login to check if the username and password are valid
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

// post request for user to login using the passport's Local Strategy defined above
app.post("/login", passport.authenticate("local", {failureRedirect: "/login"}), (req, res) => {
    res.status(200).json("Logged In Successfully")
})

// get request for user to logout and delete the session
app.get('/logout', (req, res) => {
    try {
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

    } catch (error) {
        console.log(error)
        res.status(500).json("Error")
    } 
});

// post request for logged in user to save a cat image from the CAT_API to the db
app.post("/saveCat", async (req, res) => {
    let db;

    try {
        if (req.isAuthenticated()) {
            const cat: Cat = req.body
            const username = req.user 
            
            db = await pool.getConnection()

            try {
                await db.query("INSERT INTO cuties VALUES (?, ?, ?)", [cat.catID, username, cat.catURL])
                res.status(200).json("success")
            } catch (error:any) {
                if (error.code === "ER_DUP_ENTRY") {
                    res.status(400).json("The image is already saved.")
                } 
            }
        } else {
            res.status(401).json("Please authenticate first ")
        }

    } catch (error) {
        console.log(error)
        res.status(500).json("There was an error!")
    } finally {
        if (db) await db.release()
    }
})

// get request to show saved cats images for a logged in user
app.get("/savedCats", async (req, res) => {
    let db;
    try {
        if (req.isAuthenticated()) {

            db = await pool.getConnection()
            const username = req.user

            const rows = await db.query("SELECT cat_id, cat_url FROM cuties WHERE username=?", [username])
            res.status(200).json(rows)

        } else {
            res.status(401).json("Please authenticate first")
        }

    } catch (error) {
        res.status(500).json("There was an error!")
    } finally {
        if (db) await db.release()
    }
})

// delete request to remove the cat image from the db for a logged in user
app.delete("/savedCats/:catID", async(req, res) => {
    let db;
    try {
        if (req.isAuthenticated()) {
            const username = req.user
            const {catID} = req.params

            db = await pool.getConnection()
            try{
                await db.query("DELETE FROM cuties WHERE username=? AND cat_id=?", [username, catID])
                res.status(200).json("Successfully deleted")
            } catch (error) {
                res.status(404).json("Not Found")
            }
        } else {
            res.status(401).json("Please authenticate first ")
        }

    } catch (error) {
        console.log(error)
        res.status(500).json("Error")
    } finally {
        if (db) await db.release()
    }
})

app.listen(8000, () => {
    console.log("running on port 8000")
})