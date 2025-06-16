document.addEventListener('DOMContentLoaded', () => {
    const prompts = [
        { id: 1, title: "Social Media Content Calendar", body: "Generate a one-month content calendar for a SaaS company on Twitter and LinkedIn. Include columns for Date, Platform (Twitter/LinkedIn), Post Copy, Image/Video Idea, and Relevant Hashtags. The tone should be professional yet engaging.", tags: ["Marketing", "Social Media"] },
        { id: 2, title: "Blog Post Outline", body: "Create a comprehensive outline for a blog post titled \"The Future of AI\". The outline should include an introduction, at least 3 main sections with sub-points, and a conclusion.", tags: ["Writing", "AI"] },
        { id: 3, title: "Python Code Refactoring", body: "You are an expert Python developer. Refactor the provided Python script to be more efficient and readable. Add comments to explain your changes and any complex logic.", tags: ["Development", "Python"] },
        { id: 4, title: "E-commerce Product Description", body: "Write a persuasive product description (around 150 words) for a new brand of wireless noise-cancelling headphones. Highlight key features like battery life, sound quality, and comfort.", tags: ["Marketing", "E-commerce", "Writing"] },
        { id: 5, title: "Customer Support Email Templates", body: "Create 5 professional and empathetic email templates for common customer support scenarios: 1. Refund request approved, 2. Refund request denied, 3. User inquiry about a feature, 4. Reporting a bug, 5. Apology for a service outage.", tags: ["Support", "Customer Service"] },
        { id: 6, title: "SQL Query Optimization", body: "Given a slow-running SQL query, analyze its execution plan and suggest optimizations. Explain the reasoning behind each suggestion, such as adding indexes or rewriting joins.", tags: ["Development", "Database", "SQL"] }
    ];

    const titleContainer = document.getElementById('prompt-title');
    const bodyContainer = document.getElementById('prompt-body');
    const tagsContainer = document.getElementById('prompt-tags');
    const mainContent = document.getElementById('main-content');

    const getPublicPromptIds = () => {
        const shared = localStorage.getItem('publicPrompts');
        return shared ? JSON.parse(shared) : [];
    };

    const urlParams = new URLSearchParams(window.location.search);
    const promptId = parseInt(urlParams.get('id'));

    if (isNaN(promptId)) {
        displayError("Invalid prompt ID specified.");
        return;
    }

    const publicIds = getPublicPromptIds();
    const isPublic = publicIds.includes(promptId);
    
    const prompt = prompts.find(p => p.id === promptId);

    if (prompt && isPublic) {
        document.title = `${prompt.title} - Claude AI HUB V2`;
        titleContainer.textContent = prompt.title;
        bodyContainer.textContent = prompt.body;
        tagsContainer.innerHTML = prompt.tags.map(tag => `<div class="badge badge-lg badge-outline">${tag}</div>`).join('');
    } else {
        displayError("The prompt you are looking for either does not exist or is not publicly shared.");
    }
    
    function displayError(message) {
        document.title = "Prompt Not Found - Claude AI HUB V2";
        mainContent.innerHTML = `
            <div class="text-center py-20">
                <h1 class="text-4xl font-bold mb-4">Prompt Not Found</h1>
                <p class="text-lg text-base-content/70">${message}</p>
                <a href="../index.html" class="btn btn-primary mt-8">Back to Home</a>
            </div>
        `;
    }
});
