module.exports = {
	artifact: {
		options: {
			archive: "artifact.zip",
		},
		files: [
			{
				cwd: "artifact/",
				src: [ "**" ],
				dest: "wpseo-woocommerce",
			},
		],
	},
};
