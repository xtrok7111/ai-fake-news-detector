/**
 * Content script for the AI Fake News Detector extension.
 * Exposes a helper that extracts the main article text from the page.
 */

(function () {
    // avoid re-injecting if the script already ran on this page
    if (window.__fakeNewsDetectorInjected) {
        return;
    }
    window.__fakeNewsDetectorInjected = true;

    window.__getArticleText = function () {
        // prefer a real article container; fall back to every paragraph
        const containers = document.querySelectorAll('article, main, [role="main"]');

        if (containers.length > 0) {
            return Array.from(containers[0].querySelectorAll('p'))
                .map(p => p.innerText)
                .join(' ')
                .trim();
        }

        return Array.from(document.querySelectorAll('p'))
            .map(p => p.innerText)
            .join(' ')
            .trim();
    };

})();
