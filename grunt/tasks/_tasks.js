module.exports = function(grunt){

	// _tasks
	// used by	_setPaths.js
	grunt.registerTask('_tasks', 'sub task', function(dest_path, process) {

		var pkg = grunt.file.readJSON("package.json");
		global['dest_path'] = dest_path;

		// define array of tasks
		var tasks = [];

		// add clean task
		tasks = tasks.concat([
			'clean',
		]);

		// add composer task
		if ( grunt.option('composer') != false ) {
			tasks = tasks.concat([
				'composer:update',
			]);
		}

		// add readme task and copy/str_replace tasks for php files and imgs/fonts ...
		tasks = tasks.concat( [
			'concat:readme',					// readme
			'concat:readmeMd',					// readme.md
			'wp_readme_to_markdown:readmeMd',
			'string-replace:plugin_main_file',	// copies plugin_main_file to destination
			'concat:plugin_main_file',			// add banner plugin_main_file
			'string-replace:inc_to_dest',		// copies inc to destination
			'copy',
		] );

		// add sass and js tasks
		// dist-process defaults to compacted mode, build to debug mode
		// overwrite with boolean option compact
		let compact = process === 'dist';
		compact = undefined !== grunt.option('compact') && 'boolean' === typeof( grunt.option('compact') )
			? grunt.option('compact')
			: compact;
		if ( compact ) {
			tasks = tasks.concat([
				'eslint',
				'uglify:dist',
				'browserify:dist',
				'uglify:dest',
				'sass:dist',
			] );
		} else {
			tasks = tasks.concat([
				'eslint',
				'uglify:debug',
				'browserify:debug',
				'sass:debug',
			] );
		}

		// add language tasks
		tasks = tasks.concat([
			'pot',			// language
			'_potomo',		// language
		] );

		// run tasks
		grunt.task.run( tasks );

	});
};