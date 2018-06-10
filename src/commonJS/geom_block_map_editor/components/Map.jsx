let L = require('leaflet');
require('leaflet-toolbar');
require('leaflet-draw');
require('leaflet-draw-toolbar/dist/leaflet.draw-toolbar');

import MapMixin from '../../geom_block_map/MapMixin';

import EditDrawAction from '../../geom_block_map/toolbarActions/EditDrawAction';
import EditTitleAction from '../../geom_block_map/toolbarActions/EditTitleAction';
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
		};

	}

	onDrawCreated(layer){
		this.props.onDrawCreated(layer);
	}

	onDrawRemoved( evt ){
		this.props.onDrawRemoved( evt );
	}

	onDrawDeleted(layers){
		this.props.onDrawDeleted(layers);
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
		};
		this.initMap();
		if ( this.props.isLoaded ) {
			this.updateMapFeatures();
		}
		this.updateControls();
	}

	initMap(){
		if ( this.refs.map && ! this.map  ) {
			this.map = L.map( this.refs.map,{
				center: [51.505, -0.09],
				zoom: 13,
			});

			this.getBaseLayer().addTo( this.map );

			this.addDrawToolbar();
		}
	}

	addDrawToolbar() {
		if ( ! this.drawToolbar ){
			this.drawToolbar = new L.Toolbar2.DrawToolbar({
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
		map.on('draw:deleted', function( evt ) {
			self.onDrawDeleted(evt.layers);
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

	featureAddPopup( layer ) {
		let self = this;
		layer.on('click', function( event ) {
			new L.Toolbar2.EditToolbar.Popup( event.latlng, {
				actions: self.getPopupActions(),
			}).addTo( self.map, layer ); // , AppDetails.instance.channel.request('featureModel:get') );
		});
	}

	getPopupActions(){
		return [
			EditDrawAction,
			EditTitleAction,
			RemoveModelAction,
			CancelAction
		];
	}

	render() {
		return (
			<div
				className='geom-map'
				ref='map'
				style={{
					height: '400px',
					width: '100%',
				}}
			>
			</div>
		);
	}
}

_.extend( Map.prototype, MapMixin);

export default Map;