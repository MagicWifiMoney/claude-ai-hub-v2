const FAKE_SESSION_KEY = 'claude_ai_hub_session';

export function signIn() {
    const session = {
        user: {
            email: 'user@example.com',
            name: 'Demo User',
            image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    try {
        localStorage.setItem(FAKE_SESSION_KEY, JSON.stringify(session));
        console.log('User signed in (simulated).');
    } catch (e) {
        console.error('Could not save session to localStorage.', e);
    }
}

export function signOut() {
    try {
        localStorage.removeItem(FAKE_SESSION_KEY);
        console.log('User signed out.');
    } catch (e) {
        console.error('Could not remove session from localStorage.', e);
    }
}

export function getSession() {
    try {
        const sessionStr = localStorage.getItem(FAKE_SESSION_KEY);
        if (!sessionStr) return null;
        
        const session = JSON.parse(sessionStr);
        if (new Date(session.expires) < new Date()) {
            signOut();
            return null;
        }
        return session;
    } catch (e) {
        console.error('Could not retrieve session from localStorage.', e);
        return null;
    }
}

export function checkAuth() {
    const session = getSession();
    if (!session) {
        console.log('Not authenticated, redirecting to home page.');
        window.location.href = '../index.html'; 
    }
}
