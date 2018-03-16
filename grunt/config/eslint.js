// See https://github.com/sindresorhus/grunt-eslint
module.exports = {
	grunt: {
		src: [ "Gruntfile.js", "grunt/**/*.js" ],
		options: {
			maxWarnings: 50,
		},
	},
};