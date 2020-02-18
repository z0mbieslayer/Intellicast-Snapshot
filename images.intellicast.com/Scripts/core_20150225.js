$(function () {

	var nav = $(".nav");
	var searchfield = $("#locSearch");
	var userlocation = $(".user-location");
	var inavtoggle = $(".inav-toggle");
	var inavflyout = $(".inav-flyout");
	var doc = $(document);
	var isIElt9 = false;

	var _ignoreMouse = false;
	doc.on("touchstart", function (e) {
		_ignoreMouse = true;
	});

	doc.on("MSPointerDown", function (e) {
		switch (e.pointerType) {
			case e.MSPOINTER_TYPE_TOUCH:
				_ignoreMouse = true;
				break;
			case e.MSPOINTER_TYPE_MOUSE:
				_ignoreMouse = false;
				break;
		}
	});

	doc.on("mousemove touchend click", function (e) {

		if (_ignoreMouse && e.type === "mousemove") {
			return;
		}

		var node;
		try {
			if (event && event.target) {
				node = event.target;
			}
			else {
				node = e.target;
			}
		}
		catch (error) {
			node = e.target;
		}

		var openNodes = $(".in");
		var flag = /\bin\b|toggle-btn/gi;
		var closeMenus = true;
		while (node.parentNode) {
			if (flag.test(node.className)) {
				closeMenus = false;
				break;
			}
			node = node.parentNode;
		}

		if (closeMenus) {
			openNodes.removeClass("in");
		}
	});

	var _hoverNavActivated = false;
	nav.on("click", "a", function (e) {
		var self = nav.find(this);
		if (_hoverNavActivated && !_ignoreMouse) {
			window.location = self[0].href;
		}

		var ul = self.siblings("ul");
		var parent = self.parents(".in");
		if (ul.length) {
			e.preventDefault();
			userlocation.find(".in").removeClass("in");
			inavflyout.removeClass("in");

			ul.addClass("in");
			nav.find(".in").not(parent).not(ul).removeClass("in");
		}
	});
	nav.on("mouseover", "a", function (e) {
		var self = nav.find(this);
		var ul = self.siblings("ul");
		var parent = self.parents(".in");
		if (ul.length) {
			e.preventDefault();
			userlocation.find(".in").removeClass("in");
			inavflyout.removeClass("in");
			ul.addClass("in");
			nav.find(".in").not(parent).not(ul).removeClass("in");
			if (!_ignoreMouse) {
				_hoverNavActivated = true;
			}
		}
	});

	searchfield.on("focus", function () {
		this.value = this.className = "";
	});

	searchfield.on("blur", function () {
		if (!this.value.length) {
			this.value = "Enter City, State, Country or U.S. Zip code";
			this.className = "blurred";
		}
	});

	searchfield.autocomplete({
		source: function (request, response) {
			$.ajax({
				url: "http://www.intellicast.com/Search.axd",
				dataType: "jsonp",
				data: "q=" + request.term,
				success: function (data) {
					var rows = [];
					var result;
					var i, len = data.results.count;
					for (i = 0; i < len; i++) {
						result = data.results.locations.location[i];
						rows.push({
							value: result.name,
							data: result
						});
					}
					response(rows);
				}
			});
		},
		minChars: 3,
		position: {
			my: "left top",
			at: "left bottom"
		},
		create: function (event, ui) {
			if (!/backgroundsize/gi.test(document.getElementsByTagName("html")[0])) {
				isIElt9 = true;
			}
		},
		open: function (event, ui) {
			if (isIElt9) {
				searchfield.autocomplete("widget").find("li:nth-child(odd)").addClass("odd");
			}
		},
		select: function (event, ui) {
			var id = ui.item.data.id;
			window.location = "/Local/Weather.aspx?location=" + id;
		}
	});

	var _hoverUserActivated = false;
	userlocation.on("click", ".current-location", function (e) {
		var recent = userlocation.find(".recent-locations");

		var self = userlocation.find(this);
		if (_hoverUserActivated && !_ignoreMouse) {
			window.location = self[0].href;
		}

		if (recent.length) {
			e.preventDefault();
			nav.find(".in").removeClass("in");
			inavflyout.removeClass("in");
			recent.addClass("in");
		}
	});
	userlocation.on("mouseover", ".current-location", function (e) {
		var recent = userlocation.find(".recent-locations");
		if (recent.length) {
			e.preventDefault();
			nav.find(".in").removeClass("in");
			inavflyout.removeClass("in");
			recent.addClass("in");
			if (!_ignoreMouse) {
				_hoverUserActivated = true;
			}
		}
	});

	var _hoverINavActivated = false;
	inavtoggle.on("click", function (e) {

		if (_hoverINavActivated && !_ignoreMouse) {
			window.location = "Default.html";
		}

		e.preventDefault();
		nav.find(".in").removeClass("in");
		userlocation.find(".in").removeClass("in");
		inavflyout.addClass("in");
	});
	inavtoggle.on("mouseover", function (e) {
		e.preventDefault();
		nav.find(".in").removeClass("in");
		userlocation.find(".in").removeClass("in");
		inavflyout.addClass("in");
		if (!_ignoreMouse) {
			_hoverINavActivated = true;
		}
	});

	inavflyout.on("click", "#iNavAdd", function (e) {
		$.post("/INav.axd", {
		  iNavName: inavflyout.find("#iNavText").val(),
		  iNavUrl: location.pathname + location.search
		}).done(function (data) {
			location.reload();
		});
	});

});

function SendReferral() {
  var fromName = $("#FromName");
  var fromEmail = $("#FromEmail");
  var toEmail = $("#ToEmail");
  if (!fromName[0].value){
    window.alert("Please provide your name.");
  }
  if (!fromEmail[0].value){
    window.alert("Please provide your email address.");
  }
  if (!toEmail[0].value){
    window.alert("Please provide your friend's email address.");
  }
  $.post("/referral.axd", {
    name: fromName.val(),
    from: fromEmail.val(),
    to: toEmail.val(),
    url: location.pathname + location.search
  }).done(function () {
    $("#referralForm").hide();
    $("#referralMessage").show();
  });
}

function FeedbackResponse() {
	$.post("/Response.axd", { toEmail: $("#feedbackResponseToEmail").val(), response: $("#feedbackResponseText").val() });
	location.reload(true);
}

function internalPageLink(url) {
	if (Icast.Storage.IsEnabled)
	  Icast.Storage.Save('__wxMap_isInternalPage', 'true');

	location = url;
}

function getCookie(c_name) {
  var i, x, y, ARRcookies = document.cookie.split(";"); for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("=")); y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1); x = x.replace(/^\s+|\s+$/g, ""); if (x == c_name)
    { return unescape(y); }
  }
}