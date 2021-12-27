
<script>
// window.onunload = function () {
//   window.opener.location.reload();
// };
export default {
  name: 'AuthRedirect',
  data() {
    return {
      msg: ''
    }
  },
  created() {
    var hash = window.location.hash
    var id = hash.split('?')[1]
    console.log(parent.window)
    parent.window.opener.handleAuthResult(id)
    parent.window.close()
    // if (window.localStorage) {
    //   // alert(1);
    //   window.localStorage.setItem('x-oauth-id', id);
    //   var tt = window.localStorage.getItem('x-admin-oauth-code');
    //   alert(tt);
    //   window.close();
    // }
    // alert(2);
    // alert(1)
    // this.msg='wxl'
    // this.$store
    //   .dispatch("oauth/addUser", id)
    //   .then(() => {
    //     this.msg = '添加成功'
    //     window.close()
    //   })
    //   .catch((ex) => {
    //     this.msg = ex
    //     setTimeout(window.close, 1000)
    //   })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
