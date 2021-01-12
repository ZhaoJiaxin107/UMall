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

// default goodlist, consider paging
router.get('/goodslist/:id', async (req, res, next) => {
    // get id
    let id = req.params.id;
    // get product based on third_id
    let third_id = req.query.id
    // pagination
    let { page = 1, length = 16 } = req.query
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
    if (!err) {
        res.send(getMsg('Goods list success', 200, result))
    } else {
        next('Goods list failure')
    }
})

module.exports = router;