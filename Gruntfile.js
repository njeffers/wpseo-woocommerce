/* global require, process */
const { flattenVersionForFile } = require( "./tools/version.js" );
const timeGrunt = require( "time-grunt" );
const loadGruntConfig = require( "load-grunt-config" );
const path = require( "path" );

module.exports = function( grunt ) {
	timeGrunt( grunt );

	const pkg = grunt.file.readJSON( "package.json" );
	const pluginVersion = pkg.yoast.pluginVersion;

	// Define project configuration
	const project = {
		pluginVersion: pluginVersion,
		pluginSlug: "wpseo-woocommerce",
		pluginMainFile: "wpseo-woocommerce.php",
		paths: {
			/**
			 * Gets the config path.
			 *
			 * @returns {string} Config path.
			 */
			get config() {
				return this.grunt + "config/";
			},
			grunt: "tools/grunt/",
			languages: "languages/",
			logs: "logs/",
		},
		files: {
			artifact: "artifact",
			php: [
				"*.php",
			],
			js: [
				"js/src/**/*.js",
				"!js/dist/*.min.js",
			],
			phptests: "tests/**/*.php",
			/**
			 * Gets the config path.
			 *
			 * @returns {string} Config path.
			 */
			get config() {
				return project.paths.config + "*.js";
			},
			/**
			 * Gets the changelog path file.
			 *
			 * @returns {string} Changelog path file.
			 */
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
		configPath: path.join( process.cwd(), "node_modules/@yoast/grunt-plugin-tasks/config/" ),
		overridePath: path.join( process.cwd(), project.paths.config ),
		data: project,
		jitGrunt: {
			staticMappings: {
				addtextdomain: "grunt-wp-i18n",
				makepot: "grunt-wp-i18n",
				glotpress_download: "grunt-glotpress",
				"update-version": "./node_modules/@yoast/grunt-plugin-tasks/tasks/update-version.js",
				"set-version": "./node_modules/@yoast/grunt-plugin-tasks/tasks/set-version.js",
			},
		},
	} );
};
