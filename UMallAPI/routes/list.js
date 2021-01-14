var express = require('express');
var db = require('../utils/db');
var { getMsg } = require('../utils/tool');
var router = express.Router();
let url = 'http://localhost:3000/'

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
    // get second category, first_id is necessary
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
    // get third category, second_id is necessary
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
    let { id: third_id, page = 1, length = 5, orderby = 1 } = req.query
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
               FROM goods_list WHERE third_id = ${third_id} 
               ${situation} ${orderStr} ${sort}
               LIMIT ${start}, ${length}`
    let [err, result] = await db.query(sql)
    // calculate the count of product and total page, add to the result
    // query for the count of one product
    if (!err && result.length > 0) {
        let sql1 = `SELECT COUNT(*) AS count FROM goods_list WHERE third_id = ${third_id} ${situation}`
        let [err1, result1] = await db.query(sql1)
        // add result to the data
        if (!err1) {
            let count = result1[0].count
            page = Number(page)
            let totalPage = Math.ceil(count / length)
            let data = {
                count,
                totalPage,
                page,
                result
            }
            res.send(getMsg('Goods list success', 200, data))
        } else {
            next('Goods list failure')
        }
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


module.exports = router;