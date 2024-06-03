// Prompt the user for their name
let userName = prompt("Hello there! What's your name?");

// Check if the user provided a name
if (userName) {
    // Display a warm welcome
    alert(`Welcome, ${userName}! We're glad you're here.`);

    // Ask the user for their age
    let userAge = prompt("Could you share your age with us?");

    // Check if the user provided an age
    if (userAge) {
        // Convert the age to a number
        userAge = parseInt(userAge);

        // Check if the age is a valid number
        if (!isNaN(userAge)) {
            // Display a personalized message based on the user's age
            if (userAge < 18) {
                alert("It's fantastic to see young minds exploring JavaScript!");
            } else {
                alert("It's great to have you exploring JavaScript with us!");
            }
        } else {
            alert("Oops! It seems like you entered an invalid age. Please try again.");
        }
    } else {
        alert("No worries if you don't want to share your age. Enjoy your time with JavaScript!");
    }
} else {
    alert("It's okay if you prefer to stay anonymous. Feel free to explore JavaScript!");
}
