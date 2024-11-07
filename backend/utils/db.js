const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3').verbose();
const dbConfig = require('../config/config');

const dbType = process.argv[2] || 'tidb';

let pool;

if (dbType === 'sqlite') {
    // SQLite 配置
    pool = new sqlite3.Database(dbConfig.sqlite.database, (err) => {
        if (err) {
            console.error('SQLite 连接失败:', err.message);
        } else {
            console.log('已连接到 SQLite 数据库');
        }
    });

    // 封装查询方法
    pool.query = (query, params) => {
        return new Promise((resolve, reject) => {
            pool.all(query, params, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    };

} else if (dbType === 'tidb') {
    // TiDB 配置
    pool = mysql.createPool({
        host: dbConfig.tidb.host,
        port: dbConfig.tidb.port,
        user: dbConfig.tidb.user,
        password: dbConfig.tidb.password,
        database: dbConfig.tidb.database,
        multipleStatements: true,
    });

    pool.getConnection()
        .then(() => {
            console.log('已连接到 TiDB 数据库');
        })
        .catch((err) => {
            console.error('TiDB 连接失败:', err.stack);
        });
} else {
    console.error('未指定有效的数据库类型。请使用 "sqlite" 或 "tidb"。');
}

module.exports = {
    pool,
};
