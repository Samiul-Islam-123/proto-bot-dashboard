const data = `
"serial";"Location1";"Location2";"Location3";"startTime";"endTime";"Diagnostic";"Code";"id"
"ProtoBot";"Sunninghill";"High Care";"1";"2024-06-03 09:55:05";"2024-06-03 10:05:07";"OK";"1";"1"
"ProtoBot";"Sunninghill";"High Care";"5";"2024-06-03 09:58:18";"2024-06-03 10:08:20";"OK";"1";"2"
"ProtoBot";"Sunninghill";"High Care";"5";"2024-06-03 10:02:46";"2024-06-03 10:06:47";"OK";"1";"3"
"ProtoBot";"Sunninghill";"High Care";"8";"2024-06-03 10:09:22";"2024-06-03 10:19:23";"OK";"1";"4"
"ProtoBot";"Sunninghill";"High Care";"11";"2024-06-03 10:22:04";"2024-06-03 10:32:05";"OK";"1";"5"
"ProtoBot";"Sunninghill";"High Care";"4";"2024-06-03 10:31:56";"2024-06-03 10:32:57";"OK";"1";"6"
"ProtoBot";"Sunninghill";"High Care";"2";"2024-06-03 10:35:05";"2024-06-03 10:38:23";"FAIL";"2";"7"
"ProtoBot";"Sunninghill";"High Care";"2";"2024-06-03 13:20:09";"2024-06-03 13:30:10";"OK";"1";"8"
"ProtoBot";"Sunninghill";"High Care";"3";"2024-06-03 13:54:00";"2024-06-03 14:04:01";"OK";"1";"9"
"ProtoBot";"Sunninghill";"High Care";"2";"2024-06-04 11:39:07";"2024-06-04 11:49:08";"OK";"1";"10"
"ProtoBot";"Sunninghill";"High Care";"7";"2024-06-06 11:26:19";"2024-06-06 11:36:20";NULL;NULL;"11"
"ProtoBot";"Sunninghill";"High Care";"1";"2024-06-06 11:40:03";"2024-06-06 11:50:04";NULL;NULL;"12"
"ProtoBot";"Sunninghill";"High Care";"1";"2024-06-07 09:28:19";"2024-06-07 09:35:19";NULL;NULL;"13"
"ProtoBot";"Sunninghill";"High Care";"1";"2024-06-07 09:28:19";"2024-06-07 09:35:19";NULL;NULL;"14"
"ProtoBot";"Sunninghill";"High Care";"8";"2024-06-07 10:18:23";"2024-06-07 10:28:24";NULL;NULL;"15"
"ProtoBot";"Sunninghill";"High Care";"8";"2024-06-07 10:18:23";"2024-06-07 10:28:24";NULL;NULL;"16"
"ProtoBot";"Sunninghill";"High Care";"4";"2024-06-10 12:23:45";"2024-06-10 12:33:46";NULL;NULL;"17"
"ProtoBot";"Sunninghill";"CTICU";"21";"2024-06-12 13:31:51";"2024-06-12 13:42:03";NULL;NULL;"18"
"ProtoBot";"Sunninghill";"NICU";"3";"2024-06-12 13:53:34";"2024-06-12 14:03:46";NULL;NULL;"19"
"ProtoBot";"Sunninghill";"NICU";"3";"2024-06-12 14:08:33";"2024-06-12 14:18:44";NULL;NULL;"20"
"ProtoBot";"Sunninghill";"NICU";"3";"2024-06-12 14:22:05";"2036-02-07 08:29:46";NULL;NULL;"21"
"ProtoBot";"Sunninghill";"CCU";"3";"2024-06-13 10:35:46";"2024-06-13 10:45:57";NULL;NULL;"23"
"ProtoBot";"Sunninghill";"Paediatrics";"Play Room";"2024-06-13 11:00:46";"2024-06-13 11:10:47";NULL;NULL;"24"
"ProtoBot";"Sunninghill";"Paediatrics";"Play Room";"2024-06-13 11:12:35";"2024-06-13 11:22:36";NULL;NULL;"25"
"ProtoBot";"Sunninghill";"Paediatrics";"Procedure";"2024-06-13 11:29:13";"2024-06-13 11:39:14";NULL;NULL;"26"
"ProtoBot";"Sunninghill";"Paediatrics";"Procedure";"2024-06-13 11:40:03";"2024-06-13 11:50:04";NULL;NULL;"27"
"ProtoBot";"Sunninghill";"High Care";"1";"2024-06-13 12:17:43";"2024-06-13 12:27:44";NULL;NULL;"28"
"ProtoBot";"Sunninghill";"High Care";"1";"2024-06-13 12:30:43";"2024-06-13 12:40:44";NULL;NULL;"29"
"ProtoBot";"Sunninghill";"High Care";"2";"2024-06-12 15:22:33";"2024-06-12 15:32:34";NULL;NULL;"30"
"ProtoBot";"Sunninghill";"High Care";"2";"2024-06-12 15:34:53";"2024-06-12 15:44:54";NULL;NULL;"31"
"ProtoBot";"Sunninghill";"High Care";"8";"2024-06-12 14:47:23";"2024-06-12 14:57:24";NULL;NULL;"32"
"ProtoBot";"Sunninghill";"High Care";"8";"2024-06-12 15:02:23";"2024-06-12 15:12:24";NULL;NULL;"33"
"ProtoBot";"Sunninghill";"High Care";"5";"2024-06-12 08:40:23";"2024-06-12 08:50:24";NULL;NULL;"34"
"ProtoBot";"Sunninghill";"NICU";"3";"2024-06-15 15:19:12";"2024-06-15 15:20:13";NULL;NULL;"35"
"ProtoBot";"Sunninghill";"NICU";"3";"2024-06-15 15:24:11";"2024-06-15 15:25:12";NULL;NULL;"36"
"ProtoBot";"Sunninghill";"CTICU";"20";"2024-06-15 18:02:43";"2024-06-15 18:03:44";NULL;NULL;"37"
"ProtoBot";"Sunninghill";"CTICU";"20";"2024-06-15 18:08:23";"2024-06-15 18:09:25";NULL;NULL;"38"
`;

