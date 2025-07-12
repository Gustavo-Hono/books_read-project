import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import axios from "axios";


const app = express()
const port = 4000;

dotenv.config()

app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD
})
await db.connect()

async function getAll() {
    const response = await db.query("SELECT * FROM books")
    const data = response.rows
    return data
}

app.get("/", async (req, res) => {
    try {
        let livros = await getAll()
        res.json(livros)
    } catch (error) {
        console.log("Não pegou os livros", error)
    }
})

app.get("/posts", async (req, res) => {
    try {
        console.log("Get do posts")
    } catch (error) {
        console.log("Erro renderizando o posts ", error)
    }
})

app.get("/posts/:id",async (req, res) => {
    const id = parseInt(req.params.id)
    const response = await db.query("SELECT * FROM books WHERE id = $1", [id])
    console.log("Get do posts / id")
    console.log(response.rows)
    res.json(response.rows[0])
})

app.post("/posts", async (req, res) => {
    try {
        console.log(req.body)
        const {  autor, title, review, ratings, open_library_id  } = req.body
        const response = await db.query("INSERT INTO books(autor, title, review, ratings, open_library_id) VALUES ($1,$2,$3,$4,$5)", [autor, title, review, ratings, open_library_id])
        res.json(response)
    } catch (error) {
        console.log("----------------------------------")
        console.log(error)
    }
})

app.patch("/posts/:id", async (req, res) => {
    try {
        console.log(2342)
        console.log(req.body)
        const {  autor, title, review, ratings, open_library_id  } = req.body
        const id = parseInt(req.params.id)
        // AChar os items que tem esse id

        const item = await getAll()
        const findItem = item.find((index) => index.id === id)
        console.log(findItem)
        console.log("=========================================================================")
        const patchItem = {
            autor: autor || findItem.autor,
            title: title || findItem.title,
            review: review || findItem.review ,
            ratings: ratings || findItem.ratings ,
            open_library_id: findItem.open_library_id || open_library_id
        }
        const response = await db.query("UPDATE books SET autor=$1, title=$2, review=$3, ratings=$4, open_library_id=$5 WHERE id=$6", [patchItem.autor, patchItem.title, patchItem.review, patchItem.ratings, patchItem.open_library_id, id])
        res.json(response)
    } catch (error) {
        console.log("=------------------------")
        console.log(error)
    }
}) 


app.delete("/delete/:id", async (req,res) => {
    console.log("----------------")
    const id = parseInt(req.params.id)
    const response = await db.query("DELETE FROM books WHERE id=$1", [id])
    console.log(response)
    res.json(response) // acho q nem precisa disso
})


app.listen(port, (req, res) => {
    console.log(`Servidor rodando na porta ${port}`)
})