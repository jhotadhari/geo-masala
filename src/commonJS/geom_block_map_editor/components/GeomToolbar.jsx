
class GeomToolbar extends React.Component {

	constructor(props) {
		super(props)
		this.props = props;
	}

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