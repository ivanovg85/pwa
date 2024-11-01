var defferedPrompt;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(reg => {
        console.log('Registration successful', reg);
    })
        .catch(e => console.error('Error during service worker registration:', e));
} else {
    console.warn('Service Worker is not supported');
}

window.addEventListener('beforeinstallprompt', function(event) {
    console.log('beforeinstallprompt fired')
    event.preventDefault();
    defferedPrompt = event;
    return false;
});