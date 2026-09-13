const express = require("express")
const session = require("express-session")
const crypto = require("node:crypto")
const fs = require("fs")
const format = require("node.date-time")
const { DatabaseSync } = require("node:sqlite")
require("dotenv").config()
const database = new DatabaseSync(__dirname+"/"+process.env.DB_NAME)
const app = express()
const PORT = process.env.PORT
const COMMISION_PERCENT = 0.2

function log(file, message){
    let date = new Date().format("Y-MM-dd HH:mm:SS")
    fs.appendFile(file, `${date} ${message}\n`, (err)=>{
        if(err){
            console.log(err)
        }
    })
    
}

app.use(session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax"
    }
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

const all_books_prepare = database.prepare("SELECT COUNT(title) AS sum_books FROM books")
const books_prepare = database.prepare("SELECT * FROM books")
const non_sold_prepare = database.prepare("SELECT COUNT(title) AS not_sold FROM books WHERE status = 'Nie sprzedana'")
const sold_prepare = database.prepare("SELECT COUNT(title) AS sold FROM books WHERE status = 'Sprzedana'")
const all_money_prepare = database.prepare("SELECT SUM(pupil_price) AS money FROM books WHERE status = 'Sprzedana'")
const login_data_prepare = database.prepare("SELECT uID, password, salt FROM users WHERE username = ?")
const new_book_prepare = database.prepare("INSERT INTO books (title, pupil, pupil_price, commision, status, add_date) VALUES (?, ?, ?, ?, ?, ?)",)
const update_book_preapre = database.prepare("UPDATE books SET title = ?, pupil = ?, pupil_price = ?, commision = ?, status = ?, payment_method = ? WHERE ID = ?")
const book_by_id_prepare = database.prepare("SELECT * FROM books WHERE ID = ?")
const search_on_pupil_prepare = database.prepare("SELECT * FROM books WHERE pupil LIKE ?")
const search_on_book_prepare = database.prepare("SELECT * FROM books WHERE title LIKE ?")
const all_payments_prepare = database.prepare("SELECT SUM(pupil_price) AS money FROM books WHERE payment_method=? AND status = 'Sprzedana'")
const all_paymements_commision_preapre = database.prepare("SELECT SUM(commision) AS commision FROM books WHERE payment_method=? AND status = 'Sprzedana'")
const books_by_payment_prepare = database.prepare("SELECT * FROM books WHERE payment_method LIKE ?")
const sell_book_prepare = database.prepare("UPDATE books SET status = 'Sprzedana', payment_method = ? WHERE ID = ? AND status = 'Nie sprzedana'")
const user_by_id_prepare = database.prepare("SELECT username FROM users WHERE uID = ?")


app.use((req, res, next)=>{
    if(!req.session.user){
        log("log.log", `${req.ip} wszedł na ${req.url} (${req.method})`)
    }
    else{
        log("log.log", `User ${user_by_id_prepare.get(req.session.user).username} z ${req.ip} wszedł na ${req.url} (${req.method})`)
    }
    next()
})

app.get("/", (req, res) => {
    if(!req.session.user){
        return res.redirect("/login")
    }
    const books = books_prepare.all()
    const all_books = all_books_prepare.get()
    const non_sold = non_sold_prepare.get()
    const sold = sold_prepare.get()
    const all_money = all_money_prepare.get()
    const all_cash = all_payments_prepare.get("Gotówka")
    const all_blik = all_payments_prepare.get("BLIK")
    const commision_cash = Math.floor(all_paymements_commision_preapre.get("Gotówka").commision)
    const commision_blik = Math.floor(all_paymements_commision_preapre.get("BLIK").commision)
    const commision = Math.floor(commision_blik+commision_cash)
    let sell_info = {
        sum_books: all_books.sum_books,
        non_sold: non_sold.not_sold,
        sold: sold.sold,
        all_money: all_money.money+commision,
        commision: commision,
        all_cash:all_cash.money+commision_cash,
        commision_cash: commision_cash,
        all_blik: all_blik.money+commision_blik,
        commision_blik: commision_blik
    }
    res.render(__dirname+"/templates/index.ejs", {
        books : books,
        sell_info : sell_info
    })
})


app.get("/login", (req, res) => {
    res.sendFile(__dirname+"/templates/login.html")
})

app.get("/book/add", (req, res)=>{
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
    const hashed_passwd = crypto.scryptSync(req.body.passwd, salt, 64)
    if(crypto.timingSafeEqual(Buffer.from(data.password, "hex"), hashed_passwd)){
        req.session.user = data.uID
        return res.redirect("/")
    }
    return res.redirect("/login")
})

app.post("/book/add", (req, res)=>{
    if(!req.session.user){
        return res.redirect("/login")
    }
    let date = new Date().format("Y-MM-DD")
    if(parseInt(req.body.pupil_price) < 10)
    new_book_prepare.run(req.body.title, req.body.pupil, parseInt(req.body.pupil_price), Math.floor(parseInt(req.body.pupil_price)*COMMISION_PERCENT), "Nie sprzedana", date)
    log("log.log", `User ${user_by_id_prepare.get(req.session.user).username} z ${req.ip} dodał nową książkę`)
    return res.redirect("/")
})


