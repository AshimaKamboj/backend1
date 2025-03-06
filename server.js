const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 5000;
const FILE_PATH = "booking.json";

// Middleware
app.use(express.json());
app.use(cors());

// Ensure bookings.json exists
if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, "[]", "utf8"); // Create empty array in JSON file
}

// Serve static frontend files
app.use(express.static("public"));

// Default route
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/package.html");
});

// 📌 **Get all bookings**
app.get("/bookings", (req, res) => {
    fs.readFile(FILE_PATH, "utf8", (err, data) => {
        if (err) return res.status(500).json({ message: "Error reading file" });
        res.json(JSON.parse(data));
    });
});

// 📌 **Add a new booking**
// 📌 **Add a new booking with sequential ID**
app.post("/bookings", (req, res) => {
    fs.readFile(FILE_PATH, "utf8", (err, data) => {
        if (err) return res.status(500).json({ message: "Error reading file" });

        let bookings = JSON.parse(data);
        let newId = bookings.length > 0 ? bookings[bookings.length - 1].id + 1 : 1; // Get next ID

        let newBooking = { id: newId, ...req.body };
        bookings.push(newBooking);

        fs.writeFile(FILE_PATH, JSON.stringify(bookings, null, 2), (err) => {
            if (err) return res.status(500).json({ message: "Error saving booking" });
            res.status(201).json(newBooking);
        });
    });
});


// 📌 **Get a booking by ID**
app.get("/bookings/:id", (req, res) => {
    fs.readFile(FILE_PATH, "utf8", (err, data) => {
        if (err) return res.status(500).json({ message: "Error reading file" });

        let bookings = JSON.parse(data);
        let booking = bookings.find(b => b.id == req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        res.json(booking);
    });
});

// 📌 **Update a booking**
app.put("/bookings/:id", (req, res) => {
    fs.readFile(FILE_PATH, "utf8", (err, data) => {
        if (err) return res.status(500).json({ message: "Error reading file" });

        let bookings = JSON.parse(data);
        let index = bookings.findIndex(b => b.id == req.params.id);
        if (index === -1) return res.status(404).json({ message: "Booking not found" });

        bookings[index] = { ...bookings[index], ...req.body };

        fs.writeFile(FILE_PATH, JSON.stringify(bookings, null, 2), (err) => {
            if (err) return res.status(500).json({ message: "Error updating booking" });
            res.json({ message: "Booking updated successfully" });
        });
    });
});

// 📌 **Delete a booking**
app.delete("/bookings/:id", (req, res) => {
    fs.readFile(FILE_PATH, "utf8", (err, data) => {
        if (err) return res.status(500).json({ message: "Error reading file" });

        let bookings = JSON.parse(data);
        let filteredBookings = bookings.filter(b => b.id != req.params.id);

        fs.writeFile(FILE_PATH, JSON.stringify(filteredBookings, null, 2), (err) => {
            if (err) return res.status(500).json({ message: "Error deleting booking" });
            res.json({ message: "Booking deleted successfully" });
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
