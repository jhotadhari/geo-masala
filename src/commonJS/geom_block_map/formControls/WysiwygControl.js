import Backform from 'Backform';

let isEscPressed = function( e ){
	let isEscape = false;
	if ( 'key' in e ) {
		isEscape = ( e.key == 'Escape' || e.key == 'Esc');
	} else {
		isEscape = ( e.keyCode == 27);
	}
	return isEscape;
};

let tinymceOptions = {
	inline: true,
	toolbar1: 'formatselect fontsizeselect bold italic underline | bullist numlist | alignleft aligncenter alignright | link pastetext',
};

let WysiwygControl = Backform.Control.extend({

	defaults: {
		label: '',
		helpMessage: null
	},

	initialize: function( options) {
		Backform.Control.prototype.initialize.apply(this, arguments);
		this.layer = options.layer;
	},

	template: _.template([
		'<label class="<%=Backform.controlLabelClassName%>"><%=label%></label>',
		'<div class="<%=Backform.controlsClassName%>">',
		'  <div class="geom-inline-editor" <%=disabled ? "disabled" : ""%> <%=required ? "required" : ""%> >',
		'    <%= value %>',
		'  </div>',
		'  <% if (helpMessage && helpMessage.length) { %>',
		'    <span class="<%=Backform.helpMessageClassName%>"><%=helpMessage%></span>',
		'  <% } %>',
		'</div>'
	].join('\n')),

	events: _.extend({}, Backform.Control.prototype.events, {
		'click': 'onclick',
	}),


	onclick: function(e){
		if ( e ) e.preventDefault();
		this.initMceEditor();
	},

	setupToolbar: function(){
		if ( ! this.$toolbar ){
			this.$toolbar = $('<div>', {
				id: 'geom-inline-editor-toolbar-' + this.cid,
				class: 'geom-inline-editor-toolbar',
			} );
			this.$el.closest('div[data-type="geom/map"]').find('.geom-toolbar').append(this.$toolbar);
		}
	},

	removeToolbar: function(){
		if ( this.$toolbar ){
			this.$toolbar.remove();
			delete this.$toolbar;
		}
	},

	getMceElement: function(){
		return this.$el.find('.geom-inline-editor');
	},


	initMceEditor: function(){
		let self = this;

		if ( this.mceEditor )
			return this;

		// setup editor element
		this.getMceElement().attr( 'id', this.cid );
		// setup toolbar element
		this.setupToolbar();

		let settings = _.extend( {}, wp.editor.getDefaultSettings().tinymce, tinymceOptions, {
			selector: this.cid,
			toolbar: true,
			content_css: geomData.pluginDirUrl + '/css/tinymce_content.min.css',
			fixed_toolbar_container: '#geom-inline-editor-toolbar-' + this.cid,
			setup: function (editor) {
				editor.on('init', function ( e ) {
					self.mceEditor.focus();
				}).on('KeyUp Change Paste input touchend', function ( e ) {
					if ( isEscPressed(e) ) {
						self.setModelVal(e);
						self.close(e);
					}
				}).on('focusout', function ( e ) {
					if ( $( e.explicitOriginalTarget ) !== undefined ){

						if ( $( e.explicitOriginalTarget ).attr('id') ){
							if ( $( e.explicitOriginalTarget ).attr('id').startsWith('mce') ){
								// toolbarClicked
								return;
							}
						}

						if ( e.explicitOriginalTarget.tagName === 'BUTTON' ){
							self.setModelVal(e);
							self.close(e);
							$( e.explicitOriginalTarget ).trigger('click');

							return;
						}

					}
					self.setModelVal(e);
					self.close(e);
				});
			},
		} );

		// init mceEditor
		this.mceEditor = tinymce.createEditor( this.cid, settings );

		// render mceEditor
		this.mceEditor.render();

		return this;
	},

	close: function(e){
		if ( e ) e.preventDefault();
		this.removeMceEditor();
	},

	setModelVal: function(e){
		if ( e ) e.preventDefault();
		let model = this.model;
		let val = this.mceEditor.getContent();
		let oldVal = model.get( this.field.get( 'name' ) ) || model.get( this.field.get( 'name' ) ).rendered;
		let newVal = this.formatter.toRaw( val ) || this.formatter.toRaw( val ).rendered;

		console.log( 'setModelVal newVal', newVal );		// ??? debug

		if ( ! _.isUndefined( newVal ) ) this.model.set( 'content', newVal );
	},

	getValueFromDOM: function() {
		return this.formatter.toRaw( this.getMceElement().html(), this.model );
	},

	removeMceEditor: function() {
		if ( this.mceEditor ){
			this.mceEditor.remove();
			this.removeToolbar();
			this.mceEditor.destroy();
			delete this.mceEditor;
			this.getMceElement().attr( 'id', null);
		}
	},

});

export default WysiwygControl;
