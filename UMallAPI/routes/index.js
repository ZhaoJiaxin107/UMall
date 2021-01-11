var express = require('express');
var db = require('../utils/db');
var { getMsg } = require('../utils/tool');
var router = express.Router();
let url = 'http://localhost:3000/'

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// get banner information
router.get("/banner", async (req, res, next) => {
  // 把banner的数据从数据库里，拿出来
  // let  sql=`SELECT * FROM banner`
  // let sql=`SELECT id,CONCAT("http://localhost:3000/",coverimg) AS coverimg FROM banner`

  let sql = `SELECT id,CONCAT("${url}",coverimg) AS coverimg FROM banner`

  let [err, result] = await db.query(sql)

  if (!err) {
    res.send(getMsg("banner success", 200, result))
  } else {
    next("banner failure")  // 当调用这个的next的时候，程序会去寻找具有4个参数的中间件err,,,next
  }
})

// 一级分类  路由不同、查询语句不同
router.get("/firstcategory", async (req, res, next) => {
  let sql = `SELECT * FROM category_first`
  let [err, result] = await db.query(sql)
  if (!err) {
    res.send(getMsg("first category success", 200, result))
  } else {
    next("first category failure")
  }
})



module.exports = router;
