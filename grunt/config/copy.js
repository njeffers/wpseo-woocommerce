module.exports = {
	artifactFiles: {
		files: [
			{
				expand: true,
				cwd: ".",
				src: [
					// Folders to copy
					"classes/**",
					"vendor/**",
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
