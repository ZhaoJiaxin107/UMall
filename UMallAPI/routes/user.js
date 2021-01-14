var express = require('express');
var db = require('../utils/db');
var { getMsg, setToken, getToken } = require('../utils/tool');
var router = express.Router();
const svgCaptcha = require("svg-captcha");
const md5 = require('md5');
const { v4: uuid } = require('uuid');
let url = 'http://localhost:3000/'

// register
router.post('/register', async (req, res, next) => {
    let { username, password, code } = req.body
    // console.log(username, password, code)

    // judge whether username, password and code is null
    // if it is null return
    if (!username || !password || !code) {
        res.status(403).send('Please input username or password or verification code')
        return
    }

    // refresh code if session expires
    if (!req.session.code) {
        res.status(403).send('Please refresh verification code')
        return
    }

    // judge whether the entered code correct
    // console.log(req.session.code)
    if (req.session.code.toUpperCase() != code.toUpperCase()) {
        // if enter wrong code, code is invalid
        req.session.code = undefined
        res.status(403).send('Verification code is not correct')
        return
    }

    let sql = `SELECT * FROM member WHERE username = '${username}'`
    let [err, result] = await db.query(sql);
    // console.log(result.length)
    if (result.length > 0) {
        res.status(403).send('Username has existed, please go to login in')
        return
    }

    // add user information to member 
    // Generate non duplicate UID
    let uid = uuid()
    // Password encryption
    password = md5(password)
    let head_photo_url = 'image_source/head_photo/girl_head_03.png'
    let createdate = new Date().getTime()
    // console.log(uid, password, createdate)
    let sql1 = `INSERT INTO member(uid, username, password, head_photo_url, createdate)
    VALUES('${uid}','${username}','${password}','${head_photo_url}','${createdate}')`
    let [err1] = await db.query(sql1)
    res.send(getMsg('Register success', 200))
})

// login in
router.post('/login', async (req, res, next) => {
    let { username, password, code } = req.body
    // console.log(username, password, code)

    // judge whether username, password and code is null
    // if it is null return
    if (!username || !password || !code) {
        res.status(403).send('Please input username or password or verification code')
        return
    }

    // refresh code if session expires
    if (!req.session.code) {
        res.status(403).send('Please refresh verification code')
        return
    }

    // judge whether the entered code correct
    // console.log(req.session.code)
    if (req.session.code.toUpperCase() != code.toUpperCase()) {
        // if enter wrong code, code is invalid
        req.session.code = undefined
        res.status(403).send('Verification code is not correct')
        return
    }
    // judge whether the user exists
    let sql = `SELECT * FROM member WHERE username = '${username}'`
    let [err, result] = await db.query(sql);
    if (result.length == 0) {
        // console.log('Username not exists, please go to register')
        res.status(403).send('Username not exists, please go to register')
        return
    }
    // only username and password matches, user can login in
    password = md5(password)
    let sql1 = `SELECT id, uid, username, password, 
                CONCAT("${url}", head_photo_url) AS head_photo_url, 
                createdate
                FROM member WHERE username = '${username}' 
                AND password = '${password}'`
    let [err1, result1] = await db.query(sql1)

    // console.log(result1)
    if (result1.length == 0) {
        res.status(403).send('Username or password is not correct')
        return
    }
    // User can login in, get token
    let user = {
        username: result1[0].username,
        uid: result1[0].uid
    }
    let token = setToken(user)
    // Login success
    res.send(getMsg('Login success', 200, token))
   
})

router.get('/getcode', function (req, res, next) {
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