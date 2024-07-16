var firebaseConfig = {

firebase.initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', () => {
    AOS.init();

    const themeIcon = document.getElementById('theme-icon');
    themeIcon.addEventListener('click', toggleTheme);

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        themeIcon.textContent = '🌜';
    }

    document.getElementById('google-login').addEventListener('click', googleLogin);
    document.getElementById('passwordless-login-form').addEventListener('submit', sendMagicLink);
});

function toggleTheme() {
    document.body.classList.toggle('dark');
    const themeIcon = document.getElementById('theme-icon');
    if (document.body.classList.contains('dark')) {
        themeIcon.textContent = '🌜';
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.textContent = '🌞';
        localStorage.setItem('theme', 'light');
    }
}

function googleLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            window.location.href = "/dashboard.html";
        })
        .catch((error) => {
            console.error(error);
        });
}

function sendMagicLink(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const actionCodeSettings = {
        url: window.location.origin + '/dashboard.html',
        handleCodeInApp: true,
    };

    firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
        .then(() => {
            window.localStorage.setItem('emailForSignIn', email);
            document.getElementById('login-message').textContent = "Check your email for the magic link!";
        })
        .catch((error) => {
            console.error(error);
        });
}

if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
        email = window.prompt('Please provide your email for confirmation');
    }
    firebase.auth().signInWithEmailLink(email, window.location.href)
        .then((result) => {
            window.localStorage.removeItem('emailForSignIn');
            window.location.href = "/dashboard.html";
        })
        .catch((error) => {
            console.error(error);
        });
}
