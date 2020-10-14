module.exports = {
	artifact: {
		files: [
			{
				expand: true,
				cwd: ".",
				src: [
					// Folders to copy
					"classes/**",
					"vendor/**",
					"!vendor/bin",
					"js/*.js",
					"js/dist/*.js",
					"!js/dist/*.nomin.js",
					"languages/**",
					// Files to copy
					"*.php",
				],
				dest: "artifact",
			},
		],
	},
};
