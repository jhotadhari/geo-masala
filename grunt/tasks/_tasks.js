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
			'string-replace:readmeMd',
			'string-replace:plugin_main_file',	// copies plugin_main_file to destination
			'concat:plugin_main_file',			// add banner plugin_main_file
			'string-replace:inc_to_dest',		// copies inc to destination
			'copy',
		] );

		// add sass and js tasks
		if ( process === 'build' ) {
			tasks = tasks.concat([
				'eslint',
				'uglify:debug',
				'browserify:debug',
				'sass:debug',
			] );
		} else {
			tasks = tasks.concat([
				'eslint',
				'uglify:dist',
				'browserify:dist',
				'uglify:distCommonJs',
				'sass:dist',
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