var express = require('express');
var db = require('../utils/db');
var { getMsg } = require('../utils/tool');
var router = express.Router();
let url = 'http://localhost:3000/'

router.get('/categoryfirst', async (req, res, next) => {
    // get first category
    let sql = `SELECT * FROM category_first`
    let [err, result] = await db.query(sql)
    if (!err) {
        res.send(getMsg('First category success', 200, result))
    } else {
        next('First category failure')
    }
})

router.get('/categorysecond', async (req, res, next) => {
    // get second category
    let first_id = req.query.id
    let sql = `SELECT * FROM category_second WHERE first_id = ${first_id}`
    let [err, result] = await db.query(sql)
    if (!err) {
        res.send(getMsg(`Second category success`, 200, result))
    } else {
        next(`Second category failure`)
    }
})

router.get('/categorythird', async (req, res, next) => {
    // get third category
    let second_id = req.query.id
    let sql = `SELECT * FROM category_third WHERE second_id = ${second_id}`
    let [err, result] = await db.query(sql)
    if (!err) {
        res.send(getMsg('Third category success', 200, result))
    } else {
        next('Third category failure')
    }
})

// product recomendation
router.get("/recommend", async (req, res, next) => {
    let sql = `SELECT gl.goods_id, goods_name,
               CONCAT("${url}",image_url) AS image_url, 
               goods_introduce, goods_price
                FROM win_location AS wl
                 JOIN goods_list AS gl
                ON wl.goods_id = gl.goods_id
                ORDER BY rand()
                LIMIT 5`;
    let [err, result] = await db.query(sql)
    if (!err) {
        res.send(getMsg("Product recommendation success", 200, result))
    } else {
        next("Product recommendation failure")
    }
})
// goodlist, considering parameters in url
router.get('/goodslist', async (req, res, next) => {
    // receive parameters and id(third_id) is necessary
    let { id: third_id, page = 1, length = 5, orderBy = 1 } = req.query
    let start = (page - 1) * length
    let orderStr = "", sort = "";
    // judge situation by orderby parameters
    switch (orderBy) {
        case "1":
            orderStr = `ORDER BY rand()`
            break;
        case "2":
            orderStr = `AND new_status = 1 ORDER BY rand()`
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
               FROM goods_list WHERE third_id = ${third_id} 
               ${orderStr} ${sort}
               LIMIT ${start}, ${length}`
    let [err, result] = await db.query(sql)
    // calculate the count of product and total page, add to the result
    // query for the count of one product
    let sql1 = `SELECT COUNT(*) AS count FROM goods_list WHERE third_id = ${third_id}`
    let [err1, result1] = await db.query(sql1)
    // add result to the data
    let count = result1[0].count
    let totalPage = Math.ceil(count/length)
    let data = {
        count,
        totalPage,
        page,
        result
    }
    if (!err) {
        res.send(getMsg('Goods list success', 200, data))
    } else {
        next('Goods list failure')
    }

})
// goodlist, consider paging: search by router
router.get('/goodslist/:id', async (req, res, next) => {
    // get id, sort by different situation
    let id = req.params.id;
    // get product based on third_id
    let third_id = req.query.id
    // pagination
    let { page = 1, length = 5 } = req.query
    let start = (page - 1) * length;
    let sql;
    switch (id) {
        case 'comprehensive':
            sql = `SELECT id, goods_id, 
            third_id, goods_name, 
            CONCAT("${url}", image_url) AS image_url, 
            goods_introduce,goods_manufacturer, 
            goods_price, assem_price, new_status
            FROM goods_list WHERE third_id = ${third_id} 
            ORDER BY rand() LIMIT ${start}, ${length}`
            break;
        case 'newproduct':
            sql = `SELECT id, goods_id, 
                third_id, goods_name, 
                CONCAT("${url}", image_url) AS image_url, 
                goods_introduce,goods_manufacturer, 
                goods_price, assem_price, new_status
                FROM goods_list WHERE third_id = ${third_id} 
                AND new_status = 1
                ORDER BY rand() LIMIT ${start}, ${length}`;
            break;
        case 'goodsprice':
            sql = `SELECT id, goods_id, 
                third_id, goods_name, 
                CONCAT("${url}", image_url) AS image_url, 
                goods_introduce,goods_manufacturer, 
                goods_price, assem_price, new_status
                FROM goods_list WHERE third_id = ${third_id} 
                ORDER BY goods_price ASC 
                LIMIT ${start}, ${length}`;
            break;
        default:
            sql = `SELECT id, goods_id, 
            third_id, goods_name, 
            CONCAT("${url}", image_url) AS image_url, 
            goods_introduce,goods_manufacturer, 
            goods_price, assem_price, new_status
            FROM goods_list WHERE third_id = ${third_id} 
            ORDER BY rand() LIMIT ${start}, ${length}`
            break;
    }
    let [err, result] = await db.query(sql);
    // Query for count and total page
    let sql1 = `SELECT COUNT(*) AS count FROM goods_list WHERE third_id = ${third_id}`;
    let [err1, result1] = await db.query(sql1)
    let data = {
        count: result1[0].count,
        totalPage: Math.ceil(result1[0].count / length),
        curPage: page,
        result
    }
    if (!err) {
        res.send(getMsg('Goods list success', 200, data))
    } else {
        next('Goods list failure')
    }
})
/* 
{
    "msg": "success",
    "status": 200,
    "data": {
            count:count,
            pages:20,
            page:page
            result:[
                {},
                {},
                {}
            ]
     }
}
*/

// goodslist order by different methods

module.exports = router;