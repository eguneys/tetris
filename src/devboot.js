require('./index.css');

const main = require('./main');

const test = require('./pixi/test/main');

module.exports = main.app;
module.exports.test = test.test;
