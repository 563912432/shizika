<template>
  <div class="introduce" @click="outer">
    <div id="showVideo"></div>
  </div>
</template>
<script>
  import polyvObject from 'polyvObject'

  export default {
    name: 'introduce',
    data () {
      return {
        player: null,
        host: '/'
      }
    },
    mounted () {
      let vid = 'dbadf91f04386b8b072869066b788079_d'
      this.get(this.host + 'Api/Video/getPolySign/code/' + vid, res => {
        let response = JSON.parse(res)
        if (response.status) {
          let polySign = JSON.parse(response.info)
          let videoHeight = 200
          let height = window.screen.height
          let viewHeight = window.innerHeight
          let titleHeight = height - viewHeight
          let marginTop = (height - videoHeight) / 2 - titleHeight
          document.getElementById('showVideo').style.marginTop = marginTop + 'px'
          this.player = polyvObject('#showVideo').videoPlayer({
            'width': '100%',
            'height': videoHeight,
            'vid': vid,
            'ts': polySign.ts,
            'sign': polySign.sign
          })
          this.player.j2s_resumeVideo()
        } else {
          console.log(res.info)
        }
      })
    },
    methods: {
      get (url, fn) { // XMLHttpRequest对象用于在后台与服务器交换数据
        let xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.onreadystatechange = function () {
          if (+xhr.readyState === 4 && (+xhr.status === 200 || +xhr.status === 304 || +xhr.status === 0)) { // readyState == 4说明请求已完成
            fn.call(this, xhr.responseText) // 从服务器获得数据
          }
        }
        xhr.send()
      },
      outer () {
        // 关闭视频，关闭页面
        this.player.j2s_pauseVideo()
        this.player = null
        this.$router.push({path: '/'})
      }
    }
  }
</script>
<style scoped>
  .introduce {
    flex: 1;
    background-color: #212121;
    z-index: 0;
  }

  .introduce #showVideo {
    width: 100%;
    height: auto;
    z-index: 11;
  }

</style>
