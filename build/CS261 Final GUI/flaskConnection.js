// Testing Flask REMOVE -----------------------------------------
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

// Editing north, east, south and west lanes

document.getElementById("editSouth").addEventListener("click", function() {
    fetch("/edit-southbound", {
        method: "GET", // Change to "POST" if needed
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json()) // Assuming the response is JSON
    .then(data => console.log("Success:", data))
    .catch(error => console.error("Error:", error));
});

document.getElementById("editNorth").addEventListener("click", function() {
    fetch("/edit-northbound", {
        method: "GET", // Change to "POST" if needed
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json()) // Assuming the response is JSON
    .then(data => console.log("Success:", data))
    .catch(error => console.error("Error:", error));
});

document.getElementById("editEast").addEventListener("click", function() {
    fetch("/edit-eastbound", {
        method: "GET", // Change to "POST" if needed
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json()) // Assuming the response is JSON
    .then(data => console.log("Success:", data))
    .catch(error => console.error("Error:", error));
});

document.getElementById("editWest").addEventListener("click", function() {
    fetch("/edit-westbound", {
        method: "GET", // Change to "POST" if needed
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json()) // Assuming the response is JSON
    .then(data => console.log("Success:", data))
    .catch(error => console.error("Error:", error));
});

// Adding and removing lanes

// add lane
document.getElementById("addLane").addEventListener("click", function() {
    fetch("/add-lane", {
        method: "GET", // Change to "POST" if needed
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json()) // Assuming the response is JSON
    .then(data => console.log("Success:", data))
    .catch(error => console.error("Error:", error));
});

// remove lane
document.getElementById("removeLane").addEventListener("click", function() {
    fetch("/remove-lane", {
        method: "GET", // Change to "POST" if needed
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json()) // Assuming the response is JSON
    .then(data => console.log("Success:", data))
    .catch(error => console.error("Error:", error));
});

// TO DO BUS LANE
// document.getElementById("busToggle").addEventListener("click", function() {
//     fetch("/bus-toggle", {
//         method: "GET", // Change to "POST" if needed
//         headers: {
//             "Content-Type": "application/json"
//         }
//     })
//     .then(response => response.json()) // Assuming the response is JSON
//     .then(data => console.log("Success:", data))
//     .catch(error => console.error("Error:", error));
// });

// Bus toggle
// Uses JQuery because dynamic objects

$(document).ready(function(){
    $("#columnsContainer").on("click", ".col > .column-buttons > #busToggle", function(){
        console.log("button clicked!");
        $.get("/bus-toggle", function(data){
            console.log(data);
        })
    })
})

// Left lane
$(document).ready(function(){
    $("#columnsContainer").on("click", ".col > .column-buttons > #leftToggle", function(){
        console.log("button clicked!");
        $.get("/left-toggle", function(data){
            console.log(data);
        })
    })
})


// Puffin toggle
document.getElementById("puffin").addEventListener("click", function() {
    fetch("/puffin-toggle", {
        method: "GET", // Change to "POST" if needed
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json()) // Assuming the response is JSON
    .then(data => console.log("Success:", data))
    .catch(error => console.error("Error:", error));
});

// Priority buttons ----------------------------------------------------------------------

document.getElementById("priority1").addEventListener("click", function() {
    fetch("/priority-1", {
        method: "GET", // Change to "POST" if needed
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json()) // Assuming the response is JSON
    .then(data => console.log("Success:", data))
    .catch(error => console.error("Error:", error));
});

document.getElementById("priority2").addEventListener("click", function() {
    fetch("/priority-2", {
        method: "GET", // Change to "POST" if needed
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json()) // Assuming the response is JSON
    .then(data => console.log("Success:", data))
    .catch(error => console.error("Error:", error));
});

document.getElementById("priority3").addEventListener("click", function() {
    fetch("/priority-3", {
        method: "GET", // Change to "POST" if needed
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json()) // Assuming the response is JSON
    .then(data => console.log("Success:", data))
    .catch(error => console.error("Error:", error));
});

document.getElementById("priority4").addEventListener("click", function() {
    fetch("/priority-4", {
        method: "GET", // Change to "POST" if needed
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json()) // Assuming the response is JSON
    .then(data => console.log("Success:", data))
    .catch(error => console.error("Error:", error));
});

// Changes --------------------------------------------------------------------------

document.getElementById("applyChanges").addEventListener("click", function() {
    fetch("/apply-changes", {
        method: "GET", // Change to "POST" if needed
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json()) // Assuming the response is JSON
    .then(data => console.log("Success:", data))
    .catch(error => console.error("Error:", error));
});

document.getElementById("cancelChanges").addEventListener("click", function() {
    fetch("/cancel-changes", {
        method: "GET", // Change to "POST" if needed
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json()) // Assuming the response is JSON
    .then(data => console.log("Success:", data))
    .catch(error => console.error("Error:", error));
});