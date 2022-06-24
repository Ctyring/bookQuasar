<template>
  <div class="root">

    <div class="box" :style="{width : $q.screen.lt.md ? '100%' : '60%'}">
      <div class="title">
        <div class="title_line">|</div>
        个人信息
      </div>

      <div class="dea">
        <div class="portrait">
          <div class="por_title">头像</div>
          <q-img class="por" :src="userInfo.avatar"
                 style="width:100px;height:100px"/>
          <!--        <like :toWorksId="toWorksId"  :fromUserId="fromUserId"></like>-->
        </div>
        <div class="name">
          <div class="name_title">用户名</div>
          <div class="nam">{{ userInfo.username }}</div>
        </div>
        <div class="blog_box">
          <div class="blog_title">个人博客</div>
          <a :href="this.member.blog" class="blog"
             style="cursor: pointer; text-decoration: none">{{ this.member.blog }}</a>
        </div>
        <div class="detail">
          <div class="deta_title">个人描述</div>
          <div class="deta"></div>
        </div>
        <div class="edit">
          <q-btn push label="编辑信息" color="secondary" @click="openEdit"/>
        </div>
        <div class="words">
          <div class="cloud" id="cloud"></div>
          <q-btn class="word_btn" round color="primary" icon="edit_location" @click="dialog = true"/>
        </div>
      </div>
      <!-- <el-button class="logout" type="primary" @click="logout">注销</el-button> -->
    </div>
    <q-dialog
      v-model="dialog"
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">wordcloud</div>
        </q-card-section>

        <!-- <div class="q-gutter-y-md"> -->
        <q-select
          label="add new tags"
          filled
          v-model="this.words"
          use-input
          multiple
          hide-dropdown-icon
          bg-color="white"
          label-color="primary"
          color="primary"
          input-debounce="0"
          new-value-mode="toggle"
        >
          <template v-slot:selected-item="slotProps">
            <q-chip color="teal" text-color="white" icon-right="ti-cut" clickable
                    @click="slotProps.removeAtIndex(slotProps.index)">
              {{ slotProps.opt }}
            </q-chip>
            <!-- {{ scope.row.createTime | dateFormat }} -->
          </template>
        </q-select>
        <!-- </div> -->
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" @click="editWords" v-close-popup/>
          <!--  -->
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
  <q-drawer
    side="right"
    v-model="drawerVisible"
    bordered
    overlay
    :width="400"
    :breakpoint="500"
  >
    <q-btn flat round dense icon="close" @click="closeEdit"/>
    <br>
    <q-img
      :src="tempUserInfo.avatar"
      style="width:100px;height:100px"
      class="editImg"
    >
    </q-img>
    <input class="por_input" id="por_input" type="file" round @change="changePic" ref="file">
    <q-btn color="white" text-color="black" label="更换头像" @click="getFile"
           style="transform: translateX(30px) translateY(30px)"/>
    <div class="q-pa-md" style="max-width: 400px">
      <q-form
        @submit="saveUserInfo"
        class="q-gutter-md"
      >
        <q-input
          filleduser
          v-model="tempUserInfo.username"
          label=""
          readonly
          hint="用户名"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <div class="q-gutter-sm">
          <q-radio v-model="tempUserInfo.sex" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="1"
                   label="male"/>
          <q-radio v-model="tempUserInfo.sex" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="0"
                   label="female"/>
        </div>
        <q-input filled v-model="tempUserInfo.birthday" hint="生日">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                <q-date v-model="tempUserInfo.birthday" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
          filleduser
          v-model="tempUserInfo.email"
          label=""
          hint="邮箱"
          lazy-rules
          :rules="[ val => val && val.length > 0  || '请输入你的邮箱']"
        />
        <div>
          <q-btn label="保存修改" type="submit" color="secondary"/>
          <!-- <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" /> -->
        </div>
      </q-form>
    </div>
  </q-drawer>
  <loading v-if="isLoad"></loading>
