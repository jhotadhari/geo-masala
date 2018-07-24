/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { List } from 'react-virtualized';
import MultiSelect from '@khanacademy/react-multi-select';

/**
 * WordPress dependencies
 */
const {
    BaseControl,
    PanelBody,
    RadioControl,
    ToggleControl,
} = wp.components;

/**
 * Internal dependencies
 */
import statuses from '../../geom_block_map/statuses';
// functions
import getNestedObject from '../../geom_block_map/functions/getNestedObject';
import setNestedObject from '../../geom_block_map/functions/setNestedObject';
// collections
import FeatureCollection from '../../geom_block_map/collections/FeatureCollection';
// components
import MapPlaceholder from '../../geom_block_map_editor/components/MapPlaceholder.jsx';
import FeatureListHeader from './FeatureListHeader.jsx';
import FeatureListRow from './FeatureListRow.jsx';
import FeatureListError from './FeatureListError.jsx';

class FeatureList extends React.Component {

	constructor(props) {
		super(props);

		this.props = props;

		this.state = {
			error: null,
			featureCollection: new FeatureCollection(),
			featureCollectionLoaded: false,
			displayOptions: {
				user: [ 'otherUsersFeatures', geomData.user.id.toString() ],
				post: [ 'allPostsFeatures', geomData.post.id.toString() ],
				currentMapFeaturesOnly: true,
				status: _.pluck( statuses, 'value' ),
			}
		};

		this.state.featureCollection.on( 'sync update reset sort change', (collection, options) => this.setState({}) );
	}

	componentDidMount(){
		if ( ! this.state.featureCollectionLoaded )
			this.fetchFeatureCollection();
	}

	componentDidUpdate(prevProps, prevState, snapshot){

		const { featureCollectionLoaded, displayOptions, featureCollection } = this.state;
		const { featureListTriggers } = this.props;
		let fetch = false;

		if ( ! featureCollectionLoaded )
			fetch = true;

		if ( displayOptions !== prevState.displayOptions )
			fetch = true;

		// run triggered actions
		if ( undefined !== featureListTriggers && !_.isEmpty(featureListTriggers) ) {

			// fetchFeatureCollection
			let fetchFeatureCollection = featureListTriggers.fetchFeatureCollection;
			if ( fetchFeatureCollection !== getNestedObject( prevProps, 'featureListTriggers.fetchFeatureCollection' ) ) {
				fetch = true;
				delete this.props.featureListTriggers.fetchFeatureCollection;
			}

			// fetchModelPostId
			if ( featureCollectionLoaded ){
				let fetchModelPostId = getNestedObject( this.props, 'featureListTriggers.fetchModelPostId' );
				if ( fetchModelPostId !== getNestedObject( prevProps, 'featureListTriggers.fetchModelPostId' ) ) {
					// get new a collection for features that should be in list (fields id only)
					const featureIdsCollection = new FeatureCollection();

					const onSuccess_fetchFeatureIdsCollection = ( collection ) => {
						// check if model is still in list
						if ( undefined === collection.get( fetchModelPostId ) ) {
							// model should not be in list anymore -> remove model from list
							featureCollection.remove( fetchModelPostId );
							this.setState({});
							return;
						} else {
							// model should still be in list -> fetch the model
							const featureCollectionModel = featureCollection.findWhere({ id: fetchModelPostId });
							if ( undefined !== featureCollectionModel ) {
								featureCollectionModel.fetch({
									success: ( model, response, options ) => {
										this.setState({});
									}
								});
							}

						}
					};

					if ( displayOptions.currentMapFeaturesOnly && this.props.mapFeatureCollection.isEmpty() ) {
						onSuccess_fetchFeatureIdsCollection(featureIdsCollection);
					} else {
						featureIdsCollection.fetch({
							data: _.extend( this.getFeatureCollectionQueryArgs(), {return_only_ids: true} ),
							success: onSuccess_fetchFeatureIdsCollection
						});
					};

					delete this.props.featureListTriggers.fetchModelPostId;
				}
			}

		}

		// may be fetch
		if (fetch) this.fetchFeatureCollection();
	}

