const fs = require('fs');
const Papa = require('papaparse');

// Load and parse the CSV-like data
const csvData = fs.readFileSync('device_data.csv', 'utf8');
const { data: records } = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true
});

// Function to calculate duration in minutes between startTime and endTime
function calculateDurationInMinutes(start, end) {
    const startTime = new Date(start);
    const endTime = new Date(end);
    return (endTime - startTime) / (1000 * 60); // Convert milliseconds to minutes
}

// Initialize variables to track the record with the largest duration difference
let maxDifferenceRecord = null;
let maxDifferenceMinutes = 0;

// Iterate through records to find the record with the largest difference
for (let record of records) {
    const { startTime, endTime } = record;
    if (startTime && endTime) {
        const durationMinutes = calculateDurationInMinutes(startTime, endTime);
        if (durationMinutes > maxDifferenceMinutes) {
            maxDifferenceMinutes = durationMinutes;
            maxDifferenceRecord = record;
        }
    }
}

// Print the record with the largest difference
if (maxDifferenceRecord) {
    console.log('Record with the largest difference:');
    console.log(maxDifferenceRecord);
    console.log(`Duration: ${maxDifferenceMinutes.toFixed(2)} minutes`);
} else {
    console.log('No valid records found with both startTime and endTime.');
}
