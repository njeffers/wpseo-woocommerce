<?php

namespace Yoast\WP\WooCommerce\Tests\Doubles;

use WPSEO_WooCommerce_Schema;

/**
 * Test Helper Class.
 */
class Schema_Double extends WPSEO_WooCommerce_Schema {

	/**
	 * The schema data we're going to output.
	 *
	 * @var array
	 */
	public $data;

	/**
	 * WooCommerce SEO Options.
	 *
	 * @var array
	 */
	public $options;

	/**
	 * Tries to get the primary term, then the first term, null if none found.
	 *
	 * @param string $taxonomy_name Taxonomy name for the term.
	 * @param int    $post_id       Post ID for the term.
	 *
	 * @return \WP_Term|null The primary term, the first term or null.
	 */
	public function get_primary_term_or_first_term( $taxonomy_name, $post_id ) {
		return parent::get_primary_term_or_first_term( $taxonomy_name, $post_id );
	}

	/**
	 * Retrieves the canonical URL for the current page.
	 *
	 * @return string The canonical URL.
	 */
	public function get_canonical() {
		return parent::get_canonical();
	}
}
