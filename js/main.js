// CodeSync_test/js/main.js
import { Auth } from 'aws-amplify';
import './amplify_config.js'; // Import your Amplify configuration

// --- Shared Authentication Logic ---
let currentAuthToken = null;

async function checkAuthAndDisplayUser() {
    try {
        const user = await Auth.currentAuthenticatedUser();
        currentAuthToken = user.signInUserSession.idToken.jwtToken;
        // Check if displayUsername element exists before trying to set textContent
        const displayUsernameElement = document.getElementById('displayUsername');
        if (displayUsernameElement) {
            displayUsernameElement.textContent = user.username || user.attributes.email;
        }


        // If on results page, trigger stats display after auth check
        if (document.getElementById('results')) {
            displayStats();
        }
    } catch (error) {
        console.log('User not authenticated, redirecting to login:', error);
        window.location.href = 'login.html';
    }
}

async function handleLogout() {
    try {
        await Auth.signOut();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error signing out:', error);
    }
}

// Toggle user menu dropdown
document.addEventListener('DOMContentLoaded', () => {
    const userMenuButton = document.getElementById('userMenuButton');
    if (userMenuButton) { // Ensure button exists on the page
        userMenuButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent document click from closing immediately
            const userMenu = document.getElementById('userMenu');
            if (userMenu) { // Ensure userMenu exists
                userMenu.classList.toggle('hidden');
            }
        });

        // Close dropdown if clicked outside
        window.addEventListener('click', (event) => {
            const userMenu = document.getElementById('userMenu');
            if (userMenu && !userMenuButton.contains(event.target) && !userMenu.contains(event.target)) {
                if (!userMenu.classList.contains('hidden')) {
                    userMenu.classList.add('hidden');
                }
            }
        });
    }

    // Call authentication check on load for protected pages
    // This check is applied to both index.html and results.html by default due to body class
    // Make sure login.html and signup.html do NOT have this body class if you want them unsecured
    if (document.body.classList.contains('bg-gray-900') && !window.location.href.includes('login.html') && !window.location.href.includes('signup.html')) {
        checkAuthAndDisplayUser();
    }
});


// --- Logic Specific to index.html (Input Page) ---
// Functions for index.html need to be exposed if they are called directly from HTML onclick attributes.
// The if (document.getElementById('leetcode')) check ensures this code only runs on index.html
if (document.getElementById('leetcode')) { // Check if on the input page
    function toggleCheckmark(inputElement) { //
        const checkId = inputElement.id + 'Check'; //
        const check = document.getElementById(checkId); //
        if (check) { // Added check if element exists
            if (inputElement.value.trim()) { //
                check.classList.add('checked'); //
            } else {
                check.classList.remove('checked'); //
            }
        }
    }

    function navigateToResults() { //
        const leetcode = document.getElementById("leetcode").value.trim(); //
        const codechef = document.getElementById("codechef").value.trim(); //
        const hackerrank = document.getElementById("hackerrank").value.trim(); //
        const gfg = document.getElementById("gfg").value.trim(); //

        const params = new URLSearchParams(); //
        if (leetcode) params.append('leetcode', leetcode); //
        if (codechef) params.append('codechef', codechef); //
        if (hackerrank) params.append('hackerrank', hackerrank); //
        if (gfg) params.append('gfg', gfg); //

        window.location.href = `results.html?${params.toString()}`; //
    }

    // Expose these functions globally for onclick attributes in index.html
    window.toggleCheckmark = toggleCheckmark;
    window.navigateToResults = navigateToResults;
}


// --- Logic Specific to results.html (Results Page) ---
// The if (document.getElementById('results')) check ensures this code only runs on results.html
if (document.getElementById('results')) { // Check if on the results page
    // Configuration for platform data (unchanged)
    const platformConfig = { /* ... (same as before) ... */ }; //
        
    // Cache DOM elements (unchanged)
    const resultsDiv = document.getElementById("results"); //
    const urlParams = new URLSearchParams(window.location.search); //
        
    // Main function to display stats (unchanged, but now correctly called by checkAuthAndDisplayUser)
    async function displayStats() { //
        showLoadingState(); //
        
        try { //
            const [platformsData, gfgData] = await Promise.all([ //
                fetchPlatformsData(currentAuthToken), // Pass token
                fetchGFGData(currentAuthToken) // Pass token
            ]);
            
            renderResults(platformsData, gfgData); //
        } catch (error) { //
            showErrorState(error); //
        }
    }
        
    // Fetch data from platforms API (now sends Authorization header) (unchanged)
    async function fetchPlatformsData(token) { /* ... (same as before) ... */ } //
        
    // Fetch GFG data (now sends Authorization header) (unchanged)
    async function fetchGFGData(token) { /* ... (same as before) ... */ } //
        
    // Show loading state (unchanged)
    function showLoadingState() { /* ... (same as before) ... */ } //
        
    // Show error state (unchanged)
    function showErrorState(error) { /* ... (same as before) ... */ } //
        
    // Render results cards (unchanged)
    function renderResults(platformsData, gfgData) { /* ... (same as before) ... */ } //
        
    // Render error card for a platform (unchanged)
    function renderErrorCard(platform, username, config) { /* ... (same as before) ... */ } //
    
    // Expose displayStats globally for the retry button on results.html
    window.displayStats = displayStats;
}

