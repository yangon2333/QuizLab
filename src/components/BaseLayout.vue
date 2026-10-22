<template>
  <el-container class="layout">
    <el-header class="header">
      <div class="title">题库管理后台</div>
      <div class="info">张子炀　2323040304</div>
    </el-header>

    <el-container>
      <el-aside width="180px" class="aside">
        <el-menu :default-active="active" router>
          <el-menu-item index="/question">题目管理</el-menu-item>
          <el-menu-item index="/user">用户管理</el-menu-item>
        </el-menu>
      </el-aside>

      <el-main class="main">
        <slot></slot>
      </el-main>
    </el-container>
  </el-container>
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
  height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e6e6e6;
  background: #fff;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.info {
  font-size: 14px;
  color: #666;
}

.aside {
  border-right: 1px solid #e6e6e6;
  background: #fff;
}

.aside .el-menu {
  border-right: none;
}

.main {
  background: #f5f5f5;
}
</style>
