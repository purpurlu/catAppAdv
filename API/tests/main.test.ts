import { PoolConnection } from "mariadb";
import {pool} from "../source/db"
import { User } from "../source/interfaces"
import {app} from "../source/main"

describe("API", () => {
    beforeAll(async() => {
        app.listen(8001, () => {})
    })

    let db: PoolConnection | undefined;
    const user: User = {username: "test", password: "test"}
    const userEmptyUsername: User = {username: "", password: "test"}
    const userEmptyPassword: User = {username: "test", password: ""}

    describe("signup", () => {
        beforeAll(async() => {
            db = await pool.getConnection()
        })

        afterAll(async() => {
            if (db) await db.query("DELETE FROM users WHERE username = ?", [user.username])
            if (db)  await db.release()
        })

        it("should allow to register a new user", async () => {
            const response = await fetch("http://localhost:8001/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify(user)
            })
            expect(response.status).toBe(200)
            const body = await response.json()
            expect(body).toBe("success")
        })

        it("should not allow to register a user with an existing username", async () => {
            const response = await fetch("http://localhost:8001/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify(user)
            })
            expect(response.status).toBe(400)
            const body = await response.json()
            expect(body).toBe("This user already exists, please login instead.")
        })

        it("should not allow to register a user with an empty username field", async () => {
            const response = await fetch("http://localhost:8001/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify(userEmptyUsername)
            })
            expect(response.status).toBe(400)
            const body = await response.json()
            expect(body).toBe("Missing fields")
        })

        it("should not allow to register a user with an empty password field", async () => {
            const response = await fetch("http://localhost:8001/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify(userEmptyPassword)
            })
            expect(response.status).toBe(400)
            const body = await response.json()
            expect(body).toBe("Missing fields")
        })
    })

})

