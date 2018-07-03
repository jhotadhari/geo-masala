var replacements = require('../replacements');

module.exports = function(grunt){
	grunt.registerTask('_updateConfig', 'sub task', function() {
		global['pkg'] = grunt.file.readJSON('package.json');
		grunt.config('string-replace.options.replacements', replacements.get() );
	});
};