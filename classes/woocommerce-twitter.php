<?php
/**
 * WooCommerce Yoast SEO plugin file.
 *
 * @package WPSEO/WooCommerce
 */

/**
 * Class WPSEO_WooCommerce_Twitter
 */
class WPSEO_WooCommerce_Twitter {

	/**
	 * Register hooks.
	 */
	public function register_hooks() {
		\add_filter( 'wpseo_twitter_image', [ $this, 'fallback_to_product_gallery_image' ], 10, 2 );
	}

	/**
	 * Lets the twitter image fall back to the first image in the product gallery.
	 *
	 * @param string                 $twitter_image The current twitter image.
	 * @param Indexable_Presentation $presentation  The indexable presentation.
	 *
	 * @return string The image fallback.
	 */
	public function fallback_to_product_gallery_image( $twitter_image, $presentation ) {
		// We should only fall back to the Twitter image if OpenGraph is disabled and no other Twitter image is set.
		if ( ! $presentation->context->open_graph_enabled && ! $twitter_image ) {
			$object = $presentation->model;

			// Fall back to the first image in the product gallery.
			if ( $object->object_type === 'post' && $object->object_sub_type === 'product' ) {
				$product = \wc_get_product( $object->object_id );

				if ( $product ) {
					$gallery_image_ids      = $product->get_gallery_image_ids();
					$first_gallery_image_id = \reset( $gallery_image_ids );

					if ( $first_gallery_image_id ) {
						return YoastSEO()->helpers->twitter->image->get_by_id( $first_gallery_image_id );
					}
					return '';
				}
			}
		}

		return $twitter_image;
	}
}
