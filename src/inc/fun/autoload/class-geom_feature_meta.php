<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Geom_Feature_Meta {

	/**
	 * Holds an instance of the object
	 *
	 * @var Geom_Feature_Meta
	 * @since 0.0.1
	 */
	protected static $instance = null;

	protected $post_type;
	protected $fields;

	/**
	 * Returns the running object
	 *
	 * @return Geom_Feature_Meta
	 * @since 0.0.1
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
			self::$instance->hooks();
		}
		return self::$instance;
	}

	/**
	 * Constructor
	 * @since 0.0.1
	 */
	protected function __construct() {
		$this->post_type = 'geom_feature';
	}

	/**
	 * Initiate our hooks
	 * @since 0.0.1
	 */
	public function hooks() {
		add_action( 'init', array( $this, 'set_fields' ) );
		add_action( 'rest_api_init', array( $this, 'api_register_meta' ) );
	}

	public function set_fields() {

		$fields = array();

		array_push( $fields, array(
			'title' => array(
				'key' => 'geom_feature_icon',
				'val' => 'Type',
			),
			'schema' => array(
				'type' => 'string',
			),
		) );

		array_push( $fields, array(
			'title' => array(
				'key' => 'geom_feature_popup_options',
				'val' => 'Type',
			),
			'schema' => array(
				'type' => 'string',
			),
		) );

		array_push( $fields, array(
			'title' => array(
				'key' => 'geom_feature_path_style',
				'val' => 'Type',
			),
			'schema' => array(
				'type' => 'string',
			),
		) );

		array_push( $fields, array(
			'title' => array(
				'key' => 'geom_feature_geo_json',
				'val' => 'Type',
			),
			'schema' => array(
				'type' => 'string',
			),
		) );

		array_push( $fields, array(
			'title' => array(
				'key' => 'geom_feature_share',
				'val' => 'Type',
			),
			'schema' => array(
				'type' => 'string',
			),
		) );

		$this->fields = $fields;
	}

	public function get_fields() {
		return is_array( $this->fields ) ? $this->fields : array();
	}

	public function api_register_meta(){

		$fields = $this->fields;

		if ( ! empty( $fields ) ) {
			foreach( $fields as $field ){
				if ( array_key_exists( 'title', $field ) && ! empty( $field['title'] ) ){
					if ( array_key_exists( 'key', $field['title'] ) && ! empty( $field['title']['key'] ) ){

						$schema = array();
						$schema['description'] = $field['title']['val'];
						$schema['context'] =  array( 'view', 'edit' );
						$schema['type'] = $field['schema']['type'];

						register_rest_field(
							$this->post_type,
							$field['title']['key'],
							array(
								'get_callback'      => array( $this, 'api_field_get_cb' ),
								'update_callback'   => array( $this, 'api_field_update_cb' ),
								'schema'            => $schema
							)
						);
					}
				}
			}
		}
	}

	public function api_field_get_cb( $object, $field_name, $request ) {
		return get_post_meta( $object['id'], sanitize_key( $field_name ), true );
	}

	public function api_field_update_cb( $value, $object, $field_name ) {
		switch( $field_name ) {
			case 'geom_feature_icon':
			case 'geom_feature_popup_options':
			case 'geom_feature_path_style':
			case 'geom_feature_share':
				$value = json_decode( $value, true ) !== null ? json_decode( $value, true ) : $value;
				return update_post_meta( $object->ID, $field_name, $value );
				break;
			case 'geom_feature_geo_json':
				$value = json_decode( $value, true );
				if ( $value === null ) return;
				if ( ! isset( $value['type'] ) || ! isset( $value['geometry'] ) ) return;
				if ( $value['type'] !== 'Feature' ) return;
				if ( empty( $value['geometry'] ) ) return;
				if ( ! isset( $value['geometry']['type'] ) || ! isset( $value['geometry']['coordinates'] ) ) return;
				return update_post_meta( $object->ID, $field_name, $value );
				break;
			default:
				return false;
		}
	}

}

function geom_feature_meta() {
	return Geom_Feature_Meta::get_instance();
}

// Get it started
geom_feature_meta();

?>