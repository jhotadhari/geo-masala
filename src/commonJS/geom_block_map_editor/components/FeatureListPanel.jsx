import FeatureList from './FeatureList.jsx';
import CustomPanelBody from './CustomPanelBody.jsx';

// const {
//     PanelBody,
// } = wp.components;

import FeatureCollection from '../../geom_block_map/collections/FeatureCollection';

const changedKeys = (o1, o2 ) => {
	const keys = _.union( _.keys(o1), _.keys(o2) );
	return _.filter( keys, function( key ) {
		return o1[key] !== o2[key];
	})
};

class FeatureListPanel extends React.Component {

	constructor(props) {
		super(props);

		let self = this;

		this.props = props;

		// let availableFeatureCollection = new FeatureCollection();

		this.state = {
			error: null,
			isLoadedItems: false,
			availableFeatureCollection: new FeatureCollection(),
		};

		// this.props.featureCollection.listenTo( this.props.featureCollection, 'update', function(collection, options){
		this.props.featureCollection.on( 'update', function(collection, options){
			self.fetchItems();
		} );
		// this.props.featureCollection.listenTo( this.props.featureCollection, 'sync', function(collection, options){
		this.props.featureCollection.on( 'sync', function(collection, options){
			self.setState({});
		} );

		// this.state.availableFeatureCollection.listenTo( this.state.availableFeatureCollection, 'update', function(collection, options){
		// 	console.log( 'availableFeatureCollection options', collection, options );		// ??? debug
		// } );
	}

	componentDidMount() {
		this.fetchItems();
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if ( ! this.state.isLoadedItems )
			this.fetchItems();
	}

	fetchItems(){
		let self = this;
		if ( this.props.isLoaded ) {

			this.state.availableFeatureCollection.fetch({
				data: {
					exclude:_.pluck( this.props.featureCollection.models, 'id' )
				},
				success: function( collection, response, options ){
					self.setState({
						// availableFeatureCollection: collection,
						isLoadedItems: true,
					});
				},
				error: function( collection, response, options ){
					self.setState({
						error: response,
					});
				}
			});
		}
	}

	onChangeFeatures( features ) {
        this.props.onChangeFeatures(features);
	}

	onAddNewFeature(e){
		if (e) e.preventDefault();
		this.props.onAddNewFeature();
	}

	render() {
		const { error, isLoadedItems, availableFeatureCollection } = this.state;
		const { title, className, isLoaded, featureCollection } = this.props;

		if (error) {
			return (
				<CustomPanelBody
					title={title}
					className={className}
					initialOpen={false}
				>
					<div>Error: {error.message}</div>
				</CustomPanelBody>
			)
		} else if (!isLoadedItems || !isLoaded ) {
			return (
				<CustomPanelBody
					title={title}
					className={className}
					initialOpen={false}
				>
					<div>Loading...</div>
				</CustomPanelBody>
			)
		} else {
			return (
				<CustomPanelBody
					title={title}
					className={className}
					initialOpen={false}
					onAddNewFeature={this.onAddNewFeature.bind(this)}
				>
					<FeatureList
						availableFeatureCollection={availableFeatureCollection}
						featureCollection={featureCollection}
						onChangeFeatures={this.onChangeFeatures.bind(this)}
					/>
				</CustomPanelBody>
			);
		}
	}
}

export default FeatureListPanel;