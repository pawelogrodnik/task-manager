"use strict";

var db = firebase.database();
var tasks = db.ref('tasks');
//Touch support for jQuery UI
/*!
 * jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011–2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
!function (a) {
    function f(a, b) {
        if (!(a.originalEvent.touches.length > 1)) {
            a.preventDefault();var c = a.originalEvent.changedTouches[0],
                d = document.createEvent("MouseEvents");d.initMouseEvent(b, !0, !0, window, 1, c.screenX, c.screenY, c.clientX, c.clientY, !1, !1, !1, !1, 0, null), a.target.dispatchEvent(d);
        }
    }if (a.support.touch = "ontouchend" in document, a.support.touch) {
        var e,
            b = a.ui.mouse.prototype,
            c = b._mouseInit,
            d = b._mouseDestroy;b._touchStart = function (a) {
            var b = this;!e && b._mouseCapture(a.originalEvent.changedTouches[0]) && (e = !0, b._touchMoved = !1, f(a, "mouseover"), f(a, "mousemove"), f(a, "mousedown"));
        }, b._touchMove = function (a) {
            e && (this._touchMoved = !0, f(a, "mousemove"));
        }, b._touchEnd = function (a) {
            e && (f(a, "mouseup"), f(a, "mouseout"), this._touchMoved || f(a, "click"), e = !1);
        }, b._mouseInit = function () {
            var b = this;b.element.bind({ touchstart: a.proxy(b, "_touchStart"), touchmove: a.proxy(b, "_touchMove"), touchend: a.proxy(b, "_touchEnd") }), c.call(b);
        }, b._mouseDestroy = function () {
            var b = this;b.element.unbind({ touchstart: a.proxy(b, "_touchStart"), touchmove: a.proxy(b, "_touchMove"), touchend: a.proxy(b, "_touchEnd") }), d.call(b);
        };
    }
}(jQuery);

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