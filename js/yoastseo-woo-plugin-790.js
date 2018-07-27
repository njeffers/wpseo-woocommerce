/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = yoast.analysis;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var yoastseo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var yoastseo__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(yoastseo__WEBPACK_IMPORTED_MODULE_0__);
/* global YoastSEO, tinyMCE, wpseoWooL10n */

/**
 * Registers Plugin and Test for Yoast WooCommerce.
 *
 * @returns {void}
 */
function YoastWooCommercePlugin() {
	YoastSEO.app.registerPlugin( "YoastWooCommerce", { status: "ready" } );

	YoastSEO.app.registerAssessment( "productTitle", { getResult: this.productDescription.bind( this ) }, "YoastWooCommerce" );

	this.addCallback();

	YoastSEO.app.registerPlugin( "YoastWooCommercePlugin", { status: "ready" } );

	this.registerModifications();

	this.bindEvents();
}

/**
 * Adds eventlistener to load the Yoast WooCommerce plugin.
 */
if( typeof YoastSEO !== "undefined" && typeof YoastSEO.app !== "undefined" ) {
	new YoastWooCommercePlugin(); // eslint-disable-line no-new
} else {
	jQuery( window ).on(
		"YoastSEO:ready",
		function() {
			new YoastWooCommercePlugin(); // eslint-disable-line no-new
		}
	);
}

/**
 * Strip double spaces from text.
 *
 * @param {string} text The text to strip spaces from.
 *
 * @returns {string} The text without double spaces.
 */
var stripSpaces = function( text ) {
	// Replace multiple spaces with single space
	text = text.replace( /\s{2,}/g, " " );

	// Replace spaces followed by periods with only the period.
	text = text.replace( /\s\./g, "." );

	// Remove first/last character if space
	text = text.replace( /^\s+|\s+$/g, "" );

	return text;
};

/**
 * Strip HTML-tags from text
 *
 * @param {string} text The text to strip the HTML-tags from.
 *
 * @returns {string} The text without HTML-tags.
 */
var stripTags = function( text ) {
	text = text.replace( /(<([^>]+)>)/ig, " " );
	text = stripSpaces( text );
	return text;
};

/**
 * Tests the length of the product description.
 *
 * @returns {Object} An assessment result with the score and formatted text.
 */
YoastWooCommercePlugin.prototype.productDescription = function() {
	var productDescription = document.getElementById( "excerpt" ).value;
	if ( typeof tinyMCE !== "undefined" && tinyMCE.get( "excerpt" ) !== null ) {
		productDescription = tinyMCE.get( "excerpt" ).getContent();
	}

	productDescription = stripTags( productDescription );
	var result = this.scoreProductDescription( productDescription.split( " " ).length );
	var assessmentResult = new yoastseo__WEBPACK_IMPORTED_MODULE_0__["AssessmentResult"]();
	assessmentResult.setScore( result.score );
	assessmentResult.setText( result.text );
	return assessmentResult;
};

/**
 * Returns the score based on the length of the product description.
 *
 * @param {number} length The length of the product description.
 *
 * @returns {{score: number, text: *}} The result object with score and text.
 */
YoastWooCommercePlugin.prototype.scoreProductDescription = function( length ) {
	if ( length === 0 ) {
		return {
			score: 1,
			text: wpseoWooL10n.woo_desc_none,
		};
	}

	if ( length > 0 && length < 20 ) {
		return {
			score: 5,
			text: wpseoWooL10n.woo_desc_short,
		};
	}

	if ( length >= 20 && length <= 50 ) {
		return {
			score: 9,
			text: wpseoWooL10n.woo_desc_good,
		};
	}
	if ( length > 50 ) {
		return {
			score: 5,
			text: wpseoWooL10n.woo_desc_long,
		};
	}
};

/**
 * Adds callback to the excerpt field to trigger the analyzeTimer when product description is updated.
 * The tinyMCE triggers automatically since that inherits the binding from the content field tinyMCE.
 *
 * @returns {void}
 */
YoastWooCommercePlugin.prototype.addCallback = function() {
	var elem = document.getElementById( "excerpt" );
	if( elem !== null ) {
		elem.addEventListener( "input", YoastSEO.app.analyzeTimer.bind( YoastSEO.app ) );
	}
};

/**
 * Binds events to the add_product_images anchor.
 *
 * @returns {void}
 */
YoastWooCommercePlugin.prototype.bindEvents = function() {
	jQuery( ".add_product_images" ).find( "a" ).on( "click", this.bindLinkEvent.bind( this ) );
};

/**
 * Counters for the setTimeouts, used to make sure we don't end up in an infinite loop.
 *
 * @type {number}
 */
var buttonEventCounter = 0;
var deleteEventCounter = 0;

/**
 * After the modal dialog is opened, check for the button that adds images to the gallery to trigger
 * the modification.
 *
 * @returns {void}
 */
YoastWooCommercePlugin.prototype.bindLinkEvent = function() {
	if ( jQuery( ".media-modal-content" ).find( ".media-button" ).length === 0 ) {
		buttonEventCounter++;
		if ( buttonEventCounter < 10 ) {
			setTimeout( this.bindLinkEvent.bind( this ) );
		}
	} else {
		buttonEventCounter = 0;
		jQuery( ".media-modal-content" ).find( ".media-button" ).on( "click", this.buttonCallback.bind( this )  );
	}
};

/**
 * After the gallery is added, call the analyzeTimer of the app, to add the modifications.
 * Also call the bindDeleteEvent, to bind the analyzerTimer when an image is deleted.
 *
 * @returns {void}
 */
YoastWooCommercePlugin.prototype.buttonCallback = function() {
	YoastSEO.app.analyzeTimer();
	this.bindDeleteEvent();
};

/**
 * Checks if the delete buttons of the added images are available. When they are, bind the analyzeTimer function
 * so when a image is removed, the modification is run.
 *
 * @returns {void}
 */
YoastWooCommercePlugin.prototype.bindDeleteEvent = function() {
	if ( jQuery( "#product_images_container" ).find( ".delete" ).length === 0 ) {
		deleteEventCounter++;
		if ( deleteEventCounter < 10 ) {
			setTimeout( this.bindDeleteEvent.bind( this ) );
		}
	} else {
		deleteEventCounter = 0;
		jQuery( "#product_images_container" ).find( ".delete" ).on( "click", YoastSEO.app.analyzeTimer.bind( YoastSEO.app ) );
	}
};

/**
 * Registers the addImageToContent modification.
 *
 * @returns {void}
 */
YoastWooCommercePlugin.prototype.registerModifications = function() {
	var callback = this.addImageToContent.bind( this );

	YoastSEO.app.registerModification( "content", callback, "YoastWooCommercePlugin", 10 );
};

/**
 * Adds the images from the page gallery to the content to be analyzed by the analyzer.
 *
 * @param {string} data The data string that does not have the images outer html.
 *
 * @returns {string} The data string parameter with the images outer html.
 */
YoastWooCommercePlugin.prototype.addImageToContent = function( data ) {
	var images = jQuery( "#product_images_container" ).find( "img" );

	for( var i = 0; i < images.length; i++ ) {
		data += images[ i ].outerHTML;
	}
	return data;
};


/***/ })
/******/ ]);