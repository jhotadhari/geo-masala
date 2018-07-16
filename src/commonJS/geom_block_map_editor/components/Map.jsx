
let L = require('leaflet');
require('leaflet-toolbar');
require('leaflet-draw');
// require('leaflet-draw-toolbar/dist/leaflet.draw-toolbar');

import MapMixin from '../../geom_block_map/MapMixin';
import defaults from '../../geom_block_map/defaults';
import getNestedObject from '../../geom_block_map/functions/getNestedObject';

import CustomDrawToolbar from '../../geom_block_map/toolbarControls/CustomDrawToolbar';

import EditDrawAction from '../../geom_block_map/toolbarActions/EditDrawAction';
import EditPopupAction from '../../geom_block_map/toolbarActions/EditPopupAction';
import EditAppearanceAction from '../../geom_block_map/toolbarActions/EditAppearanceAction';
import RemoveModelAction from '../../geom_block_map/toolbarActions/RemoveModelAction';
import CancelAction from '../../geom_block_map/toolbarActions/CancelAction';

class Map extends React.Component {
	constructor(props) {
		super(props)

		this.props = props;
		this.state = {
			featureCollection: props.featureCollection,
		}

		this.config = {
			controls: props.controls,
			mapOptions: props.mapOptions,
			mapDimensions: props.mapDimensions,
		};

	}

	onDrawCreated(layer){
		this.props.onDrawCreated(layer);
	}

	onDrawRemoved( evt ){
		this.props.onDrawRemoved( evt );
	}

	onDrawEdited( evt ){
		this.props.onDrawEdited( evt );
	}

	onDrawEditedAttributes( evt ){
		this.props.onDrawEditedAttributes( evt );
	}

	componentDidMount() {
		setTimeout( this.initMap.bind( this ), 0);
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		this.config = {
			controls: this.props.controls,
			mapOptions: this.props.mapOptions,
			mapDimensions: this.props.mapDimensions,
		};

		// init map if neccessary
		this.initMap();

		// update MapFeatures
		if ( this.props.isLoaded ) {
			this.updateMapFeatures();
		}

		// update controls
		this.updateControls();

		// run triggered actions
		let flyToPostId = getNestedObject( this.props, 'mapTriggers.flyToFeature' );
		if ( flyToPostId !== getNestedObject( prevProps, 'mapTriggers.flyToFeature' ) ) {
			this.flyToFeature( flyToPostId );
			delete this.props.mapTriggers.flyToFeature;
		}
		let removeFeatureId = getNestedObject( this.props, 'mapTriggers.removeFeature' );
		if ( removeFeatureId !== getNestedObject( prevProps, 'mapTriggers.removeFeature' ) ) {
			this.flyToFeature( removeFeatureId );
			delete this.props.mapTriggers.removeFeature;
		}
		let mapOptions = getNestedObject( this.props, 'mapTriggers.setOptions' );
		if ( mapOptions !== getNestedObject( prevProps, 'mapTriggers.setOptions' ) ) {
			this.setMapOptions( mapOptions )
			delete this.props.mapTriggers.setOptions;
		}
	}

	initMap(){
		if ( this.refs.map && ! this.map  ) {
			this.map = L.map( this.refs.map, {...defaults.leaflet.mapOptions, ...this.config.mapOptions} );
			this.getBaseLayer().addTo( this.map );
			this.addDrawToolbar();
		}


	}

	setMapOptions( newMapOptions ){
		// loop newMapOptions object
		for ( let newMapOptionKey in newMapOptions ) {
			if( newMapOptions.hasOwnProperty(newMapOptionKey)) {
				this.setMapOption( newMapOptionKey, newMapOptions[newMapOptionKey] );
			}
		}
	}

	setMapOption( newMapOptionKey, newMapOptionVal ){
		// set map option
		L.Util.setOptions( this.map, {[newMapOptionKey]: newMapOptionVal});
		// apply option to handler
		if ( this.map[newMapOptionKey] instanceof L.Handler ) {
			if ( newMapOptionVal ) {
				this.map[newMapOptionKey].enable();
			} else {
				this.map[newMapOptionKey].disable();
			}
		}
	}

	addDrawToolbar() {
		if ( ! this.drawToolbar ){
			// this.drawToolbar = new L.Toolbar2.DrawToolbar({
			this.drawToolbar = new CustomDrawToolbar({
				position: 'topleft'
			});

			this.mapSetupDrawHandlers();
			this.drawToolbar.addTo( this.map );
		}
	}

	mapSetupDrawHandlers() {
		let self = this;
		let map = this.map;
        map.on('draw:created', function( evt ) {
			self.onDrawCreated(evt.layer);
		});
		map.on('draw:removed', function( evt ) {
			self.onDrawRemoved( evt );
		});
		map.on('draw:edited', function( evt ) {
			self.onDrawEdited( evt );
		});
		map.on('draw:edited:attributes', function( evt ) {
			self.onDrawEditedAttributes(evt);
		});
		return this;
	}

	featureBindPopup( layer, featureModel ) {
		let self = this;
		layer.on('click', function( event ) {
			new L.Toolbar2.EditToolbar.Popup( event.latlng, {
				actions: self.getPopupActions(featureModel),
			}).addTo( self.map, layer );
		});
	}

	getPopupActions(featureModel){
		let actions = [];
		if ( featureModel.get('author').toString() === geomData.user.id ) {
			actions = actions.concat([
				EditDrawAction,
				EditPopupAction,
				EditAppearanceAction,
			]);
		}
		actions = actions.concat([
			RemoveModelAction,
			CancelAction,
		]);
		return actions;
	}

	flyToFeature( postId ){
		let layer = _.findWhere( this.getFeatureGroup().getLayers(), { postId: postId } );
		if ( undefined  === layer ) return;
		this.map._stop();	 // stop panning and fly animations if any
		let tempFeatureGroup = new L.FeatureGroup();
		tempFeatureGroup.addLayer( layer );
		this.map.flyToBounds( tempFeatureGroup.getBounds(), defaults.leaflet.flyToBounds );
	}

	getFullscreenControl() {
		if ( ! this.fullscreenControl ) {
			this.fullscreenControl = new L.Control.FullScreen({
				position: 'topleft',
				forceSeparateButton: true,
				forcePseudoFullscreen: true,
			});
		}
		return this.fullscreenControl;
	}

	render() {
		const {mapDimensions} = this.config;
		return (
			<div
				className='geom-map'
				ref='map'
				style={{
					height: mapDimensions.height + 'px',
					width: mapDimensions.width + '%',
				}}
			>
			</div>
		);
	}
}

// _.extend( Map.prototype, MapMixin);
_.defaults( Map.prototype, MapMixin);

export default Map;