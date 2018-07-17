import defaults from '../defaults';

const setFeatureAppearance = ( model, layer ) => {

	if ( layer.setIcon !== undefined ) {
		layer.setIcon( L.icon( {
			...defaults.leaflet.iconOptions,
			...model.get('geom_feature_icon'),
		} ) );
	}

	if ( layer.setStyle !== undefined ) {
		layer.setStyle( {
			...defaults.leaflet.polylineOptions,
			...model.get('geom_feature_path_style'),
		} );
	}

}

export default setFeatureAppearance;