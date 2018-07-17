/**
 * External dependencies
 */
import Backform from 'Backform';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { F10, ESCAPE, ALT } = wp.utils.keycodes;

/**
 * Wysiwyg Control
 *
 * The tinyMce integration is mostly copied from the gutenberg/core-blocks/freeform component (classic editor)
 *
 */
const WysiwygControl = Backform.Control.extend({

	defaults: {
		label: '',
		helpMessage: null
	},

	// ./form.js inits the controls with options for layer and model
	initialize( options ) {
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
		'click': 'onClick',
		'dblclick': 'onClick',
	}),

	onClick(e){
		if ( e ) e.preventDefault();
		const { baseURL, suffix } = window.wpEditorL10n.tinymce;

		if ( this.editor ) return this;

		window.tinymce.EditorManager.overrideDefaults( {
			base_url: baseURL,
			suffix,
		} );

		this.initEditor();
	},

	setupToolbar(){
		if ( ! this.$toolbar ){
			// create toolbar element
			this.$toolbar = $('<div>', {
				id: 'geom-inline-editor-toolbar-' + this.cid,
				class: 'geom-inline-editor-toolbar freeform-toolbar',
				['data-placeholder']: __( 'Classic' ),
			} );
			// append toolbar to container
			this.$el.closest('div[data-type="geom/map"]').find('.geom-toolbar').append(this.$toolbar);
			// animate toolbar
			let autoHeight = this.$toolbar.css('height', 'auto').height();
			this.$toolbar.height(0).animate({height: autoHeight}, 500, () => this.$toolbar.css('height', 'auto') );
			// toolbar events
			this.$toolbar.on('keydown', this.onToolbarKeyDown.bind(this) );
		}
	},

	getEditorElement(){
		return this.$el.find('.geom-inline-editor');
	},

	initEditor() {
		const { settings } = window.wpEditorL10n.tinymce;
		if ( this.editor ) return;
		// setup editor element
		this.getEditorElement().attr( 'id', 'editor-' + this.cid );
		// setup toolbar element
		this.setupToolbar();
		// initialize
		wp.oldEditor.initialize( 'editor-' + this.cid, {
			tinymce: {
			...settings,
			inline: true,
			content_css: geomData.pluginDirUrl + '/css/geom_block_map_editor_tinymce_content.min.css',
			fixed_toolbar_container: '#geom-inline-editor-toolbar-' + this.cid,
			setup: this.onSetup.bind(this),
		},
		} );
	},

	onSetup( editor ) {
		const self = this;
		const content  = this.getEditorElement().html();
		this.editor = editor;

		editor.addButton( 'kitchensink', {
			tooltip: __( 'More' ),
			icon: 'dashicon dashicons-editor-kitchensink',
			onClick: function() {
				const button = this;
				const active = ! button.active();
				button.active( active );
				editor.dom.toggleClass( self.$toolbar, 'has-advanced-toolbar', active );
			},
		} );

		if ( content ) {
			editor.on( 'loadContent', () => editor.setContent( content ) );
		}

		editor.on( 'init', () => {
			// Create the toolbar by refocussing the editor.
			editor.getBody().blur();
			editor.focus();
		} );

		// // ??? well that doesn't work... will fix that in future
		// editor.on('keydown', ( event ) => {
		// 	const { altKey } = event;
		// 	// Prevent Mousetrap from kicking in: TinyMCE already uses its own 'alt+f10' shortcut to focus its toolbar.
		// 	// if ( altKey && event.keyCode === F10 ) {
		// 	if ( event.keyCode === F10 ) {
		// 		event.stopPropagation();
		// 	}
		// });

		editor.on( 'blur', (event) => {
			this.setModelVal(event);
			return false;
		} );

		editor.on('KeyUp Change Paste input touchend', ( event ) => {
			// close editor if esc pressed
			if ( event.keyCode === ESCAPE ) {
				this.close(event);
			}
		});

		editor.on('focusout', ( event ) => {
			if ( undefined !== $( event.explicitOriginalTarget ) ){

				if ( $( event.explicitOriginalTarget ).attr('id') ){
					if ( $( event.explicitOriginalTarget ).attr('id').startsWith('mce') ){
						return;
					}
				}

				if ( event.explicitOriginalTarget.tagName === 'BUTTON' ){
					this.setModelVal(event);
					this.close(event);
					$( event.explicitOriginalTarget ).trigger('click');
					return;
				}
			}
			this.setModelVal(event);
			this.close(event);
		});
	},

	focus() {
		if ( this.editor ) {
			this.editor.focus();
		}
	},

	onToolbarKeyDown( event ) {
		// Prevent WritingFlow from kicking in and allow arrows navigation on the toolbar.
		event.stopPropagation();
		// Prevent Mousetrap from moving focus to the top toolbar when pressing 'alt+f10' on this block toolbar.
		event.nativeEvent.stopImmediatePropagation();
	},

	close(e){
		if ( e ) e.preventDefault();
		this.removeEditor();
	},

	setModelVal(e){
		if ( e ) e.preventDefault();
		const model = this.model;
		const val = this.editor.getContent();
		const oldVal = model.get( this.field.get( 'name' ) ) || model.get( this.field.get( 'name' ) ).rendered;
		const newVal = this.formatter.toRaw( val ) || this.formatter.toRaw( val ).rendered;
		if ( ! _.isUndefined( newVal ) ) this.model.set( 'content', newVal );
	},

	getValueFromDOM() {
		return this.formatter.toRaw( this.getEditorElement().html(), this.model );
	},

	removeEditor() {
		if ( this.editor ){
			window.addEventListener( 'DOMContentLoaded', this.initEditor );
			wp.oldEditor.remove( 'editor-' + this.cid );
			this.removeToolbar();
			delete this.editor;
			this.getEditorElement().attr( 'id', null);
		}
	},

	removeToolbar(){
		if ( this.$toolbar ){
			this.$toolbar.animate({height: 0}, 500, () => {
				this.$toolbar.remove();
				delete this.$toolbar;
			});
		}
	},

});

export default WysiwygControl;