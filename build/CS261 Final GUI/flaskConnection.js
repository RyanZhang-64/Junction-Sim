// Testing Flask REMOVE -----------------------------------------
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

function format_editor_metrics(mean_wait_mins, mean_wait_secs,
    max_wait_mins, max_wait_secs, max_queue, performance, environment) {
    document.getElementById("editor-mean-wait-time").textContent = mean_wait_mins + "m:" + mean_wait_secs + "s";
    document.getElementById("editor-max-wait-time").textContent = max_wait_mins + "m:" + max_wait_secs + "s";
    document.getElementById("editor-max-queue-length").textContent = max_queue;
    document.getElementById("editor-performance-score").textContent = performance;
    // TODO change top 41% of scores

    document.getElementById("editor-environment-score").textContent = environment;
}

document.getElementById("editSouth").addEventListener("click", function() {
    fetch("/edit-southbound")
    .then(response => response.json())  // Convert response to JSON
    .then(data => {
        format_editor_metrics(data.mean_wait_mins, data.mean_wait_secs,
            data.max_wait_mins, data.max_wait_secs,
            data.max_queue, data.performance, data.environment);
    })
    .catch(error => console.error("Error fetching data:", error));
});

document.getElementById("editNorth").addEventListener("click", function() {
    fetch("/edit-northbound")
    .then(response => response.json())  // Convert response to JSON
    .then(data => {
        format_editor_metrics(data.mean_wait_mins, data.mean_wait_secs,
            data.max_wait_mins, data.max_wait_secs,
            data.max_queue, data.performance, data.environment);
    })
    .catch(error => console.error("Error fetching data:", error));
});

document.getElementById("editEast").addEventListener("click", function() {
    fetch("/edit-eastbound")
    .then(response => response.json())  // Convert response to JSON
    .then(data => {
        format_editor_metrics(data.mean_wait_mins, data.mean_wait_secs,
            data.max_wait_mins, data.max_wait_secs,
            data.max_queue, data.performance, data.environment);
    })
    .catch(error => console.error("Error fetching data:", error));
});

document.getElementById("editWest").addEventListener("click", function() {
    fetch("/edit-westbound")
    .then(response => response.json())  // Convert response to JSON
    .then(data => {
        format_editor_metrics(data.mean_wait_mins, data.mean_wait_secs,
            data.max_wait_mins, data.max_wait_secs,
            data.max_queue, data.performance, data.environment);
    })
    .catch(error => console.error("Error fetching data:", error));
});

function update_metrics(mean_wait_mins, mean_wait_secs,
    max_wait_mins, max_wait_secs, max_queue, performance, environment) {

    document.getElementById("mean-wait-time").textContent = mean_wait_mins + "m:" + mean_wait_secs + "s";
    document.getElementById("max-wait-time").textContent = max_wait_mins + "m:" + max_wait_secs + "s";
    document.getElementById("max-queue-length").textContent = max_queue;
    document.getElementById("performance-score").textContent = performance;

    // TODO change top 41% of scoress
    document.getElementById("environment-score").textContent = environment;
}

// Metrics for whole junction
document.addEventListener("DOMContentLoaded", function() {
    fetch("/metrics")
    .then(response => response.json())  // Convert response to JSON
    .then(data => {
        update_metrics(data.mean_wait_mins, data.mean_wait_secs,
            data.max_wait_mins, data.max_wait_secs, data.max_queue, data.performance, data.environment);
        
    })
    .catch(error => console.error("Error fetching data:", error));
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
    .then(data => {
        update_metrics(data.mean_wait_mins, data.mean_wait_secs,
            data.max_wait_mins, data.max_wait_secs, data.max_queue, data.performance,
        data.environment);
        console.log("Success:", data)

    })
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
    .then(data => {


        update_metrics(data.mean_wait_mins, data.mean_wait_secs,
            data.max_wait_mins, data.max_wait_secs, data.max_queue, data.performance,
        data.environment);
        console.log("Success:", data)
    })
    .catch(error => console.error("Error:", error));
});