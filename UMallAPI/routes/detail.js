var express = require('express');
var db = require('../utils/db');
var { getMsg } = require('../utils/tool');
var router = express.Router();
let url = 'http://localhost:3000/'

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
// detail panel
router.get('/:id', async (req, res, next) => {
    // receive dynamic router
    
    let id = req.params.id
    let sql = `SELECT gl.goods_id, goods_name, 
                CONCAT("${url}", image_url) AS image_url,
                goods_introduce, goods_manufacturer,
                goods_price, assem_price,
                goods_detailed_information,
                new_status, style_name_id,
                style_name, style_value_id,
                style_value
               FROM goods_list AS gl
               JOIN goods_style AS gs
               ON gl.goods_id = gs.goods_id
               WHERE gl.goods_id = ${id}`
    let [err, result] = await db.query(sql)

    // get rotation small images
    let goods_id = result[0].goods_id
    let sql1 = `SELECT id, 
                    CONCAT("${url}", file_name) AS filename,
                    goods_id 
                FROM goods_image 
                WHERE goods_id = ${goods_id}`
    let [err1, result1] = await db.query(sql1)
    result[0].filenames = result1
    // res.send(result);
    if (!err) {
        res.send(getMsg('Detail panel success', 200, result))
    } else {
        next('Detail panel failure')
    }
})

// comment part
// we can get all the evaluation information by goods_id
// we can get username and avatar from uid
// params: page and comment length
router.get('/comment/:id', async (req, res, next) => {
    // receive dynamic router
    let id = req.params.id
    let { page = 1, length = 5 } = req.query
    // console.log(req.query)
    let start = (page - 1) * length;
    let sql = `SELECT eval_id, goods_id,
               ge.uid, style_name_id,
               style_value_id, eval_text,
               eval_star, create_time,
               username,
               CONCAT("${url}", head_photo_url) AS head_photo_url
               FROM goods_eval AS ge
               JOIN member
               ON ge.uid = member.uid
               WHERE ge.goods_id = ${id}
               LIMIT ${start}, ${length}`
    let [err, result] = await db.query(sql)
    if (!err) {
        res.send(getMsg('Comment success', 200, result))
    } else {
        next('Comment failure')
    }
})

module.exports = router

