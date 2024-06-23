// calculateBulbMinutes.js
export function calculateBulbMinutes(data, totalBulbHours) {
    totalBulbHours = calculateTotalBulbHours(data)
    console.log(totalBulbHours)
    // Convert total bulb hours to minutes
    const totalBulbMinutes = totalBulbHours * 60;

    // Calculate used bulb minutes
    const usedBulbMinutes = data.reduce((acc, curr) => {
        const start = new Date(curr.startTime);
        const end = new Date(curr.endTime);
        const operationMinutes = (end - start) / (1000 * 60); // Convert milliseconds to minutes
        return acc + operationMinutes;
    }, 0);

    // Calculate remaining bulb minutes
    const remainingBulbMinutes = totalBulbMinutes - usedBulbMinutes;

    // Format the results to two decimal places
    const formattedUsedBulbMinutes = usedBulbMinutes.toFixed(2);
    const formattedRemainingBulbMinutes = remainingBulbMinutes.toFixed(2);

    return {
        usedBulbMinutes: formattedUsedBulbMinutes,
        remainingBulbMinutes: formattedRemainingBulbMinutes
    };
}

// function to calculate total used bulb hours from the provided data
export function calculateTotalBulbHours(data) {
    // Initialize totalBulbHours accumulator
    let totalBulbHours = 0;

    // Iterate through each entry in the data
    data.forEach(item => {
        // Convert startTime and endTime to Date objects
        const start = new Date(item.startTime);
        const end = new Date(item.endTime);

        // Calculate operation hours in milliseconds and convert to hours
        const operationHours = (end - start) / (1000 * 60 * 60);

        // Add operation hours to totalBulbHours accumulator
        totalBulbHours += operationHours;
    });

    // Return the totalBulbHours
    return totalBulbHours;
}


