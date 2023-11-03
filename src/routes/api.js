const express = require("express");
const router = express.Router();

const {
    moviesPerActor,
    actorsWithMultipleCharacters,
    charactersWithMultipleActors,
} = require("../services/moviesService");

// protected routes
router.get("/moviesPerActor",  moviesPerActor);
router.get("/actorsWithMultipleCharacters", actorsWithMultipleCharacters);
router.get("/charactersWithMultipleActors", charactersWithMultipleActors);

module.exports = router;
