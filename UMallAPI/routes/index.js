const e = require('express');
var express = require('express');
var db = require('../utils/db');
var { getMsg } = require('../utils/tool');
var router = express.Router();
let url = 'http://localhost:3000/'

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'United Mall' });
});

// hot search
router.get('/hotsearch', async (req, res, next) => {
  let { limit = 9 } = req.query
  let sql = `SELECT * FROM search ORDER BY count DESC LIMIT ${limit}`
  let [err, result] = await db.query(sql)

  if (!err) {
    res.send(getMsg('Hot search success', 200, result))
  } else {
    next('Hot search failure')
  }
})
// search by user
router.get('/searchbyuser', async (req, res, next) => {
  // receive parameters and search text is necessary
  let { searchtext = '', page = 1, length = 5, orderby = 1 } = req.query
  let start = (page - 1) * length
  let orderStr = '', sort = '', situation = '';
  // judge situation by orderby parameters
  switch (orderby) {
    case "1":
      orderStr = `ORDER BY rand()`
      break;
    case "2":
      situation = `AND new_status = 1`
      orderStr = `ORDER BY rand()`
      break;
    case "3":
      orderStr = `ORDER BY goods_price`
      sort = `ASC`
      break;
    default:
      orderStr = `ORDER BY rand()`
      break;
  }
  let sql = `SELECT id, goods_id, 
             third_id, goods_name, 
             CONCAT("${url}", image_url) AS image_url, 
             goods_introduce,goods_manufacturer, 
             goods_price, assem_price, new_status
             FROM goods_list WHERE goods_name LIKE '%${searchtext}%'
             ${situation} ${orderStr} ${sort}
             LIMIT ${start}, ${length}`
  let [err, result] = await db.query(sql)
  // calculate the count of product and total page, add to the result
  // query for the count of one product
  if (!err) {
    let sql1 = `SELECT COUNT(*) AS count FROM goods_list WHERE goods_name LIKE '%${searchtext}%' ${situation}`
    let [err1, result1] = await db.query(sql1)
    // add result to the data
    if (!err1) {
      let count = result1[0].count
      let totalPage = Math.ceil(count / length)
      page = Number(page)
      let data = {
        count,
        totalPage,
        page,
        result
      }
      // judge searchtext, if it exists in the search table, count++
      // else insert a new data
      let sql2 = `SELECT * FROM search WHERE search_text = '${searchtext}'`
      let [err2, result2] = await db.query(sql2)
      // console.log(result2);
      if (result2.length == 0) {
        // insert new value
        // console.log('insert new value');
        let sql3 = `INSERT INTO search(search_text, count) VALUES('${searchtext}', 1)`
        let [err3] = await db.query(sql3)
      } else {
        // console.log('update count');
        // update count
        let searchCount = result2[0].count + 1;
        // update count in search table
        let sql4 = `UPDATE search SET count = ${searchCount} WHERE search_text = '${searchtext}'`
        let [err4] = await db.query(sql4)
      }
      res.send(getMsg('Search by user success', 200, data))
    } else {
      next('Search by user failure')
    }
  } else {
    next('Search by user failure')
  }
})

// get banner information
router.get("/banner", async (req, res, next) => {
  // get banner info from database
  let sql = `SELECT id,CONCAT("${url}",coverimg) AS coverimg FROM banner`

  let [err, result] = await db.query(sql)

  if (!err) {
    res.send(getMsg("Banner success", 200, result))
  } else {
    next("Banner failure")  // 当调用这个的next的时候，程序会去寻找具有4个参数的中间件err,,,next
  }
})

// first category
router.get("/firstcategory", async (req, res, next) => {
  let sql = `SELECT * FROM category_first`
  let [err, result] = await db.query(sql)
  if (!err) {
    res.send(getMsg("First category success", 200, result))
  } else {
    next("First category failure")
  }
})
// flash sale
router.get('/flashsale', async (req, res, next) => {
  // get flash_id from flash_sale
  let curTime = new Date('2021-01-12 13:00:00').getTime();
  let sql = `SELECT * FROM flash_sale WHERE begin_time <= ${curTime} and end_time >= ${curTime}`;
  let [err, result] = await db.query(sql);
  if (!err && result.length > 0) {
    let flash_id = result[0].flash_id;

    // get goods information from goods_list based on flash_id and goods_id
    let sql1 = `SELECT fp.goods_id, 
                    CONCAT("${url}",image_url) AS image_url,
                    goods_name, 
                    goods_price, assem_price
              FROM flash_product as fp
              JOIN goods_list as gl
              ON fp.goods_id = gl.goods_id
              WHERE fp.flash_id = "${flash_id}"
              ORDER BY rand()
              LIMIT 4`
    let [err1, result1] = await db.query(sql1)
    if (!err1 && result1.length > 0) {
      result[0].goods = result1
      res.send(getMsg('Flash sale success', 200, result))
    } else {
      next('Flash sale failure')
    }
  } else {
    next('Flash sale failure')
  }
  // res.send(result);
})

// popular goods
router.get("/populargoods", async (req, res, next) => {
  let sql = `SELECT ge.goods_id,
              CONCAT("${url}", gl.image_url) AS image_url, 
              gl.goods_name,
              SUM(ge.eval_star) as e_star
              FROM goods_eval as ge
              JOIN goods_list as gl
              ON ge.goods_id=gl.goods_id
              GROUP BY ge.goods_id 
              ORDER BY e_star DESC    
              LIMIT 8`
  let [err, result] = await db.query(sql)
  if (!err) {
    res.send(getMsg("Popular goods success", 200, result))
  } else {
    next("Popular goods failure")
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
             LIMIT 8`
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
    res.send(getMsg("Guess goods success", 200, result))
  } else {
    next("Guess goods failure")
  }
})
module.exports = router;
