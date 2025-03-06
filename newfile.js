const fs = require('fs');
const filePath = './packages.json';

// 📌 Read Data from JSON File
const readUserData = () => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return []; // Return empty array if file doesn't exist
    }
};

// 📌 Write Data to JSON File
const writeUserData = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

module.exports = { readUserData, writeUserData };
