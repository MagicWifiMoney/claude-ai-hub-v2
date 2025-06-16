document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const contentContainer = document.getElementById('content');
    
    async function loadMarkdown() {
        if (!contentContainer) {
            console.error('Content container not found.');
            return;
        }

        try {
            const response = await fetch('guide.md');
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const markdown = await response.text();

            if (typeof marked === 'undefined') {
                throw new Error('Marked.js library is not loaded.');
            }
            contentContainer.innerHTML = marked.parse(markdown);

            if (typeof Prism === 'undefined') {
                 console.warn('Prism.js library is not loaded. Syntax highlighting is disabled.');
            } else {
                 Prism.highlightAll();
            }

        } catch (error) {
            contentContainer.innerHTML = `
                <div class="text-center text-error">
                    <p class="font-semibold">Error Loading Guide</p>
                    <p class="text-sm mt-2">${error.message}</p>
                </div>`;
            console.error('Failed to load and render markdown:', error);
        }
    }

    loadMarkdown();
});
