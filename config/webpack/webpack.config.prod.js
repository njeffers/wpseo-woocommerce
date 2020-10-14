/* global require, module */
const defaults = require( "./webpack.config.default" ).defaults;

const prodConfig = {
	devtool: false,
	mode: "production",
};

module.exports = defaults( prodConfig );
