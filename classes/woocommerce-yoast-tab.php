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
	protected $global_identifier_types = [ 'isbn', 'gtin8', 'gtin12', 'gtin13', 'gtin14', 'mpn' ];

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
		echo '<script>console.log(\'tab loading\');</script>';
		$tabs['yoast_tab'] = array(
			'label'  => 'Yoast SEO',
			'class'  => 'yoast-seo',
			'target' => 'yoast_seo',
		);

		return $tabs;
	}

	/**
	 * Outputs our tab content.
	 *
	 * @return void
	 */
	public function add_yoast_seo_fields() {
		$global_identifier_types = $this->global_identifier_types;
		$global_identifier_type  = get_post_meta( get_the_ID(), 'wpseo_global_identifier_type', true );
		$global_identifier_value = get_post_meta( get_the_ID(), 'wpseo_global_identifier_value', true );
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
		foreach ( [ 'global_identifier_type', 'global_identifier_value' ] as $key ) {
			$value = $_POST['yoast_seo'][ $key ];
			if ( $this->validate_data( $key, $value ) ) {
				update_post_meta( $post_id, 'wpseo_' . $key, $value );
			}
		}
	}

	/**
	 * Make sure the data is safe to save.
	 *
	 * @param string $key   The key we're testing.
	 * @param string $value The value we're testing.
	 *
	 * @return bool True when safe, false when it's not.
	 */
	protected function validate_data( $key, $value ) {
		switch ( $key ) {
			case 'global_identifier_type':
				if ( in_array( $value, $this->global_identifier_types ) ) {
					return true;
				}

				return false;
				break;
			case 'global_identifier_value':
				if ( wp_strip_all_tags( $value ) === $value ) {
					return true;
				}

				return false;
			default:
				return false;
				break;
		}
	}
}
