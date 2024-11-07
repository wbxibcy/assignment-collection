const xlsx = require("xlsx");
const { pool } = require("../utils/db");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

// 导入学生信息的函数
exports.importStudentsFromExcel = async (filePath) => {
  // 读取 Excel 文件
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const students = xlsx.utils.sheet_to_json(sheet);

  // 用于存储插入成功和已存在的学生信息
  const insertedStudents = [];
  const existingStudents = [];

  // 遍历每一行学生信息
  for (const student of students) {
    const { username, class: studentClass, role } = student;
    console.log(student);

    // 使用学号作为默认密码
    const defaultPassword = username;

    // 对密码进行哈希加密，盐值设置为6
    const hashedPassword = await bcrypt.hash(defaultPassword, 6);

    // 检查学生是否已经存在
    const [userExists] = await pool.query("SELECT id FROM users WHERE username = ?", [username]);
    if (userExists.length === 0) {
      // 如果用户不存在，插入学生信息到数据库
      await pool.query(
        "INSERT INTO users (username, password, class, role) VALUES (?, ?, ?, ?)",
        [username, hashedPassword, studentClass, role]
      );
      console.log(`学生 ${username} 插入成功，默认密码已加密`);
      insertedStudents.push({ username, password: defaultPassword, studentClass, role });  // 将插入成功的学生加入数组
    } else {
      console.log(`学生 ${username} 已存在`);
      existingStudents.push({ username, password: defaultPassword, studentClass, role });  // 将已存在的学生加入数组
    }
  }

  // 创建一个新的 Excel 文件，包含插入成功和已存在的学生信息
  const newWorkbook = xlsx.utils.book_new();
  
  // 将插入成功和已存在的学生分别放到不同的工作表
  const insertedSheet = xlsx.utils.json_to_sheet(insertedStudents);
  const existingSheet = xlsx.utils.json_to_sheet(existingStudents);

  // 为每个工作表添加标题
  xlsx.utils.book_append_sheet(newWorkbook, insertedSheet, "插入成功");
  xlsx.utils.book_append_sheet(newWorkbook, existingSheet, "已存在");

  // 生成一个临时文件路径
  const fileName = `students_import_result_${Date.now()}.xlsx`;
  const filePathToSave = path.join(__dirname, "../uploads", fileName);

  // 写入文件
  xlsx.writeFile(newWorkbook, filePathToSave);

  // 返回生成的文件路径
  return filePathToSave;
};
