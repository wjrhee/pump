var xlsx = require('xlsx');
var workbook = xlsx.readFile('./public/pipe.xlsx');
var sheetNames = workbook.SheetNames;
var pipeTable = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

console.log(pipeTable);
