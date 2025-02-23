$(document).ready(function () {
    // When the RSVP button is clicked, show the RSVP form.
    $("#rsvp").click(function () {
        $("#rsvpForm").removeClass("hidden");
        $("#container").addClass("hidden");
        $(".welcome").addClass("hidden");
    });

    $("#print").click(function () {
        $("#printForm").removeClass("hidden");
        $("#container").addClass("hidden");
        $(".welcome").addClass("hidden");
    });

    $("#details").click(function () {
        $("#detailsForm").removeClass("hidden");
        $("#container").addClass("hidden");
        $(".welcome").addClass("hidden");
    });

    $("#plans").click(function () {
        $("#plansForm").removeClass("hidden");
        $("#container").addClass("hidden");
        $(".welcome").addClass("hidden");
    });

    $("#plansback").click(function () {
        $(".welcome").removeClass("hidden");
        $("#plansForm").addClass("hidden");
        $("#container").removeClass("hidden");
    });

    $("#detailsback").click(function () {
        $(".welcome").removeClass("hidden");
        $("#detailsForm").addClass("hidden");
        $("#container").removeClass("hidden");
    });

    $("#rsvpback").click(function () {
        $(".welcome").removeClass("hidden");
        $("#rsvpForm").addClass("hidden");
        $("#container").removeClass("hidden");
    });

    $("#printback").click(function () {
        $(".welcome").removeClass("hidden");
        $("#printForm").addClass("hidden");
        $("#container").removeClass("hidden");
    });
});

//AIzaSyDdpo3h2zvV8CCHppWziYHC2jQ94jVJWUI


// --- Google API Setup ---
const CLIENT_ID = '401657671966-kofb464skmqtm0i64vet53rk2qllq56t.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDdpo3h2zvV8CCHppWziYHC2jQ94jVJWUI';
// Discovery doc for Sheets API.
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
// Scopes for reading and writing spreadsheet data.
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

// Your spreadsheet ID and range settings.
const SPREADSHEET_ID = '1qrF6VJw-krSowUbXxo4jrgXTo3xOa-rSS3AwEsj38pk';
// Assume rows 2 and onward contain guest groups:
// Columns A-C: guest names; Column D: RSVP status.
const GUEST_RANGE = 'Sheet1!A2:D';

// Global variable to hold guest data loaded from the spreadsheet.
let guestData = [];

// Called when the API client library is loaded.
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

// Initializes the API client library and sets up sign-in.
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(() => {
        // Listen for sign-in state changes.
        alert('woeked');
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }, error => {
        alert(JSON.stringify(error, null, 2));
        console.error(JSON.stringify(error, null, 2));
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        loadGuestListFromSheet().then(() => {
            // Now that the guest data is loaded, initialize the RSVP form.
            createRSVPForm();
        });
    } else {
        gapi.auth2.getAuthInstance().signIn();
    }
}

// Loads the guest list from the spreadsheet.
function loadGuestListFromSheet() {
    return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: GUEST_RANGE,
    }).then(response => {
        // Each row represents a group.
        guestData = response.result.values || [];
        alert(guestData)
        console.log("Gu;est data loaded:", guestData);
    });
}

// --- RSVP Form Code (Modified) ---

// Create the RSVP form elements.
function createRSVPForm() {
    const stuffDiv = document.getElementById("stuff");
    stuffDiv.innerHTML = '';

    // Create search input.
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Enter your name";
    searchInput.id = "searchInput";
    stuffDiv.appendChild(searchInput);

    // Create search button.
    const searchButton = document.createElement("button");
    searchButton.innerText = "Search";
    searchButton.onclick = searchGuests;
    stuffDiv.appendChild(searchButton);

    // Container for guest checkboxes.
    const guestContainer = document.createElement("div");
    guestContainer.id = "guestContainer";
    guestContainer.style.marginTop = "10px";
    stuffDiv.appendChild(guestContainer);

    // RSVP button.
    const rsvpButton = document.createElement("button");
    rsvpButton.innerText = "RSVP";
    rsvpButton.onclick = submitRSVP;
    rsvpButton.style.display = "none";
    rsvpButton.id = "rsvpButton";
    // We'll store the matching row index on this button.
    stuffDiv.appendChild(rsvpButton);
}