// --- Logic Specific to login.html ---
// Functions for login.html need to be exposed if they are called directly from HTML onclick attributes.
if (document.getElementById('loginForm') || document.getElementById('confirmForm')) { // Check if on login or signup pages
    // These functions were originally in login.html and signup.html's script tags
    // They are now consolidated here and exposed.
    const loginForm = document.getElementById('loginForm'); //
    const confirmForm = document.getElementById('confirmForm'); //
    const errorMessageDiv = document.getElementById("errorMessage"); //
    const messageBox = document.getElementById('messageBox'); // For signup.html success/error messages
    const confirmMessageBox = document.getElementById('confirmMessageBox'); //


    function showMessage(element, message, isSuccess = true) {
        if (element) { // Check if element exists
            element.textContent = message;
            element.classList.remove('hidden', 'success-message', 'error-message');
            element.classList.add(isSuccess ? 'success-message' : 'error-message');
        }
    }

    async function handleLogin() { //
        const username = document.getElementById("username")?.value.trim();
        const password = document.getElementById("password")?.value.trim();
        if (errorMessageDiv) errorMessageDiv.classList.add('hidden'); // Clear previous errors


        if (!username || !password) {
            if (errorMessageDiv) {
                errorMessageDiv.textContent = "Please enter both username/email and password.";
                errorMessageDiv.classList.remove('hidden');
            }
            return;
        }

        try {
            await Auth.signIn({ username, password }); //
            console.log('User logged in successfully.'); //
            window.location.href = 'index.html'; // Redirect to the main input page
        } catch (error) {
            console.error('Error logging in:', error); //
            if (error.code === 'UserNotConfirmedException') { //
                const confirmUsernameInput = document.getElementById('confirmUsername');
                if (confirmUsernameInput) confirmUsernameInput.value = username; // Pre-fill username

                if (loginForm) loginForm.classList.add('hidden'); //
                if (confirmForm) confirmForm.classList.remove('hidden'); //
                showMessage(confirmMessageBox, "Your account is not confirmed. Please enter the verification code sent to your email.", false); //
            } else {
                if (errorMessageDiv) {
                    errorMessageDiv.textContent = error.message || "An unexpected error occurred during login."; //
                    errorMessageDiv.classList.remove('hidden'); //
                }
            }
        }
    }

    async function handleSignUp() { // from signup.html
        const username = document.getElementById("username")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("password")?.value.trim();
        if (messageBox) messageBox.classList.add('hidden');

        if (!username || !email || !password) {
            showMessage(messageBox, "Please fill in all fields.", false);
            return;
        }

        try {
            const { user } = await Auth.signUp({ //
                username, //
                password, //
                attributes: { email } //
            });
            console.log('User signed up successfully:', user); //
            const confirmUsernameInput = document.getElementById('confirmUsername');
            if (confirmUsernameInput) confirmUsernameInput.value = username; // Pre-fill for convenience
            
            const signupFormElement = document.getElementById('signupForm');
            const confirmFormElement = document.getElementById('confirmForm');

            if (signupFormElement) signupFormElement.classList.add('hidden');
            if (confirmFormElement) confirmFormElement.classList.remove('hidden');
            
            showMessage(confirmMessageBox, "Verification code sent to your email!", true); //
        } catch (error) {
            console.error('Error signing up:', error); //
            showMessage(messageBox, error.message || "An unexpected error occurred during sign-up.", false); //
        }
    }

    async function handleConfirmSignUp() { //
        const username = document.getElementById("confirmUsername")?.value.trim();
        const code = document.getElementById("confirmationCode")?.value.trim();
        if (confirmMessageBox) confirmMessageBox.classList.add('hidden'); //

        if (!username || !code) {
            showMessage(confirmMessageBox, "Please enter username and confirmation code.", false); //
            return;
        }

        try {
            await Auth.confirmSignUp({ username, confirmationCode: code }); //
            console.log('User confirmed successfully.'); //
            showMessage(confirmMessageBox, "Account confirmed! You can now log in.", true); //
            setTimeout(() => { //
                window.location.href = 'login.html'; //
            }, 2000); // Redirect after 2 seconds
        } catch (error) {
            console.error('Error confirming sign up:', error); //
            showMessage(confirmMessageBox, error.message || "Error confirming account. Please check the code.", false); //
        }
    }

    async function handleResendCode() { //
        const username = document.getElementById("confirmUsername")?.value.trim();
        if (confirmMessageBox) confirmMessageBox.classList.add('hidden'); //

        if (!username) {
            showMessage(confirmMessageBox, "Please enter your username to resend the code.", false); //
            return;
        }

        try {
            await Auth.resendSignUpCode({ username }); //
            showMessage(confirmMessageBox, "New verification code sent!", true); //
        } catch (error) {
            console.error('Error resending code:', error); //
            showMessage(confirmMessageBox, error.message || "Error resending code.", false); //
        }
    }

    // EXPOSE GLOBAL FUNCTIONS FOR ONCLICK ATTRIBUTES
    window.handleLogin = handleLogin;
    window.handleSignUp = handleSignUp; // For signup.html
    window.handleConfirmSignUp = handleConfirmSignUp;
    window.handleResendCode = handleResendCode;
}
