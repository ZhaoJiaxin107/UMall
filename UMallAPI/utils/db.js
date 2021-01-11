const mysql = require("mysql");
const config = require("./config");

class DbConn {
    constructor() {
        // 建立连接
        this.connection = mysql.createConnection(config);

        this.connection.connect(err => {
            if (!err) {
                console.log('Connect to database...')
            } else {
                throw (err);
                console.error("Error connecting:" + err.stcak);
                return;
            }
        });
    }

    // 处理sql语句查询的方法
    async query(sql) {
        return await this.sqlPromise(sql);
    }

    // 异步放到Pormise里面去处理
    sqlPromise(sql) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, (err, results) => {
                if (!err) {
                    resolve([err, results])
                } else {
                    resolve([err, undefined])
                }
            })
        })
    }
}

let dbConn = new DbConn();
module.exports = dbConn;
