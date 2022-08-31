// JavaScript Document
var apiURL="https://www.earlyarrival.org/php/";
var uploadURL="images/";
var baseURL="https://www.earlyarrival.org";
//apiURL for production
//var apiURL="https://www.pretermconnect.org/php/";
//var uploadURL="https://www.pretermconnect.org/uploads/";
//var baseURL="https://www.pretermconnect.org";
var platform="web";
//var aFriends=[];;
function onlyNumberKey(evt) {
	var ASCIICode = (evt.which) ? evt.which : evt.keyCode
	if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
		return false;
	return true;
 }
function isEmpty(str) {
    return (!str || 0 === str.length);
}
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

// Gets the age
function getAge(dateString) {

	// The current year, month, and day
  var now = new Date();
  var today = new Date(now.getYear(),now.getMonth(),now.getDate());

  var yearNow = now.getYear();
  var monthNow = now.getMonth();
  var dateNow = now.getDate();

	// Date of birth
  var dob = new Date(dateString.substring(6,10),
                     dateString.substring(0,2)-1,
                     dateString.substring(3,5)
                     );

  var yearDob = dob.getYear();
  var monthDob = dob.getMonth();
  var dateDob = dob.getDate();
  var age = {};
  var ageString = "";
  var yearString = "";
  var monthString = "";
  var dayString = "";

	// Calculates the current age
  yearAge = yearNow - yearDob;

  if (monthNow >= monthDob)
    var monthAge = monthNow - monthDob;
  else {
    yearAge--;
    var monthAge = 12 + monthNow -monthDob;
  }

  if (dateNow >= dateDob)
    var dateAge = dateNow - dateDob;
  else {
    monthAge--;
    var dateAge = 31 + dateNow - dateDob;

    if (monthAge < 0) {
      monthAge = 11;
      yearAge--;
    }
  }

  age = {
      years: yearAge,
      months: monthAge,
      days: dateAge
      };

  if ( age.years > 1 ) yearString = " years";
  else yearString = " year";
  if ( age.months> 1 ) monthString = " months";
  else monthString = " month";
  if ( age.days > 1 ) dayString = " days";
  else dayString = " day";


  if(age.years >= 0)
    ageString = age.years;

  else ageString = -1;

  return ageString;
}
function validateEmail(sEmail) {
	var filter = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (filter.test(sEmail)) {
		return true;
	}else{
		return false;
	}
}

// Randomly shuffles the array
function shuffleArray(d) {
  for (var c = d.length - 1; c > 0; c--) {
    var b = Math.floor(Math.random() * (c + 1));
    var a = d[c];
    d[c] = d[b];
    d[b] = a;
  }
  return d
};

// Checks if the user is logged in
var checkLoggedin=function(menu){
	$.ajax({
		type: 'post',
		url: apiURL+"isLoggedin.php",
		dataType : 'json',
		data: {page:menu},

		// If they aren't logged in, move them to the login screen
		success: function(data) {
			if(data.status && data.status=='failed'){
				$.mobile.changePage($(document.location.href='index.html'), 'slide');
				return;
			}
			var userdata=JSON.parse(data);
			if(typeof data === 'object'){
				if(userdata.user_status==5){
					$.mobile.changePage($(document.location.href='index.html'), 'slide');
					return;
				}
				if(menu=='mystory'){
					if(userdata.profile_mystory==-1){
						$.mobile.changePage($('#page4'), { transition: "slide"});
						return;
					}else if(userdata.profile_mystory==1){
							$.mobile.changePage($('#page2'), { transition: "slide"});
					}else if(userdata.profile_mystory==0){
						if(userdata.profile_babyuniversity==-1 || userdata.profile_babyuniversity==1){
							$.mobile.changePage($(document.location.href='baby_university.html'), 'slide');
						}else{
							logout();
						}
						return;
					}
				}else if(menu=="baby_university"){
					if(userdata.profile_babyuniversity==-1){
						$.mobile.changePage($('#page3'), { transition: "slide"});
						return;
					}else if(userdata.profile_babyuniversity==1){
						$.mobile.changePage($('#page2'), { transition: "slide"});
					}else if(userdata.profile_babyuniversity==0){
						if(userdata.profile_mystory==-1 || userdata.profile_mystory==1){
							$.mobile.changePage($(document.location.href='mystory.html'), 'slide');
						}else{
							logout();
						}
						return;
					}
				}else if(menu=="forum"){
					isAdmin=userdata.user_role;
				}
				if(userdata.profile_photo || userdata.profile_firstname){
					if(userdata.profile_photo){
							$('.my-photo-menu').html('<img class="center-cropped-small" src="'+uploadURL+userdata.profile_photo+'" alt="profile photo">');
						if($('div.my-story-img').length>0)
							$('.my-story-img').html('<img class="center-cropped" src="'+uploadURL+userdata.profile_photo+'"  alt="profile photo">');
						if($('div.myhealth-img').length>0)
							$('.myhealth-img').html('<img class="center-cropped" src="'+uploadURL+userdata.profile_photo+'"  alt="profile photo">');
						if($('div#newsfeed-user-name').length>0)
							$('#newsfeed-user-name').html(userdata.user_username);
						if(userdata.profile_firstname)
							$('.welcome-label').html('Welcome, '+userdata.profile_firstname);
						else
							$('.welcome-label').html('Welcome');
					}else{
						if(userdata.profile_firstname){
							$('.my-photo-menu').html(userdata.profile_firstname.charAt(0)+userdata.profile_lastname.charAt(0))
							$('.welcome-label').html('Welcome, '+userdata.profile_firstname);
						}else{
							$('.welcome-label').html('Welcome');
						}
					}
				}else{
					$('.welcome-label').html('Welcome');
				}
			}else{
				$.mobile.changePage($(document.location.href='index.html'), 'slide');
			}
		},
		error: function(){
		console.log('&nbsp;An error has occurred,try again later.');
		}
	});
}

