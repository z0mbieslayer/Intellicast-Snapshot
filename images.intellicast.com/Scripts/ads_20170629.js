/*************************************************************************
            TWC Ad Call Initialization Functions
************************************************************************ */
'TWC' in window || (window.TWC = {});

(function () {
  var zone = getTWCIds().zone;
  var head = document.getElementsByTagName("head")[0];
  var meta = document.getElementById("ctl00_ctl00_adsmetrics_zone");
  if (!meta) {
    meta = document.getElementById("ct100_adsmetrics_zone");
  }
  meta && meta.setAttribute("value", zone);
}());

function getTWCIds() {
  var pageId = "63527";
  var siteId = "52";
  var zone = "ros";
  var url = window.location.pathname.toUpperCase();

  if (url == "index.html"){
    pageId = "63526";
    zone = "home"
  }
  else if (url.indexOf("WXMAP") != -1){
    pageId = "63515";
    zone = "local_forecasts/maps";
  }
  else if (url.indexOf("LOCAL/HOURLY") != -1){
    pageId = "63511";
    zone = "local_forecasts/hourly";
  }
  else if (url.indexOf("LOCAL/FORECAST") != -1){
    pageId = "63513";
    zone = "local_forecasts/10_day";
  }
  else if (url.indexOf("LOCAL/OBSERVATION") != -1){
    pageId = "63517";
    zone = "local_forecasts/yesterday";
  }
  else if (url.indexOf("LOCAL/WEATHER") != -1){
    pageId = "63516";
    zone = "local_forecasts/today";
  }
  else if (url.indexOf("LOCAL") != -1){
    pageId = "63514";
    zone = "local_forecasts/index";
  }
  else if (url.indexOf("STORM/SEVERE") != -1){
    pageId = "63523";
    zone = "weather/severe";
  }
  else if (url.indexOf("STORM/DEFAULT") != -1){
    pageId = "63522";
    zone = "weather/index";
  }
  else if (url.indexOf("STORM/HURRICANE") != -1){
    pageId = "63524";
    zone = "weather/severe/tropical";
  }
  else if (url.indexOf("STORM") != -1){
    pageId = "63528";
    zone = "weather";
  }
  else if (url.indexOf("MARINE") != -1){
    pageId = "63518";
    zone = "sports_and_rec/boat_and_beach";
  }
  else if (url.indexOf("SNOW") != -1){
    pageId = "63521";
    zone = "sports_and_rec/ski";
  }
  else if (url.indexOf("GOLFING") != -1 || url.indexOf("TURF") != -1){
    pageId = "63519";
    zone = "sports_and_rec/golf";
  }
  else if (url.indexOf("GARDENING") != -1){
    pageId = "63512";
    zone = "sports_and_rec/home_and_garden";
  }
  else if (url.indexOf("OUTDOORS") != -1){
    pageId = "63520";
    zone = "sports_and_rec/outdoor";
  }
  else if (url.indexOf("FLYING") != -1){
    pageId = "63501";
    zone = "travel/business_travel";
  }
  else if (url.indexOf("DRIVING") != -1){
    pageId = "63502";
    zone = "travel/driving";
  }
  else if (url.indexOf("TRAVEL/DEFAULT") != -1){
    pageId = "63503";
    zone = "travel/index";
  }
  else if (url.indexOf("TRAVEL") != -1){
    pageId = "63504";
    zone = "travel";
  }
  else if (url.indexOf("BADHAIRDAY") != -1){
    pageId = "63505";
    zone = "fashion_and_beauty/daily_beauty";
  }
  else if (url.indexOf("RESPIRATORY") != -1){
    pageId = "63507";
    zone = "health/air_quality";
  }
  else if (url.indexOf("ACHESPAINS") != -1){
    pageId = "63506";
    zone = "health/aches_and_pains";
  }
  else if (url.indexOf("INFLUENZA") != -1){
    pageId = "63508";
    zone = "health/cold_and_flu";
  }
  else if (url.indexOf("OUTDOORS/ULTRAVIOLET") != -1){
    pageId = "63510";
    zone = "fashion_and_beauty/skin";
  }
  else if (url.indexOf("HEALTH/DEFAULT") != -1){
    pageId = "63509";
    zone = "health/index";
  }
  else if (url.indexOf("HEALTH") != -1){
    pageId = "63525";
    zone = "health";
  }

  return { pageId: pageId, siteId: siteId, zone: zone }
}
