// redirect for default domain name to vanity domain name
if(location.hostname == "alliance-primo.hosted.exlibrisgroup.com")
{
	var redirect = location.href.replace("alliance-primo.hosted.exlibrisgroup.com","search.library.pdx.edu");
	console.log("redirecting to: " + redirect);
	document.location.replace(redirect);
}




(function () {
    "use strict";
    'use strict';

	
	/* not on shelf module */
	/*
	angular.module('notOnShelf', []).component('prmSearchResultAvailabilityLineAfter', {
  bindings: { parentCtrl: '<' },
  controller: ['$scope', '$location',  'nosOptions', 'nosService', '$httpParamSerializer',
    function($scope, $location,  nosOptions, nosService, $httpParamSerializer){
      $scope.checkBestLoc = function() {
        if (nosService.checkPage($location)){
          $scope.bestlocation=$scope.$parent.$ctrl.result.delivery.bestlocation;
          if (!$scope.bestlocation || $scope.bestlocation.availabilityStatus=="unavailable"){
            return false;
          }
          else{
            var mainLocation = $scope.bestlocation.mainLocation
            if (!nosOptions[0][mainLocation]){
              return false;  //not on
            }
            else{
              var subLocationCode=nosService.getSubLocationCode($scope);
              var codes=nosOptions[0][mainLocation][0]["locationCodes"]
              if (nosService.subLocationCodeCheck(subLocationCode, codes)){
                var callNumber=nosService.getCallNumber($scope);
                var author=nosService.getAuthor($scope);
                var title=nosService.getTitle($scope);
                var location=nosService.getLocation($scope);

                var params={
                  [nosOptions[0][mainLocation][0].query_mappings[0].title] : title,
                  [nosOptions[0][mainLocation][0].query_mappings[0].author] : author,
                  [nosOptions[0][mainLocation][0].query_mappings[0].location]: location,
                  [nosOptions[0][mainLocation][0].query_mappings[0].callnumber]: callNumber
                }
                var urlBase=nosOptions[0][mainLocation][0].urlBase;
                $scope.url=nosService.buildUrl(urlBase, params, $httpParamSerializer);
                return true;

              }
              else{
                return false;
              }
            }
          }
        }
        else{
          // brief result
          return false;
        }
      };
    }],
    template: '<div  ng-show="checkBestLoc()"  style="margin-top:10px;"><p>Not on shelf? <a ng-href="{{url}}" target="_blank">Let us know.</a></p></div>'
    }).factory('nosService', [function () {
    return {
      buildUrl: function (url, params, $httpParamSerializer) {
        var serializedParams = $httpParamSerializer(params);
        if (serializedParams.length > 0) {
          url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
        }
        return url;
      },
      checkPage: function ($location){
        if ($location.path() === '/fulldisplay') {
          return true;
        } else {
          return false;
        }
      },
      getAuthor: function getAuthor($scope) {
        var obj = $scope.$parent.$ctrl.result.pnx.addata;
        console.log(obj);
        if (obj.hasOwnProperty("aulast")) {
          var author = encodeURIComponent($scope.$parent.$ctrl.result.pnx.addata.aulast[0]);
        } else {
          var author = "N/A";
        }
        return author;
      },
      getTitle: function getTitle($scope) {
        var obj = $scope.$parent.$ctrl.result.pnx.addata;
        if (obj.hasOwnProperty("btitle")) {
          var title = $scope.$parent.$ctrl.result.pnx.addata.btitle[0];
        } else {
          var title = "N/A";
        }
        return title;
      },
      getCallNumber: function ($scope) {
        var cn = $scope.$parent.$ctrl.result.delivery.bestlocation.callNumber;
        var callNumber = cn.replace('(', '');
        var callNumber = callNumber.replace(')', '');
        return callNumber;
      },
      getLocation: function getLocation($scope) {
        if ($scope.delCat == "Alma-E") {
          var location = "Electronic Resource";
        } else {
          var mainLocation = $scope.$parent.$ctrl.result.delivery.bestlocation.mainLocation;
          var subLocation = $scope.$parent.$ctrl.result.delivery.bestlocation.subLocation;
          var location = mainLocation + " " + subLocation;
        }
        return location;
      },
      subLocationCodeCheck: function(code, codes){
        var check = codes.indexOf(code);
        console.log(check);
        if (check == "-1") {
          return false;
        } else {
          return true;
        }
      },
      getSubLocationCode: function ($scope) {
        if ($scope.delCat == "Alma-E") {
          var subLocationCode = "Electronic Resource";
        } else {
          var subLocationCode = $scope.$parent.$ctrl.result.delivery.bestlocation.subLocationCode;
        }
        return subLocationCode;
      },
    };
  }]);
  */
  /* /not on shelf module */
	
	

    var app = angular.module('viewCustom', ['angularLoad','toggleInstitutions','PSUAskUs']);

	
	/****************************************************************************************************/
    /*In case of CENTRAL_PACKAGE - comment out the below line to replace the other module definition*/
    /*var app = angular.module('centralCustom', ['angularLoad']);*/
    /****************************************************************************************************/
	
	angular.module('PSUAskUs', []).component('addChat', {
		template: '<a class="psulib-primary-button" role="button" href="https://library.pdx.edu/services/ask-a-librarian/" target="_blank">Ask Us</a>'
	});
	app.component('prmExploreMainAfter', {template: '<add-chat />'});
	
	/* hide/show other institutions */
	app.component('prmAlmaMoreInstAfter', { template: '<toggle-institutions />' });
	app.constant('showHideMoreInstOptions', {
		default_state: "hidden",
		show_label: "Show Summit Libraries",
		hide_label: "Hide Summit Libraries"
	});
	
	// custom footer
	// not turned on because the facets overlap the footer - need to figure out a work-around
	/*
	app.component('prmExploreFooterAfter', {
             bindings: { parentCtrl: '<' },
             template: '<footer class="site-footer" role="contentinfo"><div id="psulib-footer"><div id="psulib-footer-left"><div class="psulib-footer-content"><div class="psulib-footer-content-header"><h2>Contact</h2></div><div class="psulib-footer-content-body"><a href="/about/contact/"><div class="psulib-footer-content-text">Staff Directory</div></a><a href="/about/directions/"><div class="psulib-footer-content-text">Maps &amp; Directions</div></a><div class="psulib-footer-content-text">Portland State University Library</div><div class="psulib-footer-content-text">1875 SW Park Avenue</div><div class="psulib-footer-content-text">Portland, OR 97201</div></div></div><div class="psulib-footer-content"><div class="psulib-footer-content-header"><h2>Hours</h2></div><div class="psulib-footer-content-body"><div id="psulib-footer-hours"></div></div></div></div><div id="psulib-footer-right"><div class="psulib-footer-content"><div class="psulib-footer-content-header"><h2>Quick Links</h2></div><div class="psulib-footer-content-body"><a href="/services/checkout-return/overdue-fines-replacement-charges/"><div class="psulib-footer-content-text">Fines &amp; Charges</div></a><a href="/services/accessibility/"><div class="psulib-footer-content-text">Library Accessibility</div></a><a href="https://www.pdx.edu/accessibility/"><div class="psulib-footer-content-text">University Accessibility</div></a><a href="/about/suggestions/"><div class="psulib-footer-content-text">Comments &amp; Suggestions</div></a></div></div><div class="psulib-footer-content"><div class="psulib-footer-content-header"><h2>Connect</h2></div><div class="psulib-footer-content-body"><a href="https://www.facebook.com/PortlandStateLibrary"><div class="psulib-footer-content-text">Facebook</div></a><a href="https://twitter.com/psulibrary"><div class="psulib-footer-content-text">Twitter</div></a></div></div></div></div><div id="psulib-bottom-bar"><div>© 2018 Portland State University Library</div><div id="psulib-font-attribution">Icons made by <a title="Freepik" href="http://www.freepik.com">Freepik</a> from <a title="Flaticon" href="http://www.flaticon.com">www.flaticon.com</a></div></div></footer>'
	});
	*/
	
	/* Log each page view in Google Analytics */
	app.run(['$rootScope', '$location', '$window', function($rootScope, $location, $window){
		$rootScope.$on('$locationChangeSuccess', function(event){
			console.log("logging pageview for: " + "(not set)" + " | " + "PSU Library Catalog" + " | " + $location.url());
			$window.ga('send', 'pageview', {location: $location.url(),title: "PSU Library Catalog"});
		});
	}]);
	
	app.value('nosOptions',[{
	  "MILLAR": [{
		"urlBase": "https://docs.google.com/forms/d/e/1FAIpQLSdBvdqmK0z1mHhg-ATiCHT94JVBuwdaaHzpyZJcK3XBGEP-IA/viewform?usp=pp_url",
		"query_mappings" : [{
		  'title': 'entry.956660822',
		  'author': 'entry.1791543904',
		  'callnumber': 'entry.865809076',
		  'location': 'entry.431935401'
		}],
		"locationCodes": ["PMAIN1","PMAIN2","PMAIN3","PMAIN4","PMAIN5"]
	  }]
	}])

	// load jquery - needed for custom header ubermenu
	app.component('prmTopBarBefore', {
		bindings: {parentCtrl: '<'},
		controller: function () {
			this.$onInit = function () {
				loadScript("//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js", jquery_loaded);
			};
		},
		template: ''
	});

	// debug info for custom header
	app.run(['$rootScope', '$location', '$window', function($rootScope, $location, $window){
	  $rootScope.$on('$locationChangeSuccess', function(event){
			console.log(" @@@ page: " + $location.url());
			var header_container = angular.element(document.getElementsByClassName('custom-header'));
			if(header_container.length > 0)
				console.log(" @@@ header exists when locationChangeSuccess triggered");
			console.log(" @@@ path name: " + window.location.pathname);
			
			var locations_link = angular.element(document.getElementsByClassName('locations-link'));
			angular.forEach(locations_link, function(value, key){
				 var elem = angular.element(value);
				 console.log("## updating label for " + elem.text());
				 elem.text(elem.text().replace(" )",")"));
				 console.log("## changed to: " + elem.text());
			});
	  });
	}]);
	
	function insertActions(actions) {
		app.service('customActionService', function() {
			return {
				actions: [],
				processCustomAction: function(prmActionCtrl, action) {
					action.slug = action.name.replace(/\s+/g, ''); // remove whitespace
					action.iconname = action.slug.toLowerCase();
					action.index = Object.keys(prmActionCtrl.actionListService.actionsToIndex).length - 1 ; // ignore "none" and RISPushTo
					this.actions.push(action);
					return action;
				},
				setCustomAction: function(prmActionCtrl, action) {
						console.dir(prmActionCtrl);
						prmActionCtrl.actionLabelNamesMap[action.slug] = action.name;
						prmActionCtrl.actionIconNamesMap[action.slug] = action.iconname;
						prmActionCtrl.actionIcons[action.iconname] = {
							icon: action.icon.name,
							iconSet: action.icon.set,
							type: "svg"
						};
						if (!prmActionCtrl.actionListService.actionsToIndex[action.slug]) { // ensure we aren't duplicating the entry
							prmActionCtrl.actionListService.requiredActionsList[action.index] = action.slug;
							prmActionCtrl.actionListService.actionsToDisplay.unshift(action.slug);
							prmActionCtrl.actionListService.actionsToIndex[action.slug] = action.index;
						}
						if (action.type === 'template') {
							
						  if (action.hasOwnProperty('templateVar')) {
							  action.action = action.action.replace(/{\d}/g, function(r){return action.templateVar[r.replace(/[^\d]/g,'')]});
						  }
						  action.action = action.action.replace(/{recordId}/g, function(r) {return prmActionCtrl.item.pnx.search.recordid[0]});
						}
						
						prmActionCtrl.onToggle[action.slug] = function(){
							console.log("open "+action.action+" in a new window");
							window.open(action.action, '_blank'); // opens the url in a new window
						};
				},
				setCustomActionContainer: function(mdTabsCtrl, action) { // for further review...
				},
				getCustomActions: function() {
					return this.actions;
				}
			};
		})
		.component('prmActionListAfter', {
			require: {
				prmActionCtrl: '^prmActionList',
			},
			controller: 'customActionController'
		})
		.component('prmActionContainerAfter', {
			controller: 'customActionContainerController'
		})
		.controller('customActionController', ['$scope', 'customActionService', function($scope, customActionService) {
			var vm = this;
			vm.$onInit = function() {
				console.log(vm.prmActionCtrl);
				
				actions.forEach(function(action) {
					var processedAction = customActionService.processCustomAction(vm.prmActionCtrl, action);
					customActionService.setCustomAction(vm.prmActionCtrl, processedAction);
					console.log("here init 2");
					console.dir(action);
				});
			};
		}])
		.controller('customActionContainerController', ['$scope','customActionService', function($scope, customActionService) {
			var vm = this;
			vm.$onInit = function() {
				console.log(vm.mdTabsCtrl);
				console.log("here init");
				console.log("here init done");
			};
		}]);
	}
	
	insertActions([{
		name: "Report Error",
		type: "template",
		icon: {
			set: 'action',
			name: 'ic_report_problem_24px'
		},
		action: "https://library.pdx.edu/research/eresource-report/?refer_url="+encodeURIComponent("https://alliance-primo-sb.hosted.exlibrisgroup.com/primo-explore/search?query=any,contains,")+"{recordId}"+encodeURIComponent("&tab=default_tab&search_scope=all&sortby=rank&vid=PSU_POC&offset=0")
	}]);

})();

