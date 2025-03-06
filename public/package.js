document.addEventListener("DOMContentLoaded", function () {
    // Get elements
    const popup = document.getElementById("booking-popup");
    const form = document.getElementById("booking-form");
    const destinationInput = document.getElementById("destination");
    const bookButtons = document.querySelectorAll(".btn");

    // Open Popup when "Book Now" is clicked
    bookButtons.forEach(button => {
        button.addEventListener("click", function () {
            const packageCard = this.closest(".package-card");
            const destination = packageCard.querySelector("h3").innerText; // Get destination name

            destinationInput.value = destination; // Set hidden field
            popup.style.display = "flex"; // Show popup
        });
    });

    // Close the popup
    window.closePopup = function () {
        popup.style.display = "none";
    };

    // Handle Form Submission
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get form data
        const bookingData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            contact: document.getElementById("contact").value,
            people: document.getElementById("people").value,
            destination: document.getElementById("destination").value
        };

        // Send data to the server
        fetch("http://localhost:5000/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bookingData)
        })
        .then(response => response.json())
        .then(data => {
            alert("Booking Successful!"); // Show success message
            closePopup(); // Close popup
            form.reset(); // Reset form
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Booking Failed!");
        });
    });
});
