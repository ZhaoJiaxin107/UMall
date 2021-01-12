var express = require('express');
var db = require('../utils/db');
var { getMsg } = require('../utils/tool');
var router = express.Router();
let url = 'http://localhost:3000/'

router.get('/categoryfirst', async(req, res, next) =>{
    // get first category
    let sql = `SELECT * FROM category_first`
    let [err, result] = await db.query(sql)
    if(!err){
        res.send(getMsg('First category success', 200, result))
    }else{
        next('First category failure')
    }
})

router.get('/categorysecond', async(req, res, next) =>{
    // get second category
    let first_id = req.query.id
    let sql = `SELECT * FROM category_second WHERE first_id = ${first_id}`
    let [err, result] = await db.query(sql)
    if(!err){
        res.send(getMsg(`Second category success`, 200, result))
    }else{
        next(`Second category failure`)
    }
})

router.get('/categorythird', async(req, res, next) =>{
    // get third category
    let second_id = req.query.id
    let sql = `SELECT * FROM category_third WHERE second_id = ${second_id}`
    let [err, result] = await db.query(sql)
    if(!err){
        res.send(getMsg('Third category success', 200, result))
    }else{
        next('Third category failure')
    }
})
module.exports = router;