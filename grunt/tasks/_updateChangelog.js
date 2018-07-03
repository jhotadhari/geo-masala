'use strict';

var _ = require('underscore');
var sortObj = require('sort-object');
var compareVersions = require('compare-versions');

var sortChangelog = function( changelog ){

	var next = changelog.next;
	delete changelog.next;

	var sortArr = _.allKeys(changelog).sort( compareVersions )
	sortArr.push('next');
	sortArr = sortArr.reverse();

	changelog.next = next;

	changelog = sortObj(changelog, {
		sortBy: function(){
			return sortArr;
		}
	});

	return changelog;
};

module.exports = function(grunt){

	grunt.registerTask('_updateChangelog', 'sub task', function(process) {

		// get new version
		var version = global['pkg'].version;

		// get changelog
		var changelog = grunt.file.readJSON("changelog.json");

		var key, i, len;

		if ( process === 'dist' ){
			// set global commit_msg
			global['commit_msg'] = '';
			for ( key in changelog.next) {
				global['commit_msg'] += changelog.next[key] + '\n';
			}

			// update changelog
			var next = changelog.next;
			changelog[version] = next;
			changelog.next = [
				''
			];
			// sort changelog
			changelog = sortChangelog( changelog );
			// update changelog.json
			grunt.file.write('changelog.json', JSON.stringify( changelog, null, 2 ));
		}


		// sort changelog
		changelog = sortChangelog( changelog );
		// set global changelog str, will be appended to readme.txt
		global['changelog'] = '';
		for ( key in changelog ) {

			if (key !== 'next'){
				global['changelog'] += key + '\n';

				for ( i = 0, len = changelog[key].length; i < len; i++) {
					global['changelog'] += changelog[key][i] + '\n';
				}

				global['changelog'] += '\n';

			}

		}

	});
};