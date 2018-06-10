const { __ } = wp.i18n;

const {
    PanelBody,
    SelectControl,
    ToggleControl,
} = wp.components;

import FeatureModel from '../../geom_block_map/models/FeatureModel';
import FeatureCollection from '../../geom_block_map/collections/FeatureCollection';

import Map from './Map.jsx';
import FeatureListPanel from './FeatureListPanel.jsx';

const layersControlOptions = [
	{ value: 'OpenStreetMap.Mapnik', label: 'OpenStreetMap.Mapnik' },
	{ value: 'OpenStreetMap.BlackAndWhite', label: 'OpenStreetMap.BlackAndWhite' },
	{ value: 'OpenTopoMap', label: 'OpenTopoMap' },
	{ value: 'HikeBike.HikeBike', label: 'HikeBike.HikeBike' },
	{ value: 'Esri.WorldStreetMap', label: 'Esri.WorldStreetMap' },
	{ value: 'Esri.WorldTopoMap', label: 'Esri.WorldTopoMap' },
	{ value: 'Esri.WorldImagery', label: 'Esri.WorldImagery' },
	{ value: 'Esri.WorldTerrain', label: 'Esri.WorldTerrain' },
	{ value: 'Esri.WorldShadedRelief', label: 'Esri.WorldShadedRelief' },
	{ value: 'Esri.OceanBasemap', label: 'Esri.OceanBasemap' },
	{ value: 'Esri.NatGeoWorldMap', label: 'Esri.NatGeoWorldMap' },
	{ value: 'Esri.WorldGrayCanvas', label: 'Esri.WorldGrayCanvas' },
	{ value: 'Stamen.Toner', label: 'Stamen.Toner' },
	{ value: 'Stamen.Watercolor', label: 'Stamen.Watercolor' },
	{ value: 'Stamen.Terrain', label: 'Stamen.Terrain' },
];

const viewZoomControlOptions = [
	{ value: 'FitBoundsAction', label: 'Fit Map to Features' },
	{ value: 'ZoomLocationAction', label: 'Zoom to current Location' },
];