// Gets the saved user information
var checkLoggedin_saved=function(){
	var userinfo=localStorage.getItem("stanford_ptb_app");
	if(userinfo){
		var user=JSON.parse(userinfo);
		var postdata={username:user.username,token:user.login_token};
		$.ajax({
			type: 'POST',
			url: apiURL+"isLoggedin.php",
			data:postdata,
			dataType:'json',
			success: function(data) {
				var userdata=JSON.parse(data);
				if(typeof data === 'object'){
					if(userdata.user_status==5)
						$.mobile.changePage($(document.location.href='index.html'), 'slide');
					if(userdata.profile_photo || userdata.profile_firstname){
						if(userdata.profile_photo){
							$('.my-photo-menu').html('<img class="center-cropped-small" src="'+uploadURL+userdata.profile_photo+'" alt="profile photo">');
							if($('div.my-story-img').length>0)
								$('.my-story-img').html('<img class="center-cropped" src="'+uploadURL+userdata.profile_photo+'"  alt="profile photo">');
							if($('div.myhealth-img').length>0)
								$('.myhealth-img').html('<img class="center-cropped" src="'+uploadURL+userdata.profile_photo+'"  alt="profile photo">');

							if(userdata.profile_firstname)
								$('.welcome-label').html('Welcome, '+userdata.profile_firstname);
							else
								$('.welcome-label').html('Welcome');
						}else{
							if(userdata.profile_firstname){
								$('.my-photo-menu').html(userdata.profile_firstname.charAt(0)+userdata.profile_lastname.charAt(0))
								$('.welcome-label').html('Welcome, '+userdata.profile_firstname);
							}else{
								$('.welcome-label').html('Welcome');
							}
						}
					}else{
						$('.welcome-label').html('Welcome');
					}
				}else{
					$.mobile.changePage($(document.location.href='index.html'), 'slide');
				}
			},
			error: function(jqXHR, exception){
				console.log(jqXHR.status+"/"+exception);
			}
		})
	}else{
		$.mobile.changePage($(document.location.href='index.html'), 'slide');
	}
}

var getFriends=function(){
	$.ajax({
		type: 'post',
		url: apiURL + 'find_friends.php',
		success: function(data) {
			if(data){
				var friends=JSON.parse(data);
				for(var i=0;i<friends.length;i++){
					aFriends.push(JSON.parse(friends[i].find_friends));
				}
			}
		},
		error: function(jq, status, msg) {
			console.log('&nbsp;An error has occurred,try again later.');
		}
       });
}
var listenServer=function(){
	if(typeof(EventSource) !== "undefined") {
		var url=apiURL+'test_session.php';
		var source = new EventSource(url);
		source.onmessage = function(event) {
			console.log(event.data);
		};
	} else {
     console.log("Sorry! No server-sent events support..");//
	}
}
var logout=function(){
	$.get(apiURL+"loguserout.php", function(data) {
		localStorage.removeItem('stanford_ptb_app');
		$.mobile.changePage($(document.location.href='index.html'), 'slide');
	});
}
