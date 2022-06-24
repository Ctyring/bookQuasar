<template>
  <div class="body">
    <div id="content">
      <div class="tip1" @mouseup="up($event,index)" @mousedown="down($event,index)" @mousemove="moveTip"
           :style="{left:item.left+'px', top:item.top+'px', zIndex:item.z}"
           v-for="(item, index) in messageList" @click="showMessage(index)">
        <div class="tip_h">

          <!--		                 <div class="close" title="关闭纸条"  style="cursor: pointer;" @click="deleteMessage(item.messageId)">×</div>-->
          <div class="clr"></div>
        </div>
        <div class="tip_c">
          <div class="num">{{ item.createTime.substr(0, 10) }}</div>
          {{ item.message }}
        </div>
        <div class="tip_f">
          <div class="icon">
            <img src="../assets/images/bpic_1.gif" alt="" title="">
          </div>
          <div class="name">{{ item.name }}</div>
          <div class="clr"></div>
        </div>
      </div>
    </div>
    <div id="comment-box">
      <div id="comment">
        <div id="count">
          <b>留言:{{ this.messageList.length }}</b>
        </div>
        <div id="ipt">
          <textarea @keyup.enter="sendVisible = true" v-model="addForm.content" placeholder="说点什么吧..." resize="none"
                    name="" id="" cols="30" rows="10"></textarea>
          <div class="action">
            <button id="submit" :disabled="addForm.content.length == 0" @click="sendVisible = true">发送留言</button>
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="sendVisible" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">请输入昵称</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="addForm.name" autofocus @keyup.enter="sendMessage()"/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="取消" v-close-popup @click="sendClosed"/>
          <q-btn flat label="确定" v-close-popup @click="sendMessage"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!--    <el-dialog-->
    <!--      title="请输入名称"-->
    <!--      :visible.sync="sendVisible"-->
    <!--      width="50%" @close="sendClosed">-->
    <!--      <el-input v-model="addForm.name"></el-input>-->
    <!--      <span slot="footer" class="dialog-footer">-->
    <!--				  <el-button @click="sendClosed">取 消</el-button>-->
    <!--				  <el-button type="primary" @click="sendMessage()">确 定</el-button>-->
    <!--				</span>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
import {api} from "boot/axios";

export default {
  name: "words",
  data() {
    return {
      sendVisible: false,
      messageList: [],
      z: 1,
      x: 0,
      y: 0,
      le: 0,
      to: 0,
      index: 0,
      canMove: false,
      addForm: {
        content: '',
        name: ''
      }
    }
  },
  methods: {
    up(e, index) {
      this.canMove = false
    },
    down(e, index) {
      this.le = this.messageList[index].left
      this.to = this.messageList[index].top
      this.x = e.clientX
      this.y = e.clientY
      this.index = index
      this.canMove = true
    },
    moveTip(e) {
      if (this.canMove && this.messageList[this.index].z == this.z - 1) {
        this.messageList[this.index].top = this.to + (e.clientY - this.y)
        this.messageList[this.index].left = this.le + (e.clientX - this.x)
        this.$forceUpdate()
      }
    },
    showMessage(index) {
      if (this.canMove == false) {
        return
      }
      this.messageList[index].z = this.z
      console.log(this.messageList[index])
      this.z++
      this.$forceUpdate()
    },
    sendClosed() {
      this.addForm.name = ''
      this.sendVisible = false
    },
    top() {
      return Math.random() * 300
    },
    left() {
      return Math.random() * 800
    },
    async getMessage() {
      const {data: res} = await api.post('/system/message/search/1/20', {})
      this.messageList = res.data.rows
      for (let i = 0; i < this.messageList.length; i++) {
        this.messageList[i].top = this.top()
        this.messageList[i].left = this.left()
        this.messageList[i].z = 0
      }
    },
    async sendMessage() {
      const {data: res} = await api.post('/system/message', this.addForm)
      // if (res.code !== 200){
      //   console.log(res)
      //   return this.$message.error('获取留言墙信息失败')
      // }
      this.sendVisible = false
      this.getMessage()
    }
  },
  created() {
    this.getMessage()
  },
}
</script>