function loadScript(url, callback)
{
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	script.onreadystatechange = callback;
	script.onload = callback;
	head.appendChild(script);
}

var script_loaded = function() {
	console.log("external script loaded");
};

var ubermenu_loaded = function() {
	console.log("ubermenu script loaded");
	$( "#megaMenuToggle" ).click(function() {
		$("#megaMenu.megaResponsiveToggle ul.megaMenu").toggle();
	});
};

var jquery_loaded = function() {
	console.log("jquery loaded");
	// load custom header
	$(document).ready(function(){
		var header_container = angular.element(document.getElementsByClassName('custom-header'));
		if(header_container.length > 0)
			console.log(" ### header exists when jquery loaded");
		else
			add_custom_header(header_container);
		console.log(" ### path name: " + window.location.pathname);
		
		// report an error links
		$("body").on("click","._md-nav-button",function(event){
			$(this).find("prm-icon[icon-definition='ic_report_problem_24px'] ").each(function(index) {
				var record_container = $(this).closest("prm-brief-result-container");
				var record_link = record_container.find("a");
				if(record_container.length == 0)
				{
					record_container = $(this).closest(".full-view-container");
					record_link = record_container.find("prm-brief-result-container a");
				}
				var record_url = record_link.attr("ng-href");
				var error_report_url = "https://library.pdx.edu/research/eresource-report/?refer_url="+encodeURIComponent(record_url)
				window.open(error_report_url, '_blank'); // opens the url in a new window
			});
		});
		/*
		$("body").on("click",'button[aria-label="Click to sign in"]',function(event){
			angular.element(document.querySelector('button[aria-label="Sign in"]')).triggerHandler("click");
		});
		
		$("body").on("click",'button[aria-label="Click to sign out"]',function(event){
			angular.element(document.querySelector('button[aria-label="Sign out"]')).triggerHandler("click");
		});
		*/

	});
};

