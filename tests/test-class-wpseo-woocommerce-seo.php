<?php

class Test_Yoast_WooCommerce_SEO extends WPSEO_WooCommerce_UnitTestCase {

    /**
     * Make sure 'register_i18n_promo_class' function is called.
     *
     * @covers Yoast_WooCommerce_SEO::__construct
     */
    public function test_call_i18n_module(){
        $class_instance = $this->getMock( 'Yoast_WooCommerce_SEO', array( 'register_i18n_promo_class' ) );

        $class_instance->expects( $this->once() )
            ->method( 'register_i18n_promo_class' );

        $class_instance->__construct();
    }

}