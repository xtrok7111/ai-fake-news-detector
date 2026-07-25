/**
 * Service worker (Manifest V3) for the AI Fake News Detector extension.
 * Handles the install event and simple ping messages from the popup.
 */

chrome.runtime.onInstalled.addListener(() => {
    console.log('AI Fake News Detector extension installed.');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === 'PING') {
        sendResponse({ ok: true });
    }
    return true;
});
