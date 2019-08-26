// Custom task
module.exports = {
	initializer: {
		options: {
			regEx: /(\n\s+const VERSION = ')(\d+(\.\d+){0,3})([^.^'\d]?.*?)(';\n)/,
			preVersionMatch: "$1",
			postVersionMatch: "$5",
		},
		src: "<%= pluginMainFile %>",
	},
};
