const express = require("express")
const session = require("express-session")
const crypto = require("node:crypto")
const { DatabaseSync } = require("node:sqlite")
const database = new DatabaseSync(__dirname+"/db.db")

const app = express()

const PORT = process.env.PORT

app.use(session({
    secret: process.env.SECRET,
    saveUnitialized: false,
    resave: false
}))

app.get("/", (req, res) => {
    if(!session.userID){
        res.redirect("/login")
    }
})

app.post("/", (req, res) => {
    const user = req.body.user
    console.log(user)
    const salt = database.prepare("SELECT salt FROM users WHERE username = ?").get(user)
    const hashed_passwd = crypto.scrypt(req.body.passwd, salt, 64, (err, derivedKey) => {if(err){throw err} console.log(derivedKey.toString("hex"))})
    if(hashed_passwd == database.prepare("SELECT password FROM users WHERE username = ?").get(user)){
        session.userID = database.prepare("SELECT uID FROM users WHERE username = ?").get(user)
        res.redirect("/")
    }
})

app.get("/login", (req, res) => {
    res.sendFile(__dirname+"/templates/login.html")
})

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
})