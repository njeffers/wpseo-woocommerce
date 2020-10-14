// See https://github.com/sindresorhus/grunt-shell
module.exports = function() {
	return {
		phpcs: {
			command: "composer check-cs",
		},
	};
};
