'use strict';

module.exports = {

	dist: {
		files: [{
			expand: true,
			cwd: 'src/commonJS',
			src: [
				'*.js',
				'*.jsx',
			],
			dest: '<%= dest_path %>/js',
			rename: function (dst, src) {
				return dst + '/' + src.replace('.js', '.min.js');
			}
		}],

        options: {
        	transform: [
        		[ 'babelify', {
        				plugins: [
        					'transform-object-rest-spread',
        					'babel-plugin-transform-class-properties',
        				],
        				presets: [
							'es2015',
							'react',
						]
        		}],
        		[ 'jstify' ],
        		[ 'browserify-shim', {global: true}],
        		[ 'uglifyify' ]
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
				'*.jsx',
			],
			dest: '<%= dest_path %>/js',
			rename: function (dst, src) {
				return dst + '/' + src.replace('.js', '.min.js');
			}
		}],

        options: {
        	transform: [
        		[ 'babelify', {
        				plugins: [
        					'transform-object-rest-spread',
        					'babel-plugin-transform-class-properties',
        				],
        				presets: [
							'es2015',
							'react'
						]
        		}],
        		[ 'jstify' ],
        		[ 'browserify-shim', {global: true}]
        	],
           browserifyOptions: {
           	   debug: true,
           }
        },
	}

};

