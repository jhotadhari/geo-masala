import Backform from 'Backform';

const Form = Backform.Form.extend({

	initialize: function( options ) {
		Backform.Form.prototype.initialize.apply(this, arguments);
		this.setInitialTab();
	},

	setInitialTab: function() {
		this.listenTo( this.model, 'change:actionTab', this.render );
		let actionTabField =  this.fields.findWhere({ name: 'actionTab' });
		if ( undefined !== actionTabField ){
			let currentTab = this.model.get('actionTab');
			let tabs = _.pluck( actionTabField.get( 'options' ), 'value' );
			if ( ! currentTab || ! _.indexOf(tabs, currentTab) ) {
				this.model.set( 'actionTab', tabs[0] );
			}
		}
	},

	render: function() {

		this.cleanup();
		this.$el.empty();

		let form = this,
		$form = this.$el,
		model = this.model,
		controls = this.controls;

		// create some controlGroups
		let $controlGroupTabs = $('<div>', {
			class: 'control-group control-group-tabs container-fluid geom-block',
		} );
		let $controlGroupTabContent = $('<div>', {
			class: 'control-group control-group-tab-content container-fluid',
		} );
		let $controlGroupActions = $('<div>', {
			class: 'control-group control-group-actions container-fluid',
		} );

		this.fields.each( function( field ) {
			// init control
			let control = new ( field.get( 'control' ) )({
				field: field,
				model: model,
				layer: field.get('layer'),
				showAsterisk: form.showRequiredAsAsterisk && field.get( 'required' )
			});
			// render control
			let $control = control.render().$el;

			control.field.$el = $control;
			// exchange groupClasses
			if ( ! _.isEmpty( field.get( 'groupClasses' ) ) ){ $control.removeClass().addClass( field.get( 'groupClasses' ) ); }
			// append field to controlGroup
			switch( field.get( 'controlGroup' ) ) {
			case 'controlGroupTabs':
				$controlGroupTabs.append( $control );
				break;
			case 'controlGroupTabContent':
				if ( model.get('actionTab') === field.get( 'tab' ) ) {
					$controlGroupTabContent.addClass( field.get( 'tab' ) );
					$controlGroupTabContent.append( $control );
				}
				break;
			case 'controlGroupActions':
				$controlGroupActions.append( $control );
				break;
			default:
				// $form.append( control.render().$el );	// ... no let's not attach them
			}

			controls.push( control );
		});

		// append controlGroups to $form
		if ( $.trim( $controlGroupTabs.html() ) !== '' ) $form.append( $controlGroupTabs );
		if ( $.trim( $controlGroupTabContent.html() ) !== '' ) $form.append( $controlGroupTabContent );
		if ( $.trim( $controlGroupActions.html() ) !== '' ) $form.append( $controlGroupActions );

		if ( $controlGroupTabs.find('.actionTab .checkbox').children().length <= 1 ) $controlGroupTabs.addClass('hidden');

		return this;
	},

});


export default Form;
