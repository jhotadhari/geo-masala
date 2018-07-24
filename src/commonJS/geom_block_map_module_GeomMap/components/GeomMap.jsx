/**
 * External dependencies
 */
import swal from 'sweetalert';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    BaseControl,
    PanelBody,
    SelectControl,
    ToggleControl,
    TextControl,
    ColorPalette,
} = wp.components;

/**
 * Internal dependencies
 */
import defaults from '../../geom_block_map/defaults';
// functions
import setNestedObject 			from '../../geom_block_map/functions/setNestedObject';
import featureOpenPopupToolbar 	from '../../geom_block_map/functions/featureOpenPopupToolbar';
// models
import FeatureCollection from '../../geom_block_map/collections/FeatureCollection';
// collections
import FeatureModel from '../../geom_block_map/models/FeatureModel';
// components
import Map from './Map.jsx';
import FeatureList from './FeatureList.jsx';

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

const DrawHandlers = {

	onDrawCreated(layer,map) {
		const featureModel = new FeatureModel();

		featureModel.set({
			geom_feature_geo_json: layer.toGeoJSON(),
		});

		featureModel.save().then( ( data, textStatus, jqXHR ) => {
			this.state.mapFeatureCollection.add( featureModel );
			this.setState({ featureListTriggers: { fetchFeatureCollection: true } });
			this.onChangeFeatures();
			this.setState({ mapTriggers: { openPopupToolbarFeature: featureModel } });
		}, ( jqXHR, textStatus, errorThrown ) => console.log( 'textStatus jqXHR', textStatus, jqXHR ) );
	},

	onDrawRemoved( evt ){
		let featureModel = this.state.mapFeatureCollection.findWhere({id: evt.layer.postId});
		if ( undefined !== featureModel ) {
			this.state.mapFeatureCollection.remove( featureModel );
			this.setState({ featureListTriggers: { fetchModelPostId: featureModel.get('id') } });
			this.onChangeFeatures();
		}
	},

	onDrawEdited(evt){
		let featureModel = this.state.mapFeatureCollection.findWhere({ id: evt.layer.postId, });
		featureModel.set({
			geom_feature_geo_json: evt.layer.toGeoJSON(),
		});
		featureModel.save().then(
			( data, textStatus, jqXHR ) => this.setState({ featureListTriggers: { fetchModelPostId: featureModel.get('id') } }),
			( jqXHR, textStatus, errorThrown ) => console.log( 'textStatus errorThrown', textStatus, errorThrown )
		);
	},

	onDrawEditedAttributes(evt){
		let featureModel = this.state.mapFeatureCollection.findWhere({ id: evt.layer.postId, });
		featureModel.fetch();
		this.setState({ featureListTriggers: { fetchModelPostId: featureModel.get('id') } });
	},

};

