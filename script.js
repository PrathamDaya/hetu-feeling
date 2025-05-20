const scriptURL = 'https://script.google.com/macros/s/AKfycbzH4whliZSRjcTeoA_8UQAzM9OmtNohfqiQKmeoJZWXa_xQOHg_e11bTRavjcjZqtzn/exec'; // Replace with your Google Apps Script Web App URL
const pages = document.querySelectorAll('.page');
let currentEmotion = '';

function navigateTo(pageId, emotion = '') {
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    currentEmotion = emotion;
    if (pageId === 'page2' && emotion) {
        document.querySelector('#page2 h2').textContent = `You selected: ${emotion}. Please let me know your thoughts.`;
    }
    if (pageId === 'page3') {
        const messageBox = document.getElementById('message-box');
        const messageTextarea = document.getElementById('message');
        // Ensure messageTextarea has a value before trying to substring
        if (messageTextarea.value) {
            messageBox.textContent = messageTextarea.value.substring(0, 20) + '...'; // Show a snippet in the animation
        } else {
            messageBox.textContent = "Message sent!"; // Fallback text
        }
    }
}

function submitEntry() {
    const message = document.getElementById('message').value;
    if (!message.trim()) {
        alert('Please enter your thoughts.');
        return;
    }

    // --- FIX START: Format local timestamp for Google Sheets ---
    const now = new Date();

    // Get date components
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, add 1
    const day = String(now.getDate()).padStart(2, '0');

    // Get time components
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Construct the human-readable local timestamp string
    // Example format: "20/05/2025 17:17:31" (Day/Month/Year Hour:Minute:Second)
    const formattedTimestamp = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    // --- FIX END ---


    const formData = new FormData();
    formData.append('emotion', currentEmotion);
    formData.append('message', message);
    formData.append('timestamp', formattedTimestamp); // Send the formatted local timestamp

    fetch(scriptURL, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Assuming your Apps Script returns JSON. If it returns plain text, change response.json() to response.text()
        return response.json();
    })
    .then(data => {
        console.log('Success!', data);
        navigateTo('page3');
        document.getElementById('message').value = ''; // Clear the textarea
    })
    .catch((error) => {
        console.error('Error!', error);
        alert('There was an error submitting your entry. Please try again later.');
    });
}

// Initial navigation to the first page
navigateTo('page1');
