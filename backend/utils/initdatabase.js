const sqlite3 = require('sqlite3').verbose();
const { pool } = require('./db');
const fs = require('fs');

async function initDatabase() {
    try {
        if (pool instanceof sqlite3.Database) {
            // 对于 SQLite
            let sql = fs.readFileSync('./utils/init.sql', 'utf8');

            // 移除 CREATE DATABASE 和 USE 语句
            sql = sql.replace(/^\s*(CREATE DATABASE|USE|DROP)\s+.*?;\s*/gm, '');

            pool.exec(sql, (err) => {
                if (err) {
                    console.error('SQLite 数据库初始化失败:', err.message);
                } else {
                    console.log('SQLite 数据库初始化成功');
                }
            });
        } else {
            // 对于 TiDB
            const connection = await pool.getConnection();
            // console.log('已成功连接到 TiDB 数据库');

            const sql = fs.readFileSync('./utils/init.sql', 'utf8');
            await connection.query(sql);
            console.log('TiDB 数据库初始化成功');

            connection.release();
        }
    } catch (err) {
        console.error('数据库初始化失败:', err);
    }
}

// 运行初始化
initDatabase();
