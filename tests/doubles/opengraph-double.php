<?php

namespace Yoast\WP\Woocommerce\Tests\Doubles;

use WPSEO_WooCommerce_OpenGraph;

/**
 * Test Helper Class.
 */
class OpenGraph_Double extends WPSEO_WooCommerce_OpenGraph {

	/**
	 * Retrieve the primary and if that doesn't exist first term for the brand taxonomy.
	 *
	 * @param string      $schema_brand The taxonomy the site uses for brands.
	 * @param \WC_Product $product      The product we're finding the brand for.
	 *
	 * @return bool|string The brand name or false on failure.
	 */
	public function get_brand_term_name( $schema_brand, $product ) {
		return parent::get_brand_term_name( $schema_brand, $product );
	}
}