<style scoped>
.body {
  margin: 0 auto;
  padding-top: 30px;
  height: 110vh;
  font-size: 12px;
  background: url(../assets/images/bg.gif) repeat center 36px;
  text-align: center;
  background-color: #c30230;
}

#content {
  margin: 0 auto;
  width: 960px;
  background: url(../assets/images/content_bg.jpg) no-repeat left top;
  height: 627px;
  position: relative;
}

#content .tip1,
#content .tip2,
#content .tip3,
#content .tip4,
#content .tip5,
#content .tip6,
#content .tip7,
#content .tip8 {
  position: absolute;
  width: 227px;
  left: 200px;
  top: 100px;
}

#content .tip1 .tip_h {
  background: url(../assets/images/tip1_h.gif) no-repeat left top;
}

#content .tip1 .tip_h,
#content .tip2 .tip_h,
#content .tip3 .tip_h,
#content .tip4 .tip_h,
#content .tip5 .tip_h,
#content .tip6 .tip_h,
#content .tip7 .tip_h,
#content .tip8 .tip_h {
  width: 227px;
  padding-top: 45px;
  height: 23px;
  text-align: left;
  cursor: move;
}

#content .tip1 .tip_c {
  background: url(../assets/images/tip1_c.gif) repeat-y;
}

#content .tip1 .tip_c,
#content .tip2 .tip_c,
#content .tip3 .tip_c,
#content .tip4 .tip_c,
#content .tip5 .tip_c,
#content .tip6 .tip_c,
#content .tip7 .tip_c,
#content .tip8 .tip_c {
  width: 300px;
  padding-left: 12px;
  padding-right: 15px;
  min-height: 40px;
  text-align: left;
  line-height: 20px;
  max-height: 160px;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
}

#content .tip1 .tip_f {
  background: url(../assets/images/tip1_f.gif) no-repeat left top;
}

#content .tip1 .tip_f,
#content .tip2 .tip_f,
#content .tip3 .tip_f,
#content .tip4 .tip_f,
#content .tip5 .tip_f,
#content .tip6 .tip_f,
#content .tip7 .tip_f,
#content .tip8 .tip_f {
  width: 227px;
  height: 53px;
  padding-top: 20px;
}

#content .close,
#content .close2 {
  float: left;
  font-size: 12px;
  cursor: pointer;
  color: #000000;
}

.clr {
  clear: both;
  overflow: auto;
  display: block;
  height: 0px;
}

#content .icon {
  float: left;
  width: 35px;
  padding-left: 15px;
  height: 35px;
  text-align: center;
}

#content .name {
  float: right;
  padding-right: 15px;
  text-align: right;
  font-size: 14px;
  line-height: 35px;
  color: #C0F;
}

#content .num {
  float: left;
  padding-left: 7px;
  width: 295px;
}

#count {
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  color: #222;
}

#comment {
  padding: 20px;
  box-sizing: border-box;
  height: 180px;
  margin-top: 20px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  padding: 16px;
  background: #f8f8f8;

}

#comment textarea {
  display: block;
  border: 0;
  padding: 0;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  max-height: 72px;
  width: 100%;
  height: 150px;
  font-size: 16px;
  line-height: 24px;
  color: #222;
  outline: none;
  resize: none;
  background: #f8f8f8;
  -webkit-transition: height .3s ease-in-out;
  -moz-transition: height .3s ease-in-out;
  transition: height .3s ease-in-out;

}

#comment button {
  border: none;
  border-radius: 4px;
  padding: 6px 18px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #fff;
  background: gray;
  cursor: pointer;
  outline: none;
}

#comment button:hover {
  background: deeppink;
}

#comment-box {
  width: 960px;
  margin: 0 auto;
  background: #fff;

}

.action {
  text-align: right;
}

#count {
  text-align: left;
  margin-bottom: 10px;
}
</style>
