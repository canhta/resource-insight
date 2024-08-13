function aggregateWeeklyReports() {
  // Folder ID where the individual weekly reports are stored
  var folderId = '1C7NNWqXG07LhZkIhJ9VEvB8yiBQT5KoD';
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);

  // Summary report file ID
  var summaryFileId = '1XCW-G4P8SGpFUyN1FInfQzZ379iUHUx30JYRqndrkgg';
  var summarySpreadsheet = SpreadsheetApp.openById(summaryFileId);

  // Loop through each manager's file and aggregate the data
  while (files.hasNext()) {
    var file = files.next();
    var fileName = file.getName();

    // Filter files by naming convention "Weekly Reports - [Manager Name]"
    var regex = /^Weekly Reports - (.+)$/;
    var match = fileName.match(regex);

    if (match) {
      var managerName = match[1]; // Extract the manager's name from the file name
      var spreadsheet = SpreadsheetApp.open(file);
      var sheets = spreadsheet.getSheets();

      sheets.forEach(function (sheet) {
        var weekName = sheet.getName(); // Use the sheet name as the week identifier

        // Check if the sheet already exists in the summary file
        var summarySheet = summarySpreadsheet.getSheetByName(weekName);
        if (!summarySheet) {
          // If the sheet does not exist, create it
          summarySheet = summarySpreadsheet.insertSheet(weekName);
          var header = [
            'Start of Week',
            'Employee ID',
            'Employee Name',
            'Project',
            'Effort',
          ];
          summarySheet.appendRow(header);
        }

        // Get the data from the current PM's sheet
        var data = sheet.getDataRange().getValues();

        // Skip header row in each manager's sheet
        for (var i = 1; i < data.length; i++) {
          summarySheet.appendRow(data[i]);
        }
      });
    }
  }

  Logger.log('Weekly reports have been aggregated successfully.');
}
