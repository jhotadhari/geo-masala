/**
 * WordPress dependencies
 */
const {
    Button,
    Dashicon,
    Popover,
} = wp.components;


class PopoverButton extends React.Component {

	constructor(props) {
		super(props)
		this.props = props;

		this.state = {
			popoverIsVisible: false,
		}


		this.togglePopoverIsVisible = function(e){
			if ( e ) e.preventDefault();
			console.log( 'togglePopoverIsVisible this', this );		// ??? debug

			// this.setState({
			// 	popoverIsVisible: this.state.popoverIsVisible,
			// });
		};

	}


	// shouldComponentUpdate(nextProps: Props) {
	// 	// if( 'function' !== typeof this.props.items.map )
	// 	// 	return false;
	// 	console.log( 'shouldComponentUpdate' );		// ??? debug

	// 	return false;
	// }



	render() {
		const {
			popoverIsVisible,
		} = this.state;

		console.log( 'this', this );		// ??? debug

		return ([
			<Button
				onClick={ this.togglePopoverIsVisible() }
				className={'geom-block'}
			>
				<Dashicon icon={ 'share' } className="components-panel__share" />

				{ popoverIsVisible && (
					<Popover
						focusOnMount={ false }
						aria-hidden="true"
						onClose={ this.togglePopoverIsVisible() }
						onClick={ ( event ) => event.stopPropagation() }
					>
						Popover is toggled!
					</Popover>
				) }

			</Button>
		]);
	}
}

export default PopoverButton;