const express = require('express');
const router = new express.Router();
const xlsx = require('xlsx');


router.get('/', (req, res, next) => {

  var workbook = xlsx.readFile(__dirname + '/fittings.xlsx');
  var sheetNames = workbook.SheetNames;
  var fittingsData = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  if(fittingsData){
    res.json(fittingsData);
  }
  else{
    res.sendStatus(404);
  }
})
module.exports = router;