// Searches the loaded guestData for the group that contains the searched name.
function searchGuests() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase().trim();
    const guestContainer = document.getElementById("guestContainer");
    guestContainer.innerHTML = '';
    let foundGroup = null;

    // Loop over each row (group) in guestData.
    guestData.forEach((row, index) => {
        // Assume the first three columns are guest names.
        const names = row.slice(0, 3).filter(name => name && name.trim() !== "");
        if (names.some(name => name.toLowerCase() === searchValue)) {
            foundGroup = { names: names, rowIndex: index };
        }
    });

    if (foundGroup) {
        // Render checkboxes for each guest in the group.
        foundGroup.names.forEach(name => {
            if (name === "+1") {
                // Create plus-one block with checkbox and hidden text input.
                const plusOneDiv = document.createElement("div");
                plusOneDiv.className = "plusOneBlock";

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.className = "plusOneCheck";
                checkbox.id = "plusOneCheck_" + Math.random().toString(36).substr(2, 9);

                const label = document.createElement("label");
                label.htmlFor = checkbox.id;
                label.innerText = "Bring a +1";

                const plusOneInput = document.createElement("input");
                plusOneInput.type = "text";
                plusOneInput.placeholder = "Enter +1 Name";
                plusOneInput.className = "plusOneInput";
                plusOneInput.style.display = "none";

                // Show/hide plus-one input based on checkbox.
                checkbox.addEventListener("change", function () {
                    plusOneInput.style.display = this.checked ? "inline-block" : "none";
                });

                plusOneDiv.appendChild(checkbox);
                plusOneDiv.appendChild(label);
                plusOneDiv.appendChild(plusOneInput);
                guestContainer.appendChild(plusOneDiv);
            } else {
                // Regular guest checkbox.
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.value = name;
                checkbox.id = name.replace(/ /g, "_") + "_" + Math.random().toString(36).substr(2, 5);

                const label = document.createElement("label");
                label.htmlFor = checkbox.id;
                label.innerText = name;

                guestContainer.appendChild(checkbox);
                guestContainer.appendChild(label);
                guestContainer.appendChild(document.createElement("br"));
            }
        });
        // Save the matching group's row index (for updating RSVP status later).
        document.getElementById("rsvpButton").dataset.rowIndex = foundGroup.rowIndex;
        document.getElementById("rsvpButton").style.display = "block";
    } else {
        document.getElementById("rsvpButton").style.display = "none";
        guestContainer.innerHTML = "No matching group found.";
    }
}

// When the RSVP button is clicked, process the selections and update the spreadsheet.
function submitRSVP() {
    const guestContainer = document.getElementById("guestContainer");
    let selectedGuests = [];

    // Gather checked guest names.
    const guestCheckboxes = guestContainer.querySelectorAll("input[type='checkbox']:not(.plusOneCheck)");
    guestCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedGuests.push(checkbox.value);
        }
    });

    // Process plus-one blocks.
    const plusOneBlocks = guestContainer.querySelectorAll(".plusOneBlock");
    plusOneBlocks.forEach(block => {
        const check = block.querySelector(".plusOneCheck");
        const input = block.querySelector(".plusOneInput");
        if (check.checked && input.value.trim() !== "") {
            selectedGuests.push(input.value.trim() + " (+1)");
        }
    });

    // Update the spreadsheet’s RSVP status for the matching group.
    const rowIndex = document.getElementById("rsvpButton").dataset.rowIndex;
    if (rowIndex !== undefined) {
        // Calculate the actual row number (assuming header in row 1).
        const sheetRow = parseInt(rowIndex) + 2;
        const range = `Sheet1!D${sheetRow}`;
        const valueInputOption = "RAW";
        // For example, we update with a message listing the RSVP’d names.
        const values = [
            ["RSVP'd: " + selectedGuests.join(", ")]
        ];
        const body = { values: values };

        gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: range,
            valueInputOption: valueInputOption,
            resource: body
        }).then(response => {
            console.log("RSVP status updated:", response);
            const stuffDiv = document.getElementById("stuff");
            stuffDiv.innerHTML = `<h2>Thank you!</h2><p>You have RSVP'd for: ${selectedGuests.join(", ")}</p>`;
        }, error => {
            console.error("Error updating RSVP status:", error);
        });
    }
}


$(document).ready(function () {
    // When the RSVP button is clicked, show the RSVP form.
    $("#rsvp").click(function () {
        $("#rsvpForm").removeClass("hidden");
        $("#container").addClass("hidden");
    });

    $("#print").click(function () {
        $("#printForm").removeClass("hidden");
        $("#container").addClass("hidden");
    });

    $("#details").click(function () {
        $("#detailsForm").removeClass("hidden");
        $("#container").addClass("hidden");
    });

    $("#plans").click(function () {
        $("#plansForm").removeClass("hidden");
        $("#container").addClass("hidden");
    });

    $("#plansback").click(function () {
        $("#plansForm").addClass("hidden");
        $("#container").removeClass("hidden");
    });

    $("#detailsback").click(function () {
        $("#detailsForm").addClass("hidden");
        $("#container").removeClass("hidden");
    });

    $("#rsvpback").click(function () {
        $("#rsvpForm").addClass("hidden");
        $("#container").removeClass("hidden");
    });

    $("#printback").click(function () {
        $("#printForm").addClass("hidden");
        $("#container").removeClass("hidden");
    });
});
