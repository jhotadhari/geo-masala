'use strict';

module.exports = {

	dist: {
		files: [{
			expand: true,
			cwd: 'src/commonJS',
			src: [
				'*.js',
			],
			dest: '<%= dest_path %>/js',
			rename: function (dst, src) {
				return dst + '/' + src.replace('.js', '.min.js');
			}
		}],

        options: {
           transform: [
           	   [ 'babelify', {presets: ['es2015']}],
           	   [ 'jstify' ],
           	   [ 'uglifyify' ],
           	   [ 'browserify-shim', {global: true}]
           ],
           browserifyOptions: {
           	   debug: false,
           }
        },
	},

	debug: {
		files: [{
			expand: true,
			cwd: 'src/commonJS',
			src: [
				'*.js',
			],
			dest: '<%= dest_path %>/js',
			rename: function (dst, src) {
				return dst + '/' + src.replace('.js', '.min.js');
			}
		}],

        options: {
           transform: [
           	   [ 'babelify', {presets: ['es2015']}],
           	   [ 'jstify' ],
           	   [ 'uglifyify' ],
           	   [ 'browserify-shim', {global: true}]
           ],
           browserifyOptions: {
           	   debug: true,
           }
        },
	}

};

