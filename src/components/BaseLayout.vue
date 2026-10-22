<template>
  <div class="layout">
    <div class="header">
      <div class="header-inner">
        <span class="title">题库管理系统</span>
        <span class="info">张子炀　2323040304</span>
      </div>
    </div>

    <div class="nav-bar">
      <el-menu :default-active="active" mode="horizontal" router class="nav">
        <el-menu-item index="/question">题目管理</el-menu-item>
        <el-menu-item index="/user">用户管理</el-menu-item>
      </el-menu>
    </div>

    <div class="main">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseLayout',
  computed: {
    active() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background: #f0f2f5;
}

.header {
  height: 56px;
  background: #3f6fdd;
  color: #fff;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 8px;
}

.title {
  font-size: 17px;
  letter-spacing: 1px;
}

.info {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.92);
}

.nav-bar {
  background: #fff;
  border-bottom: 1px solid #e8eaef;
}

.nav {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 8px;
  border-bottom: none;
}

.main {
  max-width: 1180px;
  margin: 0 auto;
  padding: 18px 8px 30px;
}
</style>
