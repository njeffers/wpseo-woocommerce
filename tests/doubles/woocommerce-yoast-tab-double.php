<?php
/**
 * WooCommerce Yoast SEO plugin file.
 *
 * @package WPSEO/WooCommerce
 */

namespace Yoast\WP\Woocommerce\Tests\Doubles;

use WPSEO_WooCommerce_Yoast_Tab;

/**
 * Class WPSEO_WooCommerce_Yoast_Tab_Double
 */
class WPSEO_WooCommerce_Yoast_Tab_Double extends WPSEO_WooCommerce_Yoast_Tab {

	/**
	 * Make sure the data is safe to save.
	 *
	 * @param string $value The value we're testing.
	 *
	 * @return bool True when safe, false when it's not.
	 */
	public function validate_data( $value ) {
		return parent::validate_data( $value );
	}
}