	var txtEmail = document.getElementById('txtEmail');
    var txtPassword = document.getElementById('txtPassword');
    var btnLogin = document.getElementById('btnLogin');

    function admin_login() {
      var email = txtEmail.value;
      var password = txtPassword.value;
      var auth = firebase.auth();
      var promise = auth.signInWithEmailAndPassword(email, password);
      promise.catch(e => console.log(e.message));
    }
