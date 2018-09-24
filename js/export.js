var CLIENT_ID = '40323734350-9g2u5u9pdkftvmpkocf0jm9d6veeii35.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAWFwCOE8yE1c3x9x-z__mypsavCTcR89s';
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";
var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

firebase.initializeApp(config);

var usersref = firebase.database().ref('/users/');

// var frs = ["Bdg37qkcs5h6DrHGIqhxyxXTJ2p2","n7iE1Y8s0acPX6sJVOxQJoPWtX52","9BjdmEQdxHeiecai5fbF4kX5wgA2","E2QoKFgRLdaCuxkzf2Fx5ZARgJv2","m2y26f6niqeiRcU59Ce78KRBquL2","hFEk30GFWkfM7AXfFMQpaUTexvh2","sk6IUbSrfXahNXUD3wxLNhjDKFN2","XDFOCHO8ERZA3VngVGABHz8Gqp73","jsFgMu4UOsWNy2nWQ8H7Xtj4ngE2","GAMeiBAysHfnO8HVwnauZLn2AHE2","8O8OgWwGH1gT4TLZn4NbHU77QHX2","Ct3kWaOYqSMjOXIamFa9QlGapvx1","8O8OgWwGH1gT4TLZn4NbHU77QHX2","XbUVyPaqa7NvHnPjmfin88mqn6S2","WPSz4DfI6wWcfw4aUMEDeXZikNh1","C5ZlDbmDHUfYTBsIeOjFNnBhVeg1","t0dJT1gt3DaqiMkGBALyMOn0bQj2","ZKjgNWHBa7QUZk02UkVDGGHyPys1","sVr12EJisLgzrLJMbsTaxDWKRRB3","2WdkAn74zRTSKpKVRNF0TckFqYt2","ZjjMo8lNBRQuyms2GuCZvX6AoUO2","emTK5uJ7S0d05dCgXsyLFTsvW5O2","bLERNH8nuTesIm7waxneFjrFOhb2","gsUGj0dPH8UzXVPuNs0cHRvAMhm2","oAHtwyRCMIRYk8aJTuraG8jevCF3","9N0r8ilqJ6S5W8h9pqWtGkszqg33","jbptLJmOx2bh8UeNybrbpHpp1f92v","5VYDvCi3RaPuP801bS3j1RhQ7cN2","0JBnCwpZZeXMSmE8Hk4tJ4IiGZU2","kGSDuLQMP4OKSgVra5fCDD9ajE32","Q3Odp4hQVPXvW5huKe3bN97cC2u2","qBwK5crMitN9LkPDnSdk5Yx7cVP2","oopwQGCrYHM95K52LDzTVvAS0rP2","85iBvAo6ddONLiZfyiLl9qDSNfz2","uL830SfjXwPFfcq5gxb7fSKUTHf1","8IO6EWAhn7W8MudihYp7X7JMQ7W2","1v9w0UlnECQ1Dh6OA47sYGIMX0W2","1cGv0xjoDBegw4SoPj1vcllfDYA2"]

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  });
}
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    getSheetData();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

function getSheetData() {
  var runs = 0;
  gapi.client.sheets.spreadsheets.values.clear({
    spreadsheetId: '1fSrABDzlqlbuBeuTDbBl5lKN6MGACkiMTtjIWSGeUkI',
    range: 'Info!A2:F',
  }).then(function(response) {

      gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1fSrABDzlqlbuBeuTDbBl5lKN6MGACkiMTtjIWSGeUkI',
        range: 'Info!B2:B',
      }).then(function(response) {
          console.log("found stuff")
          var ids = [];
          $.each(response.result.values, function(index,id) {
         	ids.push(id[0]);
          });
          updatesheet(ids,runs);

  });


  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
  });



  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1fSrABDzlqlbuBeuTDbBl5lKN6MGACkiMTtjIWSGeUkI',
    range: 'Info!B2:B',
  }).then(function(response) {
     ids = response.result.values;
  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
  });
}

