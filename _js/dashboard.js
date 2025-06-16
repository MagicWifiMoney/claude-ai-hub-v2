document.addEventListener('DOMContentLoaded', () => {
    const prompts = [
        { id: 1, title: "Social Media Content Calendar", body: "Generate a one-month content calendar for a SaaS company on Twitter and LinkedIn.", tags: ["Marketing", "Social Media"] },
        { id: 2, title: "Blog Post Outline", body: "Create a comprehensive outline for a blog post titled \"The Future of AI\".", tags: ["Writing"] },
        { id: 3, title: "Python Code Refactoring", body: "Refactor the provided Python script to be more efficient and readable, adding comments.", tags: ["Development"] },
        { id: 4, title: "E-commerce Product Description", body: "Write a persuasive product description for a new brand of wireless headphones.", tags: ["Marketing", "E-commerce"] },
        { id: 5, title: "Customer Support Email Templates", body: "Create 5 email templates for common customer support scenarios (e.g., refund request, feature question).", tags: ["Support"] },
        { id: 6, title: "SQL Query Optimization", body: "Analyze and optimize a slow-running SQL query for a large user database.", tags: ["Development", "Database"] }
    ];

    const pinnedPromptsGrid = document.getElementById('pinned-prompts-grid');

    const getPinnedPromptIds = () => {
        const pinned = localStorage.getItem('pinnedPrompts');
        return pinned ? JSON.parse(pinned) : [];
    };

    const savePinnedPromptIds = (ids) => {
        localStorage.setItem('pinnedPrompts', JSON.stringify(ids));
    };

    const renderPinnedPrompts = () => {
        if (!pinnedPromptsGrid) return;

        const pinnedIds = getPinnedPromptIds();
        const pinnedPrompts = prompts.filter(p => pinnedIds.includes(p.id));

        if (pinnedPrompts.length === 0) {
            pinnedPromptsGrid.innerHTML = `
                <div class="col-span-full text-center py-12 bg-base-200/50 rounded-lg">
                    <i data-lucide="pin" class="w-12 h-12 mx-auto text-base-content/30"></i>
                    <h3 class="text-xl font-semibold mt-4">Your Pinned Prompts will appear here.</h3>
                    <p class="text-base-content/70 mt-2">Find prompts you like in the <a href="prompts.html" class="link link-primary">Prompt Library</a> and pin them for quick access.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        pinnedPromptsGrid.innerHTML = pinnedPrompts.map(prompt => `
            <div class="card bg-base-200/50 shadow-sm hover:shadow-md transition-shadow">
                <div class="card-body">
                    <h3 class="card-title text-lg">${prompt.title}</h3>
                    <p class="text-sm text-base-content/70 flex-grow min-h-16">${prompt.body.substring(0, 100)}${prompt.body.length > 100 ? '...' : ''}</p>
                    <div class="mt-2 flex flex-wrap gap-1 min-h-6">
                        ${prompt.tags.map(tag => `<div class="badge badge-outline">${tag}</div>`).join('')}
                    </div>
                    <div class="card-actions justify-end mt-4">
                        <button class="btn btn-ghost btn-sm btn-circle" data-action="unpin" data-id="${prompt.id}" title="Unpin from Dashboard">
                            <i data-lucide="pin-off" class="w-4 h-4"></i>
                        </button>
                        <button class="btn btn-primary btn-sm">Use</button>
                    </div>
                </div>
            </div>
        `).join('');
        lucide.createIcons();
    };

    if (pinnedPromptsGrid) {
        pinnedPromptsGrid.addEventListener('click', e => {
            const button = e.target.closest('button[data-action="unpin"]');
            if (!button) return;

            const id = parseInt(button.dataset.id);
            let pinnedIds = getPinnedPromptIds();
            pinnedIds = pinnedIds.filter(pinnedId => pinnedId !== id);
            savePinnedPromptIds(pinnedIds);
            renderPinnedPrompts();
        });

        renderPinnedPrompts();
    }
});
