<?php
/**
 * WooCommerce Yoast SEO plugin file.
 *
 * @package WPSEO/WooCommerce
 */

/**
 * Class WPSEO_WooCommerce_Utils
 */
class WPSEO_WooCommerce_Utils {
	/**
	 * Searches for the primary terms for given taxonomies and returns the first found primary term.
	 *
	 * @param array      $brand_taxonomies The taxonomies to find the primary term for.
	 * @param WC_Product $product          The WooCommerce Product.
	 *
	 * @return string The term's name (if found). Otherwise an empty string.
	 */
	public static function search_primary_term( array $brand_taxonomies, $product ) {
		foreach ( $brand_taxonomies as $taxonomy ) {
			$primary_term       = new WPSEO_Primary_Term( $taxonomy, $product->get_id() );
			$found_primary_term = $primary_term->get_primary_term();

			if ( $found_primary_term ) {
				$term = get_term_by( 'id', $found_primary_term, $taxonomy );

				return $term->name;
			}
		}

		return '';
	}
}
