<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <!-- <sidebar-item :routes="permission_routers"></sidebar-item> -->
      <router-link to="/">
        <el-menu-item index="0" class="submenu-title-noDropdown">
          <span>出库</span>
        </el-menu-item>
      </router-link>
      <router-link to="/in">
        <el-menu-item index="1" class="submenu-title-noDropdown">
          <span>入库</span>
        </el-menu-item>
      </router-link>
      <router-link to="/summary">
        <el-menu-item index="2" class="submenu-title-noDropdown">
          <span>汇总</span>
        </el-menu-item>
      </router-link>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    isCollapse () {
      return !this.sidebar.opened
    }
  }
}
</script>
