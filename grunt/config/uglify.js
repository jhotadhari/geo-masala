'use strict';

const files = [{
	expand: true,
	cwd: 'src/js',
	src: [
		'**/*.js',
	],
	dest: '<%= dest_path %>/js',
	rename: function (dst, src) {
		return dst + '/' + src.replace('.js', '.min.js').replace('noLint/', '');
	}
}];

module.exports = {
	dist: {
		options: {
			mangle: true,
			compress: true,
			beautify: false,
		},
		files,
	},
	dest: {
		options: {
			mangle: true,
			compress: true,
			beautify: false,
		},
		files: [{
			expand: true,
			cwd: '<%= dest_path %>/js',
			src: [
				'**/*.js',
			],
			dest: '<%= dest_path %>/js',
		}]
	},
	debug: {
		options: {
			mangle: false,
			compress: false,
			beautify: true,
		},
		files,
	},

};