firebase.initializeApp(config);

var provider = new firebase.auth.GoogleAuthProvider();
$(document).ready(function(){
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        window.location = "account.html";
      }
    });

    $('.sign-in').click(popsignin)
});

function popsignin(){
    firebase.auth().signInWithPopup(provider).then(function(result) {
        window.location = "account.html";
    }).catch(function(error) {});
}