class GeomMap extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			featureIds: props.featureIds,
			featureCollection: new FeatureCollection(),
			isLoaded: false,
			controls: props.controls,
		};
	}

	componentDidMount() {
		const self = this;
		if ( _.isEmpty( this.state.featureIds ) ) {
			this.setState({
				isLoaded: true,
			});
		} else {
			this.state.featureCollection.fetch({
				data: {
					include: this.state.featureIds,
				},
				success: function( collection, response, options ){
					self.setState({
						featureCollection: collection,
						isLoaded: true,
					});
				},
				error: function( collection, response, options ){
					console.log( 'error', response );		// ??? debug
				}
			});
		}
	}


	onDrawCreated(layer) {
		let self = this;
		let featureModel = new FeatureModel();

		featureModel.set({
			geom_feature_geo_json: layer.toGeoJSON(),
		});

		featureModel.save().then( function( data, textStatus, jqXHR ) {
			self.state.featureCollection.add( featureModel );
			self.setState({
				featureCollection: self.state.featureCollection,
			});
		}, function( jqXHR, textStatus, errorThrown ) {
			console.log( 'textStatus errorThrown', textStatus, errorThrown );		// ??? debug
		});
	}

	onDrawRemoved( evt ){
		let self = this;

		// this.state.featureCollection.remove( _.pluck( layers.getLayers(), 'postId' ) );
		this.state.featureCollection.remove( evt.layer.postId );
		this.setState({
			featureCollection: self.state.featureCollection,
		});

		console.log( 'onDrawRemoved featureCollection', self.state.featureCollection );
	}

	onDrawDeleted(layers){
		console.log( 'onDrawDeleted', layers );		// ??? debug
	}

	onDrawEdited(evt){
		let featureModel = this.state.featureCollection.findWhere({
			id: evt.layer.postId,
		});

		featureModel.set({
			geom_feature_geo_json: evt.layer.toGeoJSON(),
		});

		featureModel.save().then( function( data, textStatus, jqXHR ) {
			// console.log( 'onDrawEdited saved featureModel', featureModel );		// ??? debug
		}, function( jqXHR, textStatus, errorThrown ) {
			console.log( 'textStatus errorThrown', textStatus, errorThrown );		// ??? debug
		});
	}


	onDrawEditedAttributes(evt){
		let self = this;

		console.log( 'onDrawEditedAttributes', evt );		// ??? debug
		let featureModel = this.state.featureCollection.findWhere({
			id: evt.layer.postId,
		});

		// if ( ! _.isUndefined( evt.attributes ) ) {
		// 	featureModel.set( evt.attributes );

		// 	featureModel.save().then( function( data, textStatus, jqXHR ) {
		// 		// console.log( 'onDrawEditedAttributes saved featureModel', featureModel );		// ??? debug
		// 	}, function( jqXHR, textStatus, errorThrown ) {
		// 		console.log( 'textStatus errorThrown', textStatus, errorThrown );		// ??? debug
		// 	});
		// }

		let includeIds = this.state.featureCollection.pluck('id');
		this.state.featureCollection.fetch({
			data: {
				include: includeIds,
			},
			success: function( collection, response, options ){
				// sort
				self.state.featureCollection.models = _(self.state.featureCollection.models).sortBy( function( model ) {
					return _.indexOf( includeIds, model.get('id') );
				});
			},
			error: function( collection, response, options ){
				console.log( 'error', response );		// ??? debug
			}
		});

	}

	onAddNewFeature() {
		console.log( 'onAddNewFeature' );		// ??? debug
	}

	onChangeFeatures( features ) {
		this.props.onChangeFeatures(features);
	}

	onChangeControlsSearchBar( val ) {
		this.state.controls.searchControl = val;
		this.setState( { controls: this.state.controls } );
		this.props.onChangeControls( this.state.controls );
	}

	onChangeControlsFullscreen( val ) {
		this.state.controls.fullscreenControl = val;
		this.setState( { controls: this.state.controls } );
		this.props.onChangeControls( this.state.controls );
	}

	onChangeControlsLayers( val ) {
		val = val.length ? val : ['OpenTopoMap'];
		this.state.controls.layersControl = val;
		this.setState( { controls: this.state.controls } );
		this.props.onChangeControls( this.state.controls );
	}

	onChangeControlsZoomView( val ) {
		this.state.controls.viewZoomControl = val;
		this.setState( { controls: this.state.controls } );
		this.props.onChangeControls( this.state.controls );
	}

	onChangeControlsLoading( val ) {
		this.state.controls.loadingControl = val;
		this.setState( { controls: this.state.controls } );
		this.props.onChangeControls( this.state.controls );
	}

	render() {
		return ([
        	<Map
        		featureCollection={this.state.featureCollection}
        		onDrawCreated={this.onDrawCreated.bind(this)}
        		onDrawDeleted={this.onDrawDeleted.bind(this)}
        		onDrawRemoved={this.onDrawRemoved.bind(this)}
        		onDrawEdited={this.onDrawEdited.bind(this)}
        		onDrawEditedAttributes={this.onDrawEditedAttributes.bind(this)}
				isLoaded={ this.state.isLoaded }
				controls={ this.state.controls }
        	/>,
			<PanelBody
				title='Map Settings'
				className={'geom-panel geom-components-settings-panel'}
				initialOpen={true}
			>
				<FeatureListPanel
					title='Features'
					className={'geom-panel geom-components-settings-panel-features'}
					initialOpen={false}
					onChangeFeatures={ this.onChangeFeatures.bind(this) }
					onAddNewFeature={ this.onAddNewFeature.bind(this) }
					featureCollection={ this.state.featureCollection }
					isLoaded={ this.state.isLoaded }
				/>

				<PanelBody
					title='Controls'
					className={'geom-panel geom-components-settings-panel-controls'}
					initialOpen={false}
				>

					<ToggleControl
						label='Search bar'
						onChange={ this.onChangeControlsSearchBar.bind(this) }
						checked={ this.state.controls.searchControl }
					>
					</ToggleControl>

					<ToggleControl
						label='Fullscreen'
						onChange={ this.onChangeControlsFullscreen.bind(this) }
						checked={ this.state.controls.fullscreenControl }
					>
					</ToggleControl>

					<ToggleControl
						label='Loading Control'
						onChange={ this.onChangeControlsLoading.bind(this) }
						checked={ this.state.controls.loadingControl }
					>
					</ToggleControl>

					<SelectControl
						multiple
						label={ __( 'Base Layers' ) }
						className={'geom-components-settings-panel-controls-layers'}
						value={ this.state.controls.layersControl }
						options={ layersControlOptions }
						onChange={ this.onChangeControlsLayers.bind(this) }
					/>

					<SelectControl
						multiple
						label={ __( 'View Zoom Controls' ) }
						className={'geom-components-settings-panel-controls-view-zoom'}
						value={ this.state.controls.viewZoomControl }
						options={ viewZoomControlOptions }
						onChange={ this.onChangeControlsZoomView.bind(this) }
					/>

				</PanelBody>
			</PanelBody>



		])
	}
}
export default GeomMap;