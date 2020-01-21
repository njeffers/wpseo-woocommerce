<?php

namespace Yoast\WP\Woocommerce\Tests\Doubles;

use WC_Product;
use WPSEO_WooCommerce_OpenGraph;

/**
 * Test Helper Class.
 */
class OpenGraph_Double extends WPSEO_WooCommerce_OpenGraph {

	/**
	 * Add the brand to the OpenGraph output.
	 *
	 * @param WC_Product $product The WooCommerce product.
	 */
	public function brand( WC_Product $product ) {
		parent::brand( $product );
	}

	/**
	 * Add the price to the OpenGraph output.
	 *
	 * @param WC_Product $product
	 */
	public function price( WC_Product $product ) {
		parent::price( $product );
	}

	/**
	 * Add the product condition.
	 *
	 * @param WC_Product $product The WooCommerce product object.
	 */
	public function product_condition( WC_Product $product ) {
		parent::product_condition( $product );
	}

	/**
	 * Add the Item ID.
	 *
	 * @param WC_Product $product The WooCommerce product object.
	 */
	public function retailer_item_id( WC_Product $product ) {
		parent::retailer_item_id( $product );
	}

	/**
	 * Add our product stock availability.
	 *
	 * @param WC_Product $product The WooCommerce product object.
	 */
	public function in_stock( WC_Product $product ) {
		parent::in_stock( $product );
	}

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