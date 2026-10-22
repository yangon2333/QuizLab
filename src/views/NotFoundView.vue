<template>
  <div class="not-found">
    <div class="nf-card">
      <p class="nf-code">404</p>
      <h2>这个页面走丢了</h2>
      <p class="nf-desc">
        你访问的地址不存在，可能是链接输入有误，或者页面已经被移除。
      </p>
      <div class="nf-actions">
        <el-button type="primary" @click="$router.replace('/dashboard')">
          回到数据概览
        </el-button>
        <el-button plain @click="$router.back()">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 独立于后台布局的 404 页面
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background: radial-gradient(circle at 30% 20%, #eef2ff, #f7f9ff 60%);
}

.nf-card {
  max-width: 460px;
  padding: 44px 36px;
  text-align: center;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 18px 48px rgba(40, 55, 110, 0.12);
}

.nf-code {
  margin: 0;
  font-size: 74px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 4px;
  background: linear-gradient(120deg, #4f74ff, #9b5cff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.nf-card h2 {
  margin: 14px 0 10px;
  font-size: 21px;
  color: #1b2138;
}

.nf-desc {
  margin: 0 0 24px;
  font-size: 13.5px;
  line-height: 1.8;
  color: #7a839b;
}

.nf-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
