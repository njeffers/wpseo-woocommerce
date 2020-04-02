<?php
/**
 * Yoast SEO: News plugin file.
 *
 * @package WPSEO_News
 */

use Yoast\WP\SEO\Presentations\Indexable_Presentation;

/**
 * Represents the WooCommerce presenter.
 */
class WPSEO_WooCommerce_Presenter {

	/**
	 * Presents the WooCommerce metatags when applicable.
	 *
	 * @param Indexable_Presentation $presentation Presentation to use.
	 *
	 * @return string The rendered meta tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$product = wc_get_product( $presentation->model->object_id );
		if ( ! $product instanceof WC_Product ) {
			return '';
		}

		/**
		 * Action: 'Yoast\WP\Woocommerce\opengraph' - Allow developers to add to our OpenGraph tags.
		 *
		 * @since 12.6.0
		 *
		 * @api   WC_Product $product The WooCommerce product we're outputting for.
		 */
		do_action_deprecated( 'Yoast\WP\Woocommerce\opengraph', $product, 'WPSEO Woo 13.0', 'WPSEO_WooCommerce_Presenter' );

		$output = [];

		$this->product_brand( $output, $product );
		$this->product_price( $output, $product );
		$this->pinterest_product_availability( $output, $product );
		$this->product_availability( $output, $product );
		$this->product_retailer_item_id( $output, $product );
		$this->product_condition( $output, $product );

		return implode( PHP_EOL, $output );
	}

	/**
	 * Add the brand to the OpenGraph output.
	 *
	 * @param string[]   $output  The OpenGraph output array.
	 * @param WC_Product $product The WooCommerce product object.
	 *
	 * @return string
	 */
	public function product_brand( &$output, WC_Product $product ) {
		$schema_brand = YoastSEO()->helpers->options->get( 'woo_schema_brand' );
		if ( $schema_brand !== '' ) {
			$brand = $this->get_brand_term_name( $schema_brand, $product );
			if ( ! empty( $brand ) ) {
				$output[] = '<meta property="product:brand" content="' . esc_attr( $brand ) . '"/>';
			}
		}
	}

	/**
	 * Add the price to the OpenGraph output.
	 *
	 * @param string[]   $output  The OpenGraph output array.
	 * @param WC_Product $product The WooCommerce product object.
	 */
	public function product_price( &$output, WC_Product $product ) {
		/**
		 * Filter: wpseo_woocommerce_og_price - Allow developers to prevent the output of the price in the OpenGraph tags.
		 *
		 * @deprecated 12.5.0. Use the {@see 'Yoast\WP\Woocommerce\og_price'} filter instead.
		 *
		 * @api        bool unsigned Defaults to true.
		 */
		$show_price = apply_filters_deprecated(
			'wpseo_woocommerce_og_price',
			[ true ],
			'Yoast WooCommerce 12.5.0',
			'Yoast\WP\Woocommerce\og_price'
		);

		/**
		 * Filter: Yoast\WP\Woocommerce\og_price - Allow developers to prevent the output of the price in the OpenGraph tags.
		 *
		 * @since 12.5.0
		 *
		 * @api   bool unsigned Defaults to true.
		 */
		$show_price = apply_filters( 'Yoast\WP\Woocommerce\og_price', $show_price );

		if ( $show_price === true ) {
			$output[] = '<meta property="product:price:amount" content="' . esc_attr( WPSEO_WooCommerce_Utils::get_product_display_price( $product ) ) . '" />';
			$output[] = '<meta property="product:price:currency" content="' . esc_attr( get_woocommerce_currency() ) . '" />';
		}
	}

	/**
	 * Add our product stock availability for Pinterest Rich Pins.
	 *
	 * @param string[]   $output  The OpenGraph output array.
	 * @param WC_Product $product The WooCommerce product object.
	 */
	public function pinterest_product_availability( &$output, WC_Product $product ) {
		if ( $product->is_on_backorder() ) {
			$output[] = '<meta property="og:availability" content="backorder" />';
			return;
		}

		if ( $product->is_in_stock() ) {
			$output[] = '<meta property="og:availability" content="instock" />';
			return;
		}

		$output[] = '<meta property="og:availability" content="out of stock" />';
	}

	/**
	 * Add our product stock availability.
	 *
	 * @param string[]   $output  The OpenGraph output array.
	 * @param WC_Product $product The WooCommerce product object.
	 */
	public function product_availability( &$output, WC_Product $product ) {
		if ( $product->is_on_backorder() ) {
			$output[] = '<meta property="product:availability" content="available for order" />';
			return;
		}

		if ( $product->is_in_stock() ) {
			$output[] = '<meta property="product:availability" content="in stock" />';
			return;
		}

		$output[] = '<meta property="product:availability" content="out of stock" />';
	}

	/**
	 * Add the Item ID.
	 *
	 * @param string[]   $output  The OpenGraph output array.
	 * @param WC_Product $product The WooCommerce product object.
	 */
	public function product_retailer_item_id( &$output, WC_Product $product ) {
		$output[] = '<meta property="product:retailer_item_id" content="' . esc_attr( $product->get_sku() ) . '" />';
	}

	/**
	 * Add the product condition.
	 *
	 * @param string[]   $output  The OpenGraph output array.
	 * @param WC_Product $product The WooCommerce product object.
	 */
	public function product_condition( &$output, WC_Product $product ) {
		/**
		 * Filter: Yoast\WP\Woocommerce\product_condition - Allow developers to prevent or change the output of the product condition in the OpenGraph tags.
		 *
		 * @param \WC_Product $product The product we're outputting.
		 *
		 * @api string Defaults to 'new'.
		 */
		$product_condition = apply_filters( 'Yoast\WP\Woocommerce\product_condition', 'new', $product );

		if ( ! empty( $product_condition ) ) {
			$output[] = '<meta property="product:condition" content="' . esc_attr( $product_condition ) . '" />';
		}
	}

	/**
	 * Retrieve the primary and if that doesn't exist first term for the brand taxonomy.
	 *
	 * @param string      $schema_brand The taxonomy the site uses for brands.
	 * @param \WC_Product $product      The product we're finding the brand for.
	 *
	 * @return bool|string The brand name or false on failure.
	 */
	private function get_brand_term_name( $schema_brand, $product ) {
		$primary_term = WPSEO_WooCommerce_Utils::search_primary_term( [ $schema_brand ], $product );
		if ( ! empty( $primary_term ) ) {
			return $primary_term;
		}
		$terms = get_the_terms( get_the_ID(), $schema_brand );
		if ( is_array( $terms ) && count( $terms ) > 0 ) {
			$term_values = array_values( $terms );
			$term        = array_shift( $term_values );

			return $term->name;
		}

		return false;
	}
}
