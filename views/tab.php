<?php
/**
 * WooCommerce Yoast SEO plugin file.
 *
 * @package WPSEO/WooCommerce
 *
 * @global array $global_identifier_types
 * @global array $global_identifier_values
 */

?>
<div id="yoast_seo" class="panel woocommerce_options_panel">
	<div class="options_group">
		<?php
		foreach ( $global_identifier_types as $type => $label ) {
			$value = '';
			if ( isset( $global_identifier_values[ $type ] ) ) {
				$value = $global_identifier_values[ $type ];
			}
		?>
			<p class="form-field">
				<label><?php esc_html_e( $label ); ?>:</label>
				<span class="wrap">
					<input type="text" name="yoast_seo[<?php echo esc_attr( $type ); ?>]" value="<?php echo esc_attr( $value ); ?>"/>
				</span>
			</p>
		<?php
		}
		?>
	</div>
</div>
