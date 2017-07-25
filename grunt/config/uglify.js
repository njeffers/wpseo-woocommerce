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
			]
		}
	}
};
