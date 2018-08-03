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

	// same as parent, but possible to return_only_ids
	public function prepare_item_for_response( $post, $request ) {
		$GLOBALS['post'] = $post;

		setup_postdata( $post );

		$schema = $this->get_item_schema();

		// Base fields for every post.
		$data = array();

		if ( ! empty( $schema['properties']['id'] ) ) {
			$data['id'] = $post->ID;
		}

		$params = $request->get_params();
		$return_only_ids = array_key_exists( 'return_only_ids', $params ) ? $params['return_only_ids'] : false;
		if ( ! $return_only_ids ) {


			if ( ! empty( $schema['properties']['date'] ) ) {
				$data['date'] = $this->prepare_date_response( $post->post_date_gmt, $post->post_date );
			}

			if ( ! empty( $schema['properties']['date_gmt'] ) ) {
				// For drafts, `post_date_gmt` may not be set, indicating that the
				// date of the draft should be updated each time it is saved (see
				// #38883).  In this case, shim the value based on the `post_date`
				// field with the site's timezone offset applied.
				if ( '0000-00-00 00:00:00' === $post->post_date_gmt ) {
					$post_date_gmt = get_gmt_from_date( $post->post_date );
				} else {
					$post_date_gmt = $post->post_date_gmt;
				}
				$data['date_gmt'] = $this->prepare_date_response( $post_date_gmt );
			}

			if ( ! empty( $schema['properties']['guid'] ) ) {
				$data['guid'] = array(
					/** This filter is documented in wp-includes/post-template.php */
					'rendered' => apply_filters( 'get_the_guid', $post->guid, $post->ID ),
					'raw'      => $post->guid,
				);
			}

			if ( ! empty( $schema['properties']['modified'] ) ) {
				$data['modified'] = $this->prepare_date_response( $post->post_modified_gmt, $post->post_modified );
			}

			if ( ! empty( $schema['properties']['modified_gmt'] ) ) {
				// For drafts, `post_modified_gmt` may not be set (see
				// `post_date_gmt` comments above).  In this case, shim the value
				// based on the `post_modified` field with the site's timezone
				// offset applied.
				if ( '0000-00-00 00:00:00' === $post->post_modified_gmt ) {
					$post_modified_gmt = date( 'Y-m-d H:i:s', strtotime( $post->post_modified ) - ( get_option( 'gmt_offset' ) * 3600 ) );
				} else {
					$post_modified_gmt = $post->post_modified_gmt;
				}
				$data['modified_gmt'] = $this->prepare_date_response( $post_modified_gmt );
			}

			if ( ! empty( $schema['properties']['password'] ) ) {
				$data['password'] = $post->post_password;
			}

			if ( ! empty( $schema['properties']['slug'] ) ) {
				$data['slug'] = $post->post_name;
			}

			if ( ! empty( $schema['properties']['status'] ) ) {
				$data['status'] = $post->post_status;
			}

			if ( ! empty( $schema['properties']['type'] ) ) {
				$data['type'] = $post->post_type;
			}

			if ( ! empty( $schema['properties']['link'] ) ) {
				$data['link'] = get_permalink( $post->ID );
			}

			if ( ! empty( $schema['properties']['title'] ) ) {
				add_filter( 'protected_title_format', array( $this, 'protected_title_format' ) );

				$data['title'] = array(
					'raw'      => $post->post_title,
					'rendered' => get_the_title( $post->ID ),
				);

				remove_filter( 'protected_title_format', array( $this, 'protected_title_format' ) );
			}

			$has_password_filter = false;

			if ( $this->can_access_password_content( $post, $request ) ) {
				// Allow access to the post, permissions already checked before.
				add_filter( 'post_password_required', '__return_false' );

				$has_password_filter = true;
			}

			if ( ! empty( $schema['properties']['content'] ) ) {
				$data['content'] = array(
					'raw'       => $post->post_content,
					/** This filter is documented in wp-includes/post-template.php */
					'rendered'  => post_password_required( $post ) ? '' : apply_filters( 'the_content', $post->post_content ),
					'protected' => (bool) $post->post_password,
				);
			}

			if ( ! empty( $schema['properties']['excerpt'] ) ) {
				/** This filter is documented in wp-includes/post-template.php */
				$excerpt = apply_filters( 'the_excerpt', apply_filters( 'get_the_excerpt', $post->post_excerpt, $post ) );
				$data['excerpt'] = array(
					'raw'       => $post->post_excerpt,
					'rendered'  => post_password_required( $post ) ? '' : $excerpt,
					'protected' => (bool) $post->post_password,
				);
			}

			if ( $has_password_filter ) {
				// Reset filter.
				remove_filter( 'post_password_required', '__return_false' );
			}

			if ( ! empty( $schema['properties']['author'] ) ) {
				$data['author'] = (int) $post->post_author;
			}

			if ( ! empty( $schema['properties']['featured_media'] ) ) {
				$data['featured_media'] = (int) get_post_thumbnail_id( $post->ID );
			}

			if ( ! empty( $schema['properties']['parent'] ) ) {
				$data['parent'] = (int) $post->post_parent;
			}

			if ( ! empty( $schema['properties']['menu_order'] ) ) {
				$data['menu_order'] = (int) $post->menu_order;
			}

			if ( ! empty( $schema['properties']['comment_status'] ) ) {
				$data['comment_status'] = $post->comment_status;
			}

			if ( ! empty( $schema['properties']['ping_status'] ) ) {
				$data['ping_status'] = $post->ping_status;
			}

			if ( ! empty( $schema['properties']['sticky'] ) ) {
				$data['sticky'] = is_sticky( $post->ID );
			}

			if ( ! empty( $schema['properties']['template'] ) ) {
				if ( $template = get_page_template_slug( $post->ID ) ) {
					$data['template'] = $template;
				} else {
					$data['template'] = '';
				}
			}

			if ( ! empty( $schema['properties']['format'] ) ) {
				$data['format'] = get_post_format( $post->ID );

				// Fill in blank post format.
				if ( empty( $data['format'] ) ) {
					$data['format'] = 'standard';
				}
			}

			if ( ! empty( $schema['properties']['meta'] ) ) {
				$data['meta'] = $this->meta->get_value( $post->ID, $request );
			}

			$taxonomies = wp_list_filter( get_object_taxonomies( $this->post_type, 'objects' ), array( 'show_in_rest' => true ) );

			foreach ( $taxonomies as $taxonomy ) {
				$base = ! empty( $taxonomy->rest_base ) ? $taxonomy->rest_base : $taxonomy->name;

				if ( ! empty( $schema['properties'][ $base ] ) ) {
					$terms = get_the_terms( $post, $taxonomy->name );
					$data[ $base ] = $terms ? array_values( wp_list_pluck( $terms, 'term_id' ) ) : array();
				}
			}

			$context = ! empty( $request['context'] ) ? $request['context'] : 'view';
			$data    = $this->add_additional_fields_to_object( $data, $request );
			$data    = $this->filter_response_by_context( $data, $context );
		}

		// Wrap the data in a response object.
		$response = rest_ensure_response( $data );

		$response->add_links( $this->prepare_links( $post ) );

		/**
		 * Filters the post data for a response.
		 *
		 * The dynamic portion of the hook name, `$this->post_type`, refers to the post type slug.
		 *
		 * @since 4.7.0
		 *
		 * @param WP_REST_Response $response The response object.
		 * @param WP_Post          $post     Post object.
		 * @param WP_REST_Request  $request  Request object.
		 */
		return apply_filters( "rest_prepare_{$this->post_type}", $response, $post, $request );
	}


}

?>