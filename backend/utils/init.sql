-- 删除数据库 HW（如果存在）
DROP DATABASE IF EXISTS HW;

CREATE DATABASE IF NOT EXISTS HW;

-- 使用该数据库
USE HW;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,        -- 用户ID，主键，自增
    username VARCHAR(50) NOT NULL UNIQUE,      -- 用户名，非空，唯一
    password VARCHAR(255) NOT NULL,            -- 密码，非空
    class VARCHAR(255) NOT NULL,               -- 班级，非空
    role TEXT CHECK(role IN ('teacher', 'student')) NOT NULL,  -- 用户角色，'teacher' 或 'student'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 创建时间，默认为当前时间
);

-- 创建课程表
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,         -- 课程ID，主键，自增
    course_name VARCHAR(255) NOT NULL,         -- 课程名称，非空
    description TEXT,                          -- 课程描述
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 创建时间，默认为当前时间
);

-- 创建学生课程关联表
CREATE TABLE IF NOT EXISTS student_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,         -- ID，主键，自增
    student_id INT NOT NULL,                   -- 学生ID，外键，关联用户表
    course_id INT NOT NULL,                    -- 课程ID，外键，关联课程表
    filename VARCHAR(255) NOT NULL,            -- 作业文件名，非空
    homework_number VARCHAR(50) NOT NULL,      -- 作业编号
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间，默认为当前时间
    FOREIGN KEY (student_id) REFERENCES users(id), -- 外键关联用户表（学生）
    FOREIGN KEY (course_id) REFERENCES courses(id)  -- 外键关联课程表
);

-- 创建教师课程关联表
CREATE TABLE IF NOT EXISTS teacher_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,         -- ID，主键，自增
    teacher_id INT NOT NULL,                   -- 教师ID，外键，关联用户表
    course_id INT NOT NULL,                    -- 课程ID，外键，关联课程表
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间，默认为当前时间
    FOREIGN KEY (teacher_id) REFERENCES users(id), -- 外键关联用户表（教师）
    FOREIGN KEY (course_id) REFERENCES courses(id)  -- 外键关联课程表
);