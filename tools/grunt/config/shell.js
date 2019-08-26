// See https://github.com/sindresorhus/grunt-shell
module.exports = function() {
	return {
		phpcs: {
			command: "php ./vendor/squizlabs/php_codesniffer/bin/phpcs",
		},
	};
};
