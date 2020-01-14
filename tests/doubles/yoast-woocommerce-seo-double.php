<?php

namespace Yoast\WP\Woocommerce\Tests\Doubles;

use Yoast_WooCommerce_Dependencies;

/**
 * Test Helper Class.
 */
class Yoast_WooCommerce_Dependencies_Double extends Yoast_WooCommerce_Dependencies {
	/**
	 * @inheritDoc
	 */
	public function check_dependencies( $wp_version ) {
		return parent::check_dependencies( $wp_version );
	}

	/**
	 * @inheritDoc
	 */
	public function get_wordpress_seo_version() {
		return parent::get_wordpress_seo_version();
	}

	/**
	 * @inheritDoc
	 */
	public function check_woocommerce_exists() {
		return parent::check_woocommerce_exists();
	}
}
