# Vi Coding Assignment 

The Movie Service Project is designed to provide information about movies, actors, and characters through a set of RESTful endpoints. It includes functionalities to fetch movie casts, actors with multiple characters, and characters with multiple actors.

## Tools
- Express - Web framework for Node.js.


- Lodash - JavaScript utility library.
  

- Cors - Middleware that enables CORS (Cross-Origin Resource Sharing) with various options.
  

- Dotenv - Zero-dependency module that loads environment variables from a .env file.


- Swagger UI Express - Middleware to serve auto-generated Swagger UI on Express.


- Body Parser - Node.js body parsing middleware.
  

- Winston - A logging library for Node.js.


- Eslint - A tool for identifying and reporting patterns in JavaScript code.


- Supertest - A library for testing HTTP assertions.


- Jest - A JavaScript testing framework with a focus on simplicity.


- Axios - A promise-based HTTP client for the browser and Node.js.


## Getting Started

### Clone the Repository
   ```bash
   git clone https://github.com/roytal/coding-assignment.git
   cd movie-service
   ```

### Install dependencies

Before starting to code, install all dependencies that are mentioned above:

```shell
yarn install
```

### Running tests

Run all tests once:

```shell
yarn test
```

### Start the server

By default, the server will be running on http://localhost:3000.

Swagger API documentation can be found [here](http://localhost:3000/api-docs).

Start the server:

``API_KEY`` Your 'THE MOVIES DB' API key (Mandatory)

``PORT``  The port number on which the server will run. (Optional, default is 3000)

``MOVIES_DB_API`` The base URL for 'The Movies DB' API. (Optional, default is https://api.themoviedb.org/3)

```shell
PORT={PORT_NUMBER} API_KEY={API_KEY} MOVIES_DB_API={MOVIES_DB_API_BASE} yarn start
```

## How to use

### Endpoints

#### 1. Movies Per Actor

- **Endpoint:** GET /moviesPerActor

- **Description:**
  Returns a list of movies grouped by the actor.


#### 2. Actors With Multiple Characters

- **Endpoint:** GET /actorsWithMultipleCharacters

- **Description:**
  Returns actors who have played multiple characters.


#### 3. Characters With Multiple Actors

- **Endpoint:** GET /charactersWithMultipleActors

- **Description:**
  Returns characters that have been played by multiple actors.


### Example

Make HTTP requests to the specified endpoints to retrieve information. Example using cURL:

```bash
curl http://localhost:3000/moviesPerActor
```

