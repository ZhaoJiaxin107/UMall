var express = require('express');
const { user } = require('../utils/config');
var db = require('../utils/db');
var { getMsg } = require('../utils/tool');
var router = express.Router();
const svgCaptcha = require("svg-captcha")
let url = 'http://localhost:3000/'

router.post('/register', async function (req, res, next) {
    let { username, password, code } = req.body
    // console.log(username, password, code)

    // judge whether username, password and code is null
    // if it is null return
    if(!username || !password || !code){
        res.status(404).send('请输入用户名或密码或者验证码')
        return
    } 
})

router.get('/getcode', function(req, res, next){
    let svgico = svgCaptcha.create({
        size: 4,
        ignoreChars: '0o1Il',
        noise: 3,
        color: false,
        background: '#eee'
    })
    console.log(svgico.text)

    // render svgico data into page
    res.type('svg');
    res.send(svgico.data);
})

module.exports = router