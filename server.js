/*********************************************************************************
 *  WEB422 – Assignment 1
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: IN HO HAN Student ID: 106053218 Date: 05/17/2023
 *  Cyclic Link: _______________________________________________________________
 *
 ********************************************************************************/

const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const exp = require("constants");
require("dotenv").config();
const HTTP_PORT = process.env.PORT || 8080;

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: `API Listening` });
});

app.post("/api/movies", (req, res) => {
  db.addNewMovie(req.body)
    .then((newMovie) => {
      res.status(201).json({ movie: newMovie });
    })
    .catch((err) => {
      res.status(400).json({ message: `Failed to post the data` });
    });
});

app.get("/api/movies", (req, res) => {
  const page = req.query.page;
  const perPage = req.query.perPage;
  db.getAllMovies(page, perPage)
    .then((movies) => {
      res.status(200).json({ movies: movies });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/api/movies/:id", (req, res) => {
  const id = req.params.id;
  db.getMovieById(id)
    .then((movie) => {
      res.status(200).json({ movie: movie });
    })
    .catch((err) => console.log(err));
});

app.put("/api/movies/:id", (req, res) => {
  const id = req.params.id;
  db.getMovieById(id)
    .then((movie) => {
      if (movie) {
        db.updateMovieById(req.body, id)
          .then((result) => {
            res
              .status(200)
              .json({ message: "Movie has been successfully updated" });
          })
          .catch((err) => {
            res.status(400).json({ message: "Update failed" });
          });
      } else {
        return res.status(201).json({ message: "Movie not found" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/api/movies/:id", (req, res) => {
  const id = req.params.id;
  db.deleteMovieById(id)
    .then((result) => {
      res.status(202).json({ message: `Successfully deleted the movie` });
    })
    .catch((err) => {
      res.status(204).json({ message: `Deletion failed` });
    });
});

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
