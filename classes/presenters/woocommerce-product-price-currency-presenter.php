<?php
/**
 * WooCommerce Yoast SEO plugin file.
 *
 * @package WPSEO/WooCommerce
 */

use WPSEO_WooCommerce_Abstract_Product_Presenter;

/**
 * Represents the product's price currency.
 */
class WPSEO_WooCommerce_Product_Price_Currency_Presenter extends WPSEO_WooCommerce_Abstract_Product_Presenter {

	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = '<meta property="product:price:currency" content="%s" />';

	/**
	 * Gets the raw value of a presentation.
	 *
	 * @return string The raw value.
	 */
	public function get() {
		return get_woocommerce_currency();
	}
}
