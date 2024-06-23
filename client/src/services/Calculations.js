// calculateBulbMinutes.js
export function calculateBulbMinutes(data) {
    // Calculate total bulb hours
    const totalBulbHours = 1000;
    
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

    // Convert used and remaining bulb minutes to hours
    const usedBulbHours = usedBulbMinutes / 60;
    const remainingBulbHours = remainingBulbMinutes / 60;

    // Convert used and remaining bulb hours to days
    const usedBulbDays = usedBulbHours / 24;
    const remainingBulbDays = remainingBulbHours / 24;

    // Format the results to two decimal places
    const formattedUsedBulbMinutes = usedBulbMinutes.toFixed(2);
    const formattedRemainingBulbMinutes = remainingBulbMinutes.toFixed(2);
    const formattedUsedBulbHours = usedBulbHours.toFixed(2);
    const formattedRemainingBulbHours = remainingBulbHours.toFixed(2);
    const formattedUsedBulbDays = usedBulbDays.toFixed(2);
    const formattedRemainingBulbDays = remainingBulbDays.toFixed(2);

    return {
        usedBulbMinutes: formattedUsedBulbMinutes,
        remainingBulbMinutes: formattedRemainingBulbMinutes,
        usedBulbHours: formattedUsedBulbHours,
        remainingBulbHours: formattedRemainingBulbHours,
        usedBulbDays: formattedUsedBulbDays,
        remainingBulbDays: formattedRemainingBulbDays
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


