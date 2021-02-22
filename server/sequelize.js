"use strict";

var path = require('path'),
    Sequelize = require('sequelize'),
    db = {},
    fs = require('fs'),
    modelsFolder = path.resolve('./server/models/');


db.Sequelize = Sequelize;
db.models = {};
db.discover = [];

// Expose the connection function
db.connect = function (database, username, password, options) {
    return new Promise((resolve, reject) => {
        fs.readdir(modelsFolder, (err, files) => {
            files.forEach(file => {
                db.discover.push(path.resolve(`./server/models/${file}`));
            });

            if (typeof db.logger === 'function')
                console.info("Connecting to: " + database + " as: " + username);

            // Instantiate a new sequelize instance
            var sequelize = new db.Sequelize(database, username, password, options);


            db.discover.forEach(function (location) {
                if (location.includes('mongoose') || location.includes('queries')) {
                    return;
                }
                var model = require(location)(sequelize, Sequelize.DataTypes);
                if (model)
                    db.models[model.name] = model;
            });

            // Execute the associate methods for each Model
            Object.keys(db.models).forEach(function (modelName) {
                if (db.models[modelName].options.hasOwnProperty('associate')) {
                    db.models[modelName].options.associate(db.models);
                }
            });


            sequelize.sync()
                .then(function () {
                    console.info("Database synchronized");
                    return resolve(true);
                }).catch(function (err) {
                    console.log(err);
                    console.error("An error occured: %j", err);
                    return reject(false);
                });

            console.info("Finished Connecting to Database");

            db.sequelize = sequelize;

        });
    });
};

module.exports = db;