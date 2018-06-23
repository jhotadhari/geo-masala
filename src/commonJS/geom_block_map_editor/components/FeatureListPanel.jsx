
import { List } from 'react-virtualized';

const {
    PanelBody,
    RadioControl,
} = wp.components;

import getNestedObject from '../../geom_block_map/functions/getNestedObject';

import FeatureCollection from '../../geom_block_map/collections/FeatureCollection';

import FeatureListRow from './FeatureListRow.jsx';


class FeatureListPanel extends React.Component {

	constructor(props) {
		super(props);

		let self = this;

		this.props = props;

		this.state = {
			error: null,
			availableCollection: new FeatureCollection(),
			availableCollectionLoaded: false,
			displayOptions: {
				user: 'allUsersFeatures',
				post: 'allPostsFeatures',
				// user: geomData.user.id.toString(),
				// post: geomData.post.id.toString(),
			}
		};

		this.props.featureCollection.on( 'sync', function(collection, options){
			self.setState({});
		} );
	}

	componentDidMount(){
		if ( ! this.state.availableCollectionLoaded )
			this.fetchAvailableCollection();
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if ( ! this.state.availableCollectionLoaded )
			this.fetchAvailableCollection();

		if ( this.state.displayOptions !== prevState.displayOptions )
			this.fetchAvailableCollection();

		// run triggered actions
		let fetchPool = getNestedObject( this.props, 'featurePanelTriggers.fetchPool' );
		if ( fetchPool !== getNestedObject( prevProps, 'featurePanelTriggers.fetchPool' ) ) {
			this.fetchAvailableCollection();
			delete this.props.featurePanelTriggers.fetchPool;
		}

		if ( this.state.availableCollectionLoaded ){
			let fetchAvailableItemPostId = getNestedObject( this.props, 'featurePanelTriggers.fetchAvailableItem' );
			if ( fetchAvailableItemPostId !== getNestedObject( prevProps, 'featurePanelTriggers.fetchAvailableItem' ) ) {
				let model = this.state.availableCollection.findWhere({ id: fetchAvailableItemPostId });
				if ( undefined !== model ) model.fetch();
				delete this.props.featurePanelTriggers.fetchAvailableItemPostId;
			}
		}

		let trashPostId = getNestedObject( this.props, 'featurePanelTriggers.trash' );
		if ( trashPostId !== getNestedObject( prevProps, 'featurePanelTriggers.trash' ) ) {
			this.fetchAvailableCollection();
			this.props.featureCollection.remove( trashPostId );
			delete this.props.featurePanelTriggers.remove;
		}
	}

	getAvailableCollectionQueryArgs() {
		let queryArgs = {
			per_page: 100,
			geom_custom: {
				meta_query: {
					relation: 'AND',
				}
			}
		};

		let displayOptions = this.state.displayOptions;

		let currentUserId = geomData.user.id.toString();
		let currentPostId = geomData.post.id.toString();

		let metaQueryIndex = _.allKeys(queryArgs.geom_custom.meta_query).length;


		switch( displayOptions.user ){
			case currentUserId:
				queryArgs.geom_custom.author = currentUserId;
				break;
			case 'otherUsersFeatures':
				queryArgs.geom_custom.author = '-'+currentUserId;
				break;
			case 'allUsersFeatures':
				// ... nothing to do
				break;
			default:
				// ... nothing to do
		}

		// example of serialized geom_feature_share
		// a:2:{s:4:"user";s:1:"1";s:4:"post";s:4:"1826";}
		// a:2:{s:4:"user";s:1:"1";s:4:"post";s:8:"allPosts";}
		let value;
		switch( displayOptions.post ){
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
			default:
				// ... nothing to do

		}

		return queryArgs;
	}

	fetchAvailableCollection(){
		let self = this;

		this.state.availableCollection.fetch({
			data: this.getAvailableCollectionQueryArgs(),
			success: function( collection, response, options ){
				self.setState({
					availableCollection: collection,
					availableCollectionLoaded: true,
				});
			},
			error: function( collection, response, options ){
				self.setState({
					error: response,
				});
			}
		});

	}

	onChangePoolDisplayShareUser( val ){
		let displayOptions = Object.assign({}, this.state.displayOptions);
		displayOptions.user = val.toString();
		this.setState({
			displayOptions: displayOptions,
		});
	}

