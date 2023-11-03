require('dotenv').config({path: '../.env'});
const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes/api");
const {systemLogger} = require("../utils/logger");
const {fetchMoviesCasts} = require("../utils/movies");
const app = express();

app.use(express.json({limit: "100mb"}));
app.use(cors());

// Security - api response headers
app.use(function (req, res, next) {
    res.setHeader("X-Powered-By", "PHP");
    res.setHeader(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains"
    );
    next();
});

// Normal express config defaults
app.use(express.urlencoded({extended: true}));

// routes
app.use("/", apiRouter);

// start the server
app.listen(process.env.PORT || 3000, async () => {
    await fetchMoviesCasts()
    console.log(`server running port ${process.env.PORT}`);
    systemLogger.info(`server start, port:${process.env.PORT}`);
});
