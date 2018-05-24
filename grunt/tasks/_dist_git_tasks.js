module.exports = function(grunt){

	// _dist_git_tasks
	// used by	_setPaths
	grunt.registerTask('_dist_git_tasks', 'sub task', function() {

		if ( grunt.option('git:add') === false ) return;
		grunt.task.run( ['git:add'] );

		if ( grunt.option('git:commit') === false ) return;
		grunt.task.run( ['git:commit'] );

		if ( grunt.option('git:tag') === false ) return;
		grunt.task.run( ['git:tag'] );

	});

};