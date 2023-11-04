const fs = require('fs');

const {
    fetchMoviesCasts,
    getMoviesDataFromLocal,
    trimCharacterName,
    isMoreThanOneCharacter,
    isAllListsContainedInOne,
    isAllStringsContainedInOne,
} = require('../../src/utils/movies');

const {axiosInstance} = require("../../config/axiosInstance");
jest.mock("../../config/axiosInstance");
jest.mock('fs');

describe('Utils Tests', () => {
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
            ])
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchMoviesCasts', () => {
        it('should fetch movie casts and save results to a file', async () => {
            // Mock axiosInstance.get to return a resolved promise with sample data
            axiosInstance.get.mockResolvedValue({
                data: {
                    cast: [{
                        "name": "name1",
                        "character": "character1",
                    }]
                }
            });

            await fetchMoviesCasts();

            expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
        });
    });

    describe('getMoviesDataFromLocal', () => {
        it('should read and parse data from a file', () => {
            const result = getMoviesDataFromLocal();

            expect(fs.readFileSync).toHaveBeenCalledTimes(1);
            expect(result).toEqual([
                {
                    movieId: 1,
                    cast: [
                        {id: 1, name: 'Actor1', character: 'Character1'},
                        {id: 2, name: 'Actor2', character: 'Character2'},
                    ],
                    movieName: "Movie1"
                },
            ]);
        });
    });

    describe('trimCharacterName', () => {
        it('should trim character name correctly', () => {
            const result = trimCharacterName('Johnny Storm / Human Torch');

            expect(result).toEqual('Johnny Storm');
        });

        it('should handle character name with brackets', () => {
            const result = trimCharacterName('Rocket (voice)');

            expect(result).toEqual('Rocket');
        });
    });

    describe('isMoreThanOneCharacter', () => {
        it('should return true if there is more than one character', () => {
            const result = isMoreThanOneCharacter(['Character1', 'Character2']);

            expect(result).toEqual(true);
        });

        it('should return false if there is only one character', () => {
            const result = isMoreThanOneCharacter(['Character1']);

            expect(result).toEqual(false);
        });

        it('should return false if more than one character but all are contained in a single one', () => {
            const result = isMoreThanOneCharacter(['Natalie Rushman / Natasha Romanoff / Black Widow', 'Natasha Romanoff / Black Widow']);

            expect(result).toEqual(false);
        });

        it('should return false if more than one character but all are contained in a single one #2', () => {
            const result = isMoreThanOneCharacter(["Virginia 'Pepper' Potts", "Pepper Potts"]);

            expect(result).toEqual(false);
        });
    });

    describe('isAllListsContainedInOne', () => {
        it('should return true if all lists are contained in one', () => {
            const result = isAllListsContainedInOne([
                ['a', 'b', 'c'],
                ['a', 'b'],
                ['b', 'c'],
            ]);

            expect(result).toEqual(true);
        });

        it('should return false if not all lists are contained in one', () => {
            const result = isAllListsContainedInOne([
                ['a', 'b', 'c'],
                ['a', 'b'],
                ['b', 'z'],
            ]);

            expect(result).toEqual(false);
        });
    });

    describe('isAllStringsContainedInOne', () => {
        it('should return true if all strings are contained in one', () => {
            const result = isAllStringsContainedInOne([
                'Virginia "Pepper" Potts',
                'Pepper Potts',
            ]);

            expect(result).toEqual(true);
        });

        it('should return false if not all strings are contained in one', () => {
            const result = isAllStringsContainedInOne([
                'Virginia "Pepper" Potts',
                'Pepper Potts',
                'Tony Stark',
            ]);

            expect(result).toEqual(false);
        });
    });
});
