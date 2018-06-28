<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Extend the main WP_REST_Posts_Controller
 */
class Geom_REST_Features_Controller extends WP_REST_Posts_Controller {


	public function update_item_permissions_check( $request ) {
		$post = $this->get_post( $request['id'] );
		if ( is_wp_error( $post ) ) {
			return $post;
		}

		$post_type = get_post_type_object( $this->post_type );

		if ( $post && ! $this->check_update_permission( $post ) ) {
			return new WP_Error( 'rest_cannot_edit', __( 'Sorry, you are not allowed to edit this post.' ), array( 'status' => rest_authorization_required_code() ) );
		}

		// if ( ! empty( $request['author'] ) && get_current_user_id() !== $request['author'] && ! current_user_can( $post_type->cap->edit_others_posts ) ) {
		if ( ! empty( $request['author'] ) && get_current_user_id() !== $request['author'] ) {
			return new WP_Error( 'rest_cannot_edit_others', __( 'Sorry, you are not allowed to update posts as this user.' ), array( 'status' => rest_authorization_required_code() ) );
		}

		if ( ! empty( $request['sticky'] ) && ! current_user_can( $post_type->cap->edit_others_posts ) ) {
			return new WP_Error( 'rest_cannot_assign_sticky', __( 'Sorry, you are not allowed to make posts sticky.' ), array( 'status' => rest_authorization_required_code() ) );
		}

		if ( ! $this->check_assign_terms_permission( $request ) ) {
			return new WP_Error( 'rest_cannot_assign_term', __( 'Sorry, you are not allowed to assign the provided terms.' ), array( 'status' => rest_authorization_required_code() ) );
		}

		return true;
	}


	public function delete_item_permissions_check( $request ) {
		$post = $this->get_post( $request['id'] );
		if ( is_wp_error( $post ) ) {
			return $post;
		}

		if ( $post && ! $this->check_delete_permission( $post ) ) {
			if ( ! empty( $request['author'] ) && get_current_user_id() !== $request['author'] ) {
				return new WP_Error( 'rest_cannot_delete', __( 'Sorry, you are not allowed to delete this post.' ), array( 'status' => rest_authorization_required_code() ) );
			}
		}

		return true;
	}

}

?>