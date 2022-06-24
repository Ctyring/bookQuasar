<template>
  <q-layout view="lhh LpR lff" @scroll="listenScroll">
    <q-header elevated reveal>
      <q-toolbar class="glossy">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          v-if="$q.screen.lt.md"
          @click="toggleLeftDrawer"
        />
        <q-avatar style="cursor: pointer" @click="this.$router.push('/')">
          <q-img src="../assets/logo.png"/>
        </q-avatar>
        <q-toolbar-title>
          <div style="cursor: pointer; width:0" @click="this.$router.push('/')">
            小鸭收书
          </div>
        </q-toolbar-title>
        <q-btn-dropdown flat dense :dropdown-icon="this.avatar" no-icon-animation size="20px" v-if="this.haveToken">
          <q-list>
            <q-item clickable v-close-popup @click="this.$router.push('/person')">
              <q-item-section>
                <q-item-label>用户中心</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="clearUser">
              <q-item-section>
                <q-item-label>退出登录</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn-dropdown v-else flat dense dropdown-icon="ti-user" no-icon-animation size="20px">
          <q-list>
            <q-item clickable v-close-popup @click="this.$router.push('/login')">
              <q-item-section>
                <q-item-label>登录</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="this.$router.push('/register')">
              <q-item-section>
                <q-item-label>注册</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
      <div ref="refDiv"></div>
      <q-toolbar ref="refToolBar" v-if="toggle && $q.screen.gt.sm">
        <q-space></q-space>
        <q-tabs v-model="this.$route.path" shrink inline-label>
          <q-route-tab name="/" label="首页" icon="ti-home" to="/"/>
          <q-route-tab name="/message" label="留言墙" icon="ti-receipt" to="/message"/>
          <q-route-tab name="/works" label="作品" icon="ti-calendar" to="/works"/>
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
    >
      <q-list bordered>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="info" name="ti-home"/>
          </q-item-section>
          <q-item-section>首页</q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="info" name="ti-receipt"/>
          </q-item-section>
          <q-item-section>留言墙</q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="info" name="ti-calendar"/>
          </q-item-section>
          <q-item-section>作品</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
  <!-- <div>{{avatar}}</div> -->
</template>

<script>

import {computed, defineComponent, ref} from 'vue'
import store from "src/store";
import {LocalStorage, morph} from "quasar";
import {useRouter} from "vue-router";

export default defineComponent({
  name: 'MainLayout',

  components: {},

  setup() {
    const toggle = ref(true)
    const router = useRouter();
    const refDiv = ref(null)
    const refToolBar = ref(null)
    const clearUser = () => {
      store().commit('SET_TOKEN', '')
      store().commit('SET_AVATAR', '')
      router.push('/')
      // location.reload()
      // window.localStorage.clear();
      // this.$router.push("login")
    }
    const leftDrawerOpen = ref(false)
    const haveToken = computed(() => {
      return store().getters.GET_TOKEN ?? '' !== ''
    })
    const avatar = computed(() => {
      return 'img:' + (store().getters.GET_AVATAR ? store().getters.GET_AVATAR : 'https://pic.imgdb.cn/item/620874352ab3f51d9141099f.jpg')
    })
    const mor = (state) => {
      if (state !== toggle.value) {
        const getDiv = () => refDiv.value
        const getToolBar = () => refToolBar.value ? refToolBar.value.$el : void 0

        morph({
          from: toggle.value === true ? getToolBar : getDiv,
          to: toggle.value === true ? getDiv : getToolBar,
          onToggle: () => {
            toggle.value = state
          },
          duration: 500,
          // keepToClone:true,
          // hideFromClone:true
        })
      }
    }
    const listenScroll = (details) => {
      // console.log(details)
      // if (details.direction === 'down') {
      //   mor(false)
      // } else if (details.direction === 'up') {
      //   mor(true)
      // }
    }
    return {
      listenScroll,
      mor,
      toggle,
      refDiv,
      refToolBar,
      avatar,
      clearUser,
      haveToken,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
    }
  }
})
</script>
<style lang="scss">

</style>
