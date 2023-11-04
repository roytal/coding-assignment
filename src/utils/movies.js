const _ = require("lodash");
const fs = require('fs');
const {systemLogger} = require("./logger");
const {axiosInstance} = require("../../config/axiosInstance");
const {movies, actors} = require("../../dataForQuestions");
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


/**
 * Fetches the movie casts for a batch of movie IDs using Axios.
 * @param {Array} batch - An array of movie IDs.
 * @returns {Promise<Array>} - A promise that resolves to an array of objects containing movie IDs and casts.
 */
const getMovieCastBatch = async (batch) => {
    try {
        const batchPromises = await Promise.all(
            batch.map(async (movieId) => {
                try {
                    const {data} = await axiosInstance.get(`/movie/${movieId}/credits`);
                    const cast = _.filter(_.map(data.cast || [], (actor = {}) => ({
                        id: actor.id,
                        name: actor.name,
                        character: actor.character
                    })), actor => _.includes(actors, actor.name));
                    return {movieId, cast};
                } catch (error) {
                    systemLogger.error(`Error fetching movie casts for movie ID ${movieId}: ${error.message}`);
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

/**
 * Fetches casts for a list of movies, splits the API calls into batches, and saves the results to a JSON file.
 * @returns {Promise<void>} - A promise that resolves when the fetch and save process is complete.
 * @throws {Error} - If there is an error during the fetch or the result is empty.
 */
const fetchMoviesCasts = async () => {
    try {
        const movieIds = _.values(movies);
        let movieIdToName = _.invert(movies);
        const batchSize = 5;
        const results = [];

        // split api calls into batches and sleep after each batch to avoid rate limits
        const batches = _.chunk(movieIds, batchSize);
        for (const batch of batches) {
            const batchResult = await getMovieCastBatch(batch);
            results.push(batchResult);
            systemLogger.info("batch fetching done. sleeping", {batch})
            await sleep(500);
        }
        systemLogger.info('finished fetching casts, about to save results');

        // write the result to a static file
        const flattenedResults = _.flatten(results);
        if (flattenedResults.length === 0) {
            throw new Error("could not retrieve movie api")
        }
        let resultsWithMovieNames = _.map(flattenedResults, (result) => {
            result["movieName"] = movieIdToName[result.movieId]
            return result
        })

        const jsonData = JSON.stringify(resultsWithMovieNames);
        fs.writeFileSync('api-response.json', jsonData);
        systemLogger.info('saved all results successfully');

    } catch (error) {
        console.log('error fetching movie casts:', error.message);
        systemLogger.error(`Error fetching movie casts: ${error}`);
        process.exit(1);
    }
};

/**
 * Reads and parses movie data from a local JSON file.
 * @returns {Object} - Parsed movie data.
 */
const getMoviesDataFromLocal = () => {
    const jsonData = fs.readFileSync('api-response.json', 'utf8');
    const data = JSON.parse(jsonData);
    return !_.isEmpty(data) ? data : {}
};

/**
 * Trims character names by removing unnecessary information.
 * @param {string} fullName - The full name of a character.
 * @returns {string} - The trimmed character name.
 */
const trimCharacterName = (fullName) => {
    let trimmedCharName = _.split(fullName, "/")[0]
    trimmedCharName = _.replace(trimmedCharName, /\([^)]*\)/g, '');
    return _.trim(trimmedCharName)
}

/**
 * Checks if there are more than one character for a given set of characters.
 * @param {Array} characters - An array of character names.
 * @returns {boolean} - True if there are more than one character, false otherwise.
 */
const isMoreThanOneCharacter = (characters) => {
    // remove brackets and spaces, and than remove duplications
    let charactersUnique = _.map(characters, item => _.replace(item, /\([^)]*\)/g, ''))
    charactersUnique = _.map(charactersUnique, item => _.trim(item))
    charactersUnique = _.uniq(charactersUnique)

    // check for contained values in "/" separated characters
    let characterSplitted = _.map(charactersUnique, (char) => _.split(char, " / "))
    let isAllListsContained = isAllListsContainedInOne(characterSplitted)

    // check for contained values in characters with contained name
    let isAllStringsContained = isAllStringsContainedInOne(charactersUnique)

    return !isAllListsContained && !isAllStringsContained
}

/**
 * Checks if there is a list that contains the values of all other lists.
 * @param {Array} arrayOfArrays - An array of arrays.
 * @returns {boolean} - True if one list contains the values of all other lists, false otherwise.
 */
const isAllListsContainedInOne = (arrayOfArrays) => {
    // If there's only one or zero arrays, they are all contained
    if (arrayOfArrays.length < 2) {
        return false;
    }

    // Check if every item from all arrays is included in the biggest array
    const biggestArray = _.maxBy(arrayOfArrays, 'length');
    return _.every(arrayOfArrays, (array) => {
        return _.every(array, (item) => _.includes(biggestArray, item))
    });
};


/**
 * Checks if there is a string that contains the characters of all other strings.
 * @param {Array} arr - An array of strings.
 * @returns {boolean} - True if one string contains the characters of all other strings, false otherwise.
 */
const isAllStringsContainedInOne = (arr) => {
    // If the array is empty, return false
    if (_.isEmpty(arr)) {
        return false;
    }

    // Check if all other strings contain the characters of the biggest string
    const biggestString = _.maxBy(arr, 'length');
    return _.every(arr, (str) => {
        return _.every(str, (char) => _.includes(biggestString, char));
    });
};

module.exports = {
    fetchMoviesCasts,
    getMoviesDataFromLocal,
    trimCharacterName,
    isMoreThanOneCharacter,
    isAllListsContainedInOne,
    isAllStringsContainedInOne
}