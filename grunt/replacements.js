var _ = require('underscore');
var grunt = require('grunt');

module.exports = {
	get: function() {
		replacements = [];
		_.mapObject( grunt.file.readJSON("package.json"), function( val, key ) {

			if ( !_.isObject(val) ){
				replacements.push( {
					pattern: new RegExp( 'taskRunner_set_' + key, 'g'),
					replacement: val.toString()
				} );
			}
			return val;
		});

		return replacements;
	},
};
