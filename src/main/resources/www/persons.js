document.counter = 0;

//function drag(ev) {
//    console.log("(onDrag) " + ev);
//
//    //ev.dataTransfer.setData("text", ev.target.id);
//}

function onDragEnterFunc(ev) {
    console.log("(onDragEnter) " + ev);

    var dataTypes = ev.dataTransfer.types;

    for	(index = 0; index < dataTypes.length; index++) {
        var dataType = dataTypes[index];

        console.log(" - data type = " + dataType);
    }

    //ev.preventDefault();
}

function onDragOverFunc(ev) {
    //console.log("(onDragOver) " + ev);

    ev.preventDefault();
}

function onDragLeaveFunc(ev) {
    console.log("(onDragLeave) " + ev);



    //ev.preventDefault();
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
