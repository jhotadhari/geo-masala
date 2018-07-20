'use strict';

const files = [{
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
}];

const transform = [
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
];

module.exports = {

	dist: {
		files,
        options: {
        	transform,
        	browserifyOptions: {
        		debug: false,
        	}
        },
	},

	debug: {
		files,
        options: {
        	transform,
        	browserifyOptions: {
        		debug: true,
        	}
        },
	}

};
