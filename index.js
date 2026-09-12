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
    const books = database.prepare("SELECT * FROM books").all()
    const all_books = database.prepare("SELECT COUNT(title) AS sum_books FROM books").get()
    const non_sold = database.prepare("SELECT COUNT(title) AS not_sold FROM books WHERE status = 'Nie sprzedana'").get()
    const sold = database.prepare("SELECT COUNT(title) AS sold FROM books WHERE status = 'Sprzedana'").get()
    const all_money = database.prepare("SELECT SUM(end_price) AS money FROM books WHERE status = 'Sprzedana'").get()
    const commision = database.prepare("SELECT SUM(commision) AS commision FROM books WHERE status = 'Sprzedana'").get()
    let sell_info = {
        sum_books: all_books.sum_books,
        non_sold: non_sold.not_sold,
        sold: sold.sold,
        all_money: all_money.money,
        commision: commision.commision
    }
    console.log(sell_info)
    res.render(__dirname+"/templates/index.ejs", {
        books : books,
        sell_info : sell_info
    })
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

app.post("/add", (req, res)=>{
    if(!req.session.user){
        return res.redirect("/login")
    }
    let currentDate = new Date()
    let day = currentDate.getDate()
    let month = currentDate.getMonth()
    let year = currentDate.getFullYear()
    let stringDate = day+"-"+month+"-"+year
    database.prepare("INSERT INTO books (title, pupil, pupil_price, commision, end_price, status, add_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
    ).run(req.body.title, req.body.pupil, req.body.pupil_price, req.body.commision, parseFloat(req.body.pupil_price)+parseFloat(req.body.commision), "Nie sprzedana", stringDate)
    return res.redirect("/")
})

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
})