	getFeatureCollectionQueryArgs() {
		const queryArgs = {
			per_page: 100,
			status: [],
			geom_custom: {
				meta_query: {
					relation: 'OR',
				}
			}
		};

		const { displayOptions } = this.state;
		const { mapFeatureCollection } = this.props;

		if ( displayOptions.currentMapFeaturesOnly )
			queryArgs.include = mapFeatureCollection.pluck('id');

		const currentUserId = geomData.user.id.toString();
		const currentPostId = geomData.post.id.toString();

		[...displayOptions.status].map( (status) => queryArgs.status.push( status ) );

		if ( displayOptions.user.length === 1 ) {
			switch( displayOptions.user[0] ){
				case currentUserId:
					queryArgs.geom_custom.author = currentUserId;
					break;
				case 'otherUsersFeatures':
					queryArgs.geom_custom.author = '-'+currentUserId;
					break;
			}
		}

		if ( displayOptions.post.length > 0 ) {
			// example of serialized geom_feature_share
			// a:2:{s:4:"user";s:1:"1";s:4:"post";s:4:"1826";}
			// a:2:{s:4:"user";s:1:"1";s:4:"post";s:8:"allPosts";}
			let metaQueryIndex = 0;
			let value;
			[...displayOptions.post].map( (option) => {
				switch( option ){
					case 'allPostsFeatures':
						value = 'allPosts';
						queryArgs.geom_custom.meta_query = _.extendOwn( queryArgs.geom_custom.meta_query, {
							[ metaQueryIndex.toString() ]:{
								key: 'geom_feature_share',
								value: '"post";s:' + value.length + ':"' + value + '"',
								compare: 'LIKE',
							}
						} );
						break;
					case currentPostId:
						value = currentPostId;
						queryArgs.geom_custom.meta_query = _.extendOwn( queryArgs.geom_custom.meta_query, {
							[ metaQueryIndex.toString() ]:{
								key: 'geom_feature_share',
								value: '"post";s:' + value.length + ':"' + value + '"',
								compare: 'LIKE',
							}
						} );
						break;
				}
				metaQueryIndex =+ 1;
			});
		}

		return queryArgs;
	}

	fetchFeatureCollection(){

		// display loading placeholder
		if ( this.state.featureCollectionLoaded ) this.setState({ featureCollectionLoaded: false });

		const { displayOptions } = this.state;

		if ( displayOptions.currentMapFeaturesOnly && this.props.mapFeatureCollection.isEmpty() ) {
			// set featureCollection empty
			this.setState({
				featureCollection: new FeatureCollection(),
				featureCollectionLoaded: true,
				error: null,
			})
			return;
		} else {
			// fetch featureCollection
			this.state.featureCollection.fetch({
				data: this.getFeatureCollectionQueryArgs(),
				success: ( collection, response, options ) => this.setState({
					featureCollection: collection,
					featureCollectionLoaded: true,
					error: null,
				}),
				error: ( collection, response, options ) => this.setState({
					featureCollectionLoaded: true,
					error: response,
				})
			});
		}
	}

	onChangeDisplayOptions( key, val, options ) {
		_.defaults(options, {disableEmpty: false});
		const displayOptions = {...this.state.displayOptions}
		if ( ( val.length === 0 ) && ( options.disableEmpty === true ) ) return;
		setNestedObject( displayOptions, key, val );
		this.setState({ displayOptions: displayOptions });
	}

