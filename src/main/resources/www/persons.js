const MIME_PERSON = "application/x-pigelvy-person";

document.counter = 0;

//function drag(ev) {
//    console.log("(onDrag) " + ev);
//
//    //ev.dataTransfer.setData("text", ev.target.id);
//}

function onDragEnterFunc(ev) {
    console.log("(onDragEnter) DataTypes:[" + mimeTypesToString(ev) + "]");

    if (hasPersonMimeType(ev)) {
        console.info("Allow drop because MIME:[" + MIME_PERSON + "] has been found");

        ev.preventDefault();
    } else {
        console.info("Forbid drop because MIME:[" + MIME_PERSON + "] has not been found");
    }
}

function onDragOverFunc(ev) {
    console.log("(onDragOver) DataTypes:[" + mimeTypesToString(ev) + "]");

    if(hasPersonMimeType(ev)) {
        ev.preventDefault();
    }
}

function onDropFunc(ev) {
    console.log("(onDrop) " + ev.toString());

    ev.preventDefault();

    var someText = "provided types : [";

    for (var i = 0, size = ev.dataTransfer.types.length; i < size; i++) {
        var dataType = ev.dataTransfer.types[i];

        if(i != 0) someText += ",";

        someText += dataType;

    }

    someText += "]";

    console.log("(onDrop) " + someText);

    //var data = ev.dataTransfer.getData("text");

    //ev.target.appendChild(document.getElementById(data));
}



function clickOnList(ev) {
    var newNode = document.createElement('li');

    newNode.textContent = "Item " + ++document.counter;
    console.log("append <LI> to list : " + newNode.textContent);

    ev.target.parentNode.appendChild(newNode);
}

function hasPersonMimeType(dragEvent) {
    return hasMimeType(dragEvent, MIME_PERSON);
}

function hasMimeType(dragEvent, mimeType) {
    const dataTypes = dragEvent.dataTransfer.types;

    const indexOfMimType = $.inArray(mimeType, dataTypes);

    console.log("index of MIME:[" + mimeType + "] = " + indexOfMimType);

    return indexOfMimType != -1;
}

function mimeTypesToString(event) {
    const types = event.dataTransfer.types;

    var text = "";

    for (var i = 0; i < types.length; i++) {
        if(i > 0) {
            text += ",";
        }

       text += types[i];
    }

    return text;
}

/* Test the output methods of the console object. */
function testConsoleApi() {
    console.debug("debug msg"); //works with firefox 34 & Chrome 39
    console.log("log msg");
    console.info("info msg");
    console.warn("warn msg");
    console.error("error msg");
}

