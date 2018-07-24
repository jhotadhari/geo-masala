/**
 * Internal dependencies
 */
// functions
import getPopupToolbarActions from '../functions/getPopupToolbarActions';

const featureOpenPopupToolbar = ( model, layer, map, latlng ) => {
	new L.Toolbar2.EditToolbar.Popup( latlng, {
		actions: getPopupToolbarActions(model),
	}).addTo( map, layer );
};

export default featureOpenPopupToolbar;