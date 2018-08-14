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

eval("module.exports = yoast.analysis;\n\n//# sourceURL=webpack:///external_%22yoast.analysis%22?");

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var yoastseo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);\n/* harmony import */ var yoastseo__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(yoastseo__WEBPACK_IMPORTED_MODULE_0__);\n/* global YoastSEO, tinyMCE, wpseoWooL10n */\n\n/**\n * Registers Plugin and Test for Yoast WooCommerce.\n *\n * @returns {void}\n */\nfunction YoastWooCommercePlugin() {\n\tYoastSEO.app.registerPlugin( \"YoastWooCommerce\", { status: \"ready\" } );\n\n\tYoastSEO.app.registerAssessment( \"productTitle\", { getResult: this.productDescription.bind( this ) }, \"YoastWooCommerce\" );\n\n\tthis.addCallback();\n\n\tYoastSEO.app.registerPlugin( \"YoastWooCommercePlugin\", { status: \"ready\" } );\n\n\tthis.registerModifications();\n\n\tthis.bindEvents();\n}\n\n/**\n * Adds eventlistener to load the Yoast WooCommerce plugin.\n */\nif( typeof YoastSEO !== \"undefined\" && typeof YoastSEO.app !== \"undefined\" ) {\n\tnew YoastWooCommercePlugin(); // eslint-disable-line no-new\n} else {\n\tjQuery( window ).on(\n\t\t\"YoastSEO:ready\",\n\t\tfunction() {\n\t\t\tnew YoastWooCommercePlugin(); // eslint-disable-line no-new\n\t\t}\n\t);\n}\n\n/**\n * Strip double spaces from text.\n *\n * @param {string} text The text to strip spaces from.\n *\n * @returns {string} The text without double spaces.\n */\nvar stripSpaces = function( text ) {\n\t// Replace multiple spaces with single space\n\ttext = text.replace( /\\s{2,}/g, \" \" );\n\n\t// Replace spaces followed by periods with only the period.\n\ttext = text.replace( /\\s\\./g, \".\" );\n\n\t// Remove first/last character if space\n\ttext = text.replace( /^\\s+|\\s+$/g, \"\" );\n\n\treturn text;\n};\n\n/**\n * Strip HTML-tags from text\n *\n * @param {string} text The text to strip the HTML-tags from.\n *\n * @returns {string} The text without HTML-tags.\n */\nvar stripTags = function( text ) {\n\ttext = text.replace( /(<([^>]+)>)/ig, \" \" );\n\ttext = stripSpaces( text );\n\treturn text;\n};\n\n/**\n * Tests the length of the product description.\n *\n * @returns {Object} An assessment result with the score and formatted text.\n */\nYoastWooCommercePlugin.prototype.productDescription = function() {\n\tvar productDescription = document.getElementById( \"excerpt\" ).value;\n\tif ( typeof tinyMCE !== \"undefined\" && tinyMCE.get( \"excerpt\" ) !== null ) {\n\t\tproductDescription = tinyMCE.get( \"excerpt\" ).getContent();\n\t}\n\n\tproductDescription = stripTags( productDescription );\n\tvar result = this.scoreProductDescription( productDescription.split( \" \" ).length );\n\tvar assessmentResult = new yoastseo__WEBPACK_IMPORTED_MODULE_0__[\"AssessmentResult\"]();\n\tassessmentResult.setScore( result.score );\n\tassessmentResult.setText( result.text );\n\treturn assessmentResult;\n};\n\n/**\n * Returns the score based on the length of the product description.\n *\n * @param {number} length The length of the product description.\n *\n * @returns {{score: number, text: *}} The result object with score and text.\n */\nYoastWooCommercePlugin.prototype.scoreProductDescription = function( length ) {\n\tif ( length === 0 ) {\n\t\treturn {\n\t\t\tscore: 1,\n\t\t\ttext: wpseoWooL10n.woo_desc_none,\n\t\t};\n\t}\n\n\tif ( length > 0 && length < 20 ) {\n\t\treturn {\n\t\t\tscore: 5,\n\t\t\ttext: wpseoWooL10n.woo_desc_short,\n\t\t};\n\t}\n\n\tif ( length >= 20 && length <= 50 ) {\n\t\treturn {\n\t\t\tscore: 9,\n\t\t\ttext: wpseoWooL10n.woo_desc_good,\n\t\t};\n\t}\n\tif ( length > 50 ) {\n\t\treturn {\n\t\t\tscore: 5,\n\t\t\ttext: wpseoWooL10n.woo_desc_long,\n\t\t};\n\t}\n};\n\n/**\n * Adds callback to the excerpt field to trigger the analyzeTimer when product description is updated.\n * The tinyMCE triggers automatically since that inherits the binding from the content field tinyMCE.\n *\n * @returns {void}\n */\nYoastWooCommercePlugin.prototype.addCallback = function() {\n\tvar elem = document.getElementById( \"excerpt\" );\n\tif( elem !== null ) {\n\t\telem.addEventListener( \"input\", YoastSEO.app.analyzeTimer.bind( YoastSEO.app ) );\n\t}\n};\n\n/**\n * Binds events to the add_product_images anchor.\n *\n * @returns {void}\n */\nYoastWooCommercePlugin.prototype.bindEvents = function() {\n\tjQuery( \".add_product_images\" ).find( \"a\" ).on( \"click\", this.bindLinkEvent.bind( this ) );\n};\n\n/**\n * Counters for the setTimeouts, used to make sure we don't end up in an infinite loop.\n *\n * @type {number}\n */\nvar buttonEventCounter = 0;\nvar deleteEventCounter = 0;\n\n/**\n * After the modal dialog is opened, check for the button that adds images to the gallery to trigger\n * the modification.\n *\n * @returns {void}\n */\nYoastWooCommercePlugin.prototype.bindLinkEvent = function() {\n\tif ( jQuery( \".media-modal-content\" ).find( \".media-button\" ).length === 0 ) {\n\t\tbuttonEventCounter++;\n\t\tif ( buttonEventCounter < 10 ) {\n\t\t\tsetTimeout( this.bindLinkEvent.bind( this ) );\n\t\t}\n\t} else {\n\t\tbuttonEventCounter = 0;\n\t\tjQuery( \".media-modal-content\" ).find( \".media-button\" ).on( \"click\", this.buttonCallback.bind( this )  );\n\t}\n};\n\n/**\n * After the gallery is added, call the analyzeTimer of the app, to add the modifications.\n * Also call the bindDeleteEvent, to bind the analyzerTimer when an image is deleted.\n *\n * @returns {void}\n */\nYoastWooCommercePlugin.prototype.buttonCallback = function() {\n\tYoastSEO.app.analyzeTimer();\n\tthis.bindDeleteEvent();\n};\n\n/**\n * Checks if the delete buttons of the added images are available. When they are, bind the analyzeTimer function\n * so when a image is removed, the modification is run.\n *\n * @returns {void}\n */\nYoastWooCommercePlugin.prototype.bindDeleteEvent = function() {\n\tif ( jQuery( \"#product_images_container\" ).find( \".delete\" ).length === 0 ) {\n\t\tdeleteEventCounter++;\n\t\tif ( deleteEventCounter < 10 ) {\n\t\t\tsetTimeout( this.bindDeleteEvent.bind( this ) );\n\t\t}\n\t} else {\n\t\tdeleteEventCounter = 0;\n\t\tjQuery( \"#product_images_container\" ).find( \".delete\" ).on( \"click\", YoastSEO.app.analyzeTimer.bind( YoastSEO.app ) );\n\t}\n};\n\n/**\n * Registers the addImageToContent modification.\n *\n * @returns {void}\n */\nYoastWooCommercePlugin.prototype.registerModifications = function() {\n\tvar callback = this.addImageToContent.bind( this );\n\n\tYoastSEO.app.registerModification( \"content\", callback, \"YoastWooCommercePlugin\", 10 );\n};\n\n/**\n * Adds the images from the page gallery to the content to be analyzed by the analyzer.\n *\n * @param {string} data The data string that does not have the images outer html.\n *\n * @returns {string} The data string parameter with the images outer html.\n */\nYoastWooCommercePlugin.prototype.addImageToContent = function( data ) {\n\tvar images = jQuery( \"#product_images_container\" ).find( \"img\" );\n\n\tfor( var i = 0; i < images.length; i++ ) {\n\t\tdata += images[ i ].outerHTML;\n\t}\n\treturn data;\n};\n\n\n//# sourceURL=webpack:///./js/src/yoastseo-woo-plugin.js?");

/***/ })
/******/ ]);