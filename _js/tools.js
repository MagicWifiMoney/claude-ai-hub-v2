document.addEventListener('DOMContentLoaded', () => {
    const toolsListContainer = document.getElementById('tools-list');

    if (toolsListContainer) {
        toolsListContainer.addEventListener('click', (event) => {
            const toolLink = event.target.closest('a.tool-link');

            if (toolLink) {
                event.preventDefault(); 

                const affiliateUrl = toolLink.dataset.affiliateUrl;
                const toolSlug = toolLink.getAttribute('href').split('/').pop();

                if (affiliateUrl) {
                    console.log(`[TRACKING] Tool link clicked. Slug: '${toolSlug}', Redirecting to: ${affiliateUrl}`);
                    
                    window.open(affiliateUrl, '_blank');
                } else {
                    console.error('Data attribute "data-affiliate-url" not found on the tool link.');
                }
            }
        });
    }
});
