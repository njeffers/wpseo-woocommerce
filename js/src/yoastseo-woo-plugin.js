/* global jQuery, tinyMCE, YoastSEO, YoastReplaceVarPlugin */

(function() {

	var debounce = require( 'lodash/debounce' );

	var AssessmentResult = require( 'yoastseo/js/values/AssessmentResult' );

	var inputDebounceDelay = 400;

	/**
	 * Adds eventlistener to load the Yoast WooCommerce plugin
	 */
	if ( typeof YoastSEO !== 'undefined' && typeof YoastSEO.app !== 'undefined' ) {
		new YoastWooCommercePlugin();
	}
	else {
		jQuery( window ).on(
			'YoastSEO:ready',
			function() {
				new YoastWooCommercePlugin();
			}
		);
	}

	/**
	 * Registers Plugin and Test for Yoast WooCommerce.
	 */
	function YoastWooCommercePlugin() {
		YoastSEO.app.registerPlugin( 'YoastWooCommerce', { 'status': 'ready' } );

		YoastSEO.app.registerAssessment( 'productTitle', { getResult: this.productDescription.bind( this ) }, 'YoastWooCommerce' );

		this.addCallback();

		YoastSEO.app.registerPlugin( 'YoastWooCommercePlugin', { status: 'ready' } );

		this.registerModifications();

		this.addReplacements();

		this.bindEvents();
	}

	/**
	 * Tests the length of the productdescription.
	 * @param {object} paper The paper to run this assessment on
	 * @param {object} researcher The researcher used for the assessment
	 * @param {object} i18n The i18n-object used for parsing translations
	 * @returns {object} an assessmentresult with the score and formatted text.
	 */
	YoastWooCommercePlugin.prototype.productDescription = function( paper, researcher, i18n ) {
		var productDescription = this.getShortDesc();

		var result = this.scoreProductDescription( productDescription.split( ' ' ).length );
		var assessmentResult = new AssessmentResult();
		assessmentResult.setScore( result.score );
		assessmentResult.setText( result.text );
		return assessmentResult;
	};

	/**
	 * Returns the score based on the lengt of the product description.
	 * @param {number} length The length of the product description.
	 * @returns {{score: number, text: *}} The result object with score and text.
	 */
	YoastWooCommercePlugin.prototype.scoreProductDescription = function( length ) {

		if ( length === 0 ) {
			return {
				score: 1,
				text: wpseoWooL10n.woo_desc_none
			};
		}

		if ( length > 0 && length < 20 ) {
			return {
				score: 5,
				text: wpseoWooL10n.woo_desc_short
			};
		}

		if ( length >= 20 && length <= 50 ) {
			return {
				score: 9,
				text: wpseoWooL10n.woo_desc_good
			};
		}
		if ( length > 50 ) {
			return {
				score: 5,
				text: wpseoWooL10n.woo_desc_long
			};
		}
	};

	/**
	 * Adds callback to the excerpt field to trigger the analyzeTimer when product description is updated.
	 * The tinyMCE triggers automatically since that inherets the binding from the content field tinyMCE.
	 */
	YoastWooCommercePlugin.prototype.addCallback = function() {
		jQuery( '#excerpt' ).on( 'input', YoastSEO.app.analyzeTimer.bind( YoastSEO.app ) );
	};

	/**
	 * binds events to the add_product_images anchor and product inputs.
	 */
	YoastWooCommercePlugin.prototype.bindEvents = function() {
		jQuery( '.add_product_images' ).find( 'a' ).on( 'click', this.bindLinkEvent.bind( this ) );

		jQuery( '#_regular_price' ).on( 'input', debounce( this.updatePrice.bind( this ), inputDebounceDelay ) );
		jQuery( '._sku_field input' ).on( 'input', debounce( this.updateSKU.bind( this ), inputDebounceDelay ) );
        jQuery( '#excerpt' ).on( 'input', debounce( this.updateShortDesc.bind( this ), inputDebounceDelay ) );
		jQuery( '#taxonomy-pwb-brand' ).on( 'click', debounce( this.updateBrand.bind( this ), inputDebounceDelay ) );
		YoastSEO.wp._tinyMCEHelper.addEventHandler( 'excerpt', [ 'input', 'change', 'cut', 'paste' ],
			debounce( this.updateShortDesc.bind( this ), inputDebounceDelay ) );
	};

	/**
	 * counters for the setTimeouts, used to make sure we don't end up in an infinite loop.
	 * @type {number}
	 */
	var buttonEventCounter = 0;
	var deleteEventCounter = 0;

	/**
	 * after the modal dialog is opened, check for the button that adds images to the gallery to trigger
	 * the modification.
	 */
	YoastWooCommercePlugin.prototype.bindLinkEvent = function() {
		if (jQuery( '.media-modal-content' ).find( '.media-button' ).length === 0 ) {
			buttonEventCounter++;
			if ( buttonEventCounter < 10 ) {
				setTimeout( this.bindLinkEvent.bind( this ) );
			}
		} else {
			buttonEventCounter = 0;
			jQuery( '.media-modal-content' ).find( '.media-button' ).on( 'click', this.buttonCallback.bind( this )  );
		}
	};

	/**
	 * After the gallery is added, call the analyzeTimer of the app, to add the modifications.
	 * Also call the bindDeleteEvent, to bind the analyzerTimer when an image is deleted.
	 */
	YoastWooCommercePlugin.prototype.buttonCallback = function() {
		YoastSEO.app.analyzeTimer();
		this.bindDeleteEvent();
	};

	/**
	 * Checks if the delete buttons of the added images are available. When they are, bind the analyzeTimer function
	 * so when a image is removed, the modification is run.
	 */
	YoastWooCommercePlugin.prototype.bindDeleteEvent = function() {
		if ( jQuery( '#product_images_container' ).find( '.delete' ).length === 0 ){
			deleteEventCounter++;
			if ( deleteEventCounter < 10 ) {
				setTimeout( this.bindDeleteEvent.bind( this ) );
			}
		} else {
			deleteEventCounter = 0;
			jQuery( '#product_images_container' ).find( '.delete' ).on( 'click', YoastSEO.app.analyzeTimer.bind( YoastSEO.app ) );
		}
	};

	/**
	 * Registers the addImageToContent modification
	 */
	YoastWooCommercePlugin.prototype.registerModifications = function() {
		var callback = this.addImageToContent.bind( this );

		YoastSEO.app.registerModification( 'content', callback, 'YoastWooCommercePlugin', 10 );
	};

	/**
	 * Returns the product's price from the DOM
	 */
	YoastWooCommercePlugin.prototype.getPrice = function () {
		return jQuery( '#_regular_price' ).val() || ""
	};

	/**
	 * Updates the Yoast SEO snippet Preview with the new price.
	 */
	YoastWooCommercePlugin.prototype.updatePrice = function () {
		this.priceReplaceVar.replacement = this.getPrice();
		YoastSEO.app.refresh();
	};

	/**
	 * Returns the product's sku from the DOM
	 */
	YoastWooCommercePlugin.prototype.getSKU = function () {
		return jQuery( "._sku_field input" ).val() || ""
	};

	/**
	 * Updates the Yoast SEO snippet Preview with the new sku.
	 */
	YoastWooCommercePlugin.prototype.updateSKU = function () {
		this.skuReplaceVar.replacement = this.getSKU();
		YoastSEO.app.refresh();
	};

	/**
	 * Returns the product's short description from the DOM
	 */
	YoastWooCommercePlugin.prototype.getShortDesc = function () {
		if (typeof tinyMCE !== 'undefined' && tinyMCE.get( 'excerpt' ) !== null) {
			return jQuery( jQuery.parseHTML( tinyMCE.get( 'excerpt' ).getContent() ) ).text();
		}
		return jQuery( '#excerpt' ).val();
	};

	/**
	 * Updates the Yoast SEO snippet Preview with the new short description.
	 */
	YoastWooCommercePlugin.prototype.updateShortDesc = function () {
		this.shortDescReplaceVar.replacement = this.getShortDesc();
		YoastSEO.app.refresh();
	};

    /**
     * Returns the product's Official WooCommerce Brands brand from the DOM
     */
    YoastWooCommercePlugin.prototype.getWooBrand = function () {

    }


    /**
     * Returns the product's Perfect WooCommerce Brands brand from the DOM
     */
    YoastWooCommercePlugin.prototype.getPWBBrand = function () {
        // Check if we're dealing with Perfect WooCommerce Brands.
        var pwbContainer = jQuery( '#taxonomy-pwb-brand' );
        if (pwbContainer.length > 0) {
            // Select the primary brand from multiple Perfect WooCommerce Brands.
            var primaryBrand = pwbContainer.find('.wpseo-primary-term .selectit');
            if (primaryBrand.length > 0) {
                return primaryBrand.text().trim().split(/\s+/)[0];
            }
            // Select a single Perfect WooCommerce Brand if only one is selected.
            var onlyBrand = pwbContainer.find('[name="tax_input[pwb-brand][]"]:checked');
            if (onlyBrand.length === 1) {
                return onlyBrand.parent().text().trim().split(/\s+/)[0];
            }
        }
    }

	/**
	 * Returns the product's brand from the DOM
	 */
	YoastWooCommercePlugin.prototype.getBrand = function () {
		return this.getWooBrand() || this.getPWBBrand() || "";
	};

	/**
	 * Updates the Yoast SEO snippet Preview with the new brand.
	 */
	YoastWooCommercePlugin.prototype.updateBrand = function () {
		this.brandReplaceVar.replacement = this.getBrand();
		YoastSEO.app.refresh();
	};

	/**
	 * Adds replacements for WooCommerce price, SKU, short description and brand variables.
	 */
	YoastWooCommercePlugin.prototype.addReplacements = function () {
		var ReplaceVar = YoastReplaceVarPlugin.ReplaceVar;

		// Compatibility with older version of YoastSeo which do not expose the ReplaceVar class.
		if (ReplaceVar === undefined) {
			return;
		}

		// Define the ReplaceVar objects, hold them in memory so we can update them when the DOM changes.
		this.priceReplaceVar = new ReplaceVar( '%%wc_price%%', this.getPrice(), { source: 'direct' } );
		this.skuReplaceVar = new ReplaceVar( '%%wc_sku%%', this.getSKU(), { source: 'direct' } );
		this.shortDescReplaceVar = new ReplaceVar( '%%wc_shortdesc%%', this.getShortDesc(), { source: 'direct' } );
		this.brandReplaceVar = new ReplaceVar( '%%wc_brand%%', this.getBrand(), { source: 'direct' } );

		// Add our ReplaceVar objects to the ReplaceVarsPlugin.
		YoastSEO.wp.replaceVarsPlugin.addReplacement( this.priceReplaceVar );
		YoastSEO.wp.replaceVarsPlugin.addReplacement( this.skuReplaceVar );
		YoastSEO.wp.replaceVarsPlugin.addReplacement( this.shortDescReplaceVar );
		YoastSEO.wp.replaceVarsPlugin.addReplacement( this.brandReplaceVar );
	}

	/**
	 * Adds the images from the pagegallery to the content to be analyzed by the analyzer.
	 * @param data {String}
	 * @returns {String}
	 */
	YoastWooCommercePlugin.prototype.addImageToContent = function( data ) {
		var images = jQuery( '#product_images_container' ).find( 'img' );

		for (var i = 0; i < images.length; i++ ){
			data += images[ i ].outerHTML;
		}
		return data;
	};
}
());
