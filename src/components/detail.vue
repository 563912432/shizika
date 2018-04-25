<template>
  <div style="flex: 1;display: flex">
    <div v-show="isShow" class="detail">
      <v-header></v-header>
      <div class="content" v-loading.body="loading">
        <div class="menu">
        <span>
          <span class="menu-title" @click="back"><img src="../assets/back.png" alt="返回"> 返回</span>
          <span class="menu-title" @click="prevPage"><img src="../assets/left.png" alt="上一个"> 上一个</span>
          <span class="menu-title" @click="nextPage"><img src="../assets/right.png" alt="下一个"> 下一个</span>
          <router-link to="/" class='menu-title1' style="color: #fff;text-decoration: none">
            <img src="../assets/home.png" alt="首页"> 首页
          </router-link>
        </span>
          <span ref="button">
          <span v-if="isPlay" @click="play">
            <img src="../assets/pause.png" style="width: 13px;height: 13px;margin-bottom: -1px" alt="暂停"> 暂停
          </span>
          <span v-else @click="play">
            <img src="../assets/play.png" style="width: 13px;height: 13px;margin-bottom: -1px" alt="播放"> 播放
          </span>

        </span>
        </div>
        <div class="wrapper">
          <img v-if="thumb" :src="host + 'Uploads/' + thumb" width="100%" height="100%">
          <audio ref="audio"></audio>
        </div>
        <div class="learn">
          <img src="../assets/learn.png" @click="learn($event)" tag="1" style="width: 120px;height: 24px">
        </div>
      </div>
    </div>
    <div class="learn-gif" v-show="!isShow" @click='learn($event)' tag='1'>
      <img v-if="gif" id="gif" style="width: 100%;">
      <span v-else style="color: #ffffff;font-size: 20px">暂无图片</span>
    </div>
  </div>
</template>
<script>
  import header from '@/components/header'

  export default {
    name: 'detail',
    data () {
      return {
        host: '/',
        thumb: null,
        loading: false,
        audio: null,
        isPlay: false,
        currentMp3: '',
        index: 0,
        all: [],
        gif: null,
        isShow: true
      }
    },
    components: {
      'v-header': header
    },
    watch: {
      currentMp3 () {
        if (!this.isIOS()) {
          this.$refs.button.childNodes[0].click()
        }
      }
    },
    mounted () {
      this.loading = true
      let formdata = new FormData()
      formdata.append('id', this.$route.params.id)
      formdata.append('cid', this.$route.params.cid)
      let url = this.host + 'Api/Pinyin/detail'
      this.post(url, formdata, res => {
        this.loading = false
        if (res.status) {
          this.all = res.info
          this.all.map((v, index) => {
            if (v.id === this.$route.params.id) {
              this.thumb = v.thumb
              this.index = index
              this.currentMp3 = v.mp3
              this.gif = v.gif
            }
          })
        }
      })
    },
    destroyed () {
      this.isPlay = false
    },
    methods: {
      post (url, data, fn) {         // datat应为'a=a1&b=b1'这种字符串格式，在jq里如果data为对象会自动将对象转成这种字符串格式
        let obj = new XMLHttpRequest()
        obj.open('POST', url, true)
        obj.onreadystatechange = function () {
          if (+obj.readyState === 4 && (+obj.status === 200 || +obj.status === 304 || +obj.status === 0)) {  // 304未修改
            fn.call(this, JSON.parse(obj.responseText))
          }
        }
        obj.send(data)
      },
      nextPage () {
        if (this.index >= this.all.length - 1) {
          console.log('end')
          return
        }
        this.isPlay = false
        this.index++
        this.thumb = this.all[this.index]['thumb']
        this.currentMp3 = this.all[this.index]['mp3']
        this.gif = this.all[this.index]['gif']
        this.createAudio()
      },
      prevPage () {
        if (this.index <= 0) {
          console.log('first')
          return
        }
        this.isPlay = false
        this.index--
        this.thumb = this.all[this.index]['thumb']
        this.currentMp3 = this.all[this.index]['mp3']
        this.gif = this.all[this.index]['gif']
        this.createAudio()
      },
      back () {
        this.$router.push({path: '/list/' + this.$route.params.cid})
      },
      learn (event) {
        if (event.target.getAttribute('tag') === '1') {
          this.isShow = !this.isShow
          let gif = document.getElementById('gif')
          if (this.isShow) {
            if (gif) {
              gif.src = ''
            }
          } else {
            if (this.gif !== null) {
              gif.src = this.host + 'Uploads/' + this.gif
            }
          }
        }
      },
      createAudio () {
        if (!this.audio) {
          this.audio = this.$refs.audio
          this.audio.addEventListener('ended', () => {
            this.isPlay = false
          })
        }
        this.audio.src = this.host + 'Uploads/Mp3/' + this.currentMp3
      },
      play () {
        if (!this.audio) {
          this.createAudio()
        }
        if (!this.isPlay) {
          this.playAudio({audioObj: this.audio, type: true})
          this.isPlay = true
        } else {
          this.playAudio({audioObj: this.audio, type: false})
          this.isPlay = false
        }
      },
      playAudio (parameters) {
        let {audioObj, type} = parameters
        if (type) {
          audioObj.play()
        } else {
          audioObj.pause()
        }
      },
      isIOS () {
        let userAgent = navigator.userAgent
        return !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      }
    }
  }
</script>
<style scoped>
  .detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .detail .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .detail .content .menu {
    display: flex;
    height: 40px;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    font-size: 13px;
    color: #fff;
    background-color: #038384;
    z-index: 1;
  }

  .detail .content .menu-title {
    margin-right: 8px;
  }

  .detail .content .menu-title img {
    width: 13px;
    height: 13px;
    margin-bottom: -1px;
  }

  .detail .content .menu-title1 img {
    width: 13px;
    height: 13px;
    margin-bottom: -1px;
  }

  .detail .content .wrapper {
    background-color: #fff;
    flex: 1;
    display: flex;
    overflow-y: auto;
    z-index: 1;
  }

  .detail .content .learn {
    position: absolute;
    bottom: 10px;
    text-align: center;
    width: 100%;
    height: auto;
    z-index: 2;
  }

  .learn-gif {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #000000;
  }
</style>
