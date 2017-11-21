// https://github.com/gruntjs/grunt-contrib-uglify
module.exports = {
	"woo": {
		options: {
			preserveComments: false,
			report: "gzip"
		},
		files: {
			"js/yoastseo-woo-plugin-510.min.js": [
				"js/yoastseo-woo-plugin-510.js"
			],
			"js/yoastseo-woo-replacevars-590.min.js": [
				"js/yoastseo-woo-replacevars-590.js"
			]
		}
	}
};
