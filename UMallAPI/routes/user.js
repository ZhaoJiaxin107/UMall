var express = require('express');
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
        res.status(403).send('请输入用户名或密码或者验证码')
        return
    } 

    // refresh code if session expires
    if(!req.session.code){
        res.status(403).send('请刷新验证码')
        return
    }

    // judge whether the entered code correct
    // console.log(req.session.code)
    if(req.session.code.toUpperCase()!=code.toUpperCase()){
        // if enter wrong code, code is invalid
        req.session.code = undefined
        res.status(403).send('验证码错误')
        return
    }

    res.send('注册成功')





})

router.get('/getcode', function(req, res, next){
    let svgico = svgCaptcha.create({
        size: 4,
        ignoreChars: '0o1Il',
        noise: 3,
        color: false,
        background: '#eee'
    })
    req.session.code = svgico.text
    console.log(req.session.code)
    // render svgico data into page
    res.type('svg')
    res.send(svgico.data)
})

module.exports = router