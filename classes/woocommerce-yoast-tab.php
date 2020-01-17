<?php
/**
 * WooCommerce Yoast SEO plugin file.
 *
 * @package WPSEO/WooCommerce
 */

/**
 * Class WPSEO_WooCommerce_Yoast_Tab
 */
class WPSEO_WooCommerce_Yoast_Tab {

	/**
	 * The array of allowed identifier types.
	 *
	 * @var array
	 */
	protected $global_identifier_types = [
		'gtin8'  => 'GTIN8',
		'gtin12' => 'GTIN12 / UPC',
		'gtin13' => 'GTIN13 / EAN',
		'gtin14' => 'GTIN14 / ITF-14',
		'isbn'   => 'ISBN',
		'mpn'    => 'MPN',
	];

	/**
	 * WPSEO_WooCommerce_Yoast_Tab constructor.
	 */
	public function __construct() {
		add_filter( 'woocommerce_product_data_tabs', [ $this, 'yoast_seo_tab' ] );
		add_action( 'woocommerce_product_data_panels', [ $this, 'add_yoast_seo_fields' ] );
		add_action( 'save_post', [ $this, 'save_data' ] );
	}

	/**
	 * Adds the Yoast SEO product tab.
	 *
	 * @param array $tabs The current product data tabs.
	 *
	 * @return array
	 */
	public function yoast_seo_tab( $tabs ) {
		$tabs['yoast_tab'] = [
			'label'  => 'Yoast SEO',
			'class'  => 'yoast-seo',
			'target' => 'yoast_seo',
		];

		return $tabs;
	}

	/**
	 * Outputs our tab content.
	 *
	 * @return void
	 */
	public function add_yoast_seo_fields() {
		$global_identifier_types  = $this->global_identifier_types;
		$global_identifier_values = get_post_meta( get_the_ID(), 'wpseo_global_identifier_values', true );
		require plugin_dir_path( WPSEO_WOO_PLUGIN_FILE ) . 'views/tab.php';
	}

	/**
	 * Save the $_POST values from our tab.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return void
	 */
	public function save_data( $post_id ) {
		if ( wp_is_post_revision( $post_id ) ) {
			return;
		}
		$values = [];
		foreach ( $this->global_identifier_types as $key => $label ) {
			$value = $_POST['yoast_seo'][ $key ];
			if ( ! array_key_exists( $key, $this->global_identifier_types ) ) {
				continue;
			}
			if ( $this->validate_data( $value ) ) {
				$values[ $key ] = $value;
			}
		}

		if ( $values !== [] ) {
			update_post_meta( $post_id, 'wpseo_global_identifier_values', $values );
		}
	}

	/**
	 * Make sure the data is safe to save.
	 *
	 * @param string $value The value we're testing.
	 *
	 * @return bool True when safe and not empty, false when it's not.
	 */
	protected function validate_data( $value ) {
		if ( empty( $value ) ) {
			return false;
		}
		if ( wp_strip_all_tags( $value ) !== $value ) {
			return false;
		}

		return true;
	}
}