app.post("/", (req, res)=>{
    if(!req.session.user){
        return res.redirect("/login")
    }
    if(!req.body.searchfield.trim()){
        return res.redirect("/")
    }

    let books = {}

    const all_books = all_books_prepare.get()
    const non_sold = non_sold_prepare.get()
    const sold = sold_prepare.get()
    const all_money = all_money_prepare.get()
    const all_cash = all_payments_prepare.get("Gotówka")
    const all_blik = all_payments_prepare.get("BLIK")
    const commision_cash = Math.floor(all_paymements_commision_preapre.get("Gotówka").commision)
    const commision_blik = Math.floor(all_paymements_commision_preapre.get("BLIK").commision)
    const commision = Math.floor(commision_blik+commision_cash)
    let sell_info = {
        sum_books: all_books.sum_books,
        non_sold: non_sold.not_sold,
        sold: sold.sold,
        all_money: all_money.money+commision,
        commision: commision,
        all_cash:all_cash.money+commision_cash,
        commision_cash: commision_cash,
        all_blik: all_blik.money+commision_blik,
        commision_blik: commision_blik
    }

    if(req.body.searchOn == "pupil"){
        books = search_on_pupil_prepare.all(`%${req.body.searchfield}%`)
    }
    else if(req.body.searchOn == "book"){
        books = search_on_book_prepare.all(`%${req.body.searchfield}%`)
    }
    else if(req.body.searchOn == "ID"){
        books = book_by_id_prepare.all(parseInt(req.body.searchfield))
    }
    else if(req.body.searchOn == "payment"){
        books = books_by_payment_prepare.all(`%${req.body.searchfield}%`)
    }

    log("log.log", `User ${user_by_id_prepare.get(req.session.user).username} z ${req.ip} wyszukał ${req.body.searchfield} z kategorii ${req.body.searchOn}`)

    res.render(__dirname+"/templates/index.ejs", {
        books: books,
        sell_info: sell_info
    })

})

app.post("/book/change", (req, res)=>{
    if(!req.session.user){
        return res.redirect("/login")
    }
    if(req.body.id){
        res.render(__dirname+"/templates/change.ejs", {
            book: book_by_id_prepare.get(req.body.id)
        })
    }
    else if(req.body.ID){
        update_book_preapre.run(req.body.title, req.body.pupil, parseInt(req.body.pupil_price), Math.floor(parseInt(req.body.pupil_price)*COMMISION_PERCENT), req.body.status, req.body.payment_method, parseInt(req.body.ID))
        log("log.log", `User ${user_by_id_prepare.get(req.session.user).username} z ${req.ip} zmienił książkę ${req.body.ID}`)
        return res.redirect("/")
    }
})

app.get("/book/sell/confirm", (req, res)=>{
    if(!req.session.user){
        return res.redirect("/login")
    }
    if(req.query.idC){
        res.render(__dirname+"/templates/confirm.ejs", {
            book: book_by_id_prepare.get(req.query.idC),
            payment_method: "gotówkę",
            query: req.query
        })
    }

    else if(req.query.idB){
        res.render(__dirname+"/templates/confirm.ejs", {
            book: book_by_id_prepare.get(req.query.idB),
            payment_method: "BLIK",
            query: req.query
        })
    }
})

app.post("/book/sell", (req, res)=>{
    if(!req.session.user){
        return res.redirect("/login")
    }
    if(req.body.idC){
        if(sell_book_prepare.run("Gotówka", req.body.idC).changes != 1){
            log("warning.log", `User ${user_by_id_prepare.get(req.session.user).username} z ${req.ip} spróbował sprzedać książkę ${req.body.idC} za gotówkę, błąd sprzedaży`)
            return res.redirect("/book/sell/error")
        }
        log("log.log", `User ${user_by_id_prepare.get(req.session.user).username} z ${req.ip} sprzedał książkę ${req.body.idC} za gotówkę`)
    }
    else if(req.body.idB){
        if(sell_book_prepare.run("BLIK", req.body.idB).changes != 1){
            log("warning.log", `User ${user_by_id_prepare.get(req.session.user).username} z ${req.ip} spróbował sprzedać książkę ${req.body.idB} za BLIK, błąd sprzedaży`)
            return res.redirect("/book/sell/error")
        }
        log("log.log", `User ${user_by_id_prepare.get(req.session.user).username} z ${req.ip} sprzedał książkę ${req.body.idB} za BLIK`)
    }
    return res.redirect("/")
})

app.get("/book/sell/error", (req, res)=>{
    if(!req.session.user){
        res.redirect("/login")
    }
    res.render(__dirname+"/templates/error", {
        title: "BŁĄD SPRZEDAŻY",
        error: "Upewnij się, że podałeś poprawny numer książki oraz że książka nie została już sprzedana. Jeżeli ten błąd się powtarza, skontaktuj się niezwłocznie z działem programistów."
    })
})

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
})