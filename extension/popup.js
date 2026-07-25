/**
 * Popup script for the AI Fake News Detector extension.
 * Handles login, logout, and sending article text to the backend.
 */

const API_URL = 'http://localhost:5000';

const $ = (id) => document.getElementById(id);
const show = (id) => $(id).classList.remove('hidden');
const hide = (id) => $(id).classList.add('hidden');

// Promise wrappers around the callback-based chrome.storage API
const storage = {
    get: (keys) => new Promise((res) => chrome.storage.local.get(keys, res)),
    set: (obj) => new Promise((res) => chrome.storage.local.set(obj, res)),
    remove: (keys) => new Promise((res) => chrome.storage.local.remove(keys, res)),
};

document.addEventListener('DOMContentLoaded', async () => {
    const { token, user } = await storage.get(['token', 'user']);

    if (token && user) {
        showMain(user);
    } else {
        show('login-section');
    }

    $('login-btn').addEventListener('click', login);
    $('logout-btn').addEventListener('click', logout);
    $('analyze-btn').addEventListener('click', analyze);
});

function showMain(user) {
    $('user-name').textContent = user.name;
    hide('login-section');
    show('main-section');
}

async function login() {
    hide('login-error');

    const email = $('email').value.trim();
    const password = $('password').value;

    if (!email || !password) {
        return showError('login-error', 'Email and password required.');
    }

    try {
        const res = await fetch(`${API_URL}/API/LOGIN`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Login failed');
        }

        await storage.set({ token: data.token, user: data.user });
        showMain(data.user);
    } catch (e) {
        showError('login-error', e.message);
    }
}

async function logout() {
    await storage.remove(['token', 'user']);
    hide('main-section');
    hide('result');
    show('login-section');
    $('email').value = '';
    $('password').value = '';
}

async function analyze() {
    const text = $('text-input').value.trim();

    if (!text) {
        return showError('error-msg', 'Please paste some text.');
    }

    hide('error-msg');
    hide('result');
    show('loader');

    const { token } = await storage.get(['token']);

    try {
        const res = await fetch(`${API_URL}/API/ANALYZE`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ text }),
        });

        const data = await res.json();
        hide('loader');

        if (!res.ok) {
            if (res.status === 401) {
                // token expired or invalid — send the user back to login
                await logout();
                return showError('login-error', 'Session expired. Please sign in again.');
            }
            throw new Error(data.error || 'Analysis failed');
        }

        renderResult(data);
    } catch (e) {
        hide('loader');
        showError('error-msg', e.message);
    }
}

function renderResult(data) {
    const verdict = data.prediction || 'Unknown';
    const conf = data.confidence || 0;
    const card = $('result');

    card.classList.remove('real', 'fake');

    if (verdict === 'Real') {
        card.classList.add('real');
    }
    if (verdict === 'Fake') {
        card.classList.add('fake');
    }

    const verdictEl = $('verdict');
    verdictEl.textContent = verdict;
    verdictEl.style.color = verdict === 'Fake' ? '#e74c3c' : verdict === 'Real' ? '#2ecc71' : '#95a5a6';

    $('confidence-num').textContent = `${conf}%`;

    const bar = $('progress-bar');
    bar.style.width = '0%';
    bar.style.backgroundColor = verdict === 'Fake' ? '#e74c3c' : verdict === 'Real' ? '#2ecc71' : '#95a5a6';

    // start at 0 then animate to the real width on the next tick
    setTimeout(() => { bar.style.width = `${conf}%`; }, 50);

    const risk = riskLevel(verdict, conf);
    const badge = $('risk-badge');
    badge.textContent = risk.label;
    badge.style.backgroundColor = risk.color;

    show('result');
}

function riskLevel(prediction, confidence) {
    if (prediction === 'Real' && confidence > 80) {
        return { label: 'LOW RISK', color: '#2ecc71' };
    }

    if (prediction === 'Fake' && confidence > 80) {
        return { label: 'HIGH RISK', color: '#e74c3c' };
    }

    if (confidence > 60) {
        return { label: 'MEDIUM RISK', color: '#f39c12' };
    }

    return { label: 'UNCERTAIN', color: '#95a5a6' };
}

function showError(id, msg) {
    const el = $(id);
    el.textContent = msg;
    el.classList.remove('hidden');
}
