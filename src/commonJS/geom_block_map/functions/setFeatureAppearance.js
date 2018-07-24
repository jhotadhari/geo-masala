import defaults from '../defaults';

const setFeatureClass = ( model, layer ) => {
	let type;
	if ( layer.setIcon !== undefined ) type = 'icon';
	if ( layer.setStyle !== undefined ) type = 'path';

	switch(model.get('status')){
		case 'publish':
			L.DomUtil.removeClass(layer['_' + type], 'geom-feature-status-draft');
			L.DomUtil.removeClass(layer['_' + type], 'geom-feature-status-trash');
			break;
		case 'draft':
			L.DomUtil.removeClass(layer['_' + type], 'geom-feature-status-trash');
			L.DomUtil.addClass(layer['_' + type], 'geom-feature-status-draft');
			break;
		case 'trash':
			L.DomUtil.removeClass(layer['_' + type], 'geom-feature-status-draft');
			L.DomUtil.addClass(layer['_' + type], 'geom-feature-status-trash');
			break;
	}

};

const setFeatureAppearance = ( model, layer ) => {

	if ( layer.setIcon !== undefined ) {
		layer.setIcon( L.icon( {
			...defaults.leaflet.iconOptions,
			...model.get('geom_feature_icon'),
		} ) );
		setFeatureClass( model, layer );
	}

	if ( layer.setStyle !== undefined ) {
		layer.setStyle( {
			...defaults.leaflet.polylineOptions,
			...model.get('geom_feature_path_style'),
		} );
		setFeatureClass( model, layer );
	}

};

export default setFeatureAppearance;