firebase.initializeApp(config);
var osiss;
var idnums;
var corrolate = {}
var d;
var provider = new firebase.auth.GoogleAuthProvider();
$(document).ready(function(){
    d = new Date();
    d = (String(d.getMonth()+1)+"-"+String(d.getDate())+"-"+String(d.getFullYear()))
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        initswipe()
      } else {
        window.location = "index.html";
      }
    });
    setInterval(function(){
        $('#numinput').focus();
    },1000)
    $('#numinput').keypress(function(e) {
        if(e.which == 13) {
            var num = $(this).val();
            var id;
            var type;
            if(num.length>10){
                id=idnums[num];
                type = "ID number";
            }else{
                id=osiss[num]
                type = "OSIS number"
            }
            userref = firebase.database().ref('/users/'+id+'/swipes/');
            var update = {};
            update[d] = Date.now();
            if(!corrolate[id]){
                console.log('bad scan')
                $('body').removeClass('black');
                $('body').addClass('red');
                setTimeout(function(){
                    $('body').removeClass('red');
                    $('body').addClass('black');
                },500)
            }
            else{
                userref.update(update).then(() => {
                    $('body').removeClass('black');
                    $('body').addClass('green');
                    setTimeout(function(){
                        $('body').removeClass('green');
                        $('body').addClass('black');
                    },500)
                    $('.'+id).remove()
                    $('.lastswipe').html("<h5>"+corrolate[id]+"</h5><h6>using their: </h6><h6>"+type+"</h6>")
                    $('.signedinnames').append('<div class="chip"'+id+'">'+corrolate[id]+'</div>')
                })
            }
            $(this).val('')
        }
    });
});

function initswipe(){
    var userId = firebase.auth().currentUser.uid;
    var usersref = firebase.database().ref('/users/');
    var osisref = firebase.database().ref('/osiss/');
    var idcardnumref = firebase.database().ref('/idcardnums/');
    usersref.once('value').then(function(snapshot) {
        $.each(snapshot.val(), function(user,vals) {
            data = vals.userdata
            swipes = vals.swipes
            if(swipes){
                if(swipes[d]) $('.signedinnames').append('<div class="chip" class="'+user+'">'+data.fullname+'</div>')
            }
            else $('.names').append('<div class="chip '+user+'">'+data.fullname+'</div>');
            corrolate[String(user)] = data.fullname;
        });
    });
    osisref.on('value',function(snapshot){
        osiss = snapshot.val();
    })
    idcardnumref.on('value',function(snapshot){
        idnums = snapshot.val();
    })
}