const FeaturesListItemActionHandlers = {

	onEditFeature( featureModel, key, val ) {
		let featureModelOnMap = this.state.mapFeatureCollection.findWhere({id: featureModel.get('id')});
		featureModel.set(key, val);
		featureModel.save().then( ( data, textStatus, jqXHR ) => {
			let newState = { featureListTriggers: { fetchModelPostId: featureModel.get('id') } };
			if ( ( 'status' === key ) && ( undefined !== featureModelOnMap ) )
				newState.mapTriggers = { updateMapFeatureAppearance: featureModel, };
			this.setState(newState);
		});
	},

	onFlyToFeatureOnMap( featureModel ) {
		this.setState({ mapTriggers: { flyToFeature: featureModel.get('id') } });
	},

	onAddFeatureToMap( featureModel ) {
		if ( undefined === this.state.mapFeatureCollection.findWhere({id: featureModel.get('id')}) ) {
			this.state.mapFeatureCollection.add( featureModel );
			this.onChangeFeatures();
		}
	},

	onRemoveFeaturefromMap( featureModel ) {
		let featureModelOnMap = this.state.mapFeatureCollection.findWhere({id: featureModel.get('id')});
		if ( undefined !== featureModelOnMap ) {
			this.state.mapFeatureCollection.remove( featureModelOnMap );
			this.setState({ featureListTriggers: { fetchModelPostId: featureModel.get('id') } });
			this.onChangeFeatures();
		}
	},

	onTrashDeleteFeature( action, featureModel ) {
		let featureModelTilte = featureModel.get('title').rendered || featureModel.get('title');
		featureModelTilte = 'object' === typeof( featureModelTilte ) ? featureModel.get('id') : featureModelTilte;

		let strings = {
			confirm: 'Are you sure?',
			confirm_trash: 'Do you really want to ' + action + ' "' + featureModelTilte + '"? The Feature might be used by another Post!',
			cancel: 'cancel',
			submit: action === 'trash' ? 'Trash' : 'Delete',
		};

		swal({
			title: strings.confirm,
			text: strings.confirm_trash,
			icon: 'warning',
			dangerMode: true,
			buttons: [ 			// ??? how to make buttons keyboard accessable?
				strings.cancel,
				strings.submit,
			],
		}).then( ( value ) => {
			if ( value ) {

				// move to trash
				if ( action === 'trash' ) {
					const featureModelClone = new FeatureModel( { id: featureModel.get('id') } );
					featureModel.destroy({
						success: ( destroyedModel, response ) => {
							featureModelClone.fetch().done( () => {
								this.state.mapFeatureCollection.add( featureModelClone );
								this.onChangeFeatures();
								this.setState({
									featureListTriggers: { fetchFeatureCollection: true },
									mapTriggers: { updateMapFeatureAppearance: featureModelClone },
								});
							});
						}
					});
				}

				// force delete
				if ( action === 'delete' ) {
					featureModel.destroy({
						force: true,
						success: ( model, response ) => {
							this.state.mapFeatureCollection.remove( model );
							this.onChangeFeatures();
						}
					});
				}

			}
		});

	},

};

const MapSettingsChangeHandlers = {

	onChangeMapDimensions( key, val ) {
		const mapDimensions = {...this.state.mapDimensions}
		mapDimensions[key] = val;
		this.setState( {
			mapDimensions: mapDimensions,
			mapTriggers: {
				invalidateSize: true,
			}
		} );
		this.props.onChangeMapDimensions( mapDimensions );
	},

	onChangeMapOptions( key, val ) {
		const mapOptions = {...this.state.mapOptions}
		mapOptions[key] = val;
		this.setState({
			mapOptions: mapOptions,
			mapTriggers: {
				setOptions: mapOptions,
			}
		});
		this.props.onChangeMapOptions( mapOptions );
	},

	onChangeOptions( key, val ) {
		const options = {...this.state.options}
		setNestedObject( options, key, val );
		this.setState( { options: options } );
		this.props.onChangeOptions( options );
	},

	onChangeControls( key, val ){
		const controls = {...this.state.controls}
		controls[key] = val;
		this.setState( { controls: controls } );
		this.props.onChangeControls( controls );
	},

};


