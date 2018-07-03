var path = require('path')

module.exports = function(grunt){

	// _setPaths
	// used by build.js
	// used by dist.js
	grunt.registerTask('_setPaths', 'sub task', function(process) {

		// set paths
		var i;
		var dest_path;

		grunt.log.writeln('version: ' + global['pkg'].version);

		if ( process == 'build' ) {
			dest_path = [
				'test'
			];
		} else if ( process == 'dist' ) {
			dest_path = [
				'dist' + '/tags/' + global['pkg'].version,
				'dist' + path.sep + 'trunk',
			];
		}

		// run tasks
		for ( i = 0, len = dest_path.length; i < len; i++) {
			grunt.task.run('_tasks:' + dest_path[i] + ':' + process);
		}

	});
};