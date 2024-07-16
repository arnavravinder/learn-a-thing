var firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "learn--a-thing.firebaseapp.com",
    projectId: "learn--a-thing",
    storageBucket: "learn--a-thing.appspot.com",
    messagingSenderId: "380062594384",
    appId: "1:380062594384:web:42c092f386e67cdfce6855",
    measurementId: "G-XQ1BEK7SG8"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    AOS.init();

    const themeIcon = document.getElementById('theme-icon');
    themeIcon.addEventListener('click', toggleTheme);

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        themeIcon.textContent = '🌜';
    }

    showStep(1);
    document.getElementById('onboarding-form').addEventListener('keydown', function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const currentStep = document.querySelector('.step.active');
            const nextButton = currentStep.querySelector('button');
            if (nextButton) nextButton.click();
        }
    });
    document.getElementById('onboarding-form').addEventListener('submit', submitOnboarding);
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

function showStep(step) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((stepDiv, index) => {
        if (index + 1 === step) {
            stepDiv.classList.add('active');
        } else {
            stepDiv.classList.remove('active');
        }
    });
}

function nextStep(step) {
    showStep(step);
}

function submitOnboarding(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const phone = document.getElementById('phone').value;
    const interests = document.getElementById('interests').value;
    const goal = document.getElementById('goal').value;
    const contact = document.getElementById('contact').value;

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            db.collection('users').doc(user.uid).set({
                name: name,
                age: age,
                phone: phone,
                interests: interests,
                goal: goal,
                contact: contact
            })
            .then(() => {
                document.getElementById('onboarding-message').textContent = "Welcome, " + name + "! Your onboarding is complete.";
                localStorage.setItem('onboardingComplete', 'true');
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 2000);
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
                document.getElementById('onboarding-message').textContent = "Error: " + error.message;
            });
        } else {
            document.getElementById('onboarding-message').textContent = "You are not logged in!";
        }
    });
}
