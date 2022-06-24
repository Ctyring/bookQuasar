<template>
  <div class="body" :class="{on_start:isStart, document_loaded:isLoad}">
    <div class="main">
      <form class="form" autocomplete="off" @keyup.enter="login">
        <div class="form__cover"></div>
        <div class="form__loader">
          <div class="spinner active">
            <svg class="spinner__circular" viewBox="25 25 50 50">
              <circle class="spinner__path" cx="50" cy="50" r="20" fill="none" stroke-width="4" stroke-miterlimit="10"></circle>
            </svg>
          </div>
        </div>
        <div class="form__content">
          <h1>Authorization</h1>
          <div class="styled-input" :class="{filled:isFilledU}">
            <input autocomplete="off" type="text" class="styled-input__input" name="nickname"  v-model="user.username" @focus="focusU" @blur="blurU">
            <div class="styled-input__placeholder">
              <span class="styled-input__placeholder-text">
                <span class="letter" :class="{active:U1}">U</span>
                <span class="letter" :class="{active:U2}">s</span>
                <span class="letter" :class="{active:U3}">e</span>
                <span class="letter" :class="{active:U4}">r</span>
                <span class="letter" :class="{active:U5}">n</span>
                <span class="letter" :class="{active:U6}">a</span>
                <span class="letter" :class="{active:U7}">m</span>
                <span class="letter" :class="{active:U8}">e</span>
              </span>
            </div>
            <div class="styled-input__circle"></div>
          </div>
          <div class="styled-input" :class="{filled:isFilledP}">
            <input autocomplete="new-password" type="password" class="styled-input__input" v-model="user.password" @focus="focusP" @blur="blurP">
            <div class="styled-input__placeholder"> <span class="styled-input__placeholder-text">
                <span class="letter" :class="{active:P1}">P</span>
                <span class="letter" :class="{active:P2}">a</span>
                <span class="letter" :class="{active:P3}">s</span>
                <span class="letter" :class="{active:P4}">s</span>
                <span class="letter" :class="{active:P5}">w</span>
                <span class="letter" :class="{active:P6}">o</span>
                <span class="letter" :class="{active:P7}">r</span>
                <span class="letter" :class="{active:P8}">d</span>
            </span> </div>
            <div class="styled-input__circle"></div>
          </div>
          <div class="styled-input" :class="{filled:isFilledC}" style="width: 50%; display: inline">
            <input autocomplete="off" type="text" class="styled-input__input" v-model="user.captcha" @focus="focusC" @blur="blurC">
            <div class="styled-input__placeholder"> <span class="styled-input__placeholder-text">
                <span class="letter" :class="{active:C1}">C</span>
                <span class="letter" :class="{active:C2}">a</span>
                <span class="letter" :class="{active:C3}">p</span>
                <span class="letter" :class="{active:C4}">t</span>
                <span class="letter" :class="{active:C5}">c</span>
                <span class="letter" :class="{active:C6}">h</span>
                <span class="letter" :class="{active:C7}">a</span>
            </span> </div>
            <div class="styled-input__circle"></div>
          </div>
<!--          <div style="width: 40%; background-color: #5cb3cc; height: 50px; display: inline;position: relative; float: right"></div>-->
          <button type="button" class="styled-button" @click="login"> <span class="styled-button__real-text-holder"> <span class="styled-button__real-text">Submit</span> <span class="styled-button__moving-block face"> <span class="styled-button__text-holder"> <span class="styled-button__text">Submit</span> </span> </span><span class="styled-button__moving-block back"> <span class="styled-button__text-holder"> <span class="styled-button__text">Submit</span> </span> </span> </span> </button>
          <img v-if="requestCodeSuccess" @click="handleChangeCheckCode" style="width: 80px; background-color: #5cb3cc; height: 40px; display: inline; position: absolute; right: 20px; bottom: 115px" :src="randCodeImage">
          <img v-else @click="handleChangeCheckCode" style="width: 80px; background-color: #5cb3cc; height: 40px; display: inline; position: absolute; right: 20px; bottom: 115px" src="../assets/images/checkcode.png">
        </div>
      </form>
    </div>
    <loading v-if="isLoading && isLoad"></loading>
