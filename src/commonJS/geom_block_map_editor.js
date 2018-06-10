const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
import _ from  'underscore';

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
			setAttributes( { featureIds: _.pluck( newFeatures.models, 'id' ) } );
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
