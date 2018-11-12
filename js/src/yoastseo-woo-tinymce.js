/* global YoastSEO tinyMCE jQuery */

import isUndefined from "lodash/isUndefined";

/**
 * Returns whether or not the tinyMCE script is available on the page.
 *
 * @returns {boolean} True when tinyMCE is loaded.
 */
function isTinyMCELoaded() {
	return (
		typeof tinyMCE !== "undefined" &&
		typeof tinyMCE.editors !== "undefined" &&
		tinyMCE.editors.length >= 0
	);
}

/**
 * Gets content from the content field by element id.
 *
 * @param {String} contentID The (HTML) id attribute for the TinyMCE field.
 *
 * @returns {String} The tinyMCE content.
 */
function tinyMCEElementContent( contentID ) {
	return document.getElementById( contentID ) && document.getElementById( contentID ).value || "";
}

/**
 * Returns whether or not a tinyMCE editor with the given ID is available.
 *
 * @param {string} editorID The ID of the tinyMCE editor.
 *
 * @returns {boolean} whether TinyMCE is available.
 */
function isTinyMCEAvailable( editorID ) {
	if ( ! isTinyMCELoaded() ) {
		return false;
	}

	const editor = tinyMCE.get( editorID );

	return (
		editor !== null && ! editor.isHidden()
	);
}

/**
 * Returns the excerpt/short product description.
 * @returns {string} The excerpt.
 */
export function getExcerpt() {
	if ( isUndefined( tinyMCE ) ) {
		return;
	}

	let excerptElement = tinyMCE.get( "excerpt" );
	if ( ! isTinyMCEAvailable( "excerpt" ) ) {
		return tinyMCEElementContent( "excerpt" );
	}

	return excerptElement.getContent();
}

/**
 * Sends a new product description to the worker.
 *
 * @param {AnalysisWebWorker} worker The worker to the the message to.
 *
 * @returns {void}
 */
function handleExcerptChange( worker ) {
	const excerpt = getExcerpt();

	worker.sendMessage( "updateProductDescription", excerpt, "YoastWooCommerce" );

	YoastSEO.app.refresh();
}

/**
 * Adds event handlers for when the text in the excerpt Visual editor changes.
 * A new excerpt/short product description gets sent to the web worker when it does.
 *
 * @param {AnalysisWebWorker} worker The web worker to which to send the excerpts.
 * @returns {void}
 */
function addVisualEditorEventHandlers( worker ) {
	const excerptElement = tinyMCE.get( "excerpt" );
	excerptElement.on( "change", () => handleExcerptChange( worker ) );
	excerptElement.on( "input", () => handleExcerptChange( worker ) );
}

/**
 * Adds event handlers for when the text in the excerpt raw Text editor changes.
 * A new excerpt/short product description gets sent to the web worker when it does.
 *
 * @param {AnalysisWebWorker} worker The web worker to which to send the excerpts.
 * @returns {void}
 */
function addTextEditorEventHandlers( worker ) {
	const excerptElement = jQuery( "#excerpt" );
	excerptElement.on( "change", () => handleExcerptChange( worker ) );
	excerptElement.on( "input", () => handleExcerptChange( worker ) );
}

/**
 * Adds event handlers for when the excerpt/short product description changes
 * in either the Text- or the Visual editor.
 * A new excerpt/short product description gets sent to the web worker when it does.
 *
 * @param {AnalysisWebWorker} worker The analysis web worker.
 * @returns {void}
 */
export function addExcerptEventHandlers( worker ) {
	addTextEditorEventHandlers( worker );

	if ( isTinyMCEAvailable( "excerpt" ) ) {
		addVisualEditorEventHandlers( worker );
	}

	if ( isTinyMCELoaded() ) {
		tinyMCE.on( "AddEditor", () => {
			// Switched to Visual editor.
			addVisualEditorEventHandlers( worker );
		} );
	}
}


