const express = require("express")
const session = require("express-session")
const crypto = require("node:crypto")
const { DatabaseSync } = require("node:sqlite")
const database = new DatabaseSync(__dirname+"/"+process.env.DB_NAME)

const app = express()
const PORT = process.env.PORT

app.use(session({
    secret: process.env.SECRET,
    saveUnitialized: false,
    resave: false
}))

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    if(!req.session.user){
        return res.redirect("/login")
    }
    console.log(req.session.user)
    const data = database.prepare("SELECT * FROM books").all()
    res.render(__dirname+"/templates/index.ejs", {data : data})
})


app.get("/login", (req, res) => {
    res.sendFile(__dirname+"/templates/login.html")
})

app.get("/add", (req, res)=>{
    if(!req.session.user){
        return res.redirect("/login")
    }
    res.sendFile(__dirname+"/templates/add.html")
})

app.post("/login", (req, res) => {
    const user = req.body.user
    const data = database.prepare("SELECT uID, password, salt FROM users WHERE username = ?").get(user)
    if(!data){
        res.redirect("/login")
        return
    }
    const salt = data.salt
    const hashed_passwd = crypto.scryptSync(req.body.passwd, salt, 64).toString("hex")
    if(hashed_passwd == data.password){
        req.session.user = crypto.scryptSync(data.uID.toString(), salt, 64).toString("hex")
        return res.redirect("/")
    }
    return res.redirect("/login")
})

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
})