/**
 * Internal dependencies
 */
// functions
import featureOpenPopupToolbar from '../functions/featureOpenPopupToolbar';

const featureBindPopup = ( model, layer, map ) => {
	layer.on('click', ( event ) => {
		featureOpenPopupToolbar( model, layer, map, event.latlng );
	});
};

export default featureBindPopup;