function updatesheet(ids,runs){
    var snpshot;
    usersref.once('value').then(function(snapshot) {
        var updates = [];
        // console.log(ids)
        snpshot = snapshot.val()
        var cuts=[];
        $.each(snapshot.val(), function(user,vals) {
            data = vals.userdata
            swipes = vals.swipes
            if(ids.includes(user)){
                // console.log("user exists")
            }
            else{
                updates.push([data.fullname,user,data.email,data.grade,data.osis,data.idcardnum])
            }
            cuts.push(data.cut)
            console.log(cuts);
            runs++;
        });
        // console.log(updates)
        gapi.client.sheets.spreadsheets.values.append({
          spreadsheetId: '1fSrABDzlqlbuBeuTDbBl5lKN6MGACkiMTtjIWSGeUkI',
          valueInputOption: 'USER_ENTERED',
          majorDimension: "ROWS",
          range: 'Info!K'+(2+ids.length),
          values: cuts,
        })
        gapi.client.sheets.spreadsheets.values.append({
          spreadsheetId: '1fSrABDzlqlbuBeuTDbBl5lKN6MGACkiMTtjIWSGeUkI',
          valueInputOption: 'USER_ENTERED',
          majorDimension: "ROWS",
          range: 'Info!A'+(2+ids.length),
          values: updates,
        }).then(function(response) {
           console.log(response.result);
           updateswipes(ids,runs,snpshot)
        });

        var currentdate = new Date();
        var datetime = "Last Sync: " + (currentdate.getMonth()+1) + "/"
                         + currentdate.getDate()  + "/"
                         + currentdate.getFullYear() + " @ "
                         + currentdate.getHours() + ":"
                         + currentdate.getMinutes() + ":"
                         + currentdate.getSeconds();
        console.log(datetime);
        gapi.client.sheets.spreadsheets.values.update({
          spreadsheetId: '1fSrABDzlqlbuBeuTDbBl5lKN6MGACkiMTtjIWSGeUkI',
          valueInputOption: 'USER_ENTERED',
          majorDimension: "ROWS",
          range: 'Info!L1',
          values: [[datetime]],
      }).then(function(response){
          console.log(response)
      });

    });

}

function updateswipes(ids,runs,data){
    var dates = [];
    var updates = [];
    $.each(data, function(user,vals) {
        console.log(user);
        // if(frs.includes(user)) firebase.database().ref('users/' + user + '/userdata/').update({cut: false});
        // else firebase.database().ref('users/' + user + '/userdata/').update({cut: true});
        $.each(vals.swipes,function(date,time){
            if(!dates.includes(date)) dates.push(date);
        });
    });
    $.each(data, function(user,vals) {
        tmpdates=[];
        tmp=[vals.userdata.fullname,user]
        $.each(vals.swipes,function(date,time){
            tmpdates.push(date);
        });
        $.each(dates,function(index,date){
            if(tmpdates.includes(date)) tmp.push(convertTimestamp(vals.swipes[date]))
            else{
                tmp.push("ABSENT");
            }
        });
        updates.push(tmp);
    });
    console.log(updates);
    console.log(dates);
    gapi.client.sheets.spreadsheets.values.clear({
      spreadsheetId: '1fSrABDzlqlbuBeuTDbBl5lKN6MGACkiMTtjIWSGeUkI',
      range: 'Attendance!A2:F',
    }).then(function(response) {

        gapi.client.sheets.spreadsheets.values.append({
          spreadsheetId: '1fSrABDzlqlbuBeuTDbBl5lKN6MGACkiMTtjIWSGeUkI',
          valueInputOption: 'USER_ENTERED',
          majorDimension: "ROWS",
          range: 'Attendance!A'+(2+ids.length),
          values: updates,
      }).then(function(response){
          console.log(response)
          gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: '1fSrABDzlqlbuBeuTDbBl5lKN6MGACkiMTtjIWSGeUkI',
            valueInputOption: 'USER_ENTERED',
            majorDimension: "ROWS",
            range: 'Attendance!C1',
            values: [dates],
        }).then(function(response){
            console.log(response)
            $('body').html('Speadsheet has been updated.')
        })
      })

       });
}

function convertTimestamp(timestamp) {
  var d = new Date(timestamp),
		hh = d.getHours(),
		h = hh,
		min = ('0' + d.getMinutes()).slice(-2),
		ampm = 'AM',
		time;
	if (hh > 12) {
		h = hh - 12;
		ampm = 'PM';
	} else if (hh === 12) {
		h = 12;
		ampm = 'PM';
	} else if (hh == 0) {
		h = 12;
	}
	time = h + ':' + min + ' ' + ampm;

	return time;
}

function getdate(timestamp) {
  var d = new Date(timestamp),
		yyyy = d.getFullYear(),
		mm = ('0' + (d.getMonth() + 1)).slice(-2),
		dd = ('0' + d.getDate()).slice(-2),
		time;
	time = mm + '-' + dd + '-' + yyyy;
	return time;
}
