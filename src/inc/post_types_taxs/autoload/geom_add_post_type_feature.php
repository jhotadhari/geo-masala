<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Register a feature post type.
 *
 * @link http://codex.wordpress.org/Function_Reference/register_post_type
 */
function geom_add_post_type_feature() {

	$post_type = 'geom_feature';
	$labels = array(
		'name'                  => _x( 'Features', 'Post Type General Name', 'geo-masala' ),
		'singular_name'         => _x( 'Feature', 'Post Type Singular Name', 'geo-masala' ),
		'menu_name'             => __( 'Features', 'geo-masala' ),
		'name_admin_bar'        => __( 'Feature', 'geo-masala' ),
		'archives'              => __( 'Features', 'geo-masala' ),
		'attributes'            => __( 'Feature Attributes', 'geo-masala' ),
		'parent_item_colon'     => __( 'Parent Feature:', 'geo-masala' ),
		'all_items'             => __( 'All Features', 'geo-masala' ),
		'add_new_item'          => __( 'Add New Feature', 'geo-masala' ),
		'add_new'               => __( 'Add New', 'geo-masala' ),
		'new_item'              => __( 'New Feature', 'geo-masala' ),
		'edit_item'             => __( 'Edit Feature', 'geo-masala' ),
		'update_item'           => __( 'Update Feature', 'geo-masala' ),
		'view_item'             => __( 'View Feature', 'geo-masala' ),
		'view_items'            => __( 'View Features', 'geo-masala' ),
		'search_items'          => __( 'Search Feature', 'geo-masala' ),
		'not_found'             => __( 'Not found', 'geo-masala' ),
		'not_found_in_trash'    => __( 'Not found in Trash', 'geo-masala' ),
		'featured_image'        => __( 'Featured Image', 'geo-masala' ),
		'set_featured_image'    => __( 'Set featured image', 'geo-masala' ),
		'remove_featured_image' => __( 'Remove featured image', 'geo-masala' ),
		'use_featured_image'    => __( 'Use as featured image', 'geo-masala' ),
		'insert_into_item'      => __( 'Insert into Feature', 'geo-masala' ),
		'uploaded_to_this_item' => __( 'Uploaded to this Feature', 'geo-masala' ),
		'items_list'            => __( 'Features list', 'geo-masala' ),
		'items_list_navigation' => __( 'Features list navigation', 'geo-masala' ),
		'filter_items_list'     => __( 'Filter Features list', 'geo-masala' ),
	);

	$args = array(
		'label'                 => __( 'Feature', 'geo-masala' ),
		'description'           => __( 'Feature description', 'geo-masala' ),
		'labels'                => $labels,
		'supports'              => array(
			'title',
			'author',
			'editor',
			// 'excerpt',
			// 'thumbnail',
			// 'page-attributes',
		),
		'hierarchical'          => false,
		'public'                => true,
		'show_ui'               => false,
		'show_in_menu'          => false,
		'menu_position'         => 5,
		'show_in_admin_bar'     => false,
		'show_in_nav_menus'     => false,
		'can_export'            => true,
		'has_archive'           => false,
		'exclude_from_search'   => true,
		'publicly_queryable'    => true,
		'menu_icon'             => null,	// https://developer.wordpress.org/resource/dashicons/#admin-page
		'show_in_rest'          => true,
		'rest_base'         	=> $post_type . 's',
		'rest_controller_class'	=> 'Geom_REST_Features_Controller',
		'capability_type'		=> 'post',
	);
	register_post_type( $post_type, $args );

}
add_action( 'init', 'geom_add_post_type_feature' );
add_action( 'geom_on_activate_before_flush', 'geom_add_post_type_feature' );

?>