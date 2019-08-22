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
					"js/*.min.js",
					"languages/**",
					// Files to copy
					"*.php",
				],
				dest: "artifact",
			},
		],
	},
};
