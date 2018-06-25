/* global require, process */
const { flattenVersionForFile } = require( "./grunt/modules/version.js" );
const timeGrunt = require( "time-grunt" );
const loadGruntConfig = require( "load-grunt-config" );
const path = require( "path" );

module.exports = function( grunt ) {
	timeGrunt( grunt );

	const pkg = grunt.file.readJSON( "package.json" );
	const pluginVersion = pkg.yoast.pluginVersion;

	// Define project configuration
	let project = {
		pluginVersion: pluginVersion,
		paths: {
			get config() {
				return this.grunt + "config/";
			},
			grunt: "grunt/",
			languages: "languages/",
			logs: "logs/",
		},
		files: {
			php: [
				"*.php",
			],
			js: [
				"js/src/*.js",
				"!js/*.min.js",
			],
			phptests: "tests/**/*.php",
			get config() {
				return project.paths.config + "*.js";
			},
			get changelog() {
				return project.paths.theme + "changelog.txt";
			},
			grunt: "Gruntfile.js",
		},
		pkg: grunt.file.readJSON( "package.json" ),
	};

	project.pluginVersionSlug = flattenVersionForFile( pluginVersion );

	// Load Grunt configurations and tasks
	loadGruntConfig( grunt, {
		configPath: path.join( process.cwd(), project.paths.config ),
		data: project,
		jitGrunt: {
			staticMappings: {
				addtextdomain: "grunt-wp-i18n",
				makepot: "grunt-wp-i18n",
				glotpress_download: "grunt-glotpress",
				wpcss: "grunt-wp-css",
				"update-version": "@yoast/grunt-plugin-tasks",
				"set-version": "@yoast/grunt-plugin-tasks"
			},
		},
	} );
};