</template>

<script>
import {api} from "boot/axios";
import {useQuasar} from 'quasar'
import * as echarts from 'echarts'
import store from "src/store";
import Loading from "components/loading";
import Like from "components/like"
import {computed, reactive, ref} from 'vue'
import user from "src/store/modules/user";

export default {
  name: "person",
  components: {Loading, Like},
  setup() {
    const $q = useQuasar()
    const toWorksId = ref('')
    const fromUserId = ref('')
    const isLoad = ref(false)
    const drawerVisible = ref(false)
    const userInfo = reactive({
      id: store().getters.GET_ID,
      username: store().getters.GET_USERNAME,
      sex: store().getters.GET_SEX,
      birthday: store().getters.GET_BIRTHDAY,
      email: store().getters.GET_EMAIL,
      avatar: store().getters.GET_AVATAR,
      userIdentity: store().getters.GET_USERIDENTITY
    })
    const tempUserInfo = reactive({
      id: "",
      username: "",
      sex: "",
      birthday: "",
      email: "",
      avatar: "",
      userIdentity: ""
    })
    const openEdit = () => {
      drawerVisible.value = true
      Object.assign(tempUserInfo, userInfo)
    }
    const closeEdit = () => {
      // 清空对象的值
      Object.keys(tempUserInfo).forEach(key => tempUserInfo[key] = "")
      drawerVisible.value = true
    }
    const saveUserInfo = async () => {
      isLoad.value = true
      const {data: res} = await api.post(`/sys/user/editSelf`, tempUserInfo)
      if (res.code === 200) {
        $q.notify({
          message: "修改成功",
          color: 'green',
          position: 'top'
        })
        Object.assign(userInfo, tempUserInfo)
        store().commit('SET_AVATAR', userInfo.avatar)
        store().commit('SET_SEX', userInfo.sex)
        store().commit('SET_BIRTHDAY', userInfo.birthday)
        store().commit('SET_EMAIL', userInfo.email)
      } else {
        $q.notify({
          message: res.message,
          color: 'red',
          position: 'top'
        })
      }
      isLoad.value = false
      drawerVisible.value = false
    };
    const getFile = () => {
      document.getElementById('por_input').click();
    };
    const changePic = async (e) => {
      let file = e.target.files[0]
      let formData = new FormData()
      formData.append('file', file)
      const {data: res} = await api.post(`/sys/common/upload`, formData)
      tempUserInfo.avatar = res.message
    };
    return {
      // headPic,username, birthday, sex, email, id, tempPic,
      // drawerVisible,isLoad,toWorksId,fromUserId,
      isLoad, userInfo, tempUserInfo, drawerVisible,
      saveUserInfo,
      getFile,
      changePic,
      closeEdit,
      openEdit
    }
  },
  data() {
    return {
      // chips4: [],
      dialog: false,
      // drawerVisible:false,
      nowIndex: '1',
      followQueryInfo: {
        page: 1,
        size: 5,
        fromUser: '',
        toUser: ''
      },
      blogVisible: false,
      blog: '',
      tot: 0,
      showFollow: false,
      showFans: false,
      inputVisible: false,
      inputValue: '',
      nameVisible: false,
      portraitVisible: false,
      passwordVisible: false,
      Authorization: '',
      detail: '',
      name: '',
      password: '',
      portrait: '',
      title: '',
      userId: 0,
      member: {},
      role: {},
      me: {},
      words: [],
      temp: [],
      personList: [],
      defaultUrl: 'http://sdn.geekzu.org/avatar/90337f74b07ce86da12dedd65f06cf3e?s=96&d=mm&r=g'
    }
  },
  computed: {
    // 计算属性的 getter
    // headPic: function () {
    //   // `this` 指向 vm 实例
    //   return store().getters.GET_AVATAR
    // },
    // username: function() {
    //   return store().getters.GET_USERNAME
    // },
    // birthday: function() {
    //   return store().getters.GET_BIRTHDAY
    // }
    // email: function() {
    //   return store().getters.GET_EMAIL
    // },
    // sex: function() {
    //   return store().getters.GET_SEX
    // },
  },
  methods: {
    changePer(index) {
      if (index === '2') {
        this.getFollow();
      } else {
        this.getFans();
      }
    },
    removeTag(index) {
      console.log(index)
    },
    handleSelect(index) {
      this.nowIndex = index
      if (index === '2') {
        this.getFollow();
      } else {
        this.getFans();
      }
    },

    async getFollow() {
      this.followQueryInfo.fromUser = this.member.username;
      this.followQueryInfo.toUser = '';
      const {data: res} = await this.$http.post('http://47.96.164.188:18085/follow/search/' + this.followQueryInfo.page + '/' + this.followQueryInfo.size, this.followQueryInfo)
      this.tot = res.data.total
      this.personList = res.data.list
      console.log(res)
    },

    async getFans() {
      this.followQueryInfo.fromUser = '';
      this.followQueryInfo.toUser = this.member.username;
      const {data: res} = await this.$http.post('http://47.96.164.188:18085/follow/search/' + this.followQueryInfo.page + '/' + this.followQueryInfo.size, this.followQueryInfo)
      this.tot = res.data.total
      this.personList = res.data.list
    },

    handleCloseTag(tag) {
      this.words.splice(this.words.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.words.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    handleClose() {
      if (this.loading) {
        return;
      }
      this.$confirm('要保存修改吗？')
        .then(_ => {
          this.loading = true;
          this.timer = setTimeout(() => {
            this.saveUser()
            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.loading = false;
              this.dialog = false
            }, 400);
          }, 2000);
        })
        .catch(_ => {
        });
    },
    logout() {
      window.localStorage.clear()
      this.$router.push('/welcome')
    },
    saveDetail() {
      if (this.detail.length > 230) {
        return this.$message.error('个人描述不能超过230字哦')
      }
      this.member.des = this.detail
      this.saveUser()
    },
    savePortrait() {
      this.member.img = this.portrait
      this.saveUser()
      this.portraitVisible = false
    },
    portraitClosed() {
      this.portrait = ''
      this.portraitVisible = false
    },
    blogClosed() {
      this.blogVisible = false
      this.blog = ''
    },
    passwordClosed() {
      this.passwordVisible = false
      this.password = ''
    },
    saveBlog() {
      this.member.blog = this.blog
      this.saveUser()
      this.blogVisible = false
    },
    savePassword() {
      if (this.password.length < 6 || this.password.length > 15) {
        return this.$message.error('请输入长度为6-15的密码')
      }
      this.member.password = this.password
      this.saveUser()
      this.passwordVisible = false
    },
    async getWordCloud() {

      await this.getWords()
      let myChart = echarts.init(document.getElementById('cloud'))
      let colorList = [
        '#CF4645',
        '#B580B2',
        '#29008A',
        '#146A90',
        '#8956FF',
        '#70C9A8',
        '#bfbfbf',
        '#595959',
        '#40a9ff',
        '#1890ff',
        '#ffd666',
        '#ffc53d',
        '#ffc53d',
        '#ffc069',
        '#ffa940',
        '#fa8c16',
        '#eccbd9',
        '#ffadad',
        '#ff6392',
        '#ffc09f',
        '#ffcb77',
        '#ffe066',
        '#ffd53e',
        '#ffda3d',
        '#adf7b6',
        '#a0e8af',
        '#80ed99',
        '#07beb8',
        '#17c3b2',
        '#48cae4',
        '#97d2fb',
        '#83bcff',
        '#91e5f6',
        '#9381ff',
      ];
      let colorListLen = colorList.length;
      let fontSizeList = [
        12,
        12.5,
        13,
        13.5,
        14,
        14.5,
        15,
        15.5,
        16,
        16.5,
        17,
        17.5,
        18,
        18.5,
        19,
        19.5,
        20,
        20.5,
        21,
        22,
        23,
        24,
      ];
      let fontSizeListLen = fontSizeList.length;
      let customLabel = {
        color: colorList[Math.floor(Math.random() * colorListLen)],
        fontSize: fontSizeList[Math.floor(Math.random() * fontSizeListLen)],
      };
      let bgColor = '#fffcf9';
      let canDraggable = false;
      let option = {
        backgroundColor: '#fffcf9',
        color: ['#37A2DA', '#32C5E9', '#67E0E3'],
        title: {
          show: false,
          x: 'center',
          y: 'bottom',
          // 文字的颜色,默认 #333。
          color: '#666',
          fontSize: 24,
        },
        toolbox: {
          show: true,
          feature: {
            // dataView: {readOnly: false},
            // magicType: {type: ['line', 'bar']},
            restore: {},
            // saveAsImage: {}
          },
        },
        itemStyle: {
          color: bgColor,
        },
        series: [
          {
            type: 'graph',
            layout: 'force',
            force: {
              repulsion: 80,
              edgeLength: 10,
            },
            roam: 'scale',
            // symbol: '',
            // symbolSize: 0,
            label: {
              show: true,
              color: 'auto',
              fontSize: 14,
            },
            data: []
          },
        ],
      };
      console.log(this.words)
      for (let i = 0; i < this.words.length; i++) {
        option.series[0].data.push({
          name: this.words[i],
          value: 72,
          draggable: canDraggable,
          itemStyle: {
            color: bgColor
          },
          label: {
            color: colorList[Math.floor(Math.random() * colorListLen)],
            fontSize: fontSizeList[Math.floor(Math.random() * fontSizeListLen)],
          }
        })
      }
      myChart.setOption(option)
    },
    async saveUser() {
      this.member.words = this.words.join()
      const {data: res} = await this.$http.put('http://47.96.164.188:18085/user/self', this.member)
      if (res.code !== 20000) {
        return this.$message.error('保存个人信息失败')
      }
      this.getUser()
    },
    async getRole() {
      const {data: res} = await this.$http.get('http://47.96.164.188:18085/user/role/' + this.member.roleId)
      console.log(res)
      this.role = res.data
    },

    //获取词云
    async getWords() {
      const {data: res} = await api.get(`/words/words/list`, {params: {userId: this.username}})
      // this.words = res.result.records
      console.log(res)
      for (var i = 0; i < res.result.records.length; i++) {
        var temp = res.result.records[i].words.split(',');
        for (var j = 0; j < temp.length; j++) {
          this.words.push(temp[j])
        }
      }
      console.log(this.words)
      // const str = "sunset,hero,city,lucky,happy,freedom,swift,photo"
      // this.words = str.split(',')
      // console.log(this.words)
      this.chips4 = this.words
    },
    //修改词云
    async editWords() {
      console.log(this.words)
      // console.log(this.words.toString())
      const {data: res} = await api.put(`/words/words/edit`, {params: {userId: this.username, words: this.words}})
      console.log(res)
    },
  },
  created() {
    // this.Authorization = window.localStorage.getItem('Authorization')
    // this.username = window.localStorage.getItem('username')
    // this.getUser()
    // this.name = this.member.userName
  },
  mounted() {
    this.getWordCloud()
  }
}

