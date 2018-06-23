import swal from 'sweetalert';

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
import GeomToolbar from './GeomToolbar.jsx';

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
	{ value: 'FlyToAction', label: 'Fit Map to Features' },
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
			this.fetchFeatureCollection();
		}
	}

	fetchFeatureCollection(){
		const self = this;
		this.state.featureCollection.fetch({
			data: {
				include: this.state.featureIds,
				per_page: 100,
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

	onDrawCreated(layer) {
		let self = this;
		let featureModel = new FeatureModel();

		featureModel.set({
			geom_feature_geo_json: layer.toGeoJSON(),
		});

		featureModel.save().then( function( data, textStatus, jqXHR ) {
			self.state.featureCollection.add( featureModel );
			// featurePanelTriggers fetchPool
			self.setState({
				featurePanelTriggers: {
					fetchPool: featureModel.get('id'),
				}
			});
			self.onChangeFeatures();
		}, function( jqXHR, textStatus, errorThrown ) {
			console.log( 'textStatus jqXHR', textStatus, jqXHR );		// ??? debug
		});
	}

	onDrawRemoved( evt ){
		let self = this;
		this.state.featureCollection.remove( evt.layer.postId );
		this.onChangeFeatures();
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
		let featureModel = this.state.featureCollection.findWhere({
			id: evt.layer.postId,
		});
		// fetch feature model ... will update features list
		featureModel.fetch();
		// trigger
		this.setState({
			featurePanelTriggers: {
				fetchAvailableItem: featureModel.get('id'),
			}
		});
	}

	onFlyToFeature( featureModel ) {
		this.setState({
			mapTriggers: {
				flyToFeature: featureModel.get('id'),
			}
		});
	}

	onAddNewFeature( featureModel ) {
		if ( undefined === this.state.featureCollection.findWhere({id: featureModel.get('id')}) ) {
			this.state.featureCollection.add( featureModel );
			this.onChangeFeatures();
		}
	}

	onRemoveFeature( featureModel ) {
		let modelInCollection = this.state.featureCollection.findWhere({id: featureModel.get('id')});
		if ( undefined !== modelInCollection ) {
			this.state.featureCollection.remove( modelInCollection );
			this.onChangeFeatures();
		}
	}

	onTrashFeature( featureModel ) {
		let self = this;

		let featureModelTilte = featureModel.get('title').rendered || featureModel.get('title');
		featureModelTilte = 'object' === typeof( featureModelTilte ) ? featureModel.get('id') : featureModelTilte;

		let strings = {
			confirm: 'Are you sure?',
			confirm_trash: 'Do you really want to delete "' + featureModelTilte + '"? The Feature might be used by another Post!',
			cancel: 'cancel',
			trash: 'trash',
		};

		swal({
			title: strings.confirm,
			text: strings.confirm_trash,
			icon: 'warning',
			dangerMode: true,
			buttons: [ 			// ??? how to make buttons keyboard accessable?
				strings.cancel,
				strings.trash,
			],
		}).then( ( value ) => {
			if ( value ) {
				// move to trash
				featureModel.destroy({
					success: function( model, response) {

						// remove from collection and call this.onChangeFeatures
						self.onRemoveFeature( model );

						// remove from FeatureListPanel
						self.setState({
							featurePanelTriggers: {
								trash: model.get('id'),
							}
						});

						// remove from map
						self.setState({
							mapTriggers: {
								removeFeature: model.get('id'),
							}
						});

						console.log( 'moved to trash: ' + model.get('id').toString() );
					}
				});
			}
		});

	}

	onChangeFeatures() {
		this.props.onChangeFeatures( this.state.featureCollection );
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

			<GeomToolbar/>,

        	<Map
        		featureCollection={this.state.featureCollection}
        		onDrawCreated={this.onDrawCreated.bind(this)}
        		onDrawRemoved={this.onDrawRemoved.bind(this)}
        		onDrawEdited={this.onDrawEdited.bind(this)}
        		onDrawEditedAttributes={this.onDrawEditedAttributes.bind(this)}
				isLoaded={ this.state.isLoaded }
				controls={ this.state.controls }
				mapTriggers={ this.state.mapTriggers }
        	/>,

			<FeatureListPanel
				title='Features'
				className={'geom-panel geom-components-features-panel'}
				initialOpen={false}
				onFlyToFeature={ this.onFlyToFeature.bind(this) }
				onAddNewFeature={ this.onAddNewFeature.bind(this) }
				onRemoveFeature={ this.onRemoveFeature.bind(this) }
				onTrashFeature={ this.onTrashFeature.bind(this) }
				featureCollection={ this.state.featureCollection }
				isLoaded={ this.state.isLoaded }
				featurePanelTriggers={ this.state.featurePanelTriggers }
			/>,

			<PanelBody
				title='Map Settings'
				className={'geom-panel geom-components-settings-panel'}
				initialOpen={false}
			>

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