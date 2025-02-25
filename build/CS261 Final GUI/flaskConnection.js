// Testing Flask
fetch('/api/data')
    .then(response => response.json())
    .then(data => console.log(data.message)); // Logs "Hello from Flask!"


    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("compareButton").addEventListener("click", function () {
            fetch("/api/button-click")  // Calls the Flask backend route
                .then(response => response.json()) // Convert response to JSON
                .then(data => {
                    console.log(data.message); // Log response in console
                    // document.getElementById("response").innerText = data.message; // Update the page
                })
                .catch(error => console.error("Error:", error));
        });
    });