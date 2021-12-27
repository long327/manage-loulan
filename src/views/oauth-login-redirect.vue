
<script>
// window.onunload = function () {
//   window.opener.location.reload();
// };
export default {
  name: 'AuthLoginRedirect',
  data() {
    return {
      msg: ''
    }
  },
  created() {
    setTimeout(() => {
      var hash = window.location.hash
      var id = hash.split('?')[1]
      console.log(parent.window)
      debugger

      parent.window.opener.handleOauthLoginCallback(id)
      parent.window.close()
    }, 1000)
    
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