	render() {
		const { error, featureCollection, featureCollectionLoaded, displayOptions } = this.state;
		const { title, className, height, mapFeatureCollection, placeholderColor } = this.props;
		const currentUserId = geomData.user.id.toString();
		const currentPostId = geomData.post.id.toString();

		const rowRenderer = ({ key, index, isScrolling, isVisible, style, parent }) => {
			const model = featureCollection.at(index);
			const mapFeatureCollectionModel = mapFeatureCollection.findWhere({ id: model.get('id') });

			return (
				<FeatureListRow
					style={{...style, maxWidth: '100%' }}
					model={model}
					className={ mapFeatureCollectionModel ? 'highlight' : ''}
					onEditFeature={ (model, key, val) => this.props.onEditFeature(model, key, val) }
					onFlyToFeatureOnMap={ mapFeatureCollectionModel ? (model) => this.props.onFlyToFeatureOnMap( model ) : false }
					onRemoveFeaturefromMap={ mapFeatureCollectionModel ? (model) => this.props.onRemoveFeaturefromMap( model ) : false }
					onAddFeatureToMap={ ! mapFeatureCollectionModel ? (model) => this.props.onAddFeatureToMap( model ) : false }
					onTrashDeleteFeature={ (action, model) => this.props.onTrashDeleteFeature( action, model ) }
				/>
			)
		};

		const noRowsRenderer = () => {
			return ([
				<p>No Features found</p>,
				<p>Try to adjust the Filters</p>,
			])
		};

		return ([

			<PanelBody
				title='Filter Results'
				className={'geom-panel'}
				initialOpen={false}
			>

				<ToggleControl
					label='Only Features currently on Map'
					checked={ displayOptions.currentMapFeaturesOnly }
					onChange={ (val) => this.onChangeDisplayOptions( 'currentMapFeaturesOnly', val ) }
				>
				</ToggleControl>

				<BaseControl
					label="Status"
				>
					<MultiSelect
						options={ statuses }
						selected={displayOptions.status}
						valueRenderer={ (selected, options) => selected.length === options.length ? 'Show all Features' : null }
						onSelectedChanged={ (val) => this.onChangeDisplayOptions( 'status', val, {disableEmpty: true} ) }
						disableSearch={true}
					/>
				</BaseControl>


				<BaseControl
					label="Author"
					// help="Who created the Feature?"
				>
					<MultiSelect
						options={[
							{ label: 'My Features', value: currentUserId },
							{ label: 'Other Users Features', value: 'otherUsersFeatures' },
						]}
						selected={displayOptions.user}
						valueRenderer={ (selected, options) => selected.length === options.length ? 'Show all Features' : null }
						onSelectedChanged={ (val) => this.onChangeDisplayOptions( 'user', val, {disableEmpty: true} ) }
						disableSearch={true}
					/>
				</BaseControl>


				<BaseControl
					label="Feature Sharing, Availability Scope"
					// help="Limit Search results to Features private to this Post"
				>
					<MultiSelect
						options={[
							{ label: 'Private Features for this Post', value: currentPostId },
							{ label: 'Features for all Posts', value: 'allPostsFeatures' },
						]}
						selected={displayOptions.post}
						valueRenderer={ (selected, options) => selected.length === options.length ? 'Show all Features' : null }
						onSelectedChanged={ (val) => this.onChangeDisplayOptions( 'post', val, {disableEmpty: true} ) }
						disableSearch={true}
					/>
				</BaseControl>


			</PanelBody>,

			<div className="geom-clearfix"></div>,

				null === error
					? [ ( featureCollectionLoaded

						? [
							<FeatureListHeader style={{maxWidth: '100%' }} />,

							<List
								height={height}
								width={300}
								style={{width: 'auto',maxWidth: '100%', overflowY: 'scroll' }}
								containerStyle={{width: 'auto',maxWidth: '100%'}}
								rowCount={featureCollection.length}
								rowHeight={45}
								noRowsRenderer={noRowsRenderer}
								rowRenderer={rowRenderer}
								className="geom-features-list"
							/> ]

						: [
							<FeatureListHeader style={{maxWidth: '100%' }} />,

							<MapPlaceholder color={placeholderColor} dimensions={{height:height}} />

						] ) ]

					: FeatureListError

		]);
	}

}

FeatureList.propTypes = {
	height: PropTypes.number,
	color: PropTypes.string,
	placeholderColor: PropTypes.number,
	onFlyToFeatureOnMap: PropTypes.func,
	onAddFeatureToMap: PropTypes.func,
	onRemoveFeaturefromMap: PropTypes.func,
	onTrashDeleteFeature: PropTypes.func,
}

FeatureList.defaultProps = {
	height: 200,
}

export default FeatureList;