<?php
/**
 * WooCommerce Yoast SEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Class Yoast_WooCommerce_SEO_Double.
 */
class Yoast_WooCommerce_SEO_Double extends Yoast_WooCommerce_SEO {

	/**
	 * Checks the dependencies. Sets a notice when requirements aren't met.
	 *
	 * @param string $wp_version The current version of WordPress.
	 *
	 * @return bool True whether the dependencies are okay.
	 */
	public function check_dependencies( $wp_version ) {
		return parent::check_dependencies( $wp_version );
	}

	/**
	 * Prevents a hidden product from being added to the sitemap.
	 *
	 * @param array   $url  The url data.
	 * @param string  $type The object type.
	 * @param WP_Post $post The post object.
	 *
	 * @return bool|array False when entry is hidden.
	 */
	public function filter_hidden_product( $url, $type, $post ) {
		return parent::filter_hidden_product( $url, $type, $post );
	}
}