class GeomMap extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			featureIds: props.featureIds,
			mapFeatureCollection: new FeatureCollection(),
			isLoaded: false,
			controls: props.controls,
			mapOptions: props.mapOptions,
			mapDimensions: props.mapDimensions,
			options: props.options,
		};
	}

	componentDidMount() {
		if ( _.isEmpty( this.state.featureIds ) ) {
			this.setState({
				isLoaded: true,
			});
		} else {
			this.fetchMapFeatureCollection();
		}
	}

	fetchMapFeatureCollection(){
		this.state.mapFeatureCollection.fetch({
			data: {
				include: this.state.featureIds,
				status: ['publish', 'draft' ],
				per_page: 100,
			},
			success: ( collection, response, options ) => this.setState({
				mapFeatureCollection: collection,
				isLoaded: true,
			}),
			error: ( collection, response, options ) => console.log( 'error', response ),
		});
	}

	onChangeFeatures() {
		// call block setAttributes
		this.props.onChangeFeatures( this.state.mapFeatureCollection );
	}

	render() {
		return ([

        	<Map
        		featureCollection={this.state.mapFeatureCollection}
        		onDrawCreated={this.onDrawCreated.bind(this)}
        		onDrawRemoved={this.onDrawRemoved.bind(this)}
        		onDrawEdited={this.onDrawEdited.bind(this)}
        		onDrawEditedAttributes={this.onDrawEditedAttributes.bind(this)}
				isLoaded={ this.state.isLoaded }
				mapOptions={ this.state.mapOptions }
				mapDimensions={ this.state.mapDimensions }
				controls={ this.state.controls }
				mapTriggers={ this.state.mapTriggers }
        	/>,

			<PanelBody
				title={'Map Features'}
				className={'geom-panel geom-features-panel'}
				initialOpen={false}
			>
				<FeatureList
					mapFeatureCollection={ this.state.mapFeatureCollection }
					placeholderColor={ this.state.options.placeholder.color }
					onEditFeature={ this.onEditFeature.bind(this) }
					onFlyToFeatureOnMap={ this.onFlyToFeatureOnMap.bind(this) }
					onAddFeatureToMap={ this.onAddFeatureToMap.bind(this) }
					onRemoveFeaturefromMap={ this.onRemoveFeaturefromMap.bind(this) }
					onTrashDeleteFeature={ this.onTrashDeleteFeature.bind(this) }
					featureListTriggers={ this.state.featureListTriggers }
				/>
			</PanelBody>,

			<PanelBody
				title='Map Settings'
				className={'geom-panel geom-settings-panel'}
				initialOpen={false}
			>

				<div className='geom-flex-row' >
					<TextControl
						label='Width [%]'
						// help='Width of the Map in percent'
						type='number'
						value={ this.state.mapDimensions.width }
						onChange={ (val) => this.onChangeMapDimensions( 'width', val ) }
					/>

					<TextControl
						label='Height [px]'
						// help='Height of the Map in pixels'
						type='number'
						value={ this.state.mapDimensions.height }
						onChange={ (val) => this.onChangeMapDimensions( 'height', val ) }
					/>
				</div>

				<BaseControl
					label="Loading Placeholder Color"
					className={'geom-color-palette'}
				>
					<span className='geom-color-palette-preview' style={{ background: this.state.options.placeholder.color || defaults.options.placeholder.color }}></span>
					<ColorPalette
						value={ this.state.options.placeholder.color }
						onChange={ (val) => this.onChangeOptions( 'placeholder.color', val ) }
					/>
				</BaseControl>

				<ToggleControl
					label='Scroll Wheel Zoom'
					// help='Whether the map can be zoomed by using the mouse wheel'
					onChange={ (val) => this.onChangeMapOptions( 'scrollWheelZoom', val ) }
					checked={ this.state.mapOptions.scrollWheelZoom }
				>
				</ToggleControl>

				<ToggleControl
					label='Touch Zoom'
					// help='Whether the map can be zoomed by touch-dragging with two fingers'
					onChange={ (val) => this.onChangeMapOptions( 'touchZoom', val ) }
					checked={ this.state.mapOptions.touchZoom }
				>
				</ToggleControl>

				<PanelBody
					title='Controls'
					className={'geom-panel geom-settings-panel-controls'}
					initialOpen={false}
				>

					<ToggleControl
						label='Search bar'
						onChange={ (val) => this.onChangeControls( 'searchControl', val ) }
						checked={ this.state.controls.searchControl }
					>
					</ToggleControl>

					<ToggleControl
						label='Fullscreen'
						onChange={ (val) => this.onChangeControls( 'fullscreenControl', val ) }
						checked={ this.state.controls.fullscreenControl }
					>
					</ToggleControl>

					<ToggleControl
						label='Loading Control'
						onChange={ (val) => this.onChangeControls( 'loadingControl', val ) }
						checked={ this.state.controls.loadingControl }
					>
					</ToggleControl>

					<SelectControl
						multiple
						label={ __( 'Base Layers' ) }
						className={'geom-settings-panel-controls-layers'}
						value={ this.state.controls.layersControl }
						options={ layersControlOptions }
						onChange={ (val) => this.onChangeControls( 'layersControl', (val.length ? val : ['OpenTopoMap']) ) }
					/>

					<SelectControl
						multiple
						label={ __( 'View Zoom Controls' ) }
						className={'geom-settings-panel-controls-view-zoom'}
						value={ this.state.controls.viewZoomControl }
						options={ viewZoomControlOptions }
						onChange={ (val) => this.onChangeControls( 'viewZoomControl', val ) }
					/>

				</PanelBody>
			</PanelBody>

		])
	}
}

_.defaults( GeomMap.prototype, DrawHandlers, FeaturesListItemActionHandlers, MapSettingsChangeHandlers );

export default GeomMap;