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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}

module.exports = isUndefined;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash_isUndefined__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var lodash_isUndefined__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_isUndefined__WEBPACK_IMPORTED_MODULE_0__);
/* global YoastSEO, wpseoWooL10n, tinyMCE */



const PLUGIN_NAME = "YoastWooCommerce";

/**
 * Counters for the setTimeouts, used to make sure we don't end up in an infinite loop.
 *
 * @type {number}
 */
var buttonEventCounter = 0;
var deleteEventCounter = 0;

class YoastWooCommercePlugin {
	/**
	 * Registers Plugin and Test for Yoast WooCommerce.
	 *
	 * @returns {void}
	 */
	constructor() {
		this.loadWorkerScript();

		YoastSEO.app.registerPlugin( "YoastWooCommercePlugin", { status: "ready" } );

		this.registerModifications();

		this.bindEvents();
	}

	/**
	 * Loads our worker script into the analysis worker.
	 *
	 * @returns {void}
	 */
	loadWorkerScript() {
		if ( typeof YoastSEO === "undefined" || typeof YoastSEO.analysis === "undefined" || typeof YoastSEO.analysis.worker === "undefined" ) {
			return;
		}

		const worker = YoastSEO.analysis.worker;
		const productDescription = YoastWooCommercePlugin.getProductDescription();

		worker.loadScript( wpseoWooL10n.script_url )
			.then( () => worker.sendMessage( "initialize", { l10n: wpseoWooL10n, productDescription }, PLUGIN_NAME ) )
			.then( YoastSEO.app.refresh );

		this.addExcerptEventHandler( worker );
	}

	/**
	 * Adds an event handler to the excerpt field to send a new product description to the worker.
	 *
	 * @param {AnalysisWebWorker} worker The worker to the the message to.
	 *
	 * @returns {void}
	 */
	addExcerptEventHandler( worker ) {
		if ( lodash_isUndefined__WEBPACK_IMPORTED_MODULE_0___default()( tinyMCE ) ) {
			return;
		}

		const excerptElement = tinyMCE.get( "excerpt" );
		if ( ! excerptElement ) {
			return;
		}

		excerptElement.on( "change", () => this.handleProductDescriptionChange( worker ) );
		excerptElement.on( "input", () => this.handleProductDescriptionChange( worker ) );
	}

	/**
	 * Sends a new product description to the worker.
	 *
	 * @param {AnalysisWebWorker} worker The worker to the the message to.
	 *
	 * @returns {void}
	 */
	handleProductDescriptionChange( worker ) {
		const excerpt = YoastWooCommercePlugin.getProductDescription();

		worker.sendMessage( "updateProductDescription", excerpt, PLUGIN_NAME );

		YoastSEO.app.refresh();
	}

	/**
	 * Retrieves the product description from the DOM element.
	 *
	 * @returns {string} The value of the production description.
	 */
	static getProductDescription() {
		if ( lodash_isUndefined__WEBPACK_IMPORTED_MODULE_0___default()( tinyMCE ) ) {
			return;
		}

		const excerptElement = tinyMCE.get( "excerpt" );
		if ( ! excerptElement ) {
			return;
		}

		return excerptElement.getContent();
	}

	/**
	 * Binds events to the add_product_images anchor.
	 *
	 * @returns {void}
	 */
	bindEvents() {
		jQuery( ".add_product_images" ).find( "a" ).on( "click", this.bindLinkEvent.bind( this ) );
	}

	/**
	 * After the modal dialog is opened, check for the button that adds images to the gallery to trigger
	 * the modification.
	 *
	 * @returns {void}
	 */
	bindLinkEvent() {
		if ( jQuery( ".media-modal-content" ).find( ".media-button" ).length === 0 ) {
			buttonEventCounter++;
			if ( buttonEventCounter < 10 ) {
				setTimeout( this.bindLinkEvent.bind( this ) );
			}
		} else {
			buttonEventCounter = 0;
			jQuery( ".media-modal-content" ).find( ".media-button" ).on( "click", this.buttonCallback.bind( this )  );
		}
	}

	/**
	 * After the gallery is added, call the analyzeTimer of the app, to add the modifications.
	 * Also call the bindDeleteEvent, to bind the analyzerTimer when an image is deleted.
	 *
	 * @returns {void}
	 */
	buttonCallback() {
		YoastSEO.app.analyzeTimer();
		this.bindDeleteEvent();
	}

	/**
	 * Checks if the delete buttons of the added images are available. When they are, bind the analyzeTimer function
	 * so when a image is removed, the modification is run.
	 *
	 * @returns {void}
	 */
	bindDeleteEvent() {
		if ( jQuery( "#product_images_container" ).find( ".delete" ).length === 0 ) {
			deleteEventCounter++;
			if ( deleteEventCounter < 10 ) {
				setTimeout( this.bindDeleteEvent.bind( this ) );
			}
		} else {
			deleteEventCounter = 0;
			jQuery( "#product_images_container" ).find( ".delete" ).on( "click", YoastSEO.app.analyzeTimer.bind( YoastSEO.app ) );
		}
	}

	/**
	 * Registers the addImageToContent modification.
	 *
	 * @returns {void}
	 */
	registerModifications() {
		var callback = this.addImageToContent.bind( this );

		YoastSEO.app.registerModification( "content", callback, "YoastWooCommercePlugin", 10 );
	}

	/**
	 * Adds the images from the page gallery to the content to be analyzed by the analyzer.
	 *
	 * @param {string} data The data string that does not have the images outer html.
	 *
	 * @returns {string} The data string parameter with the images outer html.
	 */
	addImageToContent( data ) {
		var images = jQuery( "#product_images_container" ).find( "img" );

		for( var i = 0; i < images.length; i++ ) {
			data += images[ i ].outerHTML;
		}
		return data;
	}
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


/***/ })
/******/ ]);