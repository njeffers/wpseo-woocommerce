// See https://github.com/sindresorhus/grunt-eslint
module.exports = {
	grunt: {
		src: [ "<%= files.grunt %>", "<%= files.config %>" ],
		options: {
			maxWarnings: 29,
		},
	},
    js: {
		src: [ "<%= files.js %>" ],
		options: {
			maxWarnings: 50,
		},
	},
};
