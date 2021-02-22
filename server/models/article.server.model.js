"use strict";
var path = require('path'),
    errorHandler = require(path.resolve('./server/controllers/errors/errors.server.controller'));

module.exports = function (sequelize, DataTypes) {

    var Article = sequelize.define('article', {
        title: {
            type: DataTypes.STRING,
            required: true,
        },
        description: {
            type: DataTypes.STRING,
        },
        authorname: {
            type: DataTypes.STRING,
            required: true,
        },
        authoremail: {
            type: DataTypes.STRING,
            required: true,
            validate: {
                isLowercase: true,
                isEmail: true
            },
            default: null
        }
    });

    Article.createPromise = function(data) {
        return new Promise(function (resolve, reject) {
            if (!data || !data.title || !data.authorname || !data.authoremail) {
                return reject(errorHandler.setErrorMessage("Bad Request"));
            }

            data.description =  data.description || '';

            Article.create(data).then((result) => {
                return resolve(result.dataValues);
            }, (err) => {
                console.log(err)
                return reject(errorHandler.dbErrorParser(err));
            });
        });
    };

    Article.updatePromise = function(data) {
        return new Promise(function (resolve, reject) {
            if (!data || !data.id) {
                return reject(errorHandler.setErrorMessage("Article Id Not Specified"));
            }

            if (!data.title || !data.authorname || !data.authoremail) {
                return reject(errorHandler.setErrorMessage("Bad Request"));
            }

            data.description =  data.description || '';

            var id = data.id;

            Article.update(data,{
                where: {
                    id: id
                },
                returning: true
            }).then((result) => {
                if(result[0]){
                    return resolve(result[1][0].dataValues);    
                } else {
                    return reject(errorHandler.setErrorMessage("No Article found to update with the Id"));
                }                
            }, (err) => {
                return reject(errorHandler.dbErrorParser(err));
            });
        });
    };

    Article.singleArticlePromise = function(data) {
        return new Promise(function (resolve, reject) {
            if (!data || !data.id) {
                return reject(errorHandler.setErrorMessage("Article Id Not Specified"));
            }

            var id = data.id;

            Article.findOne({
                where: {
                    id: id
                }
            }).then((result) => {
                if(result && result.id){
                    return resolve(result);    
                } else {
                    return reject(errorHandler.setErrorMessage("No Article found with the Id"));
                }
            }, (err) => {
                return reject(err);
            });
        });
    };

    Article.deletePromise = function(data) {
        return new Promise(function (resolve, reject) {
            if (!data || !data.id) {
                return reject(errorHandler.setErrorMessage("Article Id Not Specified"));
            }

            var id = data.id;

            Article.destroy({
                where: {
                    id: id
                }
            }).then((result) => {
                return resolve(result);
            }, (err) => {
                return reject(err);
            });
        });
    };

    Article.listPromise = function(data) {
        return new Promise(function (resolve, reject) {
            let options = {};
            if(data && data.email){
                options.where = {authoremail : data.email};
            }

            Article.findAll(options).then((result) => {
                if (result.length != 0) {
                    return resolve(result);
                } else {
                    return resolve(errorHandler.setErrorMessage("No Articles Exist"));
                }
            }, (err) => {
                return resolve(errorHandler.dbErrorParser(err));
            })
        })
    };

    Article.getAllAuthors = function(data){
        return new Promise(function (resolve, reject) {

            let authorQuery = `SELECT DISTINCT ON (authoremail)  "authoremail", "authorname" FROM "articles" AS "article"`;
            if(data.excludeEmail){
                authorQuery += ` WHERE "article"."authoremail" != '${data.excludeEmail}'`
            } else if(data.includeEmail){
                authorQuery += ` WHERE "article"."authoremail" = '${data.includeEmail}'`
            }
            sequelize.query(authorQuery, {
                type: sequelize.QueryTypes.SELECT
            }).then((authors) => {
                if (authors.length != 0) {
                    return resolve(authors);
                } else {
                    return resolve(errorHandler.setErrorMessage("No Authors Exist in Table"));
                }
            }, (err) => {
                console.log(err)
                return resolve(errorHandler.dbErrorParser(err));
            });
        });
    }

    return Article;
};