function parseCSV(data) {
    const lines = data.trim().split('\n');
    const headers = lines[0].replace(/"/g, '').split(';');
    return lines.slice(1).map(line => {
      const values = line.replace(/"/g, '').split(';');
      return headers.reduce((obj, header, i) => {
        obj[header] = values[i];
        return obj;
      }, {});
    });
  }
  
  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs} hrs ${mins} mins ${secs} secs`;
  }
  
  function calculateInsights(logs) {
    let totalTime = 0;
    let count = 0;
    let successfulDiagnostics = 0;
    let failedDiagnostics = 0;
    let usagePerDay = {};
  
    logs.forEach(log => {
      if (log.startTime && log.endTime) {
        const startTime = new Date(log.startTime);
        const endTime = new Date(log.endTime);
        const duration = (endTime - startTime) / 1000; // Duration in seconds
        if (!isNaN(duration)) {
          totalTime += duration;
          count++;
          if (log.Diagnostic === 'OK') {
            successfulDiagnostics++;
          } else if (log.Diagnostic === 'FAIL') {
            failedDiagnostics++;
          }
          const dateKey = startTime.toISOString().split('T')[0];
          usagePerDay[dateKey] = (usagePerDay[dateKey] || 0) + duration;
        }
      }
    });
  
    const averageDuration = totalTime / count;
    return {
      totalTime: formatTime(totalTime),
      averageDuration: formatTime(averageDuration),
      successfulDiagnostics,
      failedDiagnostics,
      usagePerDay: Object.fromEntries(Object.entries(usagePerDay).map(([date, time]) => [date, formatTime(time)]))
    };
  }
  

const logs = parseCSV(data);
const insights = calculateInsights(logs);

console.log('Total Usage Time (seconds):', insights.totalTime);
console.log('Average Duration per Operation (seconds):', insights.averageDuration);
console.log('Successful Diagnostics:', insights.successfulDiagnostics);
console.log('Failed Diagnostics:', insights.failedDiagnostics);
console.log('Usage Per Day (seconds):', insights.usagePerDay);
