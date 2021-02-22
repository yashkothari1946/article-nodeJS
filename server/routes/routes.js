var path = require('path'),
    articleController = require(path.resolve('./server/controllers/article.server.controller'));

exports.routes = [{
        'url': '/api/article/create',
        'method': 'post',
        'controller': articleController.create
    },{
        'url': '/api/article/update',
        'method': 'post',
        'controller': articleController.update
    },{
        'url': '/api/article/list',
        'method': 'get',
        'controller': articleController.listAllArticles
    },{
        'url': '/api/article/list/:email',
        'method': 'get',
        'controller': articleController.listAllArticles
    },{
        'url': '/api/article/delete/:id',
        'method': 'get',
        'controller': articleController.deleteById
    },{
        'url': '/api/article/find/:id',
        'method': 'get',
        'controller': articleController.getArticleById
    }
]