/* global require, module */
const defaults = require( "./webpack.config.default" ).defaults;

const prodConfig = {
	devtool: "cheap-module-source-map",
	mode: "production",
};

module.exports = defaults( prodConfig );
