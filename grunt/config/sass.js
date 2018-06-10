module.exports = {
	options: {
		require: [
			// 'susy',
			// 'breakpoint'
		],
		loadPath: [
			require('node-bourbon').includePaths,
			'node_modules/bootstrap-sass/assets/stylesheets',
			'node_modules/backgrid/src'
		]
	},

	dist: {
		options: {
			sourcemap: 'none',
			style: 'compressed'
		},
		files: [{
			expand: true,
			cwd: 'src/sass',
			src: ['*.scss'],
			dest: '<%= dest_path %>/css',
			ext: '.min.css'
		}]
	},

	debug: {
		options: {
			sourcemap: 'auto',
			style: 'expanded',
			lineNumbers: true,
		},
		files: [{
			expand: true,
			cwd: 'src/sass',
			src: ['*.scss'],
			dest: '<%= dest_path %>/css',
			ext: '.min.css'
		}]
	}

};