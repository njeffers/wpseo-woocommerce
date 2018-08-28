// See https://github.com/sindresorhus/grunt-shell
module.exports = function() {
	return {
		"production-composer-install": {
			command: "composer install --prefer-dist --optimize-autoloader --no-dev",
		},
	};
};
