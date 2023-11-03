const _ = require("lodash");
const fs = require('fs');
const {systemLogger, apiLogger} = require("../../utils/logger");
const {axiosInstance} = require("../../config/axiosInstance");
const {movies, actors} = require("../../dataForQuestions");
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


const getMovieCastBatch = async (batch) => {
    try {
        const batchPromises = await Promise.all(
            batch.map(async (movieId) => {
                try {
                    const {data} = await axiosInstance.get(`/movie/${movieId}/credits`);
                    const cast = _.map(data.cast, actor => ({
                        id: actor.id,
                        name: actor.name,
                        character: actor.character
                    }));
                    return {movieId, cast};
                } catch (error) {
                    systemLogger.error(`Error fetching movie casts for movie ID ${movieId}:`, error.message);
                    return null;
                }
            })
        );
        // remove all failed requests from the cast fetching
        return _.compact(batchPromises);
    } catch (error) {
        console.error('Error fetching movie casts:', error.message);
        return [];
    }
};

const fetchMoviesCasts = async () => {
    try {
        const movieIds = _.values(movies);
        const batchSize = 5;
        const results = [];

        // split api calls into batches and sleep after each batch to avoid rate limits
        const batches = _.chunk(movieIds, batchSize);
        for (const batch of batches) {
            const batchResult = await getMovieCastBatch(batch);
            results.push(batchResult);
            await sleep(500);
        }
        systemLogger.info('finished fetching casts, about to save results');

        // write the result to a static file
        const flattenedResults = _.flatten(results);
        const jsonData = JSON.stringify(flattenedResults);
        fs.writeFileSync('api-response.json', JSON.stringify(jsonData));
        systemLogger.info('saved all results successfully');

    } catch (error) {
        systemLogger.error('error fetching movie casts:', error.message);
    }
};

const moviesPerActor = async (req, res) => {
    try {
        apiLogger.info(`successfully fetched movies ...`);
        return res.status(200).json({msg: 'bla bla'});
    } catch (error) {
        apiLogger.error(
            `Failed to fetch movies, Error: ...`
        );
        return res.status(500).json({msg: 'bla bla'});
    }
};

const actorsWithMultipleCharacters = async (req, res) => {
    try {
        apiLogger.info(`successfully fetched movies ...`);
        return res.status(200).json({msg: 'bla bla'});
    } catch (error) {
        apiLogger.error(
            `Failed to fetch movies, Error: ...`
        );
        return res.status(500).json({msg: 'bla bla'});
    }
};

const charactersWithMultipleActors = async (req, res) => {
    try {
        apiLogger.info(`successfully fetched movies ...`);
        return res.status(200).json({msg: 'bla bla'});
    } catch (error) {
        apiLogger.error(
            `Failed to fetch movies, Error: ...`
        );
        return res.status(500).json({msg: 'bla bla'});
    }
};

module.exports = {
    fetchMoviesCasts,
    moviesPerActor,
    actorsWithMultipleCharacters,
    charactersWithMultipleActors,
};
