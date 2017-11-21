/* global jQuery, tinyMCE, YoastSEO, window.YoastReplaceVarPlugin.ReplaceVar, wpseoWooReplaceVarsL10n */
( function() {
	'use strict';

	var pluginName = 'replaceWooVariablePlugin';
	var ReplaceVar = window.YoastReplaceVarPlugin.ReplaceVar;
	var placeholders = {};

	var modifiableFields = [
		"content",
		"title",
		"snippet_title",
		"snippet_meta",
		"primary_category",
		"data_page_title",
		"data_meta_desc",
	];

	/**
	 * Calculates the price based on the set price and sale price.
	 *
	 * @returns {string} The calculated price.
	 */
	function GetPrice() {
		var regularPrice = parseFloat( jQuery( "#_regular_price" ).val() );
		var salePrice = parseFloat( jQuery( "#_sale_price" ).val() );
		var price = regularPrice;

		if ( salePrice > 0 && salePrice < price ) {
			price = regularPrice - salePrice;
		}

		// Formats the price.
		price = Math.round( price );
		price = price.toFixed( parseInt( wpseoWooReplaceVarsL10n.decimals, 10 ) );
		price = price.toLocaleString( wpseoWooReplaceVarsL10n.locale, { currency: wpseoWooReplaceVarsL10n.currency } );
		return wpseoWooReplaceVarsL10n.currencySymbol + " " +  price;
	}

	/**
	 * Gets the value of the set short description.
	 *
	 * @returns {string} The value of the short description.
	 */
	function GetShortDescription() {
		var productDescription = document.getElementById( 'excerpt' ).value;
		if (typeof tinyMCE !== 'undefined' && tinyMCE.get( 'excerpt') !== null) {
			productDescription = tinyMCE.get( 'excerpt').getContent();
		}

		return productDescription;
	}

	/**
	 * Variable replacement plugin for WordPress.
	 *	 *
	 * @returns {void}
	 */
	var YoastReplaceVarPlugin = function() {
		this._app = YoastSEO.app;
		this._app.registerPlugin( pluginName, { status: "ready" } );

		this.registerReplacements();
		this.registerModifications( this._app );
	};

	/**
	 * Registers all the placeholders and their replacements.
	 *
	 * @returns {void}
	 */
	YoastReplaceVarPlugin.prototype.registerReplacements = function() {
		this.addReplacement( new ReplaceVar( "%%wc_price%%",     "wc_price" ) );
		this.addReplacement( new ReplaceVar( "%%wc_sku%%",       "wc_sku" ) );
		this.addReplacement( new ReplaceVar( "%%wc_shortdesc%%", "wc_shortdesc" ) );
		this.addReplacement( new ReplaceVar( "%%wc_brand%%",     "wc_brand" ) );
	};

	/**
	 * Registers the modifications for the plugin on initial load.
	 *
	 * @param {app} app The app object.
	 *
	 * @returns {void}
	 */
	YoastReplaceVarPlugin.prototype.registerModifications = function( app ) {
		var callback = this.replaceVariables.bind( this );

		for ( var i = 0; i < modifiableFields.length; i++ ) {
			app.registerModification( modifiableFields[ i ], callback, pluginName, 10 );
		}
	};

	/**
	 * Runs the different replacements on the data-string.
	 *
	 * @param {string} data The data that needs its placeholders replaced.
	 * @returns {string} The data with all its placeholders replaced by actual values.
	 */
	YoastReplaceVarPlugin.prototype.replaceVariables = function( data ) {
		if ( typeof data !== "undefined" ) {
			data = data.replace( /%%wc_price%%/g, GetPrice() );
			data = data.replace( /%%wc_sku%%/g, jQuery( '#_sku' ).val() );
			data = data.replace( /%%wc_shortdesc%%/g, GetShortDescription() );

			data = this.replacePlaceholders( data );
		}

		return data;
	};

	/**
	 * Add a replacement object to be used when replacing placeholders.
	 *
	 * @param {ReplaceVar} replacement The replacement to add to the placeholders.
	 *
	 * @returns {void}
	 */
	YoastReplaceVarPlugin.prototype.addReplacement = function( replacement ) {
		placeholders[ replacement.placeholder ] = replacement;
	};

	/**
	 * Declares reloaded with YoastSEO.
	 *
	 * @returns {void}
	 */
	YoastReplaceVarPlugin.prototype.declareReloaded = function() {
		this._app.pluginReloaded( pluginName );
	};

	/**
	 * Replaces placeholder variables with their replacement value.
	 *
	 * @param {string} text The text to have its placeholders replaced.
	 * @returns {string} The text in which the placeholders have been replaced.
	 */
	YoastReplaceVarPlugin.prototype.replacePlaceholders = function( text ) {
		for ( var placeholder in placeholders ) {
			var replaceVar = placeholders[ placeholder ];
			text = text.replace(
				new RegExp( replaceVar.getPlaceholder( true ), "g" ), replaceVar.replacement
			);
		}

		return text;
	};

	/**
	 * Adds event listener to load the Yoast WooCommerce replacevars plugin
	 */
	if ( typeof YoastSEO !== 'undefined' && typeof YoastSEO.app !== 'undefined' ) {
		new YoastReplaceVarPlugin();
	}
	else {
		jQuery( window ).on(
			'YoastSEO:ready',
			function() {
				new YoastReplaceVarPlugin();
			}
		);
	}
}() );