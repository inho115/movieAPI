/*********************************************************************************
 *  WEB422 – Assignment 1
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: IN HO HAN Student ID: 106053218 Date: 05/17/2023
 *  Cyclic Link: https://blush-duck-slip.cyclic.app/
 *
 ********************************************************************************/

const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const HTTP_PORT = process.env.PORT || 8080;

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({ message: `API Listening.` });
});

app.post("/api/movies", (req, res) => {
  db.addNewMovie(req.body)
    .then((newMovie) => {
      res.status(201).json({ movie: newMovie });
    })
    .catch((err) => {
      res.status(500).json({ message: `${err}` });
    });
});

app.get("/api/movies", (req, res) => {
  const page = req.query.page;
  const perPage = req.query.perPage;
  db.getAllMovies(page, perPage)
    .then((movies) => {
      if (movies.length > 0) {
        res.status(200).json({ movies: movies });
      } else {
        res.status(204).json();
      }
    })
    .catch((err) => {
      res.status(500).json({ message: `${err}` });
    });
});

app.get("/api/movies/:id", (req, res) => {
  const id = req.params.id;
  db.getMovieById(id)
    .then((movie) => {
      if (movie !== null) {
        res.status(200).json({ movie: movie });
      } else {
        res.status(204).json();
      }
    })
    .catch((err) => {
      res.status(500).json({ message: `${err}` });
    });
});

app.put("/api/movies/:id", (req, res) => {
  const id = req.params.id;
  // Find if movie exist or not first even before trying to update it.
  db.getMovieById(id)
    .then((movie) => {
      if (movie) {
        db.updateMovieById(req.body, id).then((result) => {
          res.status(200).json({ message: "Movie has been updated." });
        });
      } else {
        return res.status(204).json();
      }
    })
    .catch((err) => {
      res.status(500).json({ message: `${err}` });
    });
});

app.delete("/api/movies/:id", (req, res) => {
  const id = req.params.id;
  db.deleteMovieById(id)
    .then((result) => {
      res.status(202).json({ message: `Movie has been deleted.` });
    })
    .catch((err) => {
      res.status(500).json({ message: `${err}` });
    });
});

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    res.status(500).json({ message: `${err}` });
  });
