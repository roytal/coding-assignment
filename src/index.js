require('dotenv').config();
const express = require("express");
const swaggerUI = require("swagger-ui-express");
const cors = require("cors");
const apiRouter = require("./routes/api");
const {systemLogger} = require("./utils/logger");
const {fetchMoviesCasts} = require("./utils/movies");
const {docs} = require('../docs/openapi')
const app = express();

app.use(express.json({limit: "100mb"}));
app.use(cors());

// security - api response headers
app.use(function (req, res, next) {
    res.setHeader("X-Powered-By", "PHP");
    res.setHeader(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains"
    );
    next();
});

// normal express config defaults
app.use(express.urlencoded({extended: true}));

// routes
app.use("/", apiRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs));

// fetch all data to local storage and start the server
const startServer = async () => {
    try {
        await fetchMoviesCasts();
        systemLogger.info(`fetched all movie calls to local storage`);
        console.log(`fetched all movie calls to local storage`);

        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
            systemLogger.info(`Server started, port: ${port}`);
        });
    } catch (error) {
        console.error('Error fetching movie casts:', error);
        systemLogger.error('Error fetching movie casts:', error);
        process.exit(1);
    }
};

startServer();