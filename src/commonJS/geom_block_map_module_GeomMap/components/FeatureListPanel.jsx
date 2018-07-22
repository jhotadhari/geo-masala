
import { List } from 'react-virtualized';

const {
    BaseControl,
    PanelBody,
    RadioControl,
} = wp.components;

import getNestedObject from '../../geom_block_map/functions/getNestedObject';

import FeatureCollection from '../../geom_block_map/collections/FeatureCollection';

import FeatureListHeader from './FeatureListHeader.jsx';
import FeatureListRow from './FeatureListRow.jsx';


class FeatureListPanel extends React.Component {

	constructor(props) {
		super(props);

		this.props = props;

		this.state = {
			error: null,
			availableCollection: new FeatureCollection(),
			availableCollectionLoaded: false,
			displayOptions: {
				user: 'allUsersFeatures',
				// post: 'allPostsFeatures',
				// user: geomData.user.id.toString(),
				post: geomData.post.id.toString(),
			}
		};

		this.props.featureCollection.on( 'sync', (collection, options) => {
			this.setState({});
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
		this.state.availableCollection.fetch({
			data: this.getAvailableCollectionQueryArgs(),
			success: ( collection, response, options ) => {
				this.setState({
					availableCollection: collection,
					availableCollectionLoaded: true,
				});
			},
			error: ( collection, response, options ) => {
				this.setState({
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
			const model = featureCollection.at(index);

			return (
				<FeatureListRow
					style={{...style, maxWidth: '100%' }}
					model={model}
					onEditShare={ self.onEditShare.bind(self) }
					onFlyToFeature={ self.onFlyToFeature.bind(self) }
					onRemoveFeature={ self.onRemoveFeature.bind(self) }
				/>
			)
		}

		function rowRenderer2({ key, index, isScrolling, isVisible, style }){
			const model = availableCollection.at(index);
			const featureCollectionModel = featureCollection.findWhere({ id: model.get('id') });

			return (
				<FeatureListRow
					style={{...style, maxWidth: '100%' }}
					model={model}
					className={ featureCollectionModel ? 'highlight' : ''}
					onEditShare={ self.onEditShare.bind(self) }
					onFlyToFeature={ featureCollectionModel ? self.onFlyToFeature.bind(self) : false }
					onAddNewFeature={ featureCollectionModel ? false : self.onAddNewFeature.bind(self) }
					onRemoveFeature={ featureCollectionModel ? self.onRemoveFeature.bind(self) : false }
					onTrashFeature={ self.onTrashFeature.bind(self) }
				/>
			)
		}

		function noRowsRenderer1(){
			return ([
				<p>No Features</p>,
				<p>Draw some Features, or select from the Feature-Pool</p>,
			])
		}

		function noRowsRenderer2(){
			return ([
				<p>No Features found</p>,
				<p>Try to adjust filters</p>,
			])
		}

		return ([

			<PanelBody
				title={title}
				className={className}
				initialOpen={false}
			>

				 {
				 	 //featureCollection.length && <p>No Features</p>
				 }

				{ isLoaded ? [

					<FeatureListHeader
						style={{maxWidth: '100%' }}
					/>,

					<List
						height={200}
						width={300}
						style={{width: 'auto',maxWidth: '100%', overflowY: 'scroll' }}
						containerStyle={{width: 'auto',maxWidth: '100%'}}
						autoContainerWidth={false}
						rowCount={featureCollection.length}
						rowHeight={45}
						noRowsRenderer={noRowsRenderer1}
						rowRenderer={rowRenderer1}
						className="geom-components-features-list"
					/>
					] : <span>... loading</span>
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

						<div className='geom-flex-row' >
							<RadioControl
								label="Author Filter"
								selected={ displayOptions.user }
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
								help="Limit Search results to Features private to this Post"
								options={[
									{ label: 'Private Features for this Post', value: currentPostId },
									{ label: 'Features for all Posts', value: 'allPostsFeatures' },
								]}
								onChange={ this.onChangePoolDisplaySharePost.bind(this) }
							/>
						</div>

					</PanelBody>

					<div className="geom-clearfix"></div>

					{ availableCollectionLoaded ? [

						<FeatureListHeader
							style={{maxWidth: '100%' }}
						/>,

						<List
							height={200}
							width={300}
							style={{width: 'auto',maxWidth: '100%', overflowY: 'scroll' }}
							containerStyle={{width: 'auto',maxWidth: '100%'}}
							rowCount={availableCollection.length}
							rowHeight={45}
							noRowsRenderer={noRowsRenderer2}
							rowRenderer={rowRenderer2}
							className="geom-components-features-list"
						/>
						]: <span>... loading</span>
					}
				</PanelBody>
			</PanelBody>,

		]);
	}

}

export default FeatureListPanel;