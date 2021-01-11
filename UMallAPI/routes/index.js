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
  // get banner info from database
  let sql = `SELECT id,CONCAT("${url}",coverimg) AS coverimg FROM banner`

  let [err, result] = await db.query(sql)

  if (!err) {
    res.send(getMsg("banner success", 200, result))
  } else {
    next("banner failure")  // 当调用这个的next的时候，程序会去寻找具有4个参数的中间件err,,,next
  }
})

// first category
router.get("/firstcategory", async (req, res, next) => {
  let sql = `SELECT * FROM category_first`
  let [err, result] = await db.query(sql)
  if (!err) {
    res.send(getMsg("first category success", 200, result))
  } else {
    next("first category failure")
  }
})

// popular goods
router.get("/populargoods", async (req, res, next) => {
  let sql = `SELECT CONCAT("${url}", gl.image_url) AS image_url, 
              gl.goods_name,
              SUM(ge.eval_start) as e_star
              FROM goods_eval as ge
              JOIN goods_list as gl
              ON ge.goods_id=gl.goods_id
              GROUP BY ge.goods_id 
              ORDER BY e_star DESC    
              LIMIT 8
      `
  let [err, result] = await db.query(sql)
  if (!err) {
    res.send(getMsg("popular goods success", 200, result))
  } else {
    next("popular goods failure")
  }
})

// guess what you like
router.get("/guessgoods", async (req, res, next) => {
  let sql = `SELECT 
              CONCAT("${url}",image_url) AS image_url,
              goods_name,
              goods_introduce,
              goods_price
          FROM  goods_list
          ORDER BY RAND() 
          LIMIT 15;`
  let [err, result] = await db.query(sql)
  if (!err) {
    res.send(getMsg("guess goods success", 200, result))
  } else {
    next("guess goods failure")
  }
})



module.exports = router;
