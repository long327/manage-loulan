
  import 'viewerjs/dist/viewer.css'
  import Viewer from "v-viewer/src/component.vue"

  export default {
    components: { Viewer },
    data() {
      return {
        options: { 
            "inline": true, 
            "button": true, 
            "navbar": true, 
            "title": false, 
            "toolbar": true, 
            "tooltip": false,
            "movable": false, 
            "zoomable": true, 
            "rotatable": false, 
            "scalable": false, 
            "transition": false, 
            "fullscreen": false, 
            "keyboard": false, 
            "url": "data-source" 
          },
      }
    },
    methods: {
        inited (viewer) {
            this.$viewer = viewer
        },
        show () {
            this.$viewer.show()
        },
    }
  }
  