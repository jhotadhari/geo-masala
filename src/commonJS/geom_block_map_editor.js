const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
import _ from  'lodash';

import defaults from './geom_block_map/defaults';
import GeomMap from './geom_block_map_editor/components/GeomMap.jsx';

registerBlockType( 'geom/map', {
	title: __( 'Geo Masala Map' ),
	icon: 'location-alt',
	category: 'widgets',

    attributes: {
        featureIds: {
            type: 'array',
        },
        controls: {
        	type: 'string',
        	default: JSON.stringify( defaults.controls ),
        }
    },

    edit( {  attributes, className, setAttributes } ) {
        const { featureIds, controls } = attributes;
        const controlsObject = JSON.parse( undefined === controls ? '{}' : controls );

		if ( undefined === featureIds ) {
			setAttributes({
				featureIds: [],
			});
		}

		function onChangeFeatures( newFeatures ) {
			let newFeatureIds = [];


			if ( newFeatures.length ){
				if ( newFeatures instanceof Backbone.Collection ){
					newFeatureIds = newFeatures.pluck('id');
				} else if ( 'object' === typeof ( newFeatures[0] ) ){
					newFeatureIds = _.pluck( newFeatures, 'id' );
				} else if ( 'integer' === typeof ( newFeatures[0] ) ) {
					newFeatureIds = newFeatures;
				}
			}

			setAttributes( { featureIds:newFeatureIds } );
		}

		function onChangeControls( newControls ) {
			setAttributes( { controls: JSON.stringify( newControls ) } );
		}

        return (
			<GeomMap
				featureIds={featureIds}
				controls={controlsObject}
				onChangeFeatures={onChangeFeatures}
				onChangeControls={onChangeControls}
			/>
		);
    },

    save( { attributes, className } ) {
        // const { featureIds } = attributes;
    	console.log( 'save attributes', attributes );		// ??? debug
    	return null;
    },

} );
