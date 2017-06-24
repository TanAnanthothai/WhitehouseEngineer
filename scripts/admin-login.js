	  var txtEmail = document.getElementById('txtEmail');
    var txtPassword = document.getElementById('txtPassword');
    var btnLogin = document.getElementById('btnLogin');
    var btnSignup = document.getElementById('btnSignup');

    function admin_login() {
      var email = txtEmail.value;
      var password = txtPassword.value;
      var auth = firebase.auth();
      var promise = auth.signInWithEmailAndPassword(email, password);
      promise.catch(e => console.log(e.message));
    }

    function admin_signup() {
      var email = txtEmail.value;
      var password = txtPassword.value;
      var auth = firebase.auth();
      var promise = auth.createUserWithEmailAndPassword(email, password);
      promise.catch(e => console.log(e.message));
    }

    //No button to call this yet
    function admin_logout() {
      firebase.auth().signOut();
    }

    firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser){
        console.log(firebaseUser);
      } else {
         console.log("Not logged in.");
      }
    });