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
/* 0 */,
/* 1 */
/***/ (function(module, exports) {

eval("/* global jQuery, tinyMCE, YoastSEO, wpseoWooReplaceVarsL10n */\nvar pluginName = \"replaceWooVariablePlugin\";\nvar ReplaceVar = window.YoastReplaceVarPlugin && window.YoastReplaceVarPlugin.ReplaceVar;\nvar placeholders = {};\n\nvar modifiableFields = [\n\t\"content\",\n\t\"title\",\n\t\"snippet_title\",\n\t\"snippet_meta\",\n\t\"primary_category\",\n\t\"data_page_title\",\n\t\"data_meta_desc\",\n];\n\n/**\n * Calculates the price based on the set price and sale price.\n *\n * @returns {string} The calculated price.\n */\nfunction getPrice() {\n\tvar price = parseFloat( jQuery( \"#_regular_price\" ).val() );\n\n\treturn price.toLocaleString(\n\t\twpseoWooReplaceVarsL10n.locale,\n\t\t{\n\t\t\tstyle: \"currency\",\n\t\t\tcurrency: wpseoWooReplaceVarsL10n.currency,\n\t\t}\n\t);\n}\n\n/**\n * Gets the value of the set short description.\n *\n * @returns {string} The value of the short description.\n */\nfunction getShortDescription() {\n\tvar productDescription = document.getElementById( \"excerpt\" ).value;\n\tif ( typeof tinyMCE !== \"undefined\" && tinyMCE.get( \"excerpt\" ) !== null ) {\n\t\tproductDescription = tinyMCE.get( \"excerpt\" ).getContent();\n\t}\n\treturn productDescription;\n}\n\n/**\n * Gets the taxonomy name from categories.\n * The logic of this function is inspired by: http://viralpatel.net/blogs/jquery-get-text-element-without-child-element/\n *\n * @param {Object} checkbox The checkbox to parse to retrieve the label.\n *\n * @returns {string} The category name.\n */\nfunction extractBrandName( checkbox ) {\n\t// Take the parent of checkbox with type label and clone it.\n\tvar clonedLabel = checkbox.parent( \"label\" ).clone();\n\n\t// Finds child elements and removes them so we only get the label's text left.\n\tclonedLabel.children().remove();\n\n\t// Returns the trimmed text value.\n\treturn clonedLabel.text().trim();\n}\n\n/**\n * Finds the brand element. First it looks to an primary term. If nothing is found it gets the first checked\n * term.\n *\n * @param {jQuery} brandContainer The metabox container to look in.\n *\n * @returns {jQuery|null} The element if found, otherwise null.\n */\nfunction findPrimaryBrand( brandContainer ) {\n\tvar primaryBrand = brandContainer.find( \"li.wpseo-primary-term input:checked\" );\n\n\tif ( primaryBrand.length > 0 ) {\n\t\treturn primaryBrand.first();\n\t}\n\n\tvar checkboxes = brandContainer.find( \"li input:checked\" );\n\n\tif ( checkboxes.length > 0 ) {\n\t\treturn checkboxes.first();\n\t}\n\n\treturn null;\n}\n\n/**\n * Returns the name of the first found brand name.\n *\n * @returns {string} The name of the brand.\n */\nfunction getBrand() {\n\tvar brandContainers = [ \"#product_brand-all\", \"#pwb-brand-all\" ];\n\tvar totalBrandContainers = brandContainers.length;\n\n\tfor( var i = 0; i < totalBrandContainers; i++ ) {\n\t\tvar brandContainer = jQuery( brandContainers[ i ] );\n\n\t\tif ( brandContainer.length === 0 ) {\n\t\t\tcontinue;\n\t\t}\n\n\t\tvar primaryProductBrand = findPrimaryBrand( brandContainer );\n\n\t\tif ( primaryProductBrand !== null && primaryProductBrand.length > 0 ) {\n\t\t\treturn extractBrandName( jQuery( primaryProductBrand ) );\n\t\t}\n\t}\n\n\treturn \"\";\n}\n\n/**\n * Variable replacement plugin for WordPress.\n *\n * @returns {void}\n */\nvar YoastReplaceVarPlugin = function() {\n\tthis._app = YoastSEO.app;\n\tthis._app.registerPlugin( pluginName, { status: \"ready\" } );\n\tthis._store = YoastSEO.store;\n\n\tthis.registerReplacements();\n\tthis.registerModifications( this._app );\n\tthis.registerEvents();\n};\n\n/**\n * Register the events that might have influence for the replace vars.\n *\n * @returns {void}\n */\nYoastReplaceVarPlugin.prototype.registerEvents = function() {\n\tjQuery( document ).on( \"input\", \"#_regular_price, #_sku\", this.declareReloaded.bind( this ) );\n\n\tvar brandElements = [ \"#taxonomy-product_brand\", \"#pwb-branddiv\" ];\n\n\tbrandElements.forEach( this.registerBrandEvents.bind( this ) );\n};\n\n/**\n * Registers the events for the brand containers.\n *\n * @param {string} brandElement The element target name.\n *\n * @returns {void}\n */\nYoastReplaceVarPlugin.prototype.registerBrandEvents = function( brandElement ) {\n\tbrandElement = jQuery( brandElement );\n\tbrandElement.on( \"wpListAddEnd\", \".categorychecklist\", this.declareReloaded.bind( this ) );\n\tbrandElement.on( \"change\", \"input[type=checkbox]\", this.declareReloaded.bind( this ) );\n\tbrandElement.on( \"click active\", \".wpseo-make-primary-term\", this.declareReloaded.bind( this ) );\n};\n\n/**\n * Registers all the placeholders and their replacements.\n *\n * @returns {void}\n */\nYoastReplaceVarPlugin.prototype.registerReplacements = function() {\n\tthis.addReplacement( new ReplaceVar( \"%%wc_price%%\",     \"wc_price\" ) );\n\tthis.addReplacement( new ReplaceVar( \"%%wc_sku%%\",       \"wc_sku\" ) );\n\tthis.addReplacement( new ReplaceVar( \"%%wc_shortdesc%%\", \"wc_shortdesc\" ) );\n\tthis.addReplacement( new ReplaceVar( \"%%wc_brand%%\",     \"wc_brand\" ) );\n};\n\n/**\n * Registers the modifications for the plugin on initial load.\n *\n * @param {app} app The app object.\n *\n * @returns {void}\n */\nYoastReplaceVarPlugin.prototype.registerModifications = function( app ) {\n\tvar callback = this.replaceVariables.bind( this );\n\n\tfor ( var i = 0; i < modifiableFields.length; i++ ) {\n\t\tapp.registerModification( modifiableFields[ i ], callback, pluginName, 10 );\n\t}\n};\n\n/**\n * Runs the different replacements on the data-string.\n *\n * @param {string} data The data that needs its placeholders replaced.\n *\n * @returns {string} The data with all its placeholders replaced by actual values.\n */\nYoastReplaceVarPlugin.prototype.replaceVariables = function( data ) {\n\tif ( typeof data !== \"undefined\" ) {\n\t\tdata = data.replace( /%%wc_price%%/g, getPrice() );\n\t\tdata = data.replace( /%%wc_sku%%/g, jQuery( \"#_sku\" ).val() );\n\t\tdata = data.replace( /%%wc_shortdesc%%/g, getShortDescription() );\n\t\tdata = data.replace( /%%wc_brand%%/g, getBrand() );\n\n\t\tdata = this.replacePlaceholders( data );\n\t}\n\n\treturn data;\n};\n\n/**\n * Adds a replacement object to be used when replacing placeholders.\n *\n * @param {ReplaceVar} replacement The replacement to add to the placeholders.\n *\n * @returns {void}\n */\nYoastReplaceVarPlugin.prototype.addReplacement = function( replacement ) {\n\tplaceholders[ replacement.placeholder ] = replacement;\n\tthis._store.dispatch( {\n\t\ttype: \"SNIPPET_EDITOR_UPDATE_REPLACEMENT_VARIABLE\",\n\t\tname: replacement.placeholder.replace( /^%%|%%$/g, \"\" ),\n\t\tvalue: replacement.placeholder,\n\t} );\n};\n\n/**\n * Reloads the app to apply possibly made changes in the content.\n *\n * @returns {void}\n */\nYoastReplaceVarPlugin.prototype.declareReloaded = function() {\n\tthis._app.pluginReloaded( pluginName );\n\tthis._store.dispatch( { type: \"SNIPPET_EDITOR_REFRESH\" } );\n};\n\n/**\n * Replaces placeholder variables with their replacement value.\n *\n * @param {string} text The text to have its placeholders replaced.\n *\n * @returns {string} The text in which the placeholders have been replaced.\n */\nYoastReplaceVarPlugin.prototype.replacePlaceholders = function( text ) {\n\tfor ( var i = 0; i < placeholders.length; i++ ) {\n\t\tvar replaceVar = placeholders[ i ];\n\n\t\ttext = text.replace(\n\t\t\tnew RegExp( replaceVar.getPlaceholder( true ), \"g\" ), replaceVar.replacement\n\t\t);\n\t}\n\treturn text;\n};\n\n/**\n * Initializes the Yoast WooCommerce ReplaceVars plugin.\n *\n * @returns {void}\n */\nfunction initializeReplacevarPlugin() {\n\t// When YoastSEO is available, just instantiate the plugin.\n\tif ( typeof YoastSEO !== \"undefined\" && typeof YoastSEO.app !== \"undefined\" ) {\n\t\tnew YoastReplaceVarPlugin(); // eslint-disable-line no-new\n\t\treturn;\n\t}\n\n\t// Otherwise, add an event that will be executed when YoastSEO will be available.\n\tjQuery( window ).on(\n\t\t\"YoastSEO:ready\",\n\t\tfunction() {\n\t\t\tnew YoastReplaceVarPlugin(); // eslint-disable-line no-new\n\t\t}\n\t);\n}\n\ninitializeReplacevarPlugin();\n\n\n//# sourceURL=webpack:///./js/src/yoastseo-woo-replacevars.js?");

/***/ })
/******/ ]);