function add_custom_header(header_container)
{
	console.log("... in add_custom_header function");
	var header_container = angular.element(document.getElementsByClassName('custom-header'));
	if(header_container.length == 0)
	{
		var custom_header_html = '<link rel="stylesheet" id="psu-library-css"  href="https://library.pdx.edu/wp-content/themes/psu_library/style.css?ver=20180731" type="text/css" media="all" /><div class="custom-header" style="height:170px;"><div id="psulib-special-alert" style="text-align: center; background: #d2492a; color: white; padding: 10px;">Interlibrary Loan (ILL) for physical materials are suspended for fall term. <a href="https://library.pdx.edu/services/library-services-fall-2020/" style="background:#FFF; color:#d2492a; padding:3px 8px; margin-left:5px; border-radius:5px;">Library Services</a></div><div id="psulib-top-bar" role="banner"><div id="psulib-top-bar-hours"><a href="https://library.pdx.edu/about/hours/"><span id="psulib-top-bar-hours-label">TODAY\'S HOURS</span><span id="psulib-top-bar-hours-value">7:30am - Midnight</span></a></div><div id="psulib-top-bar-nav"><div class="psulib-top-bar-nav-icon-links"><a id="psulib-top-bar-nav-account" class="psulib-top-bar-nav-link" href="https://library.pdx.edu/MyAccounts"><img src="https://library.pdx.edu/wp-content/themes/psu_library/img/header_icon_my_accounts.png" alt=""><span>My Accounts</span></a><a id="psulib-top-bar-nav-ask" class="psulib-top-bar-nav-link" href="https://library.pdx.edu/services/ask-a-librarian/"><img src="https://library.pdx.edu/wp-content/themes/psu_library/img/header_icon_ask_a_librarian.png" alt=""><span>Ask a Librarian</span></a><a id="psulib-top-bar-nav-chat" class="psulib-top-bar-nav-link" href="javascript:OpenLNetWindow();"><img src="https://library.pdx.edu/wp-content/themes/psu_library/img/header_icon_chat.png" alt=""><span>Chat</span></a></div><a id="psulib-top-bar-nav-give" class="psulib-primary-button" href="https://library.pdx.edu/about/giving-opportunities/">Give to the Library</a></div></div><div id="psulib-header" role="banner"><div id="psulib-header-logo"><a href="https://www.pdx.edu" alt="Portland State University Homepage"><img id="psu-logo-img" class="desktop-only" width="230" height="73" src="https://library.pdx.edu/wp-content/themes/psu_library/img/psu_logo.png" alt="Portland State University logo" srcset="https://library.pdx.edu/wp-content/themes/psu_library/img/psu_logo.png 1x, https://library.pdx.edu/wp-content/themes/psu_library/img/psu_logo@2x.png 2x"><img id="psu-logo-img-mobile" class="mobile-only" src="https://library.pdx.edu/wp-content/themes/psu_library/img/psu-logo-mobile.png" alt="Portland State University logo"></a><div id="psulib-header-logo-separator"></div><div id="psulib-header-title"><a href="https://library.pdx.edu">Library</a></div></div><div id="psulib-header-nav"><div id="ubermenu"></div></div></div></div>';
		var prm_explore_main = angular.element(document.querySelector('prm-explore-main'));
		if(prm_explore_main.length == 1)
		{
			prm_explore_main.after(custom_header_html);
			var header_container = angular.element(document.getElementsByClassName('custom-header'));
			angular.element(header_container).after(prm_explore_main);
		}
		
		var prm_full_view_page = angular.element(document.querySelector('prm-full-view-page'));
		if(prm_full_view_page.length == 1)
		{
			prm_full_view_page.after(custom_header_html);
			var header_container = angular.element(document.getElementsByClassName('custom-header'));
			header_container.after(prm_full_view_page);
		}
		
		var prm_services_page = angular.element(document.querySelector('prm-services-page'));
		if(prm_services_page.length == 1)
		{
			prm_services_page.after(custom_header_html);
			var header_container = angular.element(document.getElementsByClassName('custom-header'));
			header_container.after(prm_services_page);
		}
		
		// load header dynamic compontents
		loadScript("https://content.library.pdx.edu/static/js/chat_libanswers.js?ver=20200527", script_loaded);
		loadScript("https://library.pdx.edu/wp-content/themes/psu_library/js/psulib_hours.js", script_loaded);
		loadScript("https://library.pdx.edu/wp-content/plugins/ubermenu/assets/js/ubermenu.js?ver=3.4.1", script_loaded);
		loadScript("https://content.library.pdx.edu/static/js/ubermenu_2018.js?ver=20180911", ubermenu_loaded);
	}
	else
	{
		console.log("header already exists - this function shouldn't have been called?!");
		console.log("path name: " + window.location.pathname);
	}
}



