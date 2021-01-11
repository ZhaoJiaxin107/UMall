var express = require('express');
var db = require('../utils/db');
var { getMsg } = require('../utils/tool');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// get banner information
router.get('/banner',async (req,res)=>{
  // get banner from database
  let sql =  `SELECT * FROM banner`
  let [err, result] = await db.query(sql)

  if(!err){
    res.send(getMsg('success', 200, result))
  }else{
    res.send(getMsg('fail', 500, err))
  }
})

module.exports = router;
