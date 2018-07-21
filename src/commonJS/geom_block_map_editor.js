const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
import _ from  'lodash';
import loadJS from 'load-js';

import defaults from './geom_block_map/defaults';
import MapPlaceholder from './geom_block_map_editor/components/MapPlaceholder.jsx';
let GeomMap = null; // will be overwritten when loadJS loaded geom_block_map_component_GeomMap

registerBlockType( 'geom/map', {
	title: __( 'Geo Masala Map' ),
	icon: 'location-alt',
	category: 'widgets',
	supports: {
		html: false,
	},

    attributes: {
        featureIds: {
            type: 'array',
            default: [],
        },
        controls: {
        	type: 'string',
        	default: JSON.stringify( {...defaults.controls} ),
        },
        mapDimensions: {
        	type: 'string',
        	default: JSON.stringify( {...defaults.mapDimensions} ),
        },
        mapOptions: {
        	type: 'string',
        	default: JSON.stringify( {...defaults.leaflet.mapOptions} ),
        },
        options: {
        	type: 'string',
        	default: JSON.stringify( {...defaults.options} ),
        },
    },

    edit( {  attributes, className, setAttributes } ) {
        const { featureIds, controls, mapOptions, mapDimensions, options } = attributes;
        // parse serialized attributes to objects
        const controlsObject = JSON.parse( undefined === controls ? '{}' : controls );
        const mapOptionsObject = JSON.parse( undefined === mapOptions ? '{}' : mapOptions );
        const mapDimensionsObject = JSON.parse( undefined === mapDimensions ? '{}' : mapDimensions );
        const optionsObject = JSON.parse( undefined === options ? '{}' : options );

        // load the main editor component
        loadJS( [geomData.pluginDirUrl + '/js/geom_block_map_module_GeomMap.min.js'] ).then( () => GeomMap = geomData.modules.GeomMap );

		// display a loading placeholder or run the app
		if ( 'undefined' === typeof(GeomMap) || null === GeomMap ) {
			return ([
				<MapPlaceholder
					color={optionsObject.placeholder.color}
					dimensions={mapDimensionsObject}
				/>
			]);
		} else {
			return (
				<GeomMap
					featureIds={featureIds}
					controls={controlsObject}
					mapOptions={mapOptionsObject}
					mapDimensions={mapDimensionsObject}
					options={optionsObject}
					onChangeFeatures={ (newFeatures) => newFeatures instanceof Backbone.Collection ? setAttributes( { featureIds: newFeatures.length ? newFeatures.pluck('id') : [] } ) : null }
					onChangeControls={ (newVal) => setAttributes( { controls: JSON.stringify( newVal ) } ) }
					onChangeMapOptions={ (newVal) => setAttributes( { mapOptions: JSON.stringify( newVal ) } ) }
					onChangeMapDimensions={ (newVal) => setAttributes( { mapDimensions: JSON.stringify( newVal ) } ) }
					onChangeOptions={ (newVal) => setAttributes( { options: JSON.stringify( newVal ) } ) }
				/>
			);
		}

    },

    save( { attributes, className } ) {
    	console.log( 'save attributes', attributes );		// ??? debug
    	return null;
    },

} );
