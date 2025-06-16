# `README.md`

# Claude AI HUB V2 - Final Project Handover Guide

This document serves as a comprehensive guide for the 'Claude AI HUB V2' application, providing an overview, consolidating code and assets, and detailing the deployment and setup process.

---

## 1. Project Overview

The **Claude AI HUB V2** is a web application designed to serve as a central repository for AI-related resources, specifically focusing on leveraging large language models like Claude. Its primary purpose is to enhance user productivity and creativity by providing a curated library of prompts, automated workflows, recommended tools, and educational content.

The application is built using a modern **technology stack**:
-   **Frontend/Prototype:** HTML, CSS (Tailwind CSS, DaisyUI), and client-side JavaScript.
-   **Target Backend/Database:** Next.js, Supabase (PostgreSQL for database, Auth for authentication).
-   **External Integrations:** Notion (for blog content), Stripe (for payments/paywall).

**Key Implemented Features (in Prototype):**

*   **Core Modules:**
    *   **Prompt Library:** A fully interactive, client-side library with CRUD operations, tag filtering, and search.
    *   **Blog:** A dynamic blog section that renders mock content from a simulated Notion API.
    *   **Admin Panel:** A static page showing a conceptual admin dashboard.
*   **'Nice-to-Have' Features (Simulated):**
    *   **Stripe Paywall Simulation:** The Workflows page simulates premium content requiring a user upgrade.
    *   **Public Sharing:** Prompts can be toggled for public sharing, generating a unique URL (`/p/prompt.html`).
    *   **Instant Search:** The Prompt Library features live, debounced search-as-you-type functionality.
    *   **Similar Suggestions:** A modal in the Prompt Library shows semantically related prompts (simulation).
    *   **User Dashboard & Pinning:** A personalized dashboard displays prompts that users have pinned from the library.
    *   **Auth UI Integration:** Dynamic UI elements based on a simulated authentication state managed in `localStorage`.
    *   **Affiliate Link Tracking Simulation:** Client-side event logging for clicks on tool links.
    *   **Workflow Import Simulation:** Buttons on the Workflows page demonstrate importing to tools like n8n via `window.postMessage`.

---

## 2. Project Files

This repository contains all the necessary files to run the prototype and build the final Next.js application.

### Backend and Configuration

*   **`supabase_schema.sql`**: The complete PostgreSQL schema for setting up the Supabase database.
*   **`lib/db.ts`**: TypeScript configuration for the Supabase client.
*   **`lib/auth.ts`**: TypeScript configuration for NextAuth.js, including the Supabase adapter.
*   **`lib/notion.ts`**: TypeScript configuration for the Notion SDK, including mock data for blog functionality.

### Frontend Application

The frontend is a complete, interactive prototype built with HTML, CSS, and JavaScript.

