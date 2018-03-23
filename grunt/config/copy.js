module.exports = {
	artifactFiles: {
		files: [
			{
				expand: true,
				cwd: ".",
				src: [
					// folders to copy
					"classes/**",
					"vendor/**",
					"js/*.min.js",
					"languages/**",
					// files to copy
					"*.php",
				],
				dest: "artifact",
			},
		],
	},
};