function psu_signin_polling() {
	console.log("psu_signin_polling");
	var popup = angular.element(document.querySelector('prm-login'));
	var username = angular.element(document.querySelector('prm-user-area .user-name'));
	if(popup.length == 0 && (username.length == 0 || username.text().trim() == "" || username.text().toLowerCase().trim() == "guest" || username.text().toLowerCase().trim() == "eshelf.user.anonymous" || username.text().toLowerCase().trim() == "sign in"))
	{
		var show_login_result = angular.element(document.querySelector('.sign-in-btn-ctm')).triggerHandler("click");
		if(show_login_result.length > 0)
		{
			console.log("showing login popup");
		}
		else
			setTimeout(psu_signin_polling, 100);
	}
	else
	{
		console.log("stopping polling");
		console.log(popup.length);
		console.log(username.length);
		console.log("["+username.text()+"]");
	}
}


angular.element(document).ready(function(){
	if(window.location.search.search("&signin=true") > -1) {
		psu_signin_polling();
	}
});


/* Google Analytics */
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-18681531-1', 'auto');

var document_title = "PSU Library Catalog";
if(document.title != "")
	document_title = document.title;
ga('send', 'pageview', {page: location.pathname, title: document_title, location: location.href});
console.log("logging pageview for: " + location.pathname + " | " + document_title + " | " + location.href);

/* /Google Analytics */


