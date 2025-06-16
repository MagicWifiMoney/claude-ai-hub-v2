const notionSecret = 'YOUR_NOTION_SECRET'; // Placeholder

if (notionSecret === 'YOUR_NOTION_SECRET') {
    console.warn("Notion client is not configured. This file (lib/notion.js) is for conceptual demonstration and uses mock data.");
}

const mockPosts = [
    {
        slug: 'how-ai-is-revolutionizing-prompt-engineering',
        title: 'How AI is Revolutionizing Prompt Engineering',
        date: '2025-06-10',
        image: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800',
        excerpt: 'Explore the latest trends and techniques that are changing how we interact with large language models.',
        content: `
Welcome to the forefront of AI interaction! Prompt engineering is rapidly evolving from a niche skill into a fundamental competency for anyone working with large language models (LLMs). This post explores the key ways AI is not just responding to prompts, but actively shaping how we create them.

## The Core Principles of Modern Prompting

Effective prompting is an art and a science. Here are the foundational principles for getting the most out of your AI companion:

1.  **Clarity and Context**: The more specific you are, the better the result. Provide background information, define terms, and state your goal clearly.
2.  **Role-playing**: Assigning a persona to the AI (e.g., "You are a senior copywriter specializing in tech startups") can drastically improve the tone, style, and quality of the output.
3.  **Iterative Refinement**: Your first prompt is rarely your last. Treat prompting as a conversation. Analyze the AI's response and refine your next prompt to steer it closer to your desired outcome.
4.  **Few-Shot Learning**: Provide a few examples of the input-output format you want. This is one of the most powerful techniques for guiding the model's behavior.

### Example: A Structured Prompt

Here’s an example of a well-structured prompt using a simple Markdown format that an AI can easily parse:

\`\`\`markdown
---
role: "Expert marketing copywriter"
task: "Write three taglines for a new AI-powered coffee machine."
constraints:
  - "Each tagline must be under 10 words."
  - "The tone should be futuristic but friendly."
  - "Avoid using the word 'smart'."
output_format: "A JSON array of strings."
---
\`\`\`

By structuring prompts this way, you create a reusable and effective template for interacting with language models. The future of AI interaction is not just about what you ask, but *how* you ask it.`
    },
    {
        slug: '5-must-have-ai-workflows-for-marketers',
        title: '5 Must-Have AI Workflows for Marketers',
        date: '2025-06-05',
        image: 'https://images.unsplash.com/photo-1696204521345-a93721354673?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800',
        excerpt: 'Boost your marketing efforts with these five powerful, time-saving automation workflows.',
        content: `
Automation is the key to scaling marketing efforts, and AI is the engine. Here are five essential workflows you can implement today to save time and get better results.

### 1. Social Media Content Generation
- **Trigger**: New blog post published.
- **Action**: AI summarizes the post, generates 5 different tweet variations, a LinkedIn post, and suggests relevant hashtags.
- **Benefit**: Keeps your social channels active with minimal effort.

### 2. Competitor Analysis Reports
- **Trigger**: Weekly on Monday at 9 AM.
- **Action**: AI scans competitor websites and social media for new announcements, product launches, or marketing campaigns. It then compiles a summary report and emails it to the marketing team.
- **Benefit**: Stay informed about the competitive landscape automatically.

### 3. Personalized Email Drip Campaigns
- **Trigger**: New user signs up for a newsletter.
- **Action**: Based on the user's sign-up source or interests, AI drafts a personalized welcome email series.
- **Benefit**: Increases engagement and conversion rates with tailored content.
`
    },
    {
        slug: 'the-ethics-of-ai-navigating-the-new-frontier',
        title: 'The Ethics of AI: Navigating the New Frontier',
        date: '2025-05-28',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800',
        excerpt: 'A deep dive into the important ethical considerations for developers and users of AI technologies.',
        content: `
As artificial intelligence becomes more integrated into our daily lives, the ethical implications of its development and use are more important than ever. This post provides an overview of the key ethical challenges we face.

#### Bias in AI
AI models are trained on vast datasets, which can contain and amplify human biases. It's crucial for developers to actively work on mitigating bias in training data and model outputs to ensure fairness.

#### Transparency and Explainability
Many advanced AI models operate as "black boxes," making it difficult to understand their decision-making processes. The push for "Explainable AI" (XAI) is a movement to create models that can justify their conclusions, which is vital for accountability.

#### Privacy
AI systems often require large amounts of data to function, raising significant privacy concerns. Ensuring data is anonymized, securely stored, and used with consent is a fundamental ethical requirement.
`
    }
];


