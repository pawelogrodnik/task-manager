"use strict";

var db = firebase.database();
var tasks = db.ref('tasks');

$(document).ready(function () {
    tasks.once("value").then(function (snapshot) {
        prepareData(snapshot.val());
    }, function (error) {
        console.log("Error: " + error.code);
    });
});

function prepareData(tasksData) {
    for (var prop in tasksData) {
        generateTemplate(tasksData[prop], tasksData[prop].container, prop);
    }
}

function generateTemplate(data, wrapper, id) {
    wrapper = $('#' + wrapper);
    var template = "<div class=\"task--single\" data-container=\"" + data.container + "\" data-id=" + id + ">\n        " + data.text + "\n    </div>";
    wrapper.append(template);
    $(".user--tasks, .task--list").sortable();

    $(".task--single").draggable({
        revert: "invalid",
        connectToSortable: ".user--tasks, .task--list"
    });

    $(".user--tasks, .task--list").droppable({
        drop: function drop(event, ui) {
            var newContainer = event.target.id;
            var currentTaskContainer = ui.draggable[0].attributes[1].value;
            var taskID = ui.draggable[0].attributes[2].value;
            if (newContainer != currentTaskContainer) {
                updateDB(taskID, newContainer);
            }
        }
    });
}

function updateDB(target, containerID) {
    db.ref('tasks/' + target + '/container').set(containerID);
}