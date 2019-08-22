// See https://github.com/sindresorhus/grunt-shell
module.exports = function() {
	return {
		"composer-install-production": {
			command: "composer install --prefer-dist --optimize-autoloader --no-dev",
		},

		"composer-install-dev": {
			command: "composer install",
		},
	};
};
