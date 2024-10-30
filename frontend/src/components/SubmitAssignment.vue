<template>
    <div>
      <h1>提交作业</h1>
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
        <el-form-item label="作业文件">
          <el-upload
            ref="upload"
            :file-list="fileList"
            :on-change="handleChange"
            :before-upload="beforeUpload"
            multiple
          >
            <el-button>选择文件</el-button>
          </el-upload>
        </el-form-item>
        <el-button type="primary" @click="submitAssignment">提交</el-button>
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
  
      const beforeUpload = (_file: File) => {
        return true; // 允许上传文件
      };
  
      const handleChange = (fileList: { value: any; }) => {
        // 更新 fileList
        fileList.value = fileList;
      };
  
      const submitAssignment = async () => {
        if (!studentId.value || !name.value || !className.value || fileList.value.length === 0) {
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
  
      return {
        studentId,
        name,
        className,
        fileList,
        beforeUpload,
        handleChange,
        submitAssignment,
      };
    },
  });
  </script>
  
  <style scoped>
  h1 {
    margin-bottom: 20px;
  }
  </style>
  