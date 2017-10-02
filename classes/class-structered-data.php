<?php

class WPSEO_Structured_Data {

	private $woo_structured_data = null;

	public function __construct() {
		add_action( 'init', array( $this, 'init' ), 11 );
		add_action( 'wp_footer', array( $this, 'output_structured_data' ) );

	}

	public function init() {
		$this->woo_structured_data = WC()->structured_data;

		remove_action( 'wp_footer', array( $this->woo_structured_data, 'output_structured_data' ) );
	}

	protected function get_structured_data() {
		$original_data = $this->woo_structured_data->get_structured_data( array() );

		$this->enhance_data( $original_data );
	}

	private function get_product_data( $data ) {
		return array_filter( $data, function( $item ) {
			return $item['@type'] === 'Product';
		} );
	}

	protected function extract_description_from_offer( $offers ) {
		// Only get the description from the first offer.
		$description = '';

		foreach( $offers as $offer_key => $offer ) {
			if ( $offer['description'] !== '' && $description === '' ) {
				$description = $offer['description'];
			}
		}

		return $description;
	}

	private function cleanup_offers( $offers ) {
		foreach ( $offers as $offer_key => $offer ) {
			unset( $offers[$offer_key]['description'] );
		}

		return $offers;
	}

	protected function get_offers( $schema_data ) {
		if ( ! array_key_exists( 'offers', $schema_data ) ) {
			return array();
		}

		return $schema_data['offers'];
	}

	protected function enhance_data( $data ) {
		$graph = $data['@graph'];

		$product_data  = $this->get_product_data( $graph );
		$product_index = key( $product_data );

		$new_product   = $product_data[$product_index];

//		unset( $data["@graph"][$product_index] );

		$offers = $this->get_offers( $new_product );

		$new_product['description'] = $this->extract_description_from_offer( $offers );
		$new_product['offers'] = $this->cleanup_offers( $offers );

		$graph[$product_index] = $new_product;

		foreach( $graph as $key => $value ) {
			var_dump($value['name']);
		}

		die;

		$this->woo_structured_data->set_data(
			apply_filters( 'woocommerce_structured_data_product', $graph, new WC_Product( get_the_ID() ) ), true
		);

//		$product_data = $this->offers(  );

		// brand -> type thing
		// manufacturer

		// GTIN/GTIN8,13,14/MPN
		// itemcondition
		// move description from offer to Product
		// category
		// color
		// Related
		// Upsell
		// dimensions / weight
		// Variations

		// multi-currency + prices
	}

	public function output_structured_data() {
		$this->get_structured_data();

		$this->woo_structured_data->output_structured_data();

//		printf( '<script type="ld+json">%s</script>', wp_json_encode( wc_clean( $this->get_structured_data() ) ) );
	}


}
