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

	/**
	 * WPSEO_WooCommerce_Schema constructor.
	 */
	public function __construct() {
		add_filter( 'woocommerce_structured_data_product', array( $this, 'change_main_entity' ) );
		add_filter( 'woocommerce_structured_data_type_for_page', array( $this, 'remove_woo_breadcrumbs' ) );
		add_filter( 'wpseo_schema_webpage', array( $this, 'change_page_type' ) );
	}

	/**
	 * Changes the WebPage output to point to Product as the main entity.
	 *
	 * @param array $data Product Schema data.
	 *
	 * @return array $data Product Schema data.
	 */
	public function change_main_entity( $data ) {
		$data['mainEntityOfPage'] = array(
			'@id' => WPSEO_Frontend::get_instance()->canonical( false ) . WPSEO_Schema_IDs::WEBPAGE_HASH,
		);

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
	 * Change the page type on applicable pages.
	 *
	 * @param array $data WebPage Schema data.
	 *
	 * @return array $data WebPage Schema data.
	 */
	public function change_page_type( $data ) {
		if ( is_product() ) {
			$data['@type'] = 'ItemPage';
		}
		if ( is_checkout() || is_checkout_pay_page() ) {
			$data['$type'] = 'CheckoutPage';
		}
		return $data;
	}
}
