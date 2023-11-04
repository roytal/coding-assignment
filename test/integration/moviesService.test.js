const request = require('supertest');
const express = require('express');
const fs = require('fs');
const apiRouter = require('../../src/routes/api');
const app = express();

jest.mock('fs');
app.use(express.json());
app.use('/movies', apiRouter);

describe('Movies Service Integration Tests', () => {

    beforeEach(() => {
        // Mock fs.readFileSync - return a sample json
        fs.readFileSync.mockReturnValue(
            JSON.stringify([
                {
                    movieId: 1,
                    cast: [
                        {id: 1, name: 'Actor1', character: 'Character1'},
                        {id: 2, name: 'Actor2', character: 'Character2'},
                    ],
                    movieName: "Movie1"
                },
                {
                    movieId: 284054,
                    cast: [
                        {id: 135651, name: "Michael B. Jordan", character: "N'Jadaka / Erik 'Killmonger' Stevens"},
                        {id: 82104, name: "Danai Gurira", character: "Okoye"},
                    ], movieName: "Black Panther"
                },
                {
                    movieId: 166424,
                    cast: [
                        {id: 135651, name: "Michael B. Jordan", character: "Johnny Storm / The Human Torch"}
                    ],
                    movieName: "Fantastic Four (2015)"
                },
                {
                    movieId: 9738,
                    cast: [{id: 16828, name: "Chris Evans", character: "Johnny Storm / Human Torch"}],
                    movieName: "Fantastic Four (2005)"
                }
            ])
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    test('GET /moviesPerActor should return movies per actor', async () => {
        const response = await request(app).get('/movies/moviesPerActor');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            "Actor1": [
                "Movie1"
            ],
            "Actor2": [
                "Movie1"
            ],
            "Michael B. Jordan": [
                "Black Panther",
                "Fantastic Four (2015)"
            ],
            "Danai Gurira": [
                "Black Panther"
            ],
            "Chris Evans": [
                "Fantastic Four (2005)"
            ]
        });
    });

    test('GET /actorsWithMultipleCharacters should return actors with multiple characters', async () => {
        const response = await request(app).get('/movies/actorsWithMultipleCharacters');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            "Michael B. Jordan": [{
                "characterName": "N'Jadaka / Erik 'Killmonger' Stevens",
                "movieName": "Black Panther"
            }, {"characterName": "Johnny Storm / The Human Torch", "movieName": "Fantastic Four (2015)"}]
        });
    });

    test('GET /charactersWithMultipleActors should return characters with multiple actors', async () => {
        const response = await request(app).get('/movies/charactersWithMultipleActors');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            "Johnny Storm / The Human Torch": [{
                "actorName": "Michael B. Jordan",
                "movieName": "Fantastic Four (2015)"
            }, {"actorName": "Chris Evans", "movieName": "Fantastic Four (2005)"}]
        });
    });
});
