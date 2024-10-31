<template>
    <div id="background"></div>
        <div id="hw">
            <h1>作业提交</h1>
            <el-form @submit.native.prevent="submitAssignment">
                <el-form-item label="学号">
                    <el-input v-model="studentId" placeholder="请输入学号" />
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="name" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="班级">
                    <el-input v-model="className" placeholder="请输入班级" />
                </el-form-item>
                <el-form-item label="文件">
                    <el-upload ref="upload" :file-list="fileList" :on-change="handleChange"
                        :before-upload="beforeUpload" multiple :auto-upload="false">
                        <el-button>选择文件</el-button>
                    </el-upload>
                </el-form-item>
                <div class="button-container">
                    <el-button @click="cancelAssignment">取消</el-button>
                    <el-button type="primary" @click="submitAssignment">提交</el-button>
                </div>
            </el-form>
        </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const studentId = ref('');
        const name = ref('');
        const className = ref('');
        const fileList = ref<File[]>([]);

        const beforeUpload = (file: File) => {
            // console.log(file);
            return true; // 允许上传文件
        };

        const handleChange = (file: { status: string; name: string; raw: File }) => {
            // 检查文件状态并更新 fileList
            console.log(file);

            // 如果文件状态是成功或准备中，更新 fileList
            if (file.status === 'ready') {
                fileList.value.push(file.raw); // 将文件添加到 fileList
            }
            console.log(fileList.value);
        };


        const submitAssignment = async () => {
            if (!studentId.value || !name.value || !className.value || fileList.value.length === 0) {
                console.log(fileList.value.length);
                alert('请填写所有字段并选择文件。');
                return;
            }

            const formData = new FormData();
            formData.append('studentId', studentId.value);
            formData.append('name', name.value);
            formData.append('className', className.value);
            fileList.value.forEach(file => formData.append('assignmentFile', file));

            try {
                const response = await fetch('http://localhost:3000/api/uploads', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();
                    alert(result.message);
                } else {
                    alert('文件上传失败，请重试。');
                }
            } catch (error) {
                console.error('上传错误:', error);
                alert('上传时发生错误，请检查控制台。');
            }
        };

        // 添加取消方法
        const cancelAssignment = () => {
            location.reload();
        };

        return {
            studentId,
            name,
            className,
            fileList,
            beforeUpload,
            handleChange,
            submitAssignment,
            cancelAssignment
        };
    },
});
</script>

<style scoped>
#background {
    width: 100%;
    height: 100%;
    background: url("../assets/cool-background.svg") center center no-repeat;
    background-size: 100% 100%;
    position: fixed;
    z-index: -1;
}

h1 {
    margin-bottom: 20px;
}

#hw {
    padding: 20px;
    display: flex; /* 使用 Flexbox 对齐内容 */
    flex-direction: column; /* 纵向排列子元素 */
    justify-content: center;
    align-items: center;
    height: 90vh;
    color: black;
    overflow: hidden; 
}
.button-container {
    display: flex;
    justify-content: center; /* 居中对齐按钮 */
    width: 100%;
    gap: 20px;
}
</style>