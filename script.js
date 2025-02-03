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
});
