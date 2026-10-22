<template>
  <base-layout>
    <el-card shadow="never">
      <div class="cats">
        <span
          class="cat"
          :class="{ on: category === '' }"
          @click="changeCategory('')"
        >
          全部（{{ list.length }}）
        </span>
        <span
          v-for="item in categoryCounts"
          :key="item.name"
          class="cat"
          :class="{ on: category === item.name }"
          @click="changeCategory(item.name)"
        >
          {{ item.name }}（{{ item.count }}）
        </span>
      </div>

      <el-form :inline="true" class="filter">
        <el-form-item label="难度">
          <el-select v-model="difficulty" placeholder="全部难度" clearable style="width: 110px">
            <el-option v-for="item in difficulties" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题目">
          <el-input v-model="keyword" placeholder="输入题干关键词" clearable style="width: 180px" @keyup.enter="search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button type="success" @click="openAdd">新增题目</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="pageData" border>
        <el-table-column prop="id" label="编号" width="70" align="center"></el-table-column>
        <el-table-column prop="stem" label="题目" min-width="240"></el-table-column>
        <el-table-column label="选项" width="200">
          <template #default="scope">
            <div
              v-for="(item, index) in scope.row.options"
              :key="index"
              class="option"
              :class="{ right: letters[index] === scope.row.answer }"
            >
              {{ letters[index] }}. {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="110"></el-table-column>
        <el-table-column label="难度" width="80" align="center">
          <template #default="scope">
            <el-tag size="small" :type="tagType(scope.row.difficulty)">{{ scope.row.difficulty }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="答案" width="70" align="center">
          <template #default="scope">{{ scope.row.answer }}</template>
        </el-table-column>
        <el-table-column label="操作" width="90" align="center">
          <template #default="scope">
            <el-button size="small" type="danger" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pager"
        background
        layout="total, prev, pager, next"
        :total="filtered.length"
        :page-size="pageSize"
        v-model:current-page="page"
      >
      </el-pagination>
    </el-card>

    <el-dialog title="新增题目" v-model="dialogVisible" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="题干">
          <el-input v-model="form.stem" type="textarea" :rows="2"></el-input>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="14">
            <el-form-item label="分类">
              <el-select v-model="form.category">
                <el-option v-for="item in categories" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="难度">
              <el-select v-model="form.difficulty">
                <el-option v-for="item in difficulties" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="选项A">
          <el-input v-model="form.optionA"></el-input>
        </el-form-item>
        <el-form-item label="选项B">
          <el-input v-model="form.optionB"></el-input>
        </el-form-item>
        <el-form-item label="选项C">
          <el-input v-model="form.optionC"></el-input>
        </el-form-item>
        <el-form-item label="选项D">
          <el-input v-model="form.optionD"></el-input>
        </el-form-item>
        <el-form-item label="答案">
          <el-select v-model="form.answer" style="width: 120px">
            <el-option label="A" value="A"></el-option>
            <el-option label="B" value="B"></el-option>
            <el-option label="C" value="C"></el-option>
            <el-option label="D" value="D"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </base-layout>
</template>

<script>
import BaseLayout from '../components/BaseLayout.vue'
import { categories, difficulties, questionList } from '../data'

export default {
  name: 'QuestionView',
  components: { BaseLayout },
  data() {
    return {
      categories,
      difficulties,
      letters: ['A', 'B', 'C', 'D'],
      list: questionList.slice(),
      category: '',
      difficulty: '',
      keyword: '',
      page: 1,
      pageSize: 5,
      dialogVisible: false,
      form: this.createForm()
    }
  },
  computed: {
    categoryCounts() {
      return this.categories.map((name) => {
        return {
          name: name,
          count: this.list.filter((item) => item.category === name).length
        }
      })
    },
    filtered() {
      return this.list.filter((item) => {
        if (this.category && item.category !== this.category) return false
        if (this.difficulty && item.difficulty !== this.difficulty) return false
        if (this.keyword && item.stem.indexOf(this.keyword) === -1) return false
        return true
      })
    },
    pageData() {
      const start = (this.page - 1) * this.pageSize
      return this.filtered.slice(start, start + this.pageSize)
    }
  },
  methods: {
    createForm() {
      return {
        stem: '',
        category: categories[0],
        difficulty: '简单',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        answer: 'A'
      }
    },
    tagType(level) {
      if (level === '简单') return 'success'
      if (level === '中等') return 'warning'
      return 'danger'
    },
    changeCategory(name) {
      this.category = name
      this.page = 1
    },
    search() {
      this.page = 1
    },
    reset() {
      this.category = ''
      this.difficulty = ''
      this.keyword = ''
      this.page = 1
    },
    openAdd() {
      this.form = this.createForm()
      if (this.category) this.form.category = this.category
      this.dialogVisible = true
    },
    submit() {
      if (!this.form.stem.trim()) {
        this.$message.warning('请先填写题干')
        return
      }
      if (!this.form.optionA || !this.form.optionB) {
        this.$message.warning('至少填写 A、B 两个选项')
        return
      }
      const ids = this.list.map((item) => item.id)
      this.list.unshift({
        id: Math.max.apply(null, ids.concat(0)) + 1,
        stem: this.form.stem.trim(),
        category: this.form.category,
        options: [
          this.form.optionA,
          this.form.optionB,
          this.form.optionC || '略',
          this.form.optionD || '略'
        ],
        answer: this.form.answer,
        difficulty: this.form.difficulty
      })
      this.dialogVisible = false
      this.category = this.form.category
      this.page = 1
      this.$message.success('保存成功')
    },
    remove(row) {
      this.$confirm('确定删除这道题目吗？', '提示', { type: 'warning' })
        .then(() => {
          const index = this.list.indexOf(row)
          if (index !== -1) this.list.splice(index, 1)
          const max = Math.ceil(this.filtered.length / this.pageSize) || 1
          if (this.page > max) this.page = max
          this.$message.success('已删除')
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.cats {
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 15px;
}

.cat {
  display: inline-block;
  padding: 0 16px 10px;
  margin-right: 6px;
  margin-bottom: -1px;
  border-bottom: 2px solid transparent;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
}

.cat:hover {
  color: #409eff;
}

.cat.on {
  color: #409eff;
  border-bottom-color: #409eff;
}

.filter :deep(.el-form-item) {
  margin-bottom: 12px;
  margin-right: 12px;
}

.option {
  font-size: 13px;
  line-height: 1.7;
  color: #606266;
}

.option.right {
  color: #67c23a;
}

.pager {
  margin-top: 15px;
  text-align: right;
}
</style>
