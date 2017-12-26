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
        player: null
      }
    },
    mounted () {
      let videoHeight = 200
      let height = window.screen.height
      let viewHeight = window.innerHeight
      let titleHeight = height - viewHeight
      let marginTop = (height - videoHeight) / 2 - titleHeight
      document.getElementById('showVideo').style.marginTop = marginTop + 'px'
      this.player = polyvObject('#showVideo').videoPlayer({
        'width': '100%',
        'height': videoHeight,
        'vid': 'dbadf91f046627067f6133866e58db5f_d'
      })
      this.player.j2s_resumeVideo()
    },
    methods: {
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