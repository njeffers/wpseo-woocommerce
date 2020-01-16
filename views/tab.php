<div id="yoast_seo" class="panel woocommerce_options_panel">
    <div class="options_group">
        <p class="form-field">
            <label><strong><?php _e( 'Global identifier' ); ?></strong></label>
        </p>
        <p class="form-field">
            <label for="global_identifier_type"><?php _e( 'Type' ); ?></label>
            <span class="wrap">
            <select name="yoast_seo[global_identifier_type]" class="select short" id="global_identifier_type">
				<?php
				foreach ( $global_identifier_types as $type ) {
					$sel = '';
					if ( isset( $global_identifier_type ) && $global_identifier_type == $type ) {
						$sel = ' selected';
					}
					echo '<option' . $sel . '>' . $type . '</option>';
				}
				?>
            </select>
        </span>
        </p>
        <p class="form-field">
            <label for="global_identifier_type"><?php _e( 'Value' ); ?></label>
            <span class="wrap">
                <input type="text" name="yoast_seo[global_identifier_value]" value="<?php esc_attr_e( $global_identifier_value ); ?>"/>
            </span>
        </p>
    </div>
</div>
