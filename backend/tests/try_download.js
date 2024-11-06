const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// 模拟数据库查询结果
const homeworkData = [
    {
        "studentname": "John Doe1",
        "studentnumber": 43,
        "filename": "uploads/3f2ab6abfe67223e2c4af7424a22df11e1718086921c87aa92c63267fe683537.txt",
        "hwnumber": "1",
        "classname": "Physics",
        "created_at": "2024-11-07 00:10:47"
    },
    {
        "studentname": "John Doe2",
        "studentnumber": 45,
        "filename": "uploads/3f2ab6abfe67223e2c4af7424a22df11e1718086921c87aa92c63267fe683537.txt",
        "hwnumber": "1",
        "classname": "Physics",
        "created_at": "2024-11-07 00:09:51"
    }
];

const downloadFolder = path.join(__dirname, '../downloads');

// 假设我们需要打包所有学生的作业文件
async function createZipForHomework() {
    // 定义压缩文件名
    const class_name = "Physics";  // 示例班级名，可以根据需要动态获取
    const homework_number = "1";   // 示例作业编号
    const zipFileName = `homework_${class_name}_${homework_number}_${Date.now()}.zip`;
    const zipFilePath = path.join(downloadFolder, zipFileName);  // 设置目标路径
    console.log(zipFilePath);

    // 创建压缩文件流
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    // 通过管道将数据流向压缩文件
    archive.pipe(output);
    console.log("管道");

    // 遍历作业数据并将每个文件添加到压缩包
    homeworkData.forEach((homework) => {
        const filePath = homework.filename;  // 获取作业文件路径
        const fileName = `${homework.studentname}_${homework.studentnumber}.txt`;  // 使用学生姓名和学号作为文件名
        // 将文件添加到压缩包
        archive.file(filePath, { name: fileName });
    });

    // 完成压缩包创建
    archive.finalize();

    // 监听压缩完成
    archive.on('end', () => {
        console.log('ZIP 文件已创建:', zipFilePath);
    });

    // 监听错误
    archive.on('error', (err) => {
        console.error('压缩文件时出错:', err);
    });
}

// 调用函数生成压缩包
createZipForHomework();
