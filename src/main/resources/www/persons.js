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
    } else  if(hasMimeType(ev, "text/plain")) {
        ev.preventDefault();
    } else {
        console.info("Forbid drop because MIME:[" + MIME_PERSON + "] has not been found");
    }
}

function onDragOverFunc(ev) {
    console.log("(onDragOver) DataTypes:[" + mimeTypesToString(ev) + "]");

    if(hasPersonMimeType(ev)) {
        ev.preventDefault();
    } else  if(hasMimeType(ev, "text/plain")) {
        ev.preventDefault();
    }
}

function onDropFunc(ev) {
    ev.preventDefault();

    console.log("(onDrop) MIME types:[" + mimeTypesToString(ev) + "]");

    if (hasPersonMimeType(ev)) {
        console.info("MIME:[" + MIME_PERSON + "] has been found");

        const personJson1 = ev.dataTransfer.getData(MIME_PERSON);
        const person1 = JSON.parse(personJson1);

        createPerson(person1.firstname, person1.lastname);
    } else if(hasMimeType(ev, "text/plain")){
        const personJson2 = ev.dataTransfer.getData("text/plain");
        const person2 = JSON.parse(personJson2);

        createPerson(person2.firstname, person2.lastname);
        console.info("Forbid drop because MIME:[" + MIME_PERSON + "] has not been found");
    }
}


function onDragPerson(event) {
    const firstname = event.target.getAttribute("firstname");
    const lastname = event.target.getAttribute("lastname");

    console.debug("Drag started on [" + firstname + " " + lastname + "]");

    const person = new Person(firstname, lastname);
    var personJSON = JSON.stringify(person);

    console.debug("Person JSON = " + personJSON);

    event.dataTransfer.effectAllowed = 'copy';

    event.dataTransfer.setData(MIME_PERSON, personJSON);
    event.dataTransfer.setData('text/plain', firstname + " " + lastname);
}

/**
 * Define Person class
 */
function Person(firstname, lastname) {
    this.firstname = firstname;
    this.lastname = lastname;
}

function createPerson(firstname, lastname) {
    console.log("append Person:[" + firstname + " " + lastname + "] to list");

    var newNode = document.createElement('li');
    newNode.setAttribute("firstname", firstname);
    newNode.setAttribute("lastname", lastname);
    newNode.setAttribute("draggable", "true");
    //newNode.draggable = true;
    newNode.textContent = firstname + " " + lastname;
    newNode.ondragstart = onDragPerson;

    document.getElementById("personList").appendChild(newNode);
}
function onCreatePerson(ev) {
    const firstnameInput = document.getElementById("person_firstname");
    const lastnameInput = document.getElementById("person_lastname");

    const firstname = firstnameInput.value;
    const lastname = lastnameInput.value;

    if (firstname === "" || lastname === "") {
        // no input so stop event processing
        console.warn("no input on firstname or lastname")
        return;
    }

    // Reset input fields
    firstnameInput.value = "";
    lastnameInput.value = "";

    createPerson(firstname, lastname);
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

