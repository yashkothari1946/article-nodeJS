var path = require('path'),
    appConfig = require(path.resolve('./config/appConfig'));


// SETUP ENVIROMENT VARIABLES 
var setupEnvVariables = function () {
    return new Promise((resolve, reject) => {
        if (appConfig) {
            let appConfigKeys = Object.keys(appConfig);
            for (let i = 0; i <= appConfigKeys.length; i++) {
                process.env[appConfigKeys[i]] = appConfig[appConfigKeys[i]];
            }
            return resolve();
        } else {
            return reject('appConfig is empty!');
        }
    });
}


// LET COMPLTE THE BASIC ENV SETUP AND OTHER REQUIREMENTS
setupEnvVariables().then((envResult) => {
    var server = require(path.resolve('./server/express.js'))
    server.initiateServer();
}).catch((err) => {
    console.error(err, new Date());
})
