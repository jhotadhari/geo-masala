'use strict';

module.exports = {
	js: {
		files: {
			src: [
				'src/js/**/*.js',
				'!src/js/**/noLint/**/*.js',
				'<%= pattern.global_exclude %>',
			]
		}
	},
	commonJS: {
		options: {
			esversion: 6,
			node: true
		},
		files: {
			src: [
				'src/commonJS/**/*.js',
				'<%= pattern.global_exclude %>',
			]
		}
	}
};