var express = require('express');
var db = require('../utils/db');
var { getMsg } = require('../utils/tool');
var router = express.Router();
let url = 'http://localhost:3000/'


// detail panel
router.get('/:id', async (req, res, next) =>{
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
    if(!err){
        res.send(getMsg('Detail panel success', 200, result))
    }else{
        next('Detail panel failure')
    }
})







module.exports = router

