'use strict';

module.exports = {
	js: {
		src: [
			'src/js/**/*.js',
			'!src/js/**/noLint/**/*.js',
			'<%= pattern.global_exclude %>',
		]
	},
	commonJS: {
		src: [
			'src/commonJS/**/*.js',
			'src/commonJS/**/*.jsx',
			'<%= pattern.global_exclude %>',
		]
	}
};