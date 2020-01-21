<?php
/**
 * WooCommerce Yoast SEO plugin file.
 *
 * @package WPSEO/WooCommerce
 */

/**
 * Class WPSEO_WooCommerce_OpenGraph
 */
class WPSEO_WooCommerce_OpenGraph {

	/**
	 * WPSEO_WooCommerce_OpenGraph constructor.
	 */
	public function __construct() {
		add_filter( 'language_attributes', [ $this, 'product_namespace' ], 11 );
		add_filter( 'wpseo_opengraph_type', [ $this, 'return_type_product' ] );
		add_filter( 'wpseo_opengraph_desc', [ $this, 'product_taxonomy_desc_enhancement' ] );
		add_action( 'wpseo_opengraph', [ $this, 'product_enhancement' ], 50 );
		add_action( 'wpseo_add_opengraph_additional_images', [ $this, 'set_opengraph_image' ] );
	}

	/**
	 * Return 'product' when current page is, well... a product.
	 *
	 * @since 1.0
	 *
	 * @param string $type Passed on without changing if not a product.
	 *
	 * @return string
	 */
	public function return_type_product( $type ) {
		if ( is_singular( 'product' ) ) {
			return 'product';
		}

		return $type;
	}

	/**
	 * Make sure the OpenGraph description is put out.
	 *
	 * @since 1.0
	 *
	 * @param string $desc The current description, will be overwritten if we're on a product page.
	 *
	 * @return string
	 */
	public function product_taxonomy_desc_enhancement( $desc ) {

		if ( is_product_taxonomy() ) {
			$term_desc = term_description();

			if ( ! empty( $term_desc ) ) {
				$desc = wp_strip_all_tags( $term_desc, true );
				$desc = strip_shortcodes( $desc );
			}
		}

		return $desc;
	}

	/**
	 * Adds the other product images to the OpenGraph output.
	 *
	 * @since 1.0
	 */
	public function product_enhancement() {
		$product = wc_get_product( get_queried_object_id() );
		if ( ! is_object( $product ) ) {
			return;
		}

		$this->brand( $product );
		$this->price( $product );
		$this->in_stock( $product );
		$this->retailer_item_id( $product );
		$this->product_condition( $product );
	}

	/**
	 * Adds the opengraph images.
	 *
	 * @since 4.3
	 *
	 * @param WPSEO_OpenGraph_Image $opengraph_image The OpenGraph image to use.
	 */
	public function set_opengraph_image( WPSEO_OpenGraph_Image $opengraph_image ) {

		if ( ! function_exists( 'is_product_category' ) || is_product_category() ) {
			global $wp_query;
			$cat          = $wp_query->get_queried_object();
			$thumbnail_id = get_term_meta( $cat->term_id, 'thumbnail_id', true );
			$img_url      = wp_get_attachment_url( $thumbnail_id );
			if ( $img_url ) {
				$opengraph_image->add_image( $img_url );
			}
		}

		$product = wc_get_product( get_queried_object_id() );
		if ( ! is_object( $product ) ) {
			return;
		}

		$img_ids = $product->get_gallery_image_ids();

		if ( is_array( $img_ids ) && $img_ids !== [] ) {
			foreach ( $img_ids as $img_id ) {
				$img_url = wp_get_attachment_url( $img_id );
				$opengraph_image->add_image( $img_url );
			}
		}
	}

	/**
	 * Filter for the namespace, adding the OpenGraph namespace.
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/product/
	 *
	 * @param string $input The input namespace string.
	 *
	 * @return string
	 */
	public function product_namespace( $input ) {
		if ( is_singular( 'product' ) ) {
			$input = preg_replace( '/prefix="([^"]+)"/', 'prefix="$1 product: http://ogp.me/ns/product#"', $input );
		}

		return $input;
	}

	/**
	 * Retrieve the primary and if that doesn't exist first term for the brand taxonomy.
	 *
	 * @param string      $schema_brand The taxonomy the site uses for brands.
	 * @param \WC_Product $product      The product we're finding the brand for.
	 *
	 * @return bool|string The brand name or false on failure.
	 */
	protected function get_brand_term_name( $schema_brand, $product ) {
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

	/**
	 * Add the brand to the OpenGraph output.
	 *
	 * @param WC_Product $product The WooCommerce product object.
	 */
	protected function brand( WC_Product $product ) {
		$schema_brand = WPSEO_Options::get( 'woo_schema_brand' );
		if ( $schema_brand !== '' ) {
			$brand = $this->get_brand_term_name( $schema_brand, $product );
			if ( ! empty( $brand ) ) {
				echo '<meta property="product:brand" content="' . esc_attr( $brand ) . '"/>' . "\n";
			}
		}
	}

	/**
	 * Add the price to the OpenGraph output.
	 *
	 * @param WC_Product $product The WooCommerce product object.
	 */
	protected function price( WC_Product $product ) {
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
			echo '<meta property="product:price:amount" content="' . esc_attr( $product->get_price() ) . '" />' . "\n";
			echo '<meta property="product:price:currency" content="' . esc_attr( get_woocommerce_currency() ) . '" />' . "\n";
		}
	}

	/**
	 * Add the product condition.
	 *
	 * @param WC_Product $product The WooCommerce product object.
	 */
	protected function product_condition( WC_Product $product ) {
		/**
		 * Filter: Yoast\WP\Woocommerce\product_condition - Allow developers to prevent or change the output of the product condition in the OpenGraph tags.
		 *
		 * @param \WC_Product $product The product we're outputting.
		 *
		 * @api string Defaults to 'new'.
		 */
		$product_condition = apply_filters( 'Yoast\WP\Woocommerce\product_condition', 'new', $product );
		if ( ! empty( $product_condition ) ) {
			echo '<meta property="product:condition" content="' . esc_attr( $product_condition ) . '" />' . "\n";
		}
	}

	/**
	 * Add the Item ID.
	 *
	 * @param WC_Product $product The WooCommerce product object.
	 */
	protected function retailer_item_id( WC_Product $product ) {
		echo '<meta property="product:retailer_item_id" content="' . esc_attr( $product->get_sku() ) . '" />' . "\n";
	}

	/**
	 * Add our product stock availability.
	 *
	 * @param WC_Product $product The WooCommerce product object.
	 */
	protected function in_stock( WC_Product $product ) {
		if ( $product->is_in_stock() ) {
			echo '<meta property="product:availability" content="in stock" />' . "\n";
		}
	}
}
