<template>
  <div class="layout">
    <div class="header">
      <span class="title">题库管理系统</span>
      <span class="info">张子炀　2323040304</span>
    </div>

    <el-menu :default-active="active" mode="horizontal" router class="nav">
      <el-menu-item index="/question">题目管理</el-menu-item>
      <el-menu-item index="/user">用户管理</el-menu-item>
    </el-menu>

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
  background: #f2f4f7;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 20px;
  background: #409eff;
  color: #fff;
}

.title {
  font-size: 18px;
}

.info {
  font-size: 14px;
}

.nav {
  border-bottom: 1px solid #e4e7ed;
  padding: 0 10px;
  background: #fff;
}

.main {
  padding: 18px;
}
</style>
