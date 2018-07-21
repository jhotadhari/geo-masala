<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Geom_Block_Map {

	protected static $instance = null;
	protected $namspace = 'geom/map';

	protected $handles = array(
		'editor' => 'geom_block_map_editor',
		'frontend' => 'geom_block_map_frontend',
	);

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
			self::$instance->hooks();
		}

		return self::$instance;
	}

	protected function __construct() {
		// ... silence
	}

	public function hooks() {
		add_action( 'init', array( $this, 'geom_block_map_register' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_assets' ) );
		add_action( 'enqueue_block_assets', array( $this, 'enqueue_frontend_assets' ) );
	}

	public function geom_block_map_register() {
		if ( function_exists( 'register_block_type' ) ) {
			register_block_type( $this->namspace, array(
				'editor_script' => $this->get_handle( 'editor' ),
				'editor_style' => $this->get_handle( 'editor' ),
				// 'style' => 'geom_block_map',		// dont set a style here. use hook instead and check if post_has_block
				// 'script' => 'geom_block_map',	// dont set a style here. use hook instead and check if post_has_block
				'render_callback' => array( $this, 'render' ),
			) );
		}
	}

	protected function get_handle( $key ){
		$handles = $this->handles;
		if ( array_key_exists( $key, $handles ) ){
			return $handles[$key];
		}

	}

	protected function post_has_block(){
		global $post;

		if ( strlen( $post->post_content ) === 0 )
			return false;

		$block_pattern = (
			'/<!--\s+wp:(' .
			str_replace( '/', '\/',                 // Escape namespace, not handled by preg_quote.
				preg_quote( $this->namspace )
				) .
			')(\s+(\{.*?\}))?\s+(\/)?-->/'
			);
		return preg_match( $block_pattern, $post->post_content, $block_matches ) === 1;
	}

	// protected function get_localize_data(){
	// 	global $post;

	// 	if ( strlen( $post->post_content ) === 0 )
	// 		return array();

	// 	$block_pattern = (
	// 		'/<!--\s+wp:(' .
	// 		str_replace( '/', '\/',                 // Escape namespace, not handled by preg_quote.
	// 			preg_quote( $this->namspace )
	// 			) .
	// 		')(\s+(\{.*?\}))?\s+(\/)?-->/'
	// 		);
	// 	preg_match_all( $block_pattern, $post->post_content, $block_matches );

	// 	$geom_map_blocks = array();
	// 	foreach( $block_matches[2] as $block_match ) {
	// 		$value = json_decode( $block_match, true ) !== null ? json_decode( $block_match, true ) : false;
	// 		if ( ! $value )
	// 			break;
	// 		if ( array_key_exists( 'controls', $value ) && 'string' === gettype($value['controls']) && !empty( $value['controls'] ) ) {
	// 			$controls = json_decode( $value['controls'], true ) !== null ? json_decode( $value['controls'], true ) : false;
	// 			if ( $controls ){
	// 				$value['controls'] = $controls;
	// 			} else {
	// 				unset( $value['controls'] );
	// 			}
	// 		}
	// 		array_push( $geom_map_blocks, $value );
	// 	}

	// 	return $geom_map_blocks;
	// }

	protected function get_localize_data(){
		global $post;
		$current_user = wp_get_current_user();
		return array(
			'pluginDirUrl' => Geom_Geo_masala::plugin_dir_url(),
			'user' => array(
				'id' => strval( $current_user->ID ),
			),
			'post' => array(
				'id' => strval( $post->ID ),
			),
			'api' => array(
				'root'          => esc_url_raw( get_rest_url() ),
				'nonce'         => ( wp_installing() && ! is_multisite() ) ? '' : wp_create_nonce( 'wp_rest' ),
				'versionString' => 'wp/v2/',
			),
		);
	}

	public function enqueue_frontend_assets() {

		wp_register_script(
			'backbone-memento',
			Geom_Geo_masala::plugin_dir_url() . '/js/backbone.memento.min.js',
			array(
				'wp-backbone',
				),
			false,
			true
		);

		if ( is_admin() || ! $this->post_has_block() )
			return;

		$handle = $this->get_handle( 'frontend' );

		wp_enqueue_style(
			$handle,
			Geom_Geo_masala::plugin_dir_url() . '/css/' . $handle . '.min.css',
			array( 'wp-blocks' ),
			filemtime( Geom_Geo_masala::plugin_dir_path() . 'css/' . $handle . '.min.css' )
		);

		wp_register_script(
			$handle,
			Geom_Geo_masala::plugin_dir_url() . '/js/' . $handle . '.min.js',
			array(
				'wp-backbone',
				'wp-api',
				'utils',
				),
			filemtime( Geom_Geo_masala::plugin_dir_path() . 'js/' . $handle . '.min.js' )
		);

		wp_localize_script( $handle, 'geomData', $this->get_localize_data() );

		// wp_enqueue_media();

		wp_enqueue_script( $handle );
	}

	public function enqueue_editor_assets() {
		$handle = $this->get_handle( 'editor' );

		wp_register_script(
			'backform',
			Geom_Geo_masala::plugin_dir_url() . '/js/backform.min.js',
			array(
				'wp-backbone',
				),
			false,
			true
		);

		wp_register_script(
			$handle,
			Geom_Geo_masala::plugin_dir_url() . '/js/' . $handle . '.min.js',
			array(
				'wp-blocks',
				'wp-i18n',
				'wp-element',
				'backform',
				'backbone-memento',
				),
			filemtime( Geom_Geo_masala::plugin_dir_path() . 'js/' . $handle . '.min.js' )
		);

		wp_localize_script( $handle, 'geomData', $this->get_localize_data() );

		wp_enqueue_script( $handle );

		wp_enqueue_style(
			$handle,
			Geom_Geo_masala::plugin_dir_url() . '/css/' . $handle . '.min.css',
			array( 'wp-edit-blocks' ),
			filemtime( Geom_Geo_masala::plugin_dir_path() . 'css/' . $handle . '.min.css' )
		);
	}

	public function render( $attributes ) {

		$stringified_values = array(
			'controls',
			'mapOptions',
			'mapDimensions',
			'options',
		);

		foreach( $stringified_values as $key ) {
			if ( array_key_exists( $key, $attributes ) && 'string' === gettype($attributes[$key]) && !empty( $attributes[$key] ) ) {
				$value = json_decode( $attributes[$key], true ) !== null ? json_decode( $attributes[$key], true ) : false;
				if ( $value ){
					$attributes[$key] = $value;
				} else {
					unset( $attributes[$key] );
				}
			}
		}

		return '<figure class="geom-block-map wp-block-geom-map" data-geom-map="' . htmlspecialchars( json_encode( $attributes ), ENT_QUOTES, 'UTF-8' ) . '"></figure>';
	}

}

function geom_block_map_init() {
	return Geom_Block_Map::get_instance();
}

geom_block_map_init();




?>