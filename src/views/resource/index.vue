<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- 图片 -->
          <el-tab-pane label="图片" name="first" :key="'first'">
            <pics />
          </el-tab-pane>

          <el-tab-pane label="视频" name="second" :key="'second'">
            <videos />
          </el-tab-pane>

          <el-tab-pane label="音频" name="third" :key="'third'">
            <audios />
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </div>
  </div>
</template>

<script>
import pics from "./pics";
import videos from "./videos";
import audios from "./audios";

export default {
  name: "resource",
  components: { pics, videos, audios },
  filters: {
    fileTypeFilter(type) {
      return fileTypeMap[type];
    },
  },
  data() {
    return {
      activeName: "first",
      isFirst: true,
      isSecond: false,
      isThird: false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: "",
        resourceType: "IMAGE",
      },
      activeName: "first",
    };
  },
  methods: {
    handleClick() {
      if (this.activeName == "first") {
        this.activeName = "first";
        this.isFirst = true;
        this.isSecond = false;
        this.isThird = false;
      } else if (this.activeName == "second") {
        this.activeName = "second";
        this.isFirst = false;
        this.isSecond = true;
        this.isThird = false;
      } else {
        this.activeName = "third";
        this.isFirst = false;
        this.isSecond = false;
        this.isThird = true;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>