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
// four plates
router.get('/fourplates', async (req, res, next) => {
  // seek for third name from home and category_third
  let sql = `SELECT h.id, h.second_id, 
              CONCAT("${url}", h.image_url) AS image_url, 
              h.big_title, h.small_title, 
              ct.id, ct.third_id, 
              ct.third_name, ct.second_id 
             FROM home as h
             JOIN category_third as ct
             ON h.second_id = ct.second_id
             ORDER BY rand()
             LIMIT 4`
  let [err, result] = await db.query(sql)

  let promiseArr1 = [];
  let promiseArr2 = [];
  // 根据home表里的second_id，去category_third 
  // 三级分类里面找对应的三级分类名称，随机拿四个
  result.forEach(item => {
    // console.log(item);
    let second_id = item.second_id;
    let sql1 = `SELECT third_name FROM category_third 
      WHERE second_id = ${second_id} ORDER BY rand() LIMIT 4`
    let sql2 = `SELECT goods_id, goods_name, CONCAT("${url}",image_url) AS image_url, 
    goods_introduce, goods_manufacturer, goods_price, assem_price FROM goods_list WHERE second_id = ${second_id}
      ORDER BY rand() LIMIT 4`
    promiseArr1.push(db.query(sql1));
    promiseArr2.push(db.query(sql2));
    // console.log(promiseArr1);
  })
  // result1 get third_name
  let result1 = await Promise.all(promiseArr1);
  let result2 = await Promise.all(promiseArr2);
  // res.send(result2);
  result.forEach((item, index) => {
    // add third classification for the result 
    // console.log(item, index);
    item.third_name = result1[index][1]
    item.goods = result2[index][1]
  })
  if (!err) {
    res.send(getMsg("Four Plates success", 200, result))
  } else {
    next('Four plates failure')
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
