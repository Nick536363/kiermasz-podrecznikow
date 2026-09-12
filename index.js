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

const all_books_prepare = database.prepare("SELECT COUNT(title) AS sum_books FROM books")
const books_prepare = database.prepare("SELECT * FROM books")
const non_sold_prepare = database.prepare("SELECT COUNT(title) AS not_sold FROM books WHERE status = 'Nie sprzedana'")
const sold_prepare = database.prepare("SELECT COUNT(title) AS sold FROM books WHERE status = 'Sprzedana'")
const all_money_prepare = database.prepare("SELECT SUM(end_price) AS money FROM books WHERE status = 'Sprzedana'")
const commision_prepare = database.prepare("SELECT SUM(commision) AS commision FROM books WHERE status = 'Sprzedana'")
const login_data_prepare = database.prepare("SELECT uID, password, salt FROM users WHERE username = ?")
const new_book_prepare = database.prepare("INSERT INTO books (title, pupil, pupil_price, commision, end_price, status, add_date) VALUES (?, ?, ?, ?, ?, ?, ?)",)
const update_books_preapre = database.prepare("UPDATE books SET title = ?, pupil = ?, pupil_price = ?, commision = ?, end_price = ?, status = ? WHERE ID = ?")

app.get("/", (req, res) => {
    if(!req.session.user){
        return res.redirect("/login")
    }
    const books = books_prepare.all()
    const all_books = all_books_prepare.get()
    const non_sold = non_sold_prepare.get()
    const sold = sold_prepare.get()
    const all_money = all_money_prepare.get()
    const commision = commision_prepare.get()
    let sell_info = {
        sum_books: all_books.sum_books,
        non_sold: non_sold.not_sold,
        sold: sold.sold,
        all_money: all_money.money,
        commision: commision.commision
    }
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

app.get("/change", (req, res)=>{
    if(!req.session.user){
        return res.redirect("/login")
    }
    const books = books_prepare.all()
    res.render(__dirname+"/templates/change.ejs", {
        books: books
    })
})

app.post("/login", (req, res) => {
    const user = req.body.user
    const data = login_data_prepare.get(user)
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
    new_book_prepare.run(req.body.title, req.body.pupil, req.body.pupil_price, req.body.commision, parseFloat(req.body.pupil_price)+parseFloat(req.body.commision), "Nie sprzedana", stringDate)
    return res.redirect("/")
})

app.post("/change", (req, res)=>{
    if(!req.session.user){
        return res.redirect("/login")
    }
    const all_books = all_books_prepare.get().sum_books
    for(let book_num = 1; book_num <= all_books; book_num++){
        update_books_preapre.get(
            req.body.title[book_num-1], req.body.pupil[book_num-1], parseFloat(req.body.pupil_price[book_num-1]), parseFloat(req.body.commision[book_num-1]), parseFloat(req.body.pupil_price[book_num-1])+parseFloat(req.body.commision[book_num-1]), req.body.status[book_num-1], book_num
        )
    }
    return res.redirect("/")
})

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
})