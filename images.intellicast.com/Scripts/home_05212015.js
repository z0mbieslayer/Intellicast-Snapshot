$(function () {
  var next = $('#slideNext');
  var prev = $('#slidePrev');
  var dots = $('#slideNumbers td');

  var totalSlides = dots.length;
  var currentSlide = 0;
  var timer;
  var sliding = true;

  function swapContent(slideNumber){
    Stop();
    Rotate(slideNumber);
  }

  function Rotate(slideNumber){
	  currentSlide = slideNumber;
	  for(var i = 1; i <= totalSlides; i++){
		  var content = document.getElementById("rotatorDiv" + i);
		  //var button = document.getElementById("rotatorButton" + i);
		  var button = document.getElementById("rotatorButton" + i).parentNode;
		  if(i == slideNumber){
			  content.style.visibility = "visible";
			  content.style.display = "block";
			  //button.src = "http://images.intellicast.com/App_Themes/Silver/Images/btn_" + i + "_r.gif";
			  button.className = "active";
		  } else {
			  content.style.visibility = "hidden";
			  content.style.display = "none";
			  //button.src = "http://images.intellicast.com/App_Themes/Silver/Images/btn_" + i + ".gif";
			  button.className = "";
		  }
	  }
  }

  function ToggleTimer() {
    if (sliding) { Stop(); } else { Start(); }
  }
  function Start(){
    sliding = true;
    NextSlide(false);
    timer = setTimeout(Start, 8000);
  }

  function Stop(){
    sliding = false;
    clearTimeout(timer);
    timer = 0;
  }

  function NextSlide(doStop){
    if(currentSlide == totalSlides){currentSlide = 0;}
    Rotate(currentSlide + 1);
    if (doStop) Stop();
  }

  function PreviousSlide(){
    if (currentSlide == 1){currentSlide = (totalSlides + 1);}
    Rotate(currentSlide - 1);
    Stop();
  }

  dots.on('click', 'a', function (e) {
    e.preventDefault();
    swapContent($(this.parentNode).index() + 1);
    return false;
  })
  next.on('click', function () {
    NextSlide(true);
    return false;
  });
  prev.on('click', function () {
    PreviousSlide()
    return false;
  });

  Start();
});


function swapTab(tab) {
  if (tab == 1) {
    $("#cities").css("display", "none");
    $("#alerts").css("display", "block");
    $("#cityTab").css("background", "#383e49");
    $("#alertTab").css("background", "#e3e6ea");
    $("#cityButton").css("color", "#fff");
    $("#alertButton").css("color", "#383e49");
  } else if (tab == 0) {
    $("#cities").css("display", "block");
    $("#alerts").css("display", "none");
    $("#cityTab").css("background", "#e3e6ea");
    $("#alertTab").css("background", "#383e49");
    $("#cityButton").css("color", "#383e49");
    $("#alertButton").css("color", "#fff");
  }
}

if (document.images) {
  cityOff = new Image();
  cityOff.src = "../images.intellicast.com/App_Images/tab_cities.gif";
  cityHover = new Image();
  cityHover.src = "../images.intellicast.com/App_Images/tab_cities_r.gif";
  cityOn = new Image();
  cityOn.src = "../images.intellicast.com/App_Images/tab_cities_1.gif";
  wwOff = new Image();
  wwOff.src = "../images.intellicast.com/App_Images/tab_watchwarning.gif";
  wwHover = new Image();
  wwHover.src = "../images.intellicast.com/App_Images/tab_watchwarning_r.gif";
  wwOn = new Image();
  wwOn.src = "../images.intellicast.com/App_Images/tab_watchwarning_1.gif";
}

function homeSwipe(state) {
  var searchBox = $("#homeSearchBox");
  var text = "Enter City, State, Country, Zip or Airport";
  if (state == 'on' && searchBox.val() == text) {
    searchBox.val("").css({
      "font-size": "11px",
      "color": "#383e49"});
  }
  else if (searchBox.val() == "") {
    searchBox.val(text).css({
      "font-size": "10px",
      "color": "#999"
    });
  }
}

function homeEnter() {
  if (event.keyCode == 13) {
    event.cancelBubble = true;
    event.returnValue = false;
    search($('#homeSearchBox').val());
  }
}