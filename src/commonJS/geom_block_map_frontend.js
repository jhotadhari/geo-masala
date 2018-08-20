/**
 * External dependencies
 */
import loadJS from 'load-js';
import _ from  'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
Backbone.$ = $;

/**
 * Internal dependencies
 */
import defaults from './geom_block_map/defaults';
// functions
import getNestedObject from './geom_block_map/functions/getNestedObject';
import getBlocksWithDefaults from './geom_block_map/functions/getBlocksWithDefaults';
import getMapPlaceholder from './geom_block_map_frontend/functions/getMapPlaceholder';

document.addEventListener('DOMContentLoaded', () => {
	wp.api.loadPromise.done( () => {
		const $targets = $('.wp-block-geom-map');

		if ( $targets.length === 0 ) return;

		// display placeholder element
		$targets.each( function(){
			// get block attributes
			const atts = getBlocksWithDefaults( JSON.parse( this.getAttribute('data-geom-map') ) );
			// append placeholder
			$(this).append( getMapPlaceholder( getNestedObject( atts, 'options.placeholder.color' ), atts.mapDimensions ) );
		});

		// load app and start
		loadJS( [geomData.pluginDirUrl + '/js/geom_block_map_module_FrontendApp.min.js'] ).then( () => {
			const App = geomData.modules.FrontendApp;
			$targets.each( function(){
				const geomMap = new App({
					element: this,
				});
				geomMap.start();
			});
		});

	});
});
