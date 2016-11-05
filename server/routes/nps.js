const express = require('express');
const router = new express.Router();
const xlsx = require('xlsx');


router.get('/', (req, res, next) => {

  var workbook = xlsx.readFile(__dirname + '/pipe.xlsx');
  console.log(workbook);
  var sheetNames = workbook.SheetNames;
  var pipeTable = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  if(pipeTable){
    res.json(pipeTable);
  }
  else{
    res.sendStatus(404);
  }
})
module.exports = router;
