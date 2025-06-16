export class InstantSearch {
    constructor(options = {}) {
        this.searchInput = options.searchInput;
        this.searchStatusElement = options.searchStatusElement;
        this.onSearch = options.onSearch || (() => {});
        this.debounceMs = options.debounceMs || 150;
        this.minSearchLength = options.minSearchLength || 0;
        
        this.debounceTimer = null;
        this.currentQuery = '';
        this.isSearching = false;
        
        this.init();
    }
    
    init() {
        if (!this.searchInput) return;
        
        this.searchInput.addEventListener('input', (e) => {
            this.handleInput(e.target.value);
        });
        
        this.searchInput.addEventListener('focus', () => {
            this.searchInput.parentElement.classList.add('input-focus');
        });
        
        this.searchInput.addEventListener('blur', () => {
            this.searchInput.parentElement.classList.remove('input-focus');
        });
        
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearch();
            }
        });
    }
    
    handleInput(value) {
        const query = value.trim();
        
        clearTimeout(this.debounceTimer);
        
        if (query.length < this.minSearchLength && this.currentQuery.length >= this.minSearchLength) {
             this.executeSearch('');
             return;
        }

        if (query.length < this.minSearchLength) {
            return;
        }
        
        this.showSearchingState();
        
        this.debounceTimer = setTimeout(() => {
            this.executeSearch(query);
        }, this.debounceMs);
    }
    
    executeSearch(query) {
        this.currentQuery = query;
        this.isSearching = false;
        
        try {
            const results = this.onSearch(query);
            this.showSearchResults(query, results);
        } catch (error) {
            console.error('Search error:', error);
            this.showSearchError();
        }
    }
    
    showSearchingState() {
        this.isSearching = true;
        if (this.searchStatusElement) {
            this.searchStatusElement.textContent = '●';
            this.searchStatusElement.classList.add('animate-pulse');
        }
    }
    
    showSearchResults(query, results) {
        if (this.searchStatusElement) {
            this.searchStatusElement.classList.remove('animate-pulse');
            this.searchStatusElement.textContent = '';
        }
    }
    
    showSearchError() {
        if (this.searchStatusElement) {
            this.searchStatusElement.classList.remove('animate-pulse');
            this.searchStatusElement.textContent = 'Error';
        }
    }
    
    clearSearch() {
        this.searchInput.value = '';
        this.handleInput('');
    }
    
    highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${this.escapeRegExp(query)})`, 'gi');
        return text.replace(regex, '<mark class="bg-primary/20 text-primary-content/90 rounded px-0.5 py-0">$1</mark>');
    }
    
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    getQuery() {
        return this.currentQuery;
    }
}