</script>

<style lang="scss" scoped>
.tags {
  display: flex;
  flex-wrap: wrap;

  .tag {
    margin: 10px;
  }
}

.root {
  width: 100%;
  display: flex;
  background-color: rgb(247, 247, 247);
  align-items: center;
  // flex-direction: column;
  justify-content: space-around;
  // .list{
  //   width: 400px;
  //   height: 330px;
  //   align-self: flex-start;
  //   transform: translateY(30px);
  //   .fans_follow{
  //     align-self: flex-end;
  //     margin-right: 10px;
  //     transform: translateY(30px);
  //     //.fans{
  //     //  display: inline-block;
  //     //}
  //     //.follow{
  //     //  display: inline-block;
  //     //  margin-right: 10px;
  //     //  cursor: pointer;
  //     //}
  //   }
}

.box {
  background-color: #ffffff;
  transform: translateY(30px);
  width: 60%;
  display: flex;
  flex-direction: column;
  padding-bottom: 200px;
  // justify-content: center;
  .logout {
    // width: 80px;
    transform: translateY(130px);
  }

  .title {
    transform: translateY(20px) translateX(30px);
    width: 90%;
    height: 30px;
    font-size: 25px;

    .title_line {
      display: inline;
      color: #20a162;
      font-size: 28px;
    }
  }

  .dea {
    border-top: 3px solid #7a7374;
    transform: translateY(35px);
    width: 100%;
    // height: 90px;
    .words {
      width: 100%;
      height: 400px;
      transform: translateY(70px);
      display: flex;
      align-items: flex-end;
      justify-content: center;

      .cloud {
        width: 70%;
        height: 400px;
        transform: translateX(0px);
      }

      .word_btn {
        // width: 10%;
        // height: 10%;
        transform: translateX(10px);
      }
    }

    .portrait {
      // background-color: chocolate;
      transform: translateX(50px) translateY(30px);
      width: 270px;
      height: 100px;
      display: flex;
      align-items: center;

      .por_title {
        transform: translateX(20px);
      }

      .por {
        transform: translateX(70px);
        border-radius: 50%;
      }

      .por_btn {
        transform: translateX(140px);
      }

      .por_load {
        transform: translateX(140px);
      }
    }

    .name {
      // background-color: chocolate;
      transform: translateX(50px) translateY(30px);
      width: 470px;
      height: 100px;
      display: flex;
      align-items: center;

      .name_title {
        transform: translateX(20px);
      }

      .nam {
        transform: translateX(70px);
      }

      .name_btn {
        transform: translateX(140px);
      }

      .pas_btn {
        transform: translateX(170px);
      }
    }

    .id {
      // background-color: chocolate;
      transform: translateX(50px) translateY(30px);
      width: 270px;
      height: 100px;
      display: flex;
      align-items: center;

      .id_title {
        transform: translateX(20px);
      }

      .id_ {
        transform: translateX(70px);
      }
    }

    .password {
      transform: translateX(50px) translateY(30px);
      width: 270px;
      height: 100px;
      display: flex;
      align-items: center;

      .pas_title {
        transform: translateX(20px);
      }

      .pas_btn {
        transform: translateX(70px);
      }
    }

    .role {
      // background-color: chocolate;
      transform: translateX(50px) translateY(30px);
      width: 270px;
      height: 100px;
      display: flex;
      align-items: center;

      .rol {
        transform: translateX(70px);
      }
    }

    .blog_box {
      transform: translateX(50px) translateY(30px);
      width: 500px;
      height: 100px;
      display: flex;
      align-items: center;

      .blog_title {
        transform: translateX(20px);
      }

      .blog {
        display: inline-block;
        margin: 50px;
      }
    }

    .detail {
      transform: translateX(50px) translateY(30px);
      width: 870px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: space-around;

      .deta_title {
        flex: 2;
        transform: translateX(20px);
      }

      .deta {
        width: 400px;
        height: 100px;
        transform: translateX(-130px);
        // background-color: red;
      }

      .deta_btn {
        transform: translateX(-200px);
      }
    }

    .edit {
      transform: translateX(50px) translateY(30px);
    }
  }
}

// }
.editImg {
  transform: translateX(20px);
  border-radius: 50%;
}

#por_input {
  opacity: 0;
  z-index: -200;
  transform: trasnslateX(200px);
}

</style>
