const docs = {
    "openapi": "3.0.0",
    "info": {
        "title": "Movies API",
        "version": "1.0.0"
    },
    "paths": {
        "/moviesPerActor": {
            "get": {
                "summary": "Get movies per actor",
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "content": {
                            "application/json": {
                                "example": {
                                    "Actor1": [
                                        "Movie1",
                                        "Movie2"
                                    ],
                                    "Actor2": [
                                        "Movie3",
                                        "Movie4"
                                    ]
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "content": {
                            "application/json": {
                                "example": {
                                    "msg": "Could not retrieve movies per actor"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/actorsWithMultipleCharacters": {
            "get": {
                "summary": "Get actors with multiple characters",
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "content": {
                            "application/json": {
                                "example": {
                                    "Actor1": [
                                        {
                                            "movieName": "Movie1",
                                            "characterName": "Character1"
                                        }
                                    ],
                                    "Actor2": [
                                        {
                                            "movieName": "Movie2",
                                            "characterName": "Character2"
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "content": {
                            "application/json": {
                                "example": {
                                    "msg": "Could not retrieve actors with multiple characters"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/charactersWithMultipleActors": {
            "get": {
                "summary": "Get characters with multiple actors",
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "content": {
                            "application/json": {
                                "example": {
                                    "Character1": [
                                        {
                                            "movieName": "Movie1",
                                            "actorName": "Actor1"
                                        }
                                    ],
                                    "Character2": [
                                        {
                                            "movieName": "Movie2",
                                            "actorName": "Actor2"
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "content": {
                            "application/json": {
                                "example": {
                                    "msg": "Could not retrieve characters with multiple actors"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

module.exports = {
    docs
}