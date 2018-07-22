const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
import _ from  'lodash';
import loadJS from 'load-js';

import defaults from './geom_block_map/defaults';
import getNestedObject from './geom_block_map/functions/getNestedObject';
import MapPlaceholder from './geom_block_map_editor/components/MapPlaceholder.jsx';

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

        if ( undefined === getNestedObject( geomData, 'modules.GeomMap' ) ) {
        	// load the main editor component, then set some nonsense to rerender the block
			loadJS( [geomData.pluginDirUrl + '/js/geom_block_map_module_GeomMap.min.js'] ).then( () => setAttributes({nonsense: true}) );
			// until loaded, display a placeholder
			return ([
				<MapPlaceholder
					color={optionsObject.placeholder.color}
					dimensions={mapDimensionsObject}
				/>
			]);
		} else {
			return (
				<geomData.modules.GeomMap
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
    	// console.log( 'save attributes', attributes );		// ??? debug
    	return null;
    },

} );
