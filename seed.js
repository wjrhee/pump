var xlsx = require('xlsx');
var workbook = xlsx.readFile('pipe.xlsx');
var sheetNames = workbook.SheetNames;
var test = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
console.log(test);
