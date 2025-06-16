// Enhanced Authentication System with Modal UI
import { signIn, signOut, getSession } from './auth.js';

class EnhancedAuth {
    constructor() {
        this.modalId = 'auth-modal';
        this.init();
    }

    init() {
        this.createAuthModal();
        this.setupEventListeners();
    }

    createAuthModal() {
        // Check if modal already exists
        if (document.getElementById(this.modalId)) return;

        const modalHTML = `
        <!-- Enhanced Auth Modal -->
        <dialog id="${this.modalId}" class="modal">
            <div class="modal-box w-11/12 max-w-md">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                
                <div id="auth-tabs" class="tabs tabs-boxed mb-6">
                    <a id="signin-tab" class="tab tab-active">Sign In</a>
                    <a id="signup-tab" class="tab">Sign Up</a>
                </div>

                <!-- Sign In Form -->
                <div id="signin-form" class="space-y-4">
                    <h3 class="font-bold text-2xl mb-4">Welcome Back!</h3>
                    <form id="signin-form-element" class="space-y-4">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Email</span>
                            </label>
                            <input type="email" placeholder="your@email.com" class="input input-bordered" required />
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Password</span>
                                <span class="label-text-alt">
                                    <a href="#" class="link link-hover text-xs">Forgot password?</a>
                                </span>
                            </label>
                            <input type="password" placeholder="••••••••" class="input input-bordered" required />
                        </div>
                        <div class="form-control">
                            <label class="cursor-pointer label">
                                <span class="label-text">Remember me</span>
                                <input type="checkbox" class="checkbox checkbox-primary" />
                            </label>
                        </div>
                        <button type="submit" class="btn btn-primary w-full">Sign In</button>
                    </form>
                    
                    <div class="divider">OR</div>
                    
                    <div class="space-y-2">
                        <button class="btn btn-outline w-full gap-2">
                            <svg class="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continue with Google
                        </button>
                        <button class="btn btn-outline w-full gap-2">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                            </svg>
                            Continue with GitHub
                        </button>
                    </div>
                </div>

                <!-- Sign Up Form -->
                <div id="signup-form" class="space-y-4 hidden">
                    <h3 class="font-bold text-2xl mb-4">Create Account</h3>
                    <form id="signup-form-element" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text">First Name</span>
                                </label>
                                <input type="text" placeholder="John" class="input input-bordered" required />
                            </div>
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text">Last Name</span>
                                </label>
                                <input type="text" placeholder="Doe" class="input input-bordered" required />
                            </div>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Email</span>
                            </label>
                            <input type="email" placeholder="your@email.com" class="input input-bordered" required />
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Password</span>
                            </label>
                            <input type="password" placeholder="••••••••" class="input input-bordered" required />
                            <label class="label">
                                <span class="label-text-alt text-xs">At least 8 characters with numbers and symbols</span>
                            </label>
                        </div>
                        <div class="form-control">
                            <label class="cursor-pointer label">
                                <span class="label-text text-sm">I agree to the <a href="#" class="link">Terms of Service</a> and <a href="#" class="link">Privacy Policy</a></span>
                                <input type="checkbox" class="checkbox checkbox-primary" required />
                            </label>
                        </div>
                        <button type="submit" class="btn btn-primary w-full">Create Account</button>
                    </form>
                    
                    <div class="divider">OR</div>
                    
                    <div class="space-y-2">
                        <button class="btn btn-outline w-full gap-2">
                            <svg class="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Sign up with Google
                        </button>
                        <button class="btn btn-outline w-full gap-2">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                            </svg>
                            Sign up with GitHub
                        </button>
                    </div>
                </div>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            // Tab switching
            if (e.target.id === 'signin-tab') {
                this.showSignIn();
            } else if (e.target.id === 'signup-tab') {
                this.showSignUp();
            }
            
            // Open modal for sign in
            if (e.target.matches('[data-action="open-signin"]') || 
                e.target.closest('[data-action="open-signin"]')) {
                e.preventDefault();
                this.openModal('signin');
            }
            
            // Open modal for sign up
            if (e.target.matches('[data-action="open-signup"]') || 
                e.target.closest('[data-action="open-signup"]')) {
                e.preventDefault();
                this.openModal('signup');
            }
        });

        // Form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'signin-form-element') {
                e.preventDefault();
                this.handleSignIn(e.target);
            } else if (e.target.id === 'signup-form-element') {
                e.preventDefault();
                this.handleSignUp(e.target);
            }
        });
    }

    openModal(mode = 'signin') {
        const modal = document.getElementById(this.modalId);
        if (modal) {
            if (mode === 'signup') {
                this.showSignUp();
            } else {
                this.showSignIn();
            }
            modal.showModal();
        }
    }

    showSignIn() {
        document.getElementById('signin-tab').classList.add('tab-active');
        document.getElementById('signup-tab').classList.remove('tab-active');
        document.getElementById('signin-form').classList.remove('hidden');
        document.getElementById('signup-form').classList.add('hidden');
    }

    showSignUp() {
        document.getElementById('signup-tab').classList.add('tab-active');
        document.getElementById('signin-tab').classList.remove('tab-active');
        document.getElementById('signup-form').classList.remove('hidden');
        document.getElementById('signin-form').classList.add('hidden');
    }

    async handleSignIn(form) {
        const formData = new FormData(form);
        const email = formData.get('email') || form.querySelector('input[type="email"]').value;
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing In...';
        submitBtn.disabled = true;

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Use existing sign in function
            const success = signIn();
            
            if (success !== false) {
                // Close modal and redirect
                document.getElementById(this.modalId).close();
                window.location.href = './dashboard/index.html';
            } else {
                throw new Error('Sign in failed');
            }
        } catch (error) {
            console.error('Sign in error:', error);
            this.showNotification('Sign in failed. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleSignUp(form) {
        const formData = new FormData(form);
        const email = formData.get('email') || form.querySelector('input[type="email"]').value;
        const firstName = formData.get('firstName') || form.querySelector('input[placeholder="John"]').value;
        const lastName = formData.get('lastName') || form.querySelector('input[placeholder="Doe"]').value;
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Auto sign in after successful signup
            const success = signIn();
            
            if (success !== false) {
                this.showNotification('Account created successfully! Welcome aboard!', 'success');
                
                // Close modal and redirect after a brief delay
                setTimeout(() => {
                    document.getElementById(this.modalId).close();
                    window.location.href = './dashboard/index.html';
                }, 1500);
            } else {
                throw new Error('Account creation failed');
            }
        } catch (error) {
            console.error('Sign up error:', error);
            this.showNotification('Account creation failed. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} fixed top-4 right-4 w-auto max-w-sm z-50 shadow-lg`;
        toast.innerHTML = `
            <div class="flex items-center gap-2">
                <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}" class="w-5 h-5"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Initialize lucide icons for the toast
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize enhanced auth
const enhancedAuth = new EnhancedAuth();

// Export for use in other modules
window.enhancedAuth = enhancedAuth;