var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    app = express(),
    port = process.env.PORT;


// SETUP ALL ROUTES
var setupExpressRoutes = function () {
    return new Promise((resolve, reject) => {
        var routes = require(path.resolve('./server/routes/routes')).routes
        var getMethodRoutes = [],
            postMethodRoutes = [];

        routes.map((route) => {
            if (route.method.toLowerCase() === 'get') {
                getMethodRoutes.push(route);
            } else if (route.method.toLowerCase() === 'post') {
                postMethodRoutes.push(route);
            }
        });
        postMethodRoutes.map((route) => {
            app.post(route.url, route.controller);
        });

        getMethodRoutes.map((route) => {
            app.get(route.url, route.controller);
        });

        return resolve();
    });
}


// SETUP PSQL / MODELS
var setupPsqlSequelize = function () {
    return new Promise((resolve, reject) => {
        var sequelize = require(path.resolve('./server/sequelize'));
        sequelize.connect(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: 'postgres',
            logging: false
        }).then(() => {
            return resolve();
        });
    });
}

// INITIATE EXPRESS SERVER AFTER COMPLETE THE ENV SETUP 
exports.initiateServer = function () {
    return new Promise((resolve, reject) => {
        setupPsqlSequelize().then((psqlResult) => {
            // parse application/x-www-form-urlencoded
            app.use(bodyParser.urlencoded({
                extended: false
            }));

            // parse application/json
            app.use(bodyParser.json());

            setupExpressRoutes().then(() => {
                app.listen(port, () => console.log(`Batch server listening on port ${port}!`))
            });
        }).catch(err => console.log(err));
    });
}