	onChangePoolDisplaySharePost( val ){
		let displayOptions = Object.assign({}, this.state.displayOptions);
		displayOptions.post = val.toString();
		this.setState({
			displayOptions: displayOptions,
		});
	}

	onEditShare( model ){
		// this.setState({});
		this.fetchAvailableCollection();
	}

	onFlyToFeature( model ){
		this.props.onFlyToFeature( model );
	}

	onAddNewFeature( model ){
		this.props.onAddNewFeature( model );
	}

	onRemoveFeature( model ){
		this.props.onRemoveFeature( model );
	}

	onTrashFeature( model ){
		this.props.onTrashFeature( model );
	}

	render() {
		const self = this;
		const { error, availableCollection, availableCollectionLoaded, displayOptions } = this.state;
		const { title, className, featureCollection, isLoaded } = this.props;
		const currentUserId = geomData.user.id.toString();
		const currentPostId = geomData.post.id.toString();


		function rowRenderer1({ key, index, isScrolling, isVisible, style }){
			let model = featureCollection.at(index);
			style.maxWidth = '100%';
			return (
				<FeatureListRow
					style={style}
					model={model}
					onEditShare={ self.onEditShare.bind(self) }
					onFlyToFeature={ self.onFlyToFeature.bind(self) }
					onRemoveFeature={ self.onRemoveFeature.bind(self) }
				/>
			)
		}

		function rowRenderer2({ key, index, isScrolling, isVisible, style }){
			let model = availableCollection.at(index);
			style.maxWidth = '100%';

			return (
				<FeatureListRow
					style={style}
					model={model}
					className={featureCollection.findWhere({ id: model.get('id') }) ? 'highlight' : ''}
					onEditShare={ self.onEditShare.bind(self) }
					onAddNewFeature={ self.onAddNewFeature.bind(self) }
					onTrashFeature={ self.onTrashFeature.bind(self) }
				/>
			)
		}

		function noRowsRenderer1(){
			return ([
				<p>Draw some Features</p>,
				<p>Or select some from the Feature-Pool</p>,
			])
		}

		return ([

			<PanelBody
				title={title}
				className={className}
				initialOpen={false}
			>

				{ featureCollection.length ? <p>Features on Map</p> : <p>No Features on Map until now.</p> }

				{ isLoaded ?
					<List
						height={200}
						width={300}
						style={{width: 'auto',maxWidth: '100%'}}
						containerStyle={{width: 'auto',maxWidth: '100%'}}
						autoContainerWidth={false}
						rowCount={featureCollection.length}
						rowHeight={45}
						noRowsRenderer={noRowsRenderer1}
						rowRenderer={rowRenderer1}
						className="geom-components-features-list"
					/>
					: <span>... loading</span>
				}
				<PanelBody
					title='Feature-Pool'
					className={className}
					initialOpen={false}
				>
					<PanelBody
						title='Filter Feature-Pool Results'
						className={className}
						initialOpen={false}
					>

						<RadioControl
							label="Author Filter"
							selected={ displayOptions.user }
							className="geom-left geom-half-width"
							help="Who created the Feature?"
							options={[
								{ label: 'My Features', value: currentUserId },
								{ label: 'Other Users Features', value: 'otherUsersFeatures' },
								{ label: 'All Features', value: 'allUsersFeatures' },
							]}
							onChange={ this.onChangePoolDisplayShareUser.bind(this) }
						/>

						<RadioControl
							label="Posts Filter"
							selected={ displayOptions.post }
							className="geom-left geom-half-width"
							help="Limit Search results to Features private to this Post, or display them all"
							options={[
								{ label: 'Private Features for this Post', value: currentPostId },
								{ label: 'Features for all Posts', value: 'allPostsFeatures' },
							]}
							onChange={ this.onChangePoolDisplaySharePost.bind(this) }
						/>

					</PanelBody>

					<div className="geom-clearfix"></div>

					{ availableCollectionLoaded ?
						<List
							height={200}
							width={300}
							style={{width: 'auto',maxWidth: '100%'}}
							containerStyle={{width: 'auto',maxWidth: '100%'}}
							rowCount={availableCollection.length}
							rowHeight={45}
							rowRenderer={rowRenderer2}
							className="geom-components-features-list"
						/>
						: <span>... loading</span>
					}
				</PanelBody>
			</PanelBody>,

		]);
	}

}

export default FeatureListPanel;