<!--    <q-banner inline-actions class="text-white bg-red" style="order: 100">-->
<!--      You have lost connection to the internet. This app is offline.-->
<!--      <template v-slot:action>-->
<!--        <q-btn flat color="white" label="Turn ON Wifi" />-->
<!--      </template>-->
<!--    </q-banner>-->
  </div>
</template>

<script>
import {api} from "boot/axios";
import store from "src/store";
import Loading from "components/loading";
export default {
  name:"login",
  components: {Loading},
  data(){
    return {
      isLoading:false,
      requestCodeSuccess: false,
      randCodeImage: '',
      currdatetime:'',
      isStart:false,
      isLoad:false,
      isFilledU:false,
      isFilledP:false,
      isFilledC:false,
      inputCode:'',
      user:{
        username:"",
        password:"",
        captcha:"",
        checkKey:""
      },
      U1:false,
      U2:false,
      U3:false,
      U4:false,
      U5:false,
      U6:false,
      U7:false,
      U8:false,
      P1:false,
      P2:false,
      P3:false,
      P4:false,
      P5:false,
      P6:false,
      P7:false,
      P8:false,
      C1:false,
      C2:false,
      C3:false,
      C4:false,
      C5:false,
      C6:false,
      C7:false,
    }
  },
  methods:{
    /**刷新验证码*/
    async handleChangeCheckCode(){
      // this.isLoading = true
      this.currdatetime = new Date().getTime()
      this.user.captcha = ''
      const {data:res} = await api.get(`/user/user/randomImage/${this.currdatetime}`)
      if (res.flag === true){
        this.requestCodeSuccess=true
        this.randCodeImage = res.data
      }else{
        this.$q.notify({
          message: res.message,
          color: 'red',
          position:'top'
        })
        this.requestCodeSuccess=false
      }
      // this.isLoading = false
    },
    async login(){
      this.isLoading = true
        const {data: res} = await api.post('/user/sys/login',
          {
            "captcha": this.user.captcha,
            "checkKey": this.currdatetime,
            "password": this.user.password,
            "username": this.user.username
          }
        )
        if(res.flag === true){
          this.$q.notify({
            message: res.message,
            color: 'green',
            position:'top'
          })
          console.log(res.result)
          store().commit('SET_TOKEN',res.result.token)
          store().commit('SET_AVATAR', res.result.userInfo.avatar)
          store().commit('SET_USERNAME', res.result.userInfo.username)
          store().commit('SET_SEX', res.result.userInfo.sex)
          store().commit('SET_BIRTHDAY', res.result.userInfo.birthday)
          store().commit('SET_EMAIL', res.result.userInfo.phone)
          store().commit('SET_ID', res.result.userInfo.id)
          store().commit('SET_USERIDENTITY', res.result.userInfo.userIdentity)
          await this.$router.push('/')
        }else{
          this.$q.notify({
            message: res.message,
            color: 'red',
            position:'top'
          })
        }
      this.isLoading = false
    },
    focusU(e){
      this.isFilledU = true
      setTimeout(() =>{
        this.U1 = true
      },50)
      setTimeout(() =>{
        this.U2 = true
      },100)
      setTimeout(() =>{
        this.U3 = true
      },150)
      setTimeout(() =>{
        this.U4 = true
      },200)
      setTimeout(() =>{
        this.U5 = true
      },250)
      setTimeout(() =>{
        this.U6 = true
      },300)
      setTimeout(() =>{
        this.U7 = true
      },350)
      setTimeout(() =>{
        this.U8 = true
      },400)
    },
    focusC(e){
      this.isFilledC = true
      setTimeout(() =>{
        this.C1 = true
      },50)
      setTimeout(() =>{
        this.C2 = true
      },100)
      setTimeout(() =>{
        this.C3 = true
      },150)
      setTimeout(() =>{
        this.C4 = true
      },200)
      setTimeout(() =>{
        this.C5 = true
      },250)
      setTimeout(() =>{
        this.C6 = true
      },300)
      setTimeout(() =>{
        this.C7 = true
      },350)
    },
    blurP(e){
      if((this.user.password??'') !== ''){
        return
      }
      this.isFilledP = false
      setTimeout(() =>{
        this.P1 = false
      },50)
      setTimeout(() =>{
        this.P2 = false
      },100)
      setTimeout(() =>{
        this.P3 = false
      },150)
      setTimeout(() =>{
        this.P4 = false
      },200)
      setTimeout(() =>{
        this.P5 = false
      },250)
      setTimeout(() =>{
        this.P6 = false
      },300)
      setTimeout(() =>{
        this.P7 = false
      },350)
      setTimeout(() =>{
        this.P8 = false
      },400)
    },
    focusP(e){
      this.isFilledP = true
      setTimeout(() =>{
        this.P1 = true
      },50)
      setTimeout(() =>{
        this.P2 = true
      },100)
      setTimeout(() =>{
        this.P3 = true
      },150)
      setTimeout(() =>{
        this.P4 = true
      },200)
      setTimeout(() =>{
        this.P5 = true
      },250)
      setTimeout(() =>{
        this.P6 = true
      },300)
      setTimeout(() =>{
        this.P7 = true
      },350)
      setTimeout(() =>{
        this.P8 = true
      },400)
    },
    blurU(e){
      if((this.user.username??'') !== ''){
        return
      }
      this.isFilledU = false
      setTimeout(() =>{
        this.U1 = false
      },50)
      setTimeout(() =>{
        this.U2 = false
      },100)
      setTimeout(() =>{
        this.U3 = false
      },150)
      setTimeout(() =>{
        this.U4 = false
      },200)
      setTimeout(() =>{
        this.U5 = false
      },250)
      setTimeout(() =>{
        this.U6 = false
      },300)
      setTimeout(() =>{
        this.U7 = false
      },350)
      setTimeout(() =>{
        this.U8 = false
      },400)
    },
    blurC(e){
      if((this.user.captcha??'') !== ''){
        return
      }
      this.isFilledC = false
      setTimeout(() =>{
        this.C1 = false
      },50)
      setTimeout(() =>{
        this.C2 = false
      },100)
      setTimeout(() =>{
        this.C3 = false
      },150)
      setTimeout(() =>{
        this.C4 = false
      },200)
      setTimeout(() =>{
        this.C5 = false
      },250)
      setTimeout(() =>{
        this.C6 = false
      },300)
      setTimeout(() =>{
        this.C7 = false
      },350)
    },
  },
  mounted() {
    setTimeout(() =>{
      this.isStart = true
    },100)
    setTimeout(()=>{
      this.isLoad = true
    }, 1800)
  },
  created() {
    this.handleChangeCheckCode()
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto');
.body {
  all: initial;
  font-family: 'Roboto', sans-serif;
  letter-spacing: 0.02em;
}
* {
  box-sizing: border-box;
}
.main {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background: #3f2766;
}
.form {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  position: relative;
  width: 500px;
  height: 500px;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  padding: 20px;
  border-radius: 5px;
}
.form__loader {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  z-index: -4;
  -webkit-transition: all 0.5s ease;
  transition: all 0.5s ease;
}
.form__content {
  text-align: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  position: relative;
  opacity: 0;
  -webkit-transform: translateY(10px);
  transform: translateY(10px);
  -webkit-transition: all 0.5s ease 0.7s;
  transition: all 0.5s ease 0.7s;
}
.form__cover {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: -4;
  border-radius: 7px;
  overflow: hidden;
  -webkit-transition: all 0.3s ease 0.8s;
  transition: all 0.3s ease 0.8s;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
}
.form__cover:after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: #4d317a;
  z-index: -4;
  border-radius: 50%;
  -webkit-transition: all 1.5s ease 0.3s;
  transition: all 1.5s ease 0.3s;
  -webkit-transform: scale(0);
  transform: scale(0);
}
.form__cover:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: white;
  z-index: -5;
  border-radius: 50%;
  -webkit-transition: all 0.5s ease;
  transition: all 0.5s ease;
  -webkit-transform: scale(0);
  transform: scale(0);
}
.body.on_start .form__cover:before {
  -webkit-transform: scale(0.15);
  transform: scale(0.15);
}
.body.document_loaded .form__loader {
  -webkit-transform: scale(0);
  transform: scale(0);
  opacity: 0;
  visibility: hidden;
}
.body.document_loaded .form__content {
  opacity: 1;
  -webkit-transform: none;
  transform: none;
}
.body.document_loaded .form__cover {
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}
.body.document_loaded .form__cover:after {
  -webkit-transform: scale(2);
  transform: scale(2);
}
.body.document_loaded .form__cover:before {
  -webkit-transition: opacity 0.3s ease 0.8s, -webkit-transform 2s ease;
  transition: opacity 0.3s ease 0.8s, -webkit-transform 2s ease;
  transition: transform 2s ease, opacity 0.3s ease 0.8s;
  transition: transform 2s ease, opacity 0.3s ease 0.8s, -webkit-transform 2s ease;
  -webkit-transform: scale(2);
  transform: scale(2);
  opacity: 0;
}
h1 {
  font-size: 40px;
  margin: 15px 0 20px 0;
  letter-spacing: 0.05em;
  color: #714cab;
  font-weight: 700;
}
.styled-button {
  -webkit-appearance: none;
  -webkit-user-select: none;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  padding: 20px;
  outline: none;
  background: none;
  position: relative;
  color: #492e72;
  border-radius: 3px;
  margin-bottom: 25px;
  border: none;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.1em;
  background: #714cac;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
  overflow: hidden;
}
.styled-button__real-text-holder {
  position: relative;
}
.styled-button__real-text {
  color: transparent;
  display: inline-block;
}
.styled-button__text-holder {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
}
.styled-button__moving-block {
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.styled-button__moving-block.back {
  color: white;
  -webkit-transform: translateX(-100%);
  transform: translateX(-100%);
}
.styled-button__moving-block.back .styled-button__text-holder {
  -webkit-transform: translateX(100%);
  transform: translateX(100%);
}
.styled-button:hover,
.styled-button:active {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  background: #7a51bb;
}
.styled-button:hover .face,
.styled-button:active .face {
  -webkit-transform: translateX(100%);
  transform: translateX(100%);
}
.styled-button:hover .face .styled-button__text-holder,
.styled-button:active .face .styled-button__text-holder {
  -webkit-transform: translateX(-100%);
  transform: translateX(-100%);
}
.styled-button:hover .back,
.styled-button:active .back {
  -webkit-transform: translateX(0);
  transform: translateX(0);
}
.styled-button:hover .back .styled-button__text-holder,
.styled-button:active .back .styled-button__text-holder {
  -webkit-transform: translateX(0);
  transform: translateX(0);
}
.styled-button:active {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
.styled-input {
  width: 100%;
  position: relative;
  margin-bottom: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
}
.styled-input__circle {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  overflow: hidden;
  border-radius: 3px;
}
.styled-input__circle:after {
  content: '';
  position: absolute;
  left: 16.5px;
  top: 19px;
  height: 14px;
  width: 14px;
  z-index: -2;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0);
  -webkit-transition: opacity 1s ease, -webkit-transform 0.6s ease;
  transition: opacity 1s ease, -webkit-transform 0.6s ease;
  transition: transform 0.6s ease, opacity 1s ease;
  transition: transform 0.6s ease, opacity 1s ease, -webkit-transform 0.6s ease;
}
.styled-input__input {
  width: 100%;
  -webkit-appearance: none;
  font-size: 14px;
  outline: none;
  background: none;
  padding: 18px 15px;
  color: #ceafff;
  border: none;
  font-weight: 600;
  letter-spacing: 0.035em;
}
.styled-input__placeholder {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  z-index: -1;
  padding-left: 45px;
  color: white;
}
.styled-input__placeholder-text {
  -webkit-perspective: 500px;
  perspective: 500px;
  display: inline-block;
}
.styled-input__placeholder-text .letter {
  display: inline-block;
  vertical-align: middle;
  position: relative;
  -webkit-animation: letterAnimOut 0.25s ease forwards;
  animation: letterAnimOut 0.25s ease forwards;
  text-shadow: 0 0 5px;
}
.styled-input__placeholder-text .letter.active {
  -webkit-animation: letterAnimIn 0.25s ease forwards;
  animation: letterAnimIn 0.25s ease forwards;
}
.styled-input:hover {
  border-color: rgba(255, 255, 255, 0.4);
}
.styled-input.filled {
  border-color: rgba(255, 255, 255, 0.2);
}
.styled-input.filled .styled-input__circle:after {
  -webkit-transform: scale(37);
  transform: scale(37);
  opacity: 0;
}
@-webkit-keyframes letterAnimIn {
  0% {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  25% {
    -webkit-transform: translate(0, 10px);
    transform: translate(0, 10px);
    color: red;
  }
  45% {
    -webkit-transform: translate(0, 10px);
    transform: translate(0, 10px);
    opacity: 0;
    color: red;
  }
  55% {
    -webkit-transform: translate(0, 10px);
    transform: translate(0, 10px);
    opacity: 0;
  }
  56% {
    -webkit-transform: translate(-30px, -27px);
    transform: translate(-30px, -27px);
    opacity: 0;
    color: #00ff6b;
  }
  76% {
    color: #00ff6b;
    opacity: 1;
    -webkit-transform: translate(-30px, -27px);
    transform: translate(-30px, -27px);
  }
  100% {
    -webkit-transform: translate(-30px, -27px);
    transform: translate(-30px, -27px);
    opacity: 1;
  }
}
@keyframes letterAnimIn {
  0% {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  25% {
    -webkit-transform: translate(0, 10px);
    transform: translate(0, 10px);
    color: red;
  }
  45% {
    -webkit-transform: translate(0, 10px);
    transform: translate(0, 10px);
    opacity: 0;
    color: red;
  }
  55% {
    -webkit-transform: translate(0, 10px);
    transform: translate(0, 10px);
    opacity: 0;
  }
  56% {
    -webkit-transform: translate(-30px, -27px);
    transform: translate(-30px, -27px);
    opacity: 0;
    color: #00ff6b;
  }
  76% {
    color: #00ff6b;
    opacity: 1;
    -webkit-transform: translate(-30px, -27px);
    transform: translate(-30px, -27px);
  }
  100% {
    -webkit-transform: translate(-30px, -27px);
    transform: translate(-30px, -27px);
    opacity: 1;
  }
}
@-webkit-keyframes letterAnimOut {
  0% {
    -webkit-transform: translate(-30px, -27px);
    transform: translate(-30px, -27px);
    opacity: 1;
  }
  25% {
    -webkit-transform: translate(-30px, -40px);
    transform: translate(-30px, -40px);
    opacity: 0;
  }
  45% {
    -webkit-transform: translate(0, 10px);
    transform: translate(0, 10px);
    opacity: 0;
  }
  55% {
    -webkit-transform: translate(0, 10px);
    transform: translate(0, 10px);
    opacity: 0;
    color: red;
  }
  56% {
    -webkit-transform: translate(0, 10px);
    transform: translate(0, 10px);
    color: red;
  }
  100% {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
}
@keyframes letterAnimOut {
  0% {
    -webkit-transform: translate(-30px, -27px);
    transform: translate(-30px, -27px);
    opacity: 1;
  }
  25% {
    -webkit-transform: translate(-30px, -40px);
    transform: translate(-30px, -40px);
    opacity: 0;
  }
  45% {
    -webkit-transform: translate(0, 10px);
    transform: translate(0, 10px);
    opacity: 0;
  }
  55% {
    -webkit-transform: translate(0, 10px);
    transform: translate(0, 10px);
    opacity: 0;
    color: red;
  }
  56% {
    -webkit-transform: translate(0, 10px);
    transform: translate(0, 10px);
    color: red;
  }
  100% {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
}
.spinner {
  position: relative;
  margin: auto;
  width: 50px;
  height: 50px;
  -webkit-transition: all 0.2s ease 0s;
  transition: all 0.2s ease 0s;
}
.spinner__circular {
  -webkit-animation: rotate 1.5s linear infinite;
  animation: rotate 1.5s linear infinite;
  -webkit-animation-play-state: paused;
  animation-play-state: paused;
  -webkit-transform-origin: center center;
  transform-origin: center center;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  margin: auto;
}
.spinner__path {
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  -webkit-animation: dash 1.3s ease forwards 0.5s;
  animation: dash 1.3s ease forwards 0.5s;
  opacity: 0;
  stroke-linecap: round;
  stroke: #7b23ff;
  -webkit-animation-play-state: running;
  animation-play-state: running;
}
@-webkit-keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    opacity: 0;
  }
  50% {
    stroke-dasharray: 40, 200;
    opacity: 1;
  }
  100% {
    stroke-dasharray: 125, 200;
    opacity: 1;
  }
}
@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    opacity: 0;
  }
  50% {
    stroke-dasharray: 40, 200;
    opacity: 1;
  }
  100% {
    stroke-dasharray: 125, 200;
    opacity: 1;
  }
}

</style>
