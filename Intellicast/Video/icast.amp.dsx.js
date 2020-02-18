$(function () {
  var videoPlayer;
  var config = {
    autoplay: false,
    autoadvance: {
      interval: -1
    },
    feed: {}
  };
  var readyHandler = function readyHandler() {
    videoPlayer.loadVideo(activeMenu.value);
    videoPlayer.amp.autoadvance.addEventListener("advance", advanceHandler);
  };
  var advanceHandler = function advanceHandler() {
    selectFeedItem(activeMenu.selectedIndex + 1);
  };
  var selectFeedItem = function selectFeedItem(index) {
    activeMenu.select(index);
    videoPlayer.loadVideo(activeMenu.value);
    videoPlayer.amp.play();
  };

  var createActiveMenu = function createActiveMenu(collection, selector, index) {
    // find the associated markup and inject the title to the active menu title
    var view = $("#active-video-menu");
    var original = $(selector);
    view.find(".title").text(original.find(".title").text());
    original.hide();
    // instantiate the menu and add a click handler
    activeMenu = new Icast.VideoMenu(view.find(".video-menu"), collection, true);
    activeMenu.view.on("click", ".video-menu-item", function (e) {
      e.preventDefault();
      var index = $(this).data("index");
      selectFeedItem(index);
    });
    activeMenu.select(index || 0);
    // instantiate the video player
    videoPlayer = new Icast.VideoPlayer($('#video-player'));
    videoPlayer.initAmp("akamai-media-player", config, readyHandler);
  };
  var createMenu = function createMenu(collection, menu, selector) {
    menus[menu] = new Icast.VideoMenu($(selector), collection, true);
    menus[menu].setClass = false;
    menus[menu].view.on("click", ".video-menu-item", function (e) {
      var index = $(this).data("index");
      var id = menus[menu].data[index].id;
      window.location = '/Video/Player.aspx?id=' + encodeURIComponent(id);
    });
  };

  var activeMenu;

  var queryObj = akamai.amp.utils.QueryString; // using akamai library to retrieve query
  var hasQuery = !!queryObj.id;

  var api = {
    weather: 'https://dsx.weather.com/cms/orderedlist/video/(/news/weather)',
    hurricanes: 'https://dsx.weather.com/cms/orderedlist/video/(/storms/hurricane)',
    tornadoes: 'https://dsx.weather.com/cms/orderedlist/video/(/storms/tornado)',
    winter: 'https://dsx.weather.com/cms/orderedlist/video/(/storms/winter)',
    safety: 'https://dsx.weather.com/cms/orderedlist/video/(/safety)'
  };

  var collections = {
    weather: null,
    hurricanes: null,
    tornadoes: null,
    winter: null,
    safety: null
  };

  var menus = {
    weather: null,
    hurricanes: null,
    tornadoes: null,
    winter: null,
    safety: null
  };

  var win = $(window);
  
  if (hasQuery) {
    config.autoplay = true;
  }

  // create our object of video collections
  _.each(collections, function(value, key){
    collections[key] = new Icast.VideoCollection(api[key]);
    collections[key].fetch().then(function(collection){
      // we have a specific video to play
      if(hasQuery && !activeMenu){
        for(var i = 0, l = collection.length; i<l; i++) {
          if(queryObj.id === collection[i].id){
            createActiveMenu(collection, "#"+ key + "-video-menu", i);
            break;
          }
        }
      // default active menu load
      } else if (!hasQuery && key === "weather") {
        createActiveMenu(collection, "#weather-video-menu");
      }
      // load all other menus
      createMenu(collection, key, "#" + key + "-video-menu .video-menu");
    });
  });

});