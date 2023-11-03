const _ = require("lodash");
const {apiLogger} = require("../../utils/logger");
const {getMoviesDataFromLocal, trimCharacterName, isMoreThanOneCharacter} = require("../../utils/movies");


const moviesPerActor = async (req, res) => {
    try {
        let movies = getMoviesDataFromLocal()

        const moviesPerActor = {};
        movies.forEach((movie) => {
            movie.cast.forEach((actor) => {
                if (!moviesPerActor[actor.name]) {
                    moviesPerActor[actor.name] = [];
                }
                moviesPerActor[actor.name].push(movie.movieName);
            });
        });
        apiLogger.debug(`successfully ran moviesPerActor`, {req});

        return res.status(200).json(moviesPerActor);
    } catch (error) {
        apiLogger.error(`got error running moviesPerActor`, {error});
        return res.status(500).json({msg: 'could not retrieve movies per actor'});
    }
};


const actorsWithMultipleCharacters = async (req, res) => {
    try {
        let movies = getMoviesDataFromLocal()

        // setup dict of all actor to their {movieName, characterName}
        const moviesPerActor = {};
        movies.forEach((movie) => {
            movie.cast.forEach((actor) => {
                if (!moviesPerActor[actor.name]) {
                    moviesPerActor[actor.name] = [];
                }
                moviesPerActor[actor.name].push({movieName: movie.movieName, characterName: actor.character});
            });
        });

        // find all actors with more than 1 character
        const actorWithMultipleCharacters = {};
        _.map(moviesPerActor, (roles, actorName) => {
            if (isMoreThanOneCharacter(_.map(roles, 'characterName'))) {
                actorWithMultipleCharacters[actorName] = roles
            }

        })
        apiLogger.debug(`successfully ran actorsWithMultipleCharacters`, {req});

        return res.status(200).json(actorWithMultipleCharacters);
    } catch (error) {
        apiLogger.error(`got error running actorsWithMultipleCharacters`, {error});
        return res.status(500).json({msg: 'could not retrieve actors with multiple characters'});
    }
};

// { characterName: [{movieName, actorName}] }
const charactersWithMultipleActors = async (req, res) => {
    try {
        let movies = getMoviesDataFromLocal()

        // setup dict of all Character to their {movieName, actorName}
        const moviesPerActor = {};
        const fixedCharacterToFullName = {};
        movies.forEach((movie) => {
            movie.cast.forEach((actor) => {
                let fixedCharacterName = trimCharacterName(actor.character)
                if (!moviesPerActor[fixedCharacterName]) {
                    moviesPerActor[fixedCharacterName] = [];
                    fixedCharacterToFullName[fixedCharacterName] = actor.character
                }
                moviesPerActor[fixedCharacterName].push({movieName: movie.movieName, actorName: actor.name});
            });
        });

        // find all characters with more than 1 actor
        const actorWithMultipleCharacters = {};
        _.map(moviesPerActor, (roles, fixedCharacterName) => {
            let uniqueRoles = _.uniqBy(roles, 'actorName');
            if (uniqueRoles.length > 1) {
                actorWithMultipleCharacters[fixedCharacterToFullName[fixedCharacterName]] = roles
            }

        })
        apiLogger.debug(`successfully ran actorsWithMultipleCharacters`, {req});

        return res.status(200).json(actorWithMultipleCharacters);
    } catch (error) {
        apiLogger.error(`got error running actorsWithMultipleCharacters`, {error});
        return res.status(500).json({msg: 'could not retrieve actors with multiple characters'});
    }
};

module.exports = {
    moviesPerActor,
    actorsWithMultipleCharacters,
    charactersWithMultipleActors,
};
