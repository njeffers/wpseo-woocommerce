const _defaultsDeep = require( "lodash/defaultsDeep" );
const path = require( "path" );
const pkg = require( "../../package.json" );
const UnminifiedWebpackPlugin = require( "unminified-webpack-plugin" );
const CaseSensitivePathsPlugin = require( "case-sensitive-paths-webpack-plugin" );
const { flattenVersionForFile } = require( "../version.js" );
const webpack = require( "webpack" );

const externals = {
	yoastseo: "yoast.analysis",
};

const pluginVersionSlug = flattenVersionForFile( pkg.yoast.pluginVersion );

const defaultConfig = {
	mode: "production",
	devtool: "cheap-module-eval-source-map",
	entry: {
		"yoastseo-woo-plugin": path.join( __dirname, "../../", "js/src/yoastseo-woo-plugin.js" ),
		"yoastseo-woo-replacevars": path.join( __dirname, "../../", "js/src/yoastseo-woo-replacevars.js" ),
		"yoastseo-woo-worker": path.join( __dirname, "../../", "js/src/yoastseo-woo-worker.js" ),
	},
	output: {
		path: path.join( __dirname, "../../", "js" ),
		filename: "[name]-" + pluginVersionSlug + ".min.js",
	},
	externals: externals,
	optimization: {
		minimize: true,
	},
	plugins: [
		new webpack.DefinePlugin( {
			"process.env": {
				NODE_ENV: JSON.stringify( "production" ),
			},
		} ),
		new UnminifiedWebpackPlugin(),
		new CaseSensitivePathsPlugin(),
	],
};


const defaults = ( config ) => {
	return _defaultsDeep( config, defaultConfig );
};

module.exports = {
	defaults,
};
