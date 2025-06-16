import { InstantSearch } from './instant_search.js';

document.addEventListener('DOMContentLoaded', () => {

    let prompts = [
        { id: 1, title: "Social Media Content Calendar", body: "Generate a one-month content calendar for a SaaS company on Twitter and LinkedIn. Include columns for Date, Platform (Twitter/LinkedIn), Post Copy, Image/Video Idea, and Relevant Hashtags. The tone should be professional yet engaging.", tags: ["Marketing", "Social Media"] },
        { id: 2, title: "Blog Post Outline", body: "Create a comprehensive outline for a blog post titled \"The Future of AI\". The outline should include an introduction, at least 3 main sections with sub-points, and a conclusion.", tags: ["Writing", "AI"] },
        { id: 3, title: "Python Code Refactoring", body: "You are an expert Python developer. Refactor the provided Python script to be more efficient and readable. Add comments to explain your changes and any complex logic.", tags: ["Development", "Python"] },
        { id: 4, title: "E-commerce Product Description", body: "Write a persuasive product description (around 150 words) for a new brand of wireless noise-cancelling headphones. Highlight key features like battery life, sound quality, and comfort.", tags: ["Marketing", "E-commerce", "Writing"] },
        { id: 5, title: "Customer Support Email Templates", body: "Create 5 professional and empathetic email templates for common customer support scenarios: 1. Refund request approved, 2. Refund request denied, 3. User inquiry about a feature, 4. Reporting a bug, 5. Apology for a service outage.", tags: ["Support", "Customer Service"] },
        { id: 6, title: "SQL Query Optimization", body: "Given a slow-running SQL query, analyze its execution plan and suggest optimizations. Explain the reasoning behind each suggestion, such as adding indexes or rewriting joins.", tags: ["Development", "Database", "SQL"] }
    ];

    const getPinnedPromptIds = () => {
        const pinned = localStorage.getItem('pinnedPrompts');
        return pinned ? JSON.parse(pinned) : [];
    };

    const savePinnedPromptIds = (ids) => {
        localStorage.setItem('pinnedPrompts', JSON.stringify(ids));
    };

    const getPublicPromptIds = () => {
        const shared = localStorage.getItem('publicPrompts');
        return shared ? JSON.parse(shared) : [];
    };

    const savePublicPromptIds = (ids) => {
        localStorage.setItem('publicPrompts', JSON.stringify(ids));
    };

    let activeTags = new Set();
    let currentSearchTerm = '';
    
    const promptsGrid = document.getElementById('prompts-grid');
    const tagFiltersContainer = document.getElementById('tag-filters');
    const searchInput = document.getElementById('search-input');
    const searchStatusElement = document.getElementById('search-status');
    const newPromptBtn = document.getElementById('new-prompt-btn');
    const promptModal = document.getElementById('prompt-modal');
    const promptForm = document.getElementById('prompt-form');
    const modalTitle = document.getElementById('modal-title');
    const promptIdInput = document.getElementById('prompt-id');
    const promptTitleInput = document.getElementById('prompt-title');
    const promptBodyInput = document.getElementById('prompt-body');
    const promptTagsInput = document.getElementById('prompt-tags');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const relatedPromptsModal = document.getElementById('related-prompts-modal');
    const relatedModalContent = document.getElementById('related-modal-content');

    let instantSearch = null;

    const getUniqueTags = () => {
        const allTags = new Set();
        prompts.forEach(p => p.tags.forEach(tag => allTags.add(tag)));
        return [...allTags].sort();
    };

    const renderTags = () => {
        if (!tagFiltersContainer) return;
        const uniqueTags = getUniqueTags();
        let tagButtonsHTML = '<button class="btn btn-sm btn-active tag-filter" data-tag="all">All</button>';
        uniqueTags.forEach(tag => {
            const isActive = activeTags.has(tag);
            tagButtonsHTML += `<button class="btn btn-sm ${isActive ? 'btn-active' : 'btn-ghost'} tag-filter" data-tag="${tag}">${tag}</button>`;
        });
        tagFiltersContainer.innerHTML = tagButtonsHTML;
    };
    
    const getFilteredPrompts = (searchTerm = currentSearchTerm) => {
        return prompts.filter(prompt => {
            const searchMatch = searchTerm === '' ||
                                prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                prompt.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            const tagMatch = activeTags.size === 0 ||
                             [...activeTags].every(tag => prompt.tags.includes(tag));
            return searchMatch && tagMatch;
        });
    };
    
    const renderPrompts = (highlightQuery = '') => {
        if (!promptsGrid) return 0;
        const pinnedIds = getPinnedPromptIds();
        const publicIds = getPublicPromptIds();
        const filteredPrompts = getFilteredPrompts();

        if (filteredPrompts.length === 0) {
            const noResultsMessage = currentSearchTerm ? 
                `No prompts found for "${currentSearchTerm}"` : 
                'No prompts found';
            const suggestion = currentSearchTerm ? 
                'Try different keywords or clear your search.' : 
                'Try adjusting your filters.';
                
            promptsGrid.innerHTML = `<div class="col-span-full text-center py-12">
                <div class="max-w-md mx-auto">
                    <i data-lucide="search-x" class="w-16 h-16 text-base-content/30 mx-auto mb-4"></i>
                    <h3 class="text-xl font-semibold mb-2">${noResultsMessage}</h3>
                    <p class="text-base-content/70">${suggestion}</p>
                    ${currentSearchTerm ? '<button id="clear-search-btn" class="btn btn-ghost btn-sm mt-4">Clear Search</button>' : ''}
                </div>
            </div>`;
            lucide.createIcons();
            
            if (currentSearchTerm) {
                document.getElementById('clear-search-btn')?.addEventListener('click', () => {
                    instantSearch?.clearSearch();
                });
            }
            return filteredPrompts.length;
        }

        promptsGrid.innerHTML = filteredPrompts.map(prompt => {
            const isPinned = pinnedIds.includes(prompt.id);
            const isPublic = publicIds.includes(prompt.id);
            
            const highlightedTitle = highlightQuery ? 
                instantSearch.highlightText(prompt.title, highlightQuery) : 
                prompt.title;
            const highlightedBody = highlightQuery ? 
                instantSearch.highlightText(prompt.body.substring(0, 100), highlightQuery) : 
                prompt.body.substring(0, 100);
            
            return `
            <div class="card bg-base-200/50 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                <div class="card-body">
                    <h3 class="card-title text-lg">${highlightedTitle}</h3>
                    <p class="text-sm text-base-content/70 flex-grow min-h-16">${highlightedBody}${prompt.body.length > 100 ? '...' : ''}</p>
                    <div class="mt-2 flex flex-wrap gap-1 min-h-6">
                        ${prompt.tags.map(tag => {
                            const highlightedTag = highlightQuery ? 
                                instantSearch.highlightText(tag, highlightQuery) : 
                                tag;
                            return `<div class="badge badge-outline">${highlightedTag}</div>`;
                        }).join('')}
                    </div>
                    <div class="card-actions justify-end mt-4">
                        <button class="btn ${isPinned ? 'btn-primary' : 'btn-ghost'} btn-sm" data-action="pin" data-id="${prompt.id}"><i data-lucide="pin" class="w-4 h-4 mr-1"></i>${isPinned ? 'Pinned' : 'Pin'}</button>
                        <button class="btn btn-ghost btn-sm" data-action="view-related" data-id="${prompt.id}"><i data-lucide="sparkles" class="w-4 h-4 mr-1"></i>Related</button>
                        <button class="btn btn-ghost btn-sm" data-action="edit" data-id="${prompt.id}"><i data-lucide="edit-3" class="w-4 h-4 mr-1"></i>Edit</button>
                        <button class="btn btn-ghost btn-sm text-error" data-action="delete" data-id="${prompt.id}"><i data-lucide="trash-2" class="w-4 h-4 mr-1"></i>Delete</button>
                    </div>
                    <div class="divider my-1"></div>
                    <div class="flex items-center justify-between gap-2">
                        <div class="form-control">
                            <label class="label cursor-pointer gap-2 p-0">
                                <span class="label-text text-sm">Public Sharing</span> 
                                <input type="checkbox" class="toggle toggle-sm toggle-success" data-action="share" data-id="${prompt.id}" ${isPublic ? 'checked' : ''} />
                            </label>
                        </div>
                        <div class="public-link-container text-xs text-base-content/60 min-w-0 flex-1 text-right truncate">
                            ${isPublic ? `<a href="../p/prompt.html?id=${prompt.id}" target="_blank" class="link link-hover">/p/prompt.html?id=${prompt.id}</a>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `}).join('');
        lucide.createIcons();
        return filteredPrompts.length;
    };

    const handleInstantSearch = (query) => {
        currentSearchTerm = query;
        const resultCount = renderPrompts(query);
        return resultCount;
    };

    const openModal = (mode, promptId = null) => {
        promptForm.reset();
        if (mode === 'create') {
            modalTitle.textContent = 'Create New Prompt';
            promptIdInput.value = '';
            promptModal.showModal();
        } else if (mode === 'edit') {
            modalTitle.textContent = 'Edit Prompt';
            const prompt = prompts.find(p => p.id === promptId);
            if (prompt) {
                promptIdInput.value = prompt.id;
                promptTitleInput.value = prompt.title;
                promptBodyInput.value = prompt.body;
                promptTagsInput.value = prompt.tags.join(', ');
                promptModal.showModal();
            }
        }
    };
    
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const id = promptIdInput.value ? parseInt(promptIdInput.value) : null;
        const title = promptTitleInput.value;
        const body = promptBodyInput.value;
        const tags = promptTagsInput.value.split(',').map(tag => tag.trim()).filter(Boolean);

        if (id) {
            const index = prompts.findIndex(p => p.id === id);
            if (index !== -1) {
                prompts[index] = { ...prompts[index], title, body, tags };
            }
        } else {
            const newId = prompts.length > 0 ? Math.max(...prompts.map(p => p.id)) + 1 : 1;
            prompts.unshift({ id: newId, title, body, tags });
        }
        
        promptModal.close();
        renderTags();
        renderPrompts(instantSearch?.getQuery() || '');
    };

    const openRelatedModal = (promptId) => {
        const mainPrompt = prompts.find(p => p.id === promptId);
        if (!mainPrompt) return;

        const relatedPrompts = prompts.filter(p => {
            if (p.id === mainPrompt.id) return false;
            return p.tags.some(tag => mainPrompt.tags.includes(tag));
        })
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);

        let relatedPromptsHTML = '<h4 class="text-lg font-semibold mt-6 mb-3">Related Prompts (Simulated)</h4>';
        if (relatedPrompts.length > 0) {
            relatedPromptsHTML += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
            relatedPrompts.forEach(p => {
                relatedPromptsHTML += `
                    <div class="card card-compact bg-base-200/70 hover:bg-base-300/80 transition-colors cursor-pointer" data-action="view-related-from-modal" data-id="${p.id}">
                        <div class="card-body pointer-events-none">
                            <h5 class="card-title text-base">${p.title}</h5>
                            <div class="flex flex-wrap gap-1 mt-1">
                                ${p.tags.map(tag => `<div class="badge badge-outline badge-sm">${tag}</div>`).join('')}
                            </div>
                        </div>
                    </div>
                `;
            });
            relatedPromptsHTML += '</div>';
        } else {
            relatedPromptsHTML += '<p class="text-base-content/60">No similar prompts found.</p>';
        }

        const modalContentHTML = `
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 class="font-bold text-2xl mb-2 pr-10">${mainPrompt.title}</h3>
            <div class="flex flex-wrap gap-2 mb-4">
                ${mainPrompt.tags.map(tag => `<div class="badge badge-primary badge-outline">${tag}</div>`).join('')}
            </div>
            <div class="prose max-w-none bg-base-200 p-4 rounded-lg max-h-60 overflow-y-auto">
                <p style="white-space: pre-wrap;">${mainPrompt.body}</p>
            </div>
            ${relatedPromptsHTML}
        `;

        relatedModalContent.innerHTML = modalContentHTML;
        if (!relatedPromptsModal.open) {
            relatedPromptsModal.showModal();
        }
    };

    const init = () => {
        instantSearch = new InstantSearch({
            searchInput: searchInput,
            searchStatusElement: searchStatusElement,
            onSearch: handleInstantSearch,
            debounceMs: 150,
            minSearchLength: 1
        });

        renderTags();
        renderPrompts();

        if(tagFiltersContainer) {
            tagFiltersContainer.addEventListener('click', (e) => {
                if (e.target.matches('.tag-filter')) {
                    const tag = e.target.dataset.tag;
                    
                    document.querySelectorAll('.tag-filter').forEach(btn => btn.classList.remove('btn-active', 'btn-ghost'));

                    if (tag === 'all') {
                        activeTags.clear();
                    } else {
                        if (activeTags.has(tag)) {
                            activeTags.delete(tag);
                        } else {
                            activeTags.add(tag);
                        }
                    }
                    
                    document.querySelectorAll('.tag-filter').forEach(btn => {
                        const btnTag = btn.dataset.tag;
                        if (btnTag === 'all' && activeTags.size === 0) {
                             btn.classList.add('btn-active');
                        } else if (btnTag !== 'all' && activeTags.has(btnTag)) {
                            btn.classList.add('btn-active');
                        } else {
                            btn.classList.add('btn-ghost');
                        }
                    });

                    if (activeTags.size > 0) {
                        document.querySelector('.tag-filter[data-tag="all"]').classList.remove('btn-active');
                        document.querySelector('.tag-filter[data-tag="all"]').classList.add('btn-ghost');
                    }
                    renderPrompts(instantSearch?.getQuery() || '');
                }
            });
        }

        newPromptBtn?.addEventListener('click', () => openModal('create'));
        cancelModalBtn?.addEventListener('click', () => promptModal.close());
        promptForm?.addEventListener('submit', handleFormSubmit);

        if(promptsGrid) {
            promptsGrid.addEventListener('click', (e) => {
                const target = e.target;

                if (target.matches('input[data-action="share"]')) {
                    const id = parseInt(target.dataset.id);
                    let publicIds = getPublicPromptIds();
                    if (target.checked) {
                        if (!publicIds.includes(id)) publicIds.push(id);
                    } else {
                        publicIds = publicIds.filter(pid => pid !== id);
                    }
                    savePublicPromptIds(publicIds);
                    renderPrompts(instantSearch?.getQuery() || '');
                    return;
                }

                const button = target.closest('button');
                if (!button) return;

                const action = button.dataset.action;
                const id = parseInt(button.dataset.id);

                if (action === 'view-related') {
                    openRelatedModal(id);
                } else if (action === 'edit') {
                    openModal('edit', id);
                } else if (action === 'delete') {
                    if (window.confirm('Are you sure you want to delete this prompt?')) {
                        prompts = prompts.filter(p => p.id !== id);
                        
                        let pinnedIds = getPinnedPromptIds();
                        if (pinnedIds.includes(id)) {
                           pinnedIds = pinnedIds.filter(pid => pid !== id);
                           savePinnedPromptIds(pinnedIds);
                        }

                        let publicIds = getPublicPromptIds();
                        if(publicIds.includes(id)) {
                            publicIds = publicIds.filter(pid => pid !== id);
                            savePublicPromptIds(publicIds);
                        }
                        
                        renderTags();
                        renderPrompts(instantSearch?.getQuery() || '');
                    }
                } else if (action === 'pin') {
                    let pinnedIds = getPinnedPromptIds();
                    if (pinnedIds.includes(id)) {
                        pinnedIds = pinnedIds.filter(pinnedId => pinnedId !== id);
                    } else {
                        pinnedIds.push(id);
                    }
                    savePinnedPromptIds(pinnedIds);
                    renderPrompts(instantSearch?.getQuery() || '');
                }
            });
        }
        
        if (relatedPromptsModal) {
             relatedPromptsModal.addEventListener('click', (e) => {
                const card = e.target.closest('[data-action="view-related-from-modal"]');
                if (card) {
                    const id = parseInt(card.dataset.id);
                    if (id) {
                        openRelatedModal(id);
                    }
                }
            });
        }
    };

    init();
});