async function getBlogPosts() {
    console.log("Mock Notion API call: getBlogPosts");
    return new Promise(resolve => {
        setTimeout(() => {
            const postsForIndex = mockPosts.map(({ content, ...rest }) => rest);
            resolve(postsForIndex);
        }, 500); 
    });
}


async function getBlogPost(slug) {
    console.log(`Mock Notion API call: getBlogPost with slug: ${slug}`);
    return new Promise(resolve => {
        setTimeout(() => {
            const post = mockPosts.find(p => p.slug === slug);
            resolve(post || null);
        }, 500);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const blogPostsContainer = document.getElementById('blog-posts-container');
    const postContentContainer = document.getElementById('post-content-container');

    if (blogPostsContainer) {
        renderBlogIndex(blogPostsContainer);
    }

    if (postContentContainer) {
        if (window.marked) {
            renderBlogPost(postContentContainer);
        } else {
            console.error('Marked.js library not found. Please include it in your HTML.');
            postContentContainer.innerHTML = '<p class="text-error">Error: Content renderer is missing.</p>';
        }
    }
});

async function renderBlogIndex(container) {
    const posts = await getBlogPosts();
    if (!posts || posts.length === 0) {
        container.innerHTML = '<p class="text-lg text-base-content/70">No blog posts found. Check back later!</p>';
        return;
    }
    
    container.innerHTML = '';

    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'card card-compact bg-base-100 shadow-lg border border-base-200 transition-transform transform hover:-translate-y-1';
        
        const postDate = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        postCard.innerHTML = `
            <figure><img src="${post.image}" alt="${post.title}" class="h-56 w-full object-cover" /></figure>
            <div class="card-body">
                <div class="text-sm text-base-content/60">${postDate}</div>
                <h2 class="card-title">${post.title}</h2>
                <p>${post.excerpt}</p>
                <div class="card-actions justify-start mt-2">
                    <a href="post-template.html?slug=${post.slug}" class="link link-primary">Read More <i data-lucide="arrow-right" class="inline w-4 h-4"></i></a>
                </div>
            </div>
        `;
        container.appendChild(postCard);
    });
    
    if(window.lucide) {
        lucide.createIcons();
    }
}

async function renderBlogPost(container) {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
        container.innerHTML = '<div class="text-center py-10"><h1 class="text-2xl font-bold">Post not found</h1><p>No post specified in the URL.</p><a href="./index.html" class="link link-primary mt-4 inline-block">Back to Blog</a></div>';
        return;
    }
    
    const post = await getBlogPost(slug);
    
    if (!post) {
        document.title = 'Post Not Found - Claude AI HUB V2';
        container.innerHTML = '<div class="text-center py-10"><h1 class="text-2xl font-bold">Post not found</h1><p>Sorry, we could not find the post you are looking for.</p><a href="./index.html" class="link link-primary mt-4 inline-block">Back to Blog</a></div>';
        return;
    }

    document.title = `${post.title} - Claude AI HUB V2`;
    
    const postDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    
    const renderedContent = window.marked.parse(post.content);

    container.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <div class="text-sm breadcrumbs mb-4">
                <ul>
                    <li><a href="../index.html">Home</a></li> 
                    <li><a href="./index.html">Blog</a></li> 
                    <li>${post.title}</li>
                </ul>
            </div>
            <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">${post.title}</h1>
            <p class="text-base-content/70 mb-8">Published on ${postDate}</p>
            <div class="prose lg:prose-xl max-w-none">
                ${renderedContent}
            </div>
        </div>
    `;
    
    if(window.lucide) {
        lucide.createIcons();
    }
}
