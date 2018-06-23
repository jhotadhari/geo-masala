
class GeomToolbar extends React.Component {

	constructor(props) {
		super(props)
		this.props = props;
	}

	// shouldComponentUpdate(nextProps: Props) {
	// 	// if( 'function' !== typeof this.props.items.map )
	// 	// 	return false;
	// 	console.log( 'shouldComponentUpdate' );		// ??? debug

	// 	return false;
	// }

	render() {
		return ([
			<div
				className={ 'geom-toolbar' }
				ref={ 'geom-toolbar' }
			>
			</div>,
			<div
				className={ 'geom-clearfix' }
			>
			</div>
		]);
	}
}

export default GeomToolbar;