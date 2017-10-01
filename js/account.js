firebase.initializeApp(config);
var user;
var provider = new firebase.auth.GoogleAuthProvider();
$(document).ready(function(){
    $(".modal-close").click(function(){
        getuserdata(user)})
    $('#firstusermodal').modal();
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        user = user;
        getuserdata(user);
      } else {
        window.location = "index.html";
      }
    });

    $('.sign-out').click(signout)
    $('.save-info').click(updatebasicinfo)
});

function signout(){
    firebase.auth().signOut().then(function() {
        window.location = "index.html";
    }).catch(function(error) {
        console.log('outt')
    });
}

function updatebasicinfo(){
    var userId = firebase.auth().currentUser.uid;
    var userdataref = firebase.database().ref('/users/' + userId + '/userdata');
    var userinfo = {
        fullname: $('.full_name').val(),
        osis: $('.osis').val(),
        idcardnum: $('.idnum').val(),
        email: $('.email').val(),
        grade: $('.grade').val(),
    }
    $('.form').animate({
        opacity: 0
    },500,function(){
        $(this).animate({
            height: 0
        },500);
        $('.submitting').animate({
            opacity: 1
        },100,function(){
            userdataref.update(userinfo).then(() => {
                Materialize.toast('Information succesfully updated');
                var osisref = firebase.database().ref('/osiss/');
                var osis = $('.osis').val();
                var osisupdate = {};
                osisupdate[osis] = userId;
                var idref = firebase.database().ref('/idcardnums/');
                var idrefnum = $('.idnum').val();
                var idupdate = {};
                idupdate[idrefnum] = userId;
                osisref.update(osisupdate).then(() => {
                    idref.update(idupdate).then(() =>{
                        $('.form').animate({
                            height: "100%"
                        },500,function(){
                            $(this).animate({
                                opacity: 1
                            },500);
                            $('.submitting').animate({
                                opacity: 0
                            },100);
                        });
                    });
                });
            });
        });
    });
}

function getuserdata(user){
    var userId = firebase.auth().currentUser.uid;
    var userdataref = firebase.database().ref('/users/' + userId + '/userdata')
    userdataref.once('value').then(function(snapshot) {
      //If user is first time
      if(!snapshot.val()) newusersetup();
      else{
          userdata = snapshot.val();
          $('.grade').val(userdata.grade);
          $('.email').val(userdata.email);
          $('.idnum').val(userdata.idcardnum);
          $('.osis').val(userdata.osis)
          $('.full_name').val(userdata.fullname);
            $('.form').animate({
                height: "100%"
            },250,function(){
                $(this).animate({
                    opacity: 1
                },500);
                $('.submitting').animate({
                    opacity: 0
                },100);
            });
      }
    });

    function newusersetup(){
        var uploadeddata = {
            fullname: user.displayName,
            osis: 0,
            idcardnum: 0,
            email: user.email,
            grade: 'none',
        }
        $('#firstusermodal').modal('open')
        userdataref.update(uploadeddata)
    }

    firebase.database().ref('/users/'+firebase.auth().currentUser.uid+'/swipes/').on('value',function(snapshot){
        $('.swipebody').html('')
        $.each(snapshot.val(),function(date,time){
            d = new Date(time);
            $('.swipebody').append('<tr><td>'+date+'</td><td>'+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+'</td></tr>')
        })
    })
}
