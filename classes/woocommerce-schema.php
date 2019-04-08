<?php
/**
 * WooCommerce Yoast SEO plugin file.
 *
 * @package WPSEO/WooCommerce
 */

/**
 * Class WPSEO_WooCommerce_Schema
 */
class WPSEO_WooCommerce_Schema {
	const PRODUCT_HASH = '#product';

	/**
	 * WPSEO_WooCommerce_Schema constructor.
	 */
	public function __construct() {
		add_filter( 'woocommerce_structured_data_review', array( $this, 'change_reviewed_entity' ) );
		add_filter( 'woocommerce_structured_data_product', array( $this, 'change_product' ) );
		add_filter( 'woocommerce_structured_data_type_for_page', array( $this, 'remove_woo_breadcrumbs' ) );
		add_filter( 'wpseo_schema_webpage', array( $this, 'filter_webpage' ) );
	}

	/**
	 * Changes the WebPage output to point to Product as the main entity.
	 *
	 * @param array $data Product Schema data.
	 *
	 * @return array $data Product Schema data.
	 */
	public function filter_webpage( $data ) {
		if ( is_product() ) {
			$data['@type'] = 'ItemPage';
		}
		if ( is_checkout() || is_checkout_pay_page() ) {
			$data['@type'] = 'CheckoutPage';
		}

		$data['mainEntity'] = $this->return_product_reference();

		return $data;
	}

	/**
	 * Changes the Review output to point to Product as the reviewed Item.
	 *
	 * @param array $data Review Schema data.
	 *
	 * @return array $data Review Schema data.
	 */
	public function change_reviewed_entity( $data ) {
		$data['itemReviewed'] = $this->return_product_reference();

		return $data;
	}

	/**
	 * Filter Schema Product data to work.
	 *
	 * @param array $data Schema Product data.
	 *
	 * @return array $data Schema Product data.
	 */
	public function change_product( $data ) {
		// Make seller refer to the Organization.
		foreach( $data['offers'] as $key => $val ) {
			$data['offers'][$key]['seller'] = array(
				'@id' => trailingslashit( WPSEO_Utils::get_home_url() ) . WPSEO_Schema_IDs::ORGANIZATION_HASH
			);
		}

		// This review data always only contains the first review for a product and is therefor useless.
		unset( $data['review'] );

		return $data;
	}

	/**
	 * Removes the Woo Breadcrumbs from their Schema output.
	 *
	 * @param array $types Types of Schema Woo will render.
	 *
	 * @return array $types Types of Schema Woo will render.
	 */
	public function remove_woo_breadcrumbs( $types ) {
		foreach ( $types as $key => $type ) {
			if ( $type === 'breadcrumblist' ) {
				unset( $types[ $key ] );
			}
		}

		return $types;
	}

	/**
	 * Returns a reference to the Product.
	 *
	 * @return array Reference to the product.
	 */
	private function return_product_reference() {
		return array(
			'@id' => WPSEO_Frontend::get_instance()->canonical( false ) . self::PRODUCT_HASH,
		);
	}
}
