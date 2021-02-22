const path = require('path'),
    db = require(path.resolve('./server/sequelize')).models,
    errorHandler = require(path.resolve('./server/controllers/errors/errors.server.controller')),
    EmailHandler = require(path.resolve('./server/controllers/email.server.controller')),
    Article = db.article,
    Op = require('sequelize').Op;

exports.create = function (req, res) {
	let data = req.body;
	if(!data || !Object.keys(data).length){
     	return res.status(400).send('Bad Request')
 	}
	let createPromise = Article.createPromise(data);
	createPromise.then((result) => {
		notifyOtherAuthors(result.authoremail,result.authorname);
		return res.send(result);
	}).catch((err) => {
		return res.status(400).send(errorHandler.setErrorMessage(err));
	});
}

var notifyOtherAuthors = function(email,name){
	let data = {};
	if(email){
		data.excludeEmail = email;
    }
	let getAllAuthors = Article.getAllAuthors(data);
	getAllAuthors.then((result) => {
		result.map((element)=>{
			var mailData = {};

			mailData.emailto = element.authoremail;
		    mailData.subject = 'New Post from ' + name
		    mailData.template = 'server/templates/notification';
		    mailData.attributes = {
		      name: name,
		      authorname: element.authorname
		    };
		    EmailHandler.sendMail(mailData)
		})
		console.log(result);
	}).catch((err) => {
		console.log(err);
	});
}

exports.update = function (req, res) {
	let data = req.body;
	if(!data || !Object.keys(data).length){
     	return res.status(400).send('Bad Request')
 	}
	let updatePromise = Article.updatePromise(data);
	updatePromise.then((result) => {
		return res.send(result);
	}).catch((err) => {
		return res.status(400).send(errorHandler.setErrorMessage(err));
	});
}

exports.listAllArticles = function (req, res) {
	let data = {};
	if(req.params && req.params.email){
		data.email = req.params.email;
	}
	let listPromise = Article.listPromise(data);
	listPromise.then((result) => {
		return res.send(result);
	}).catch((err) => {
		return res.status(400).send(errorHandler.setErrorMessage(err));
	});
}

exports.deleteById = function (req, res) {
	let data = {
		id: req.params.id
	}
	let deletePromise = Article.deletePromise(data);
	deletePromise.then((deletionResult) => {
		return res.send('Article deleted successfully!');
	}).catch((err) => {
		return res.status(400).send(errorHandler.setErrorMessage(err));
	});
}

exports.getArticleById = function (req, res) {
	let data = {
		id: req.params.id
	}
	let singleArticlePromise = Article.singleArticlePromise(data);
	singleArticlePromise.then((result) => {
		return res.send(result);
	}).catch((err) => {
		return res.status(400).send(errorHandler.setErrorMessage(err));
	});
}