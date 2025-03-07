/**
 * Junction Simulator Interaction - This script specifies the Flask 
 * routes that are triggered when buttons are pressed on the simulator.
 */

/**
 * Displays junction arm metrics in the editor
 * @param - Junction arm metrics
 */
function format_editor_metrics(mean_wait_mins, mean_wait_secs, max_wait_mins, max_wait_secs, max_queue, performance, environment, environment_rank, performance_rank) {
    document.getElementById("editor-mean-wait-time").textContent = mean_wait_mins + "m:" + mean_wait_secs + "s";
    document.getElementById("editor-max-wait-time").textContent = max_wait_mins + "m:" + max_wait_secs + "s";
    document.getElementById("editor-max-queue-length").textContent = max_queue;
    document.getElementById("editor-performance-score").textContent = performance;
    document.getElementById("editor-environment-score").textContent = environment;
    document.getElementById("editor-environment-rank").textContent = "Top " + environment_rank + "% of recorded scores";
    document.getElementById("editor-performance-rank").textContent = "Top " + performance_rank + "% of recorded scores";
}

/**
 * Displays metrics of the overall junction in the main editor
 * @param - Junction metrics
 */
function update_metrics(mean_wait_mins, mean_wait_secs, max_wait_mins, max_wait_secs, max_queue, performance, environment, environment_rank, performance_rank) {
    document.getElementById("mean-wait-time").textContent = mean_wait_mins + "m:" + mean_wait_secs + "s";
    document.getElementById("max-wait-time").textContent = max_wait_mins + "m:" + max_wait_secs + "s";
    document.getElementById("max-queue-length").textContent = max_queue;
    document.getElementById("performance-score").textContent = performance;
    document.getElementById("environment-score").textContent = environment;
    document.getElementById("environment-rank").textContent = "Top " + environment_rank + "% of recorded scores";
    document.getElementById("performance-rank").textContent = "Top " + performance_rank + "% of recorded scores";
}

// Displays metrics in the junction arm editor for each direction

document.getElementById("editSouth").addEventListener("click", function() {
    fetch("/edit-southbound")
    .then(response => response.json())  // Convert response to JSON
    .then(data => {
        format_editor_metrics(data.mean_wait_mins, data.mean_wait_secs, data.max_wait_mins, data.max_wait_secs, 
            data.max_queue, data.performance, data.environment, data.environment_rank, data.performance_rank);
    })
    .catch(error => console.error("Error fetching data:", error));
});

document.getElementById("editNorth").addEventListener("click", function() {
    fetch("/edit-northbound")
    .then(response => response.json())  // Convert response to JSON
    .then(data => {
        format_editor_metrics(data.mean_wait_mins, data.mean_wait_secs, data.max_wait_mins, data.max_wait_secs, 
            data.max_queue, data.performance, data.environment, data.environment_rank, data.performance_rank);
    })
    .catch(error => console.error("Error fetching data:", error));
});

document.getElementById("editEast").addEventListener("click", function() {
    fetch("/edit-eastbound")
    .then(response => response.json())  // Convert response to JSON
    .then(data => {
        format_editor_metrics(data.mean_wait_mins, data.mean_wait_secs, data.max_wait_mins, data.max_wait_secs, 
            data.max_queue, data.performance, data.environment, data.environment_rank, data.performance_rank);
    })
    .catch(error => console.error("Error fetching data:", error));
});

document.getElementById("editWest").addEventListener("click", function() {
    fetch("/edit-westbound")
    .then(response => response.json())  // Convert response to JSON
    .then(data => {
        format_editor_metrics(data.mean_wait_mins, data.mean_wait_secs, data.max_wait_mins, data.max_wait_secs, 
            data.max_queue, data.performance, data.environment, data.environment_rank, data.performance_rank);
    })
    .catch(error => console.error("Error fetching data:", error));
});

// Adding and removing lanes on the junction arm

document.getElementById("addLane").addEventListener("click", function() {
    fetch("/add-lane", {
        method: "GET", 
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json()) // Assuming the response is JSON
    .then(data => console.log("Success:", data))
    .catch(error => console.error("Error:", error));
});

document.getElementById("removeLane").addEventListener("click", function() {
    fetch("/remove-lane", {
        method: "GET", 
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json()) // Assuming the response is JSON
    .then(data => console.log("Success:", data))
    .catch(error => console.error("Error:", error));
});

/*
* Toggling bus/bike/left-priority lanes. This uses JQuery
* since buttons are dynamic
*/

// Bus 
$(document).ready(function(){
    $("#columnsContainer").on("click", ".col > .column-buttons > #busToggle", function(){
        console.log("button clicked!");
        $.get("/bus-toggle", function(data){
            console.log(data);
        })
    })
})

// Left-priority
$(document).ready(function(){
    $("#columnsContainer").on("click", ".col > .column-buttons > #leftToggle", function(){
        console.log("button clicked!");
        $.get("/left-toggle", function(data){
            console.log(data);
        })
    })
})

// Bike 
$(document).ready(function(){
    $("#columnsContainer").on("click", ".col > .column-buttons > #bikeToggle", function(){
        console.log("button clicked!");
        $.get("/bike-toggle", function(data){
            console.log(data);
        })
    })
})

// Puffin toggle
document.getElementById("puffin").addEventListener("click", function() {
    fetch("/puffin-toggle", {
        method: "GET", 
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json()) // Assuming the response is JSON
    .then(data => console.log("Success:", data))
    .catch(error => console.error("Error:", error));
});

/*
* Toggling priority buttons. This uses JQuery
* since buttons are dynamic
*/

// Button 1
$(document).ready(function(){
    $(".pagination").on("click", "#priority1 > .page-link", function(){
        console.log("button clicked!");
        $.get("/priority-1", function(data){
            console.log(data);
        })
    })
})

// Button 2
$(document).ready(function(){
    $(".pagination").on("click", "#priority2 > .page-link", function(){
        console.log("button clicked!");
        $.get("/priority-2", function(data){
            console.log(data);
        })
    })
})

// Button 3
$(document).ready(function(){
    $(".pagination").on("click", "#priority3 > .page-link", function(){
        console.log("button clicked!");
        $.get("/priority-3", function(data){
            console.log(data);
        })
    })
})

// Button 4
$(document).ready(function(){
    $(".pagination").on("click", "#priority4 > .page-link", function(){
        console.log("button clicked!");
        $.get("/priority-4", function(data){
            console.log(data);
        })
    })
})

// Displays metrics for the whole junction

// Flask app is opened
document.addEventListener("DOMContentLoaded", function() {
    fetch("/metrics")
    .then(response => response.json())  // Convert response to JSON
    .then(data => {
        update_metrics(data.mean_wait_mins, data.mean_wait_secs, data.max_wait_mins, data.max_wait_secs, 
            data.max_queue, data.performance, data.environment, data.environment_rank, data.performance_rank);
    })
    .catch(error => console.error("Error fetching data:", error));
});

// Main junction editor is loaded after changes are applied
document.getElementById("applyChanges").addEventListener("click", function() {
    let vphValue = document.getElementById("trafficVolumeInput").value;

    fetch("/apply-changes", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ vph: vphValue })
    })
    .then(response => response.json()) // Assuming the response is JSON
    .then(data => {
        update_metrics(data.mean_wait_mins, data.mean_wait_secs, data.max_wait_mins, data.max_wait_secs, 
            data.max_queue, data.performance, data.environment, data.environment_rank, data.performance_rank);
    })
    .catch(error => console.error("Error:", error));
});

// Main junction editor is loaded after changes are discarded
document.getElementById("cancelChanges").addEventListener("click", function() {
    fetch("/cancel-changes", {
        method: "GET", 
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json()) // Assuming the response is JSON
    .then(data => {
        update_metrics(data.mean_wait_mins, data.mean_wait_secs, data.max_wait_mins, data.max_wait_secs, 
            data.max_queue, data.performance, data.environment, data.environment_rank, data.performance_rank);
    })
    .catch(error => console.error("Error:", error));
});

/*
* Handles when the user presses to save their junction,
* including prompting them to overwrite their save if necessary
*/

document.getElementById("saveButton").addEventListener("click", function() {
    fetch("/save-junction", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {

        if (data.result === "success") {

            // Change the button to indicate saved
            const saveButton = document.getElementById("saveButton");
            saveButton.innerHTML = '<i class="fa-solid fa-check"></i> Saved';
            saveButton.classList.remove("btn-secondary");
            saveButton.classList.add("btn-success");
            
            // Revert after a delay
            setTimeout(() => {
                saveButton.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save';
                saveButton.classList.remove("btn-success");
                saveButton.classList.add("btn-secondary");
            }, 2000);

        } else {

            // Inform about overwriting
            const overwriteSave = confirm("Warning: This will overwrite your oldest save. Continue?");

            if (overwriteSave) {
                fetch("/overwrite-save", {
                    method: "GET", 
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(response => response.json()) // Assuming the response is JSON
                .then(data => console.log("Success:", data))
                .catch(error => console.error("Error:", error));
            } 
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Error saving. Please try again.");
    });
});

