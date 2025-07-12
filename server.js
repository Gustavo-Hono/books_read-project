import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/`);
    const data = response.data;
    console.log(data);
    res.render("index.ejs", { books: data });
  } catch (error) {
    console.log(error);
  }
});

app.get("/posts", async (req, res) => {
  try {
    console.log("Chamando a página posts 2352549279");
    res.render("posts.ejs");
  } catch (error) {
    console.log(error);
  }
});

app.get("/posts/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Chamando a página posts");
    const response = await axios.get(`${API_URL}/posts/${id}`);
    const data = response.data;
    console.log(data);
    res.render("posts.ejs", { book: data });
  } catch (error) {
    res.status(500);
    console.log(error);
  }
});

app.post("/api/posts", async (req, res) => {
  try {
    console.log(req.body);
    const { autor, title, review, ratings, open_library_id } = req.body;
    const response = await axios.post(`${API_URL}/posts`, {
      autor,
      title,
      review,
      ratings,
      open_library_id,
    });
    console.log(response.data);
    res.redirect("/");
  } catch (error) {
    console.log("----------------------------------");
    console.log(error);
  }
});

app.post("/api/posts/:id", async (req, res) => {
  try {
    console.log("Chamando o patch");
    const { autor, title, review, ratings, open_library_id } = req.body;
    const response = await axios.patch(
      `${API_URL}/posts/${parseInt(req.params.id)}`,
      {
        autor,
        title,
        review,
        ratings: parseInt(ratings),
        open_library_id,
      }
    );
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/delete/:id", async (req, res) => {
  const response = await axios.delete(
    `${API_URL}/delete/${parseInt(req.params.id)}`
  );
  console.log(response);
  res.redirect("/");
});

app.listen(port, (req, res) => {
  console.log(`Servidor rodando na porta ${port}`);
});
