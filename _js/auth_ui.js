import { getSession, signIn, signOut } from './auth.js';

function createPublicNavDesktop() {
    const fragment = document.createDocumentFragment();
    const buttonSignIn = document.createElement('a');
    buttonSignIn.href = "#";
    buttonSignIn.className = 'btn btn-ghost';
    buttonSignIn.textContent = 'Sign In';
    buttonSignIn.setAttribute('data-action', 'open-signin');
    buttonSignIn.addEventListener('click', (e) => { 
        e.preventDefault(); 
        // Enhanced auth modal will handle this via event delegation
    });

    const buttonGetStarted = document.createElement('a');
    buttonGetStarted.href = "#";
    buttonGetStarted.className = 'btn btn-primary';
    buttonGetStarted.textContent = 'Get Started';
    buttonGetStarted.setAttribute('data-action', 'open-signup');
    buttonGetStarted.addEventListener('click', (e) => { 
        e.preventDefault(); 
        // Enhanced auth modal will handle this via event delegation
    });
    
    fragment.appendChild(buttonSignIn);
    fragment.appendChild(buttonGetStarted);
    return fragment;
}

function createPublicNavMobile() {
    const tempEl = document.createElement('div');
    tempEl.innerHTML = `
        <div class="divider"></div>
        <li><a href="#" id="signin-btn-mobile" data-action="open-signin">Sign In</a></li>
        <li class="mt-2"><a href="#" id="getstarted-btn-mobile" class="btn btn-sm btn-primary w-full" data-action="open-signup">Get Started</a></li>
    `;

    const fragment = document.createDocumentFragment();
    
    const signInBtn = tempEl.querySelector('#signin-btn-mobile');
    if(signInBtn) {
       signInBtn.addEventListener('click', (e) => { e.preventDefault(); });
    }
    
    const getStartedBtn = tempEl.querySelector('#getstarted-btn-mobile');
    if(getStartedBtn) {
        getStartedBtn.addEventListener('click', (e) => { e.preventDefault(); });
    }

    while (tempEl.firstChild) {
        fragment.appendChild(tempEl.firstChild);
    }
    
    return fragment;
}

function createAuthenticatedNavDesktop() {
     const fragment = document.createDocumentFragment();
     const isDashboard = window.location.pathname.includes('/dashboard/');
     const dashboardPath = isDashboard ? './index.html' : 'dashboard/index.html';
     
     const tempEl = document.createElement('div');
     tempEl.innerHTML = `<a href="${dashboardPath}" class="btn btn-primary">Go to Dashboard</a>`;
     while (tempEl.firstChild) {
         fragment.appendChild(tempEl.firstChild);
     }
     return fragment;
}

function createAuthenticatedNavMobile() {
    const fragment = document.createDocumentFragment();
    const isDashboard = window.location.pathname.includes('/dashboard/');
    const dashboardPath = isDashboard ? './index.html' : 'dashboard/index.html';
    
    const tempEl = document.createElement('div');
    tempEl.innerHTML = `
        <div class="divider"></div>
        <li><a href="${dashboardPath}" class="btn btn-sm btn-primary w-full">Go to Dashboard</a></li>
    `;
    while (tempEl.firstChild) {
        fragment.appendChild(tempEl.firstChild);
    }
    return fragment;
}

function createDashboardNav(session) {
    const container = document.createElement('div');
    container.className = "dropdown dropdown-end";
    container.innerHTML = `
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
                <img alt="User Avatar" src="${session.user.image}" />
            </div>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><p class="justify-between font-medium px-4 py-2">${session.user.email}</p></li>
            <div class="divider my-1"></div>
            <li><a>Profile</a></li>
            <li><a>Settings</a></li>
            <li><button id="signout-btn">Sign Out</button></li>
        </ul>
    `;
    container.querySelector('#signout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        signOut();
        window.location.href = '../index.html';
    });
    return container;
}


function updateUI() {
    const session = getSession();
    
    const desktopContainer = document.getElementById('auth-container-desktop');
    if (desktopContainer) {
        desktopContainer.innerHTML = '';
        if (session) {
            desktopContainer.appendChild(createAuthenticatedNavDesktop());
        } else {
            desktopContainer.appendChild(createPublicNavDesktop());
        }
    }

    const mobileContainer = document.getElementById('auth-container-mobile');
    if (mobileContainer) {
        mobileContainer.innerHTML = '';
        if (session) {
            mobileContainer.appendChild(createAuthenticatedNavMobile());
        } else {
            mobileContainer.appendChild(createPublicNavMobile());
        }
    }
    
    const dashboardContainer = document.getElementById('auth-container-dashboard');
    if (dashboardContainer && session) {
        dashboardContainer.innerHTML = '';
        dashboardContainer.appendChild(createDashboardNav(session));
    }
}

document.addEventListener('DOMContentLoaded', updateUI);