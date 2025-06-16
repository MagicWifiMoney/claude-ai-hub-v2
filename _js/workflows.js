document.addEventListener('DOMContentLoaded', () => {



    const simulatedUser = {
        role: 'user' // Change to 'pro' to see the unlocked content
    };

    const premiumWorkflows = document.querySelectorAll('[data-premium="true"]');
    

    if (simulatedUser.role !== 'pro') {
        premiumWorkflows.forEach(card => {
            const actionsContainer = card.querySelector('.card-actions');
            if (actionsContainer) {
                actionsContainer.innerHTML = `
                    <a href="../pricing.html" class="btn btn-primary btn-sm">
                        <i data-lucide="lock" class="w-4 h-4 mr-1"></i>
                        Upgrade to Pro
                    </a>
                `;
            }
        });

        if (window.lucide) {
            lucide.createIcons();
        }
    }


    const importButtons = document.querySelectorAll('.btn-import-n8n');

    importButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const workflowButton = event.currentTarget;
            const n8nJsonString = workflowButton.dataset.n8nJson;
            
            if (!n8nJsonString) {
                console.error('No n8n JSON data found on the button.');
                return;
            }

            try {
                const workflowData = JSON.parse(n8nJsonString);
                

                window.postMessage(workflowData, '*');

                console.log('Simulating workflow import. Posting message with data:', workflowData);
                
                workflowButton.innerHTML = `<span class="loading loading-spinner loading-xs"></span> Importing...`;
                workflowButton.disabled = true;

                setTimeout(() => {
                    workflowButton.innerHTML = `<i data-lucide="check" class="w-4 h-4 mr-1"></i> Imported`;
                     if(window.lucide) {
                        lucide.createIcons({
                            nodes: [workflowButton.querySelector('i')]
                        });
                    }
                }, 1500);

            } catch (error) {
                console.error('Failed to parse n8n JSON data:', error);
                alert('An error occurred during import. Please check the console.');
            }
        });
    });
});
