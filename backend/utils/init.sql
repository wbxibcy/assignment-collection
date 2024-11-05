-- 删除数据库 HW（如果存在）
DROP DATABASE IF EXISTS HW;

CREATE DATABASE IF NOT EXISTS HW;

-- 使用该数据库
USE HW;

-- 创建教师表
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,         -- 教师ID，主键，自增
    teachername VARCHAR(50) NOT NULL,         -- 教师姓名，非空
    classname VARCHAR(255) NOT NULL,           -- 课程名称，非空
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 创建时间，默认为当前时间
);

-- 创建学生表
CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,         -- 学生ID，主键，自增
    studentname VARCHAR(50) NOT NULL,        -- 学生姓名，非空
    studentnumber INT NOT NULL,                -- 学生编号，非空
    filename VARCHAR(255) NOT NULL,            -- 文件名，非空
    hwnumber INT NOT NULL,                     -- 作业编号，非空
    classname VARCHAR(255) NOT NULL,           -- 课程名称，非空
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 创建时间，默认为当前时间
);
