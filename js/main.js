const db = firebase.database();
const tasks = db.ref('tasks');

$(document).ready(function () {
    tasks.once("value").then(function (snapshot) {
        prepareData(snapshot.val());
    }, function (error) {
        console.log("Error: " + error.code);
    });
})

function prepareData(tasksData) {
    for (let prop in tasksData) {
        generateTemplate(tasksData[prop], tasksData[prop].container, prop);
    }
}

function generateTemplate(data, wrapper, id) {
    wrapper = $('#' + wrapper);
    const template = `<div class="task--single" data-container="${data.container}" data-id=${id}>
        ${data.text}
    </div>`
    wrapper.append(template);
    $(".user--tasks, .task--list").sortable();
    
    $(".task--single").draggable({
        revert: "invalid",
        connectToSortable: ".user--tasks, .task--list"
    });

    $(".user--tasks, .task--list").droppable({
        drop: function (event, ui) {
            const newContainer = event.target.id;
            const currentTaskContainer = ui.draggable[0].attributes[1].value;
            const taskID = ui.draggable[0].attributes[2].value;
            if (newContainer != currentTaskContainer) {
                updateDB(taskID, newContainer);
            }
        }
    });
}

function updateDB(target, containerID) {
    db.ref('tasks/' + target + '/container').set(containerID);
}