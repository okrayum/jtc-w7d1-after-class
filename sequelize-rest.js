// To use this app you can use "npm run start2"
const express = require("express");
const Sequelize = require("sequelize");

const PORT = 3000;

const app = express();

app.use(express.json());


// Initialize Sequelize with database
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
  logging: false
});

// Define the Movie model
const Movie = sequelize.define("Movie", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  yearOfRelease: {
    type: Sequelize.NUMBER,
    allowNull: false
  },
  synopsis: {
    type: Sequelize.TEXT,
    allowNull: false
  }
});

// Sync the model with the database
sequelize.sync()
  .then(async () => {
    const currentMovieData = await Movie.findAll();

    if (currentMovieData.length === 0) {
      await Movie.bulkCreate([
        {
          title: "Test Movie #1",
          yearOfRelease: 2010,
          synopsis: "A true and inspiring tale of desire and testing."
        },
        {
          title: "Test Movie #2",
          yearOfRelease: 2008,
          synopsis: "When the team is faced with difficult QA challenges, he is the one to call"
        },
        {
          title: "Test Movie #3",
          yearOfRelease: 2014,
          synopsis: "A team of explorers travel through a wormhole in order to develop the planets first React App"
        }
      ]);
      console.log("Example data entered successfully")
    }
  })
  .catch(err => {
    console.error("Error inserting example movie data:", err);
  });


// Define routes for CRUD operations here

// Create a movie
app.post("/movies", async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    return res.status(201).json(movie);
  } catch (error) {
    console.error("Error creating movie:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Read all movies
app.get("/movies", async (req, res) => {
  try {
    const { limit = 5, offset = 0 } = req.query;
    const movies = await Movie.findAndCountAll({ limit, offset });
    return res.status(200).json({ data: movies.rows, total: movies.count });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

// Read a single movie
app.get("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    return res.status(200).json(movie);
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

// Update a single movie
app.put("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    } else {
      await movie.update(req.body);
      return res.status(200).json(movie);
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a single movie
app.delete("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    } else {
      await movie.destroy();
      return res.status(200).json({ message: "Movie deleted successfully"});
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});


// Starts the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});

