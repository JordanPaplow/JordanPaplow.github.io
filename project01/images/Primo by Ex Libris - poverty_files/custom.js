/*
* 
*	Orbis Cascade Alliance Central Package
*	Environment: Production
*	Last updated: 20200925
*	
*	Included customizations:
*		Hide/show Summit institutions (updated 20180701)
*		Insert custom action (updated 20181107)
*		Send SMS (updated 20181107)
*   Custom model window for peer-review and open access badges (updated 20191226)
*   Toggle advanced search in mobile display (updated 20181009)
*   Favorite signin warning (updated 20200311)
*   Enlarge Covers (Added 20200311)
*   Text a Call Number (Added 20200724)
*   External Search (Added 20200724)
*   
*/




(function(){
  "use strict";
  'use strict';

  var app = angular.module('centralCustom', ['angularLoad']);

/* Custom action Begins */
  
  angular.module('customActions', []);

/* eslint-disable max-len */
angular.module('customActions').component('customAction', {
    bindings: {
        name: '@',
        label: '@',
        icon: '@',
        iconSet: '@',
        link: '@',
        target: '@',
        index: '<'
    },
    require: {
        prmActionCtrl: '^prmActionList'
    },
    controller: ['customActions', function (customActions) {
        var _this = this;

        this.$onInit = function () {
            _this.action = {
                name: _this.name,
                label: _this.label,
                index: _this.index,
                icon: {
                    icon: _this.icon,
                    iconSet: _this.iconSet,
                    type: 'svg'
                },
                onToggle: customActions.processLinkTemplate(_this.link, _this.prmActionCtrl.item, _this.target)
            };
            customActions.removeAction(_this.action, _this.prmActionCtrl);
            customActions.addAction(_this.action, _this.prmActionCtrl);          
        };
    }]
});

/* eslint-disable max-len */
angular.module('customActions').factory('customActions', function () {
    return {
        /**
         * Adds an action to the actions menu, including its icon.
         * @param  {object} action  action object
         * @param  {object} ctrl    instance of prmActionCtrl
         */
        // TODO coerce action.index to be <= requiredActionsList.length
        addAction: function addAction(action, ctrl) {
            if (!this.actionExists(action, ctrl)) {
                this.addActionIcon(action, ctrl);
                ctrl.actionListService.requiredActionsList.splice(action.index, 0, action.name);
                ctrl.actionListService.actionsToIndex[action.name] = action.index;
                ctrl.actionListService.onToggle[action.name] = action.onToggle;
                ctrl.actionListService.actionsToDisplay.unshift(action.name);
            }
        },
        /**
         * Removes an action from the actions menu, including its icon.
         * @param  {object} action  action object
         * @param  {object} ctrl    instance of prmActionCtrl
         */
        removeAction: function removeAction(action, ctrl) {
            if (this.actionExists(action, ctrl)) {
                this.removeActionIcon(action, ctrl);
                delete ctrl.actionListService.actionsToIndex[action.name];
                delete ctrl.actionListService.onToggle[action.name];
                var i = ctrl.actionListService.actionsToDisplay.indexOf(action.name);
                ctrl.actionListService.actionsToDisplay.splice(i, 1);
                i = ctrl.actionListService.requiredActionsList.indexOf(action.name);
                ctrl.actionListService.requiredActionsList.splice(i, 1);
            }
        },
        /**
         * Registers an action's icon.
         * Called internally by addAction().
         * @param  {object} action  action object
         * @param  {object} ctrl    instance of prmActionCtrl
         */
        addActionIcon: function addActionIcon(action, ctrl) {
            ctrl.actionLabelNamesMap[action.name] = action.label;
            ctrl.actionIconNamesMap[action.name] = action.name;
            ctrl.actionIcons[action.name] = action.icon;
        },
        /**
         * Deregisters an action's icon.
         * Called internally by removeAction().
         * @param  {object} action  action object
         * @param  {object} ctrl    instance of prmActionCtrl
         */
        removeActionIcon: function removeActionIcon(action, ctrl) {
            delete ctrl.actionLabelNamesMap[action.name];
            delete ctrl.actionIconNamesMap[action.name];
            delete ctrl.actionIcons[action.name];
        },
        /**
         * Check if an action exists.
         * Returns true if action is part of actionsToIndex.
         * @param  {object} action  action object
         * @param  {object} ctrl    instance of prmActionCtrl
         * @return {bool}
         */
        actionExists: function actionExists(action, ctrl) {
            return ctrl.actionListService.actionsToIndex.hasOwnProperty(action.name);
        },
        /**
         * Process a link into a function to call when the action is clicked.
         * The function will open the processed link in a new tab.
         * Will replace {pnx.xxx.xxx} expressions with properties from the item.
         * @param  {string}    link    the original link string from the html
         * @param  {object}    item    the item object obtained from the controller
         * @return {function}          function to call when the action is clicked
         */
        processLinkTemplate: function processLinkTemplate(link, item, target) {
            var processedLink = link;
            var pnxProperties = link.match(/\{(pnx\..*?)\}/g) || [];
            pnxProperties.forEach(function (property) {
                var value = property.replace(/[{}]/g, '').split('.').reduce(function (o, i) {
                    try {
                        var h = /(.*)(\[\d\])/.exec(i);
                        if (h instanceof Array) {
                            return o[h[1]][h[2].replace(/[^\d]/g, '')];
                        }
                        return o[i];
                    } catch (e) {
                        return '';
                    }
                }, item);
                processedLink = processedLink.replace(property, value);
            });
            return function () {
                if (typeof(target) === 'undefined') {
                  target = '_blank';
                }
                return window.open(processedLink, target);
            };
        }
    };
}); 

 
/* Custom action Ends */

/* Send SMS */

angular.module('sendSms', ['ngMaterial', 'primo-explore.components', 'customActions']);

/* eslint-disable max-len */
angular.module('sendSms').component('ocaSendSms', {
    bindings: {
        item: '<',
        finishedSmsEvent: '&'
    },
    template: '\n  <div class="send-actions-content-item" layout="row">\n      <md-content layout-wrap layout-padding layout-fill>\n          <form name="smsForm" novalidate layout="column" layout-align="center center" (submit)="$ctrl.sendSms($event);">\n              <div layout="row" class="layout-full-width" layout-align="center center">\n                  <div flex="20" flex-sm="10" hide-xs></div>\n                  <div class="form-focus service-form" layout-padding flex>\n                      <div layout-margin>\n                          <div layout="column">\n                              <h4 class="md-subhead">Standard message and data rates may apply.</h4>\n                              <md-input-container class="underlined-input md-required"><label>Phone number:</label>\n                                  <input ng-model="$ctrl.phoneNumber" name="phoneNumber" type="text" required ng-pattern="::$ctrl.telRegEx">\n                                  <div ng-messages="smsForm.phoneNumber.$error">\n                                      <div ng-message="pattern, required ">phone number is invalid</div>\n                                  </div>\n                              </md-input-container>\n                              <md-input-container class="md-required"><label>Carrier:</label>\n                                <md-select ng-model="$ctrl.carrier" name="carrier" placeholder="Select a carrier" required>\n                                  <md-option ng-repeat="(carrier, address) in carriers" value="{{ address }}">\n                                    {{ carrier }}\n                                  </md-option>\n                                </md-select>\n                                <div ng-messages="smsForm.carrier.$error">\n                                    <div ng-message="required">please select a carrier</div>\n                                </div>\n                              </md-input-container>\n                              <md-input-container class="underlined-input" ng-if="$ctrl.isCaptcha">\n                                  <div vc-recaptcha key="$ctrl.getCaptchaPublicKey()" on-success="$ctrl.setResponse(response)"></div>\n                                  <span class="recaptcha-error-info" ng-show="smsForm.$submitted && (smsForm.recaptchaResponse.$invalid || smsForm.$error.recaptcha.length)">\n                                    <span translate="captcha.notselected"></span>\n                                  </span>\n                              </md-input-container>\n                          </div>\n                      </div>\n                  </div>\n                  <div flex="20" flex-sm="10" hide-xs></div>\n              </div>\n              <div layout="row">\n                  <div layout="row" layout-align="center" layout-fill>\n                      <md-button type="submit" class="button-with-icon button-large button-confirm" aria-label="Send the result by SMS">\n                          <prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="send"></prm-icon><span translate="email.popup.link.send"></span></md-button>\n                  </div>\n              </div>\n          </form>\n      </md-content>\n  </div>\n  <prm-send-email ng-hide="true"></prm-send-email>\n  <oca-send-sms-after parent-ctrl="$ctrl"></oca-send-sms-after>',
    controller: ['$scope', 'smsOptions', function ($scope, smsOptions) {
        var _this = this;

        this.$onInit = function () {
            $scope.$watch('$$childTail.$ctrl', function (ctrl) {
                return _this.sendEmailService = ctrl.sendEmailService;
            });
            $scope.carriers = smsOptions.smsCarriers;
            _this.carrier = _this.phoneNumber = '';
            _this.telRegEx = /^\d{3}( |-)?\d{3}( |-)?\d{4}$/;
        };
        this.validate = function () {
            return _this.telRegEx.test(_this.phoneNumber) && _this.carrier;
        };
        this.isCaptcha = function () {
            return window.appConfig['system-configuration']['Activate Captcha [Y/N]'] == 'Y';
        };
        this.getCaptchaPublicKey = function () {
            return window.appConfig['system-configuration']['Public Captcha Key'];
        };
        this.setResponse = function (response) {
            return _this.gCaptchaResponse = response;
        };
        this.sendSms = function () {
            if (_this.validate()) {
                _this.sendEmailService.sendEmail([_this.phoneNumber + '@' + _this.carrier], // addresses
                '', // subject
                '', // note
                [_this.item], // items
                _this.gCaptchaResponse // captcha
                ).then(function (msg) {
                    return console.log('sms successfully sent', msg);
                }).catch(function (err) {
                    return console.error('sms sending failed', err);
                }).finally(function () {
                    return _this.finishedSmsEvent();
                });
            }
        };
    }]
}).run(['$templateCache', 'smsOptions', function ($templateCache, smsOptions) {
    $templateCache.put('components/search/actions/actionContainer/action-container.html', '\n  <oca-send-sms ng-if="($ctrl.actionName===\'' + smsOptions.smsAction.name + '\')" finished-sms-event="$ctrl.throwCloseTabsEvent()" item="::$ctrl.item"></oca-send-sms>\n  <prm-send-email ng-if="($ctrl.actionName===\'E-mail\')" (finished-email-event)="$ctrl.throwCloseTabsEvent()" [item]="::$ctrl.item" [toggleform]="::$ctrl.toggleActionCotent" [user]="::\'\'"></prm-send-email>\n  <prm-citation ng-if="($ctrl.actionName===\'Citation\')" [item]="::$ctrl.item" [on-toggle]="::$ctrl.onToggle"></prm-citation>\n  <prm-permalink ng-if="($ctrl.actionName===\'Permalink\')" [item]="::$ctrl.item" [on-toggle]="::$ctrl.onToggle"></prm-permalink>\n  <prm-print-item ng-if="($ctrl.actionName===\'Print\')" (close-tabs-event)="$ctrl.throwCloseTabsEvent()" [item]="::$ctrl.item" [on-toggle]="::$ctrl.onToggle"></prm-print-item>\n  <prm-endnote ng-if="($ctrl.actionName===\'EndNote\')" (close-tabs-event)="$ctrl.throwCloseTabsEvent()" [item]="::$ctrl.item" [on-toggle]="::$ctrl.onToggle"></prm-endnote>\n  <prm-easybib ng-if="($ctrl.actionName===\'EasyBib\')" (close-tabs-event)="$ctrl.throwCloseTabsEvent()" [item]="::$ctrl.item" [on-toggle]="::$ctrl.onToggle"></prm-easybib>\n  <prm-refworks ng-if="($ctrl.actionName===\'RefWorks\')" (close-tabs-event)="$ctrl.throwCloseTabsEvent()" [item]="::$ctrl.item" [on-toggle]="::$ctrl.onToggle"></prm-refworks>\n  <prm-export-ris ng-if="($ctrl.actionName===\'RISPushTo\')" [item]="::$ctrl.item" [on-toggle]="::$ctrl.onToggle"></prm-export-ris>\n  <prm-action-container-after parent-ctrl="$ctrl"></prm-action-container-after>');
}]);

/* eslint-disable max-len */
angular.module('sendSms').component('smsAction', {
    require: {
        prmActionCtrl: '^prmActionList'
    },
    controller: ['customActions', 'smsOptions', function (customActions, smsOptions) {
        var _this2 = this;

        this.$onInit = function () {
            customActions.removeAction(smsOptions.smsAction, _this2.prmActionCtrl);
            customActions.addAction(smsOptions.smsAction, _this2.prmActionCtrl);
        };
    }]
});

angular.module('sendSms').value('smsOptions', {
    smsAction: {
        name: 'send_sms',
        label: 'SMS',
        index: 9,
        icon: {
            icon: 'ic_smartphone_24px',
            iconSet: 'hardware',
            type: 'svg'
        }
    },
    smsCarriers: {
        'ATT': 'txt.att.net',
        'T-Mobile': 'tmomail.net',
        'Virgin': 'vmobl.com',
        'Sprint': 'messaging.sprintpcs.com',
        'Nextel': 'messaging.nextel.com',
        'Verizon': 'vtext.com',
        'Cricket': 'mms.mycricket.com',
        'Qwest': 'qwestmp.com',
        'Project Fi': 'msg.fi.google.com'
    }
}); /* Send SMS */

    /*
     * Toggle institutions (hide/show summit libraries)
     * https://github.com/alliance-pcsg/primo-explore-toggle-institutions
     */

angular
  .module('toggleInstitutions', [])
  .component('toggleInstitutions', {
      bindings: {
          startHidden: '<'
      },
      template: '<md-button class="md-raised" ng-click="$ctrl.toggleLibs()" id="summitButton" aria-controls="summitLinks" aria-expanded=false aria-label="Show/Hide Summit Libraries"> {{$ctrl.showLibs ? hide_label : show_label}} <span aria-hidden=true>{{$ctrl.showLibs ? "&laquo;" : "&raquo;"}}</span></md-button>',
      controller: ['$scope', 'showHideMoreInstOptions', function ($scope, showHideMoreInstOptions) {
          this.$onInit = function () {
              if (showHideMoreInstOptions.default_state == 'hidden') this.showLibs = this.startHidden === false ? true : false
              if (showHideMoreInstOptions.default_state == 'visible') this.showLibs = this.startHidden === false ? true : true
              this.button = angular.element(document.querySelector('prm-alma-more-inst-after button'))
              this.tabs = angular.element(document.querySelector('prm-alma-more-inst md-tabs'))
              this.tabs.attr('id', 'summitLinks')
              this.button.parent().after(this.tabs)
              if (!this.showLibs) this.tabs.addClass('hide')

              $scope.show_label = showHideMoreInstOptions.show_label;
              $scope.hide_label = showHideMoreInstOptions.hide_label;
          }
          this.toggleLibs = function () {
              this.showLibs = !this.showLibs
              this.tabs.hasClass('hide') ?
              this.tabs.removeClass('hide') && this.button.attr('aria-expanded', true) :
              this.tabs.addClass('hide') && this.button.attr('aria-expanded', false)
          }
      }]
  })
angular.module('toggleInstitutions').value('showHideMoreInstOptions', {
    default_state: 'hidden',
    show_label: 'Show Summit Libraries',
    hide_label: 'Hide Summit Libraries'
}); /* hide/show */

// Begin Badges modal module
angular
  .module('badgesModal', [])
  .component('badgesModal', {
    template: '<md-button ng-if="$ctrl.inBadges" ng-click="$ctrl.showBadgeInfo($event, $ctrl.view_code, $ctrl.infoFile)" class="badgeButton" aria-label="{{$ctrl.badgeTooltip}}"><md-tooltip>{{$ctrl.badgeTooltip}}</md-tooltip><md-icon md-svg-icon="{{$ctrl.infoIcon}}"></md-icon></md-button>',
    controller: function ($scope, $mdDialog, $location, badgeOptions) {
      
      // Badge types
      this.badgeTypes = [
        {
          definition: 'peer-reviewed',
          file: 'peer_review.html',
          options: badgeOptions.peer_review
        },
        {
          definition: 'open-access',
          file: 'open_access.html',
          options: badgeOptions.open_access
        }
      ];
      
      // Initialization
      this.$onInit = function () {
        this.view_code = $location.search().vid;
        this.infoIcon = badgeOptions.info_icon;
        this.inBadges = false;
        var icon_definition = $scope.$parent.$parent.$ctrl.iconDefinition;
        angular.forEach($scope.$ctrl.badgeTypes, function(badge) {
          if (icon_definition == badge.definition && badge.options.show_icon) {
            $scope.$ctrl.inBadges = true;
            $scope.$ctrl.badgeTooltip = badge.options.tooltip;
            $scope.$ctrl.infoFile = badge.file;
          }
        });
      }
      
      // Badge info dialog
      this.showBadgeInfo = function showBadgeInfo($event, view_code, info_file) {
        $mdDialog.show({
          templateUrl: 'custom/' + view_code + '/html/' + info_file,
          controller: badgeDialogController
        });
        function badgeDialogController($scope, $mdDialog) {
          $scope.closeBadgeInfo = function () {
            $mdDialog.hide();
          }
        }
        $event.stopPropagation();
      }
      
    }
  })
  .value('badgeOptions', {
    info_icon: 'primo-ui:help-circle-outline',
    peer_review: {
      show_icon: true,
      tooltip: 'What is peer review?'
    },
    open_access: {
      show_icon: true,
      tooltip: 'What is open access?'
    }
  });
  
// END Badges modal module
  

// Begin Toggle Advanced Fields module //
angular
.module('toggleAdvancedFields', [])
.component('toggleAdvancedFields', {
    template: '<md-button class="md-raised" ng-click="$ctrl.toggleFields()" id="advancedFieldsButton" aria-controls="advancedFields" aria-expanded=false aria-label="Show/Hide Advanced Fields">{{$ctrl.advancedFieldsButtonLabel}}</md-button>',
    controller: function ($scope, $window, advancedFieldsOptions) {
        this.$onInit = function () {

            // Declare button and field variables
            this.button = angular.element(document.getElementById('advancedFieldsButton'));
            this.fields = angular.element(document.querySelector('prm-advanced-search md-card:nth-child(2)'));
            this.fields.attr('id', 'advancedFields');

            // Show/hide button and fields on initialization and window resize
            this.setInitDisplay();
            if (advancedFieldsOptions.show_button_for == 'mobile') {
                angular.element($window).bind('resize', function () {
                    $scope.$ctrl.setInitDisplay();
                });
            }

        }

        // Set initial display of button and fields based on default options and window size
        this.setInitDisplay = function () {
            if (advancedFieldsOptions.show_button_for == 'all' || $window.innerWidth < 600) {
                this.showHideFields('hide');
                this.button.removeClass('hide');
            }
            else {
                this.showHideFields('show');
                this.button.addClass('hide');
            }
        }

        // Toggle fields on button click
        this.toggleFields = function () {
            this.fields.hasClass('hide') ? this.showHideFields('show') : this.showHideFields('hide');
        }

        // Show or hide fields
        this.showHideFields = function (show_hide) {
            switch (show_hide) {
                case 'show':
                    this.fields.removeClass('hide');
                    this.advancedFieldsButtonLabel = advancedFieldsOptions.hide_label;
                    this.button.attr('aria-expanded', true);
                    break;
                case 'hide':
                    this.fields.addClass('hide');
                    this.advancedFieldsButtonLabel = advancedFieldsOptions.show_label;
                    this.button.attr('aria-expanded', false);
                    break;
            }
        }

    }
});
    // Set default values for toggleAdvancedFields module
    // show_button_for can be 'mobile' or 'all'
angular.module('toggleAdvancedFields').value('advancedFieldsOptions', {
    show_button_for: 'mobile',
    show_label: 'Show Additional Fields',
    hide_label: 'Hide Additional Fields'
});  

/* End toggle advanced fields */


//* Begin Favorites Warning module  *//
angular
.module('showFavoritesWarning', [])
.run(["$rootScope", function ($rootScope) {
    $rootScope.view = false;
}])
.value('globalFavVars', {
    favWarnBarTxt: 'Sign in to make your favorites list permanent',
    favWarnModalTitleText: 'Sign in to make your favorites list permanent',
    favWarnModalContentText: 'You can create a favorites list as a Guest, but to save a list permanently you must be signed in.',
})
.factory("favSession", function ($window, $rootScope) {
    angular.element($window).on('storage', function (event) {
        if (event.key === 'showFavWarning') {
            $rootScope.$apply();
        }
    });
    /*Functions for setting and getting session data*/
    return {
        setData: function (val) {
            $window.sessionStorage && $window.sessionStorage.setItem('showFavWarning', val);
            return this;
        },
        getData: function () {
            return $window.sessionStorage && $window.sessionStorage.getItem('showFavWarning');
        }
    };
})
.controller('favOverlayCtrl', function ($scope, $mdDialog, $rootScope, favSession, globalFavVars) {
    $scope.status = ' ';
    $scope.customFullscreen = false;
    $scope.favWarning = favSession.getData();  //Pull session data to determine if favorites warning modal should be displayed
    var icon_definition = $scope.$parent.$parent.$ctrl.iconDefinition;
    this.isPinIcon = false;
    if(icon_definition === 'prm_pin')
    {
      this.isPinIcon = true;
    }

    /*Upon initialization of the app the favSession value will be null, so we need to give it a value
	based on global variables set by the institution in their custom.js file*/
    if ($scope.favWarning === null) {
        favSession.setData('true');
        $scope.favWarning = favSession.getData();
    }
    /*If the user is a guest then the isLoggedIn variable is set to 'false'*/
    var rootScope = $scope.$root;
    var uSMS = rootScope.$$childHead.$ctrl.userSessionManagerService;
    var jwtData = uSMS.jwtUtilService.getDecodedToken();
    if (jwtData.userGroup === "GUEST") {
        $scope.isLoggedIn = 'false';
    }
    else {
        $scope.isLoggedIn = 'true';
    }
    /*Set the rootScope view variable depending on session data, if the user is logged in*/
    if ($scope.favWarning === 'true' && $scope.isLoggedIn === 'false') {
        $rootScope.view = true;
    }

    $scope.favWarningOnClick = function () {
        favSession.setData('false');
        $scope.favWarning = favSession.getData();
        $rootScope.view = false;
    };
    /*Function to display favorites warning modal when favorites icon is clicked*/
    $scope.showFavWarningModal = function (ev) {
        $mdDialog.show({
            template: '<md-dialog>' +
                           '<md-dialog-content>' +
                               '<md-toolbar id="fav-modal-header">' +
                                   '<div class="md-toolbar-tools">' +
                                       '<h2 class="flex"><p id="fav-modal-header-text" ng-bind-html="favWarnModalTitleDisplay"></p></h2>' +
                                   '</div>' +
                               '</md-toolbar>' +
                               '<div id="fav-modal-content" class="md-dialog-content">' +
                                   '<p id="fav-modal-content-text" ng-bind-html="favWarnModalContentDisplay"></p>' +
                                   '<p style="text-align: center">' +
                                       '<prm-authentication>' +
                                           '<button class="button-with-icon zero-margin md-button md-primoExplore-theme md-ink-ripple" type="button" ng-transclude="">' +
                                               '<prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="sign-in">' +
                                                   '<md-icon md-svg-icon="primo-ui:sign-in" alt="" class="md-primoExplore-theme" aria-hidden="true"></md-icon>' +
                                               '</prm-icon>' +
                                               '<span translate="eshelf.signin.title">Sign in</span>' +
                                           '</button>' +
                                       '</prm-authentication>' +
                                       '<button class="dismiss-alert-button zero-margin md-button md-primoExplore-theme md-ink-ripple button-with-icon" ng-click="favModalClose(); favWarningOnClick()">' +
                                           '<prm-icon icon-type="svg" svg-icon-set="navigation" icon-definition="ic_close_24px">' +
                                               '<md-icon md-svg-icon="navigation:ic_close_24px" alt="" class="md-primoExplore-theme" aria-hidden="true"></md-icon>' +
                                           '</prm-icon>' +
                                           'DISMISS' +
                                       '</button></p>' +
                               '</div>' +
                           '</md-dialog-content>' +
                       '</md-dialog>',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen,
            controller: function favModalDialogCtrl($scope, $mdDialog, $state, favSession, globalFavVars) {
                $scope.favModalClose = function () {
                    $mdDialog.hide();
                }
                $scope.favWarnModalTitleDisplay = globalFavVars.favWarnModalTitleText;
                $scope.favWarnModalContentDisplay = globalFavVars.favWarnModalContentText;
            }
        })
    };
})
.component('favOverlay', {  //This component is an element that sits over the favorites icon when the modal warning functionality is enabled.
    controller: 'favOverlayCtrl',
    template: '<div>' +
				'<button style="cursor: pointer; background: transparent; border: none; width: 41px; height: 41px; margin: -31px 0px 0px -21px; position: absolute" ng-if="$ctrl.isPinIcon" ng-disabled="$ctrl.isFavoritesDisabled()" ng-show="$root.view" ng-click="showFavWarningModal($event); favWarningOnClick()">' +
        '</button>' +
			'</div>'
});

//* End Favorites signin warning  *//


//*  Begin Enlarge covers   *//
  angular
    .module('enlargeCover', [])
    .component('enlargeCover', {
      // Template
      template: '<md-button ng-if="$ctrl.show_cover" ng-click="$ctrl.showLargeCover($event)" title="View Larger" />',
      controller: function controller($scope, $location, enlargeCoverOptions) {
        this.$onInit = function() {
          this.cover_url = '';
          this.show_cover = false;
          if (angular.isDefined($scope.$parent.$parent.$ctrl.item)) {
            var resource_type = $scope.$parent.$parent.$ctrl.item.pnx.display.type[0];
            if ($location.path() == '/fulldisplay' && enlargeCoverOptions.resource_types.indexOf(resource_type) != -1) {
              this.show_cover = true;
            }
          }
        }
        
        this.showLargeCover = function showLargeCover($event) {
          // Prevent page submission
          $event.preventDefault();
          
          // Get thumbnail URL and modify for large image
          if (angular.isDefined($scope.$parent.$parent.$ctrl.selectedThumbnailLink)) {
            var thumbnail_url = $scope.$parent.$parent.$ctrl.selectedThumbnailLink.linkURL;
            if (thumbnail_url.indexOf('syndetics.com') != -1) {
              this.cover_url = thumbnail_url.replace('SC.JPG', 'LC.JPG');
            }
            else if (thumbnail_url.indexOf('books.google.com')) {
              this.cover_url = thumbnail_url.replace('zoom=5', 'zoom=1');
            }
            window.open(this.cover_url, '_blank');
          }
        }
      }
    })
    .value('enlargeCoverOptions', {
      resource_types: [
        'book',
        'pbook',
        'dvdvideo',
        'videocassette'
      ]
    });

//* End Enlarge covers  *//

//* Begin Text a Call Number *//

// SMS action
  angular
    .module('smsAction', [])
    .component('smsAction', {
      require: {
        prmActionCtrl: '^prmActionList'
      },
      controller: function controller($scope, $location, $http, $mdDialog, customActions, smsActionOptions) {
        var _this = this;
        this.$onInit = function () {
          // Set defaults;
          var vid = '';
          var mms_id = '';
          var show_sms = false;
          var pnx = $scope.$parent.$parent.$ctrl.item.pnx;
          if (!angular.isUndefined(pnx)) {
            // Get available institutions
            var availinstitution = pnx.display.availinstitution;
            if (!angular.isUndefined(availinstitution)) {
              
              // Get vid
              var vid = angular.uppercase($location.search().vid);
              
              // Get institution code
              var institution = vid;
              if (angular.isDefined(smsActionOptions.institution) && smsActionOptions.institution != '') {
                institution = smsActionOptions.institution;
              }
              
              // Continue if this institution has availability
              var available = false;
              for (var i=0; i < availinstitution.length; i++) {
                if (availinstitution[i].indexOf('$$I' + institution) != -1) {
                  available = true;
                }
              }
              if (available == true) {
                
                // Get title
                var title = encodeURIComponent(pnx.display.title[0]);
                
                // Get MMS ID
                var mms_id = '';
                var lds04 = pnx.display.lds04;
                if (!angular.isUndefined(lds04)) {
                  var loc = '$$I' + vid;
                  for (var m=0; m < lds04.length; m++) {
                    if (lds04[m].includes(loc)) {
                      mms_id = lds04[m].replace(loc, '');
                    }
                  }
                }
                
                // Get holdings
                var holdings = new Array();
                var availlibrary = pnx.display.availlibrary;
                for (var h = 0; h < availlibrary.length; h++) {
                  var holding = availlibrary[h];
                  if (holding.indexOf('$$I' + institution) != -1) {
                    var split_holding = holding.split('$$');
                    for (var s = 0; s < split_holding.length; s++) {
                      var sub = split_holding[s];
                      var sub_value = sub.substring(1);
                      switch (sub.charAt(0)) {
                        case '1':
                          var library_location = sub_value;
                        break;
                        case '2':
                          var call_number = sub_value;
                        break;
                        case 'Y':
                          var library_code = sub_value;
                        break;
                        default:
                          // Do nothing
                      }
                    }
                    holdings.push(library_code + ';' + library_location + ';' + call_number);
                  }
                }
                var joined_holdings = encodeURIComponent(holdings.join('|'));

                // If holdings were set successfully, set show_sms to true
                if (holdings.length > 0) {
                  show_sms = true;
                }
              }
            }
            // Define action
            _this.sms_action = {
              name: 'sms_action',
              label: smsActionOptions.label,
              index: smsActionOptions.index,
              icon: smsActionOptions.icon,
              onToggle: _this.showSmsForm(vid, title, mms_id, joined_holdings)
            };
            // Add action if show_sms is true, otherwise remove it
            if (show_sms) {
              customActions.removeAction(_this.sms_action, _this.prmActionCtrl);
              customActions.addAction(_this.sms_action, _this.prmActionCtrl);
            }
            else {
              customActions.removeAction(_this.sms_action, _this.prmActionCtrl);
            }
          };
        }
        
        // SMS dialog
        this.showSmsForm = function showSmsForm(vid, title, mms_id, joined_holdings) {
          return function() {
            
            // Get form asynchronously
            $http({
              method: "GET",
              url: 'https://cloud9.orbiscascade.org/sms/form.php?vid=' + vid + '&title=' + title + '&holdings=' + joined_holdings + '&libraries=' + smsActionOptions.libraries
            })
            .then(
              function(response) {
                // Show dialog
                $mdDialog.show({
                  controller: smsFormController,
                  template: '<md-dialog aria-label="' + smsActionOptions.label + '"><md-dialog-content><md-toolbar><div class="md-toolbar-tools"><h2 class="flex">' + smsActionOptions.label + '</h2><md-button class="md-icon-button" ng-click="closeSmsForm()"><md-tooltip>Close Window</md-tooltip><md-icon md-svg-icon="primo-ui:close" aria-label="Close form window"></md-button></div></md-toolbar><div id="smsFormContent" class="md-dialog-content">' + response.data + '</div></md-dialog-content></md-dialog>',
                  clickOutsideToClose: true,
                  escapeToClose: true
                });
              },
              function(error_response) {
                console.log(error_response);
              }
            );
              
            function smsFormController($scope, $mdDialog) {

              // Submit form asynchronously
              $scope.sendText = function () {
                if (!angular.isUndefined($scope.smsPhone) && !angular.isUndefined($scope.smsProvider)) {
                  // Get note
                  var smsNote = $scope.smsNote;
                  if (angular.isUndefined(smsNote)) {
                    smsNote = '';
                  }
                  // Get link option
                  var smsLink = document.getElementById('smsLink').checked;
                  // Get details
                  var smsItemDetails = document.getElementById('smsItemDetails').value;
                  // Send request
                  $http({
                    method: 'GET',
                    url: 'https://cloud9.orbiscascade.org/sms/send.php?vid=' + vid + '&title=' + title + '&mms_id=' + mms_id + '&details=' + smsItemDetails + '&phone=' + $scope.smsPhone + '&provider=' + $scope.smsProvider + '&note=' + smsNote + '&include_link=' + smsLink
                  })
                  .then(
                    // Display confirmation
                    function(response) {
                      document.getElementById('smsFormContent').innerHTML = response.data;
                    },
                    function(error_response) {
                      console.log(error_response);
                    }
                  );
                }
                else {
                  document.getElementById('smsError').style.display = "block";
                }
              };
              
              // Close form
              $scope.closeSmsForm = function () {
                $mdDialog.hide();
              };
              
            }
            
          };
        }
      }
    })
    .value('smsActionOptions', {
      label: 'Text Call Number',
      index: 0,
      icon: {
        icon: 'ic_textsms_24px',
        iconSet: 'communication',
        type: 'svg'
      },
      libraries: '',
      institution: ''
    });

//* End Text a Call Number  *//

//* Begin External Search *//

angular.module('externalSearch', [])
  .component('externalSearchFacet', {
    controller: function ($scope, externalSearchService, externalSearchOptions) {
      externalSearchService.controller = $scope.$parent.$parent.$ctrl;
      externalSearchService.externalSearchOptions = externalSearchOptions;
      externalSearchService.addExtSearch();
    }
  })
  .component('externalSearchPagenav', {
    controller: function (externalSearchService) {
      if (externalSearchService.controller) {
        externalSearchService.addExtSearch();
      }
    }
  })
  .component('externalSearchContents', {
    template: '<div ng-if="$ctrl.checkName()"><div ng-hide="$ctrl.checkCollapsed()"><div class="section-content animate-max-height-variable"><div class="md-chips md-chips-wrap"><div ng-repeat="target in targets" aria-live="polite" class="md-chip animate-opacity-and-scale facet-element-marker-local4"><div class="md-chip-content layout-row" role="button" tabindex="0"><strong dir="auto" title="{{ target.name }}"><a ng-href="{{ target.url + target.mapping(queries, filters) }}" target="_blank"><img ng-src="{{ target.img }}" width="22" height="22" alt="{{ target.alt }}" style="vertical-align:middle;"> {{ target.name }}</a></strong></div></div></div></div></div></div>',
    controller: function ($scope, $location, externalSearchOptions) {
      $scope.facetName = externalSearchOptions.facetName;
      $scope.targets = externalSearchOptions.searchTargets;
      var query = $location.search().query;
      var filter = $location.search().pfilter;
      $scope.queries = Array.isArray(query) ? query : query ? [query] : false;
      $scope.filters = Array.isArray(filter) ? filter : filter ? [filter] : false;
      this.parentCtrl = $scope.$parent.$parent.$ctrl;
      this.checkName = function () {
        return this.parentCtrl.facetGroup.name == externalSearchOptions.facetName ? true : false;
      }
      this.checkCollapsed = function () {
        return this.parentCtrl.facetGroup.facetGroupCollapsed;
      }
    }
  })
  .factory('externalSearchService', function (externalSearchOptions) { 
    return {
      get controller() {
        return this.prmFacetCtrl || false;
      },
      set controller(controller) {
        this.prmFacetCtrl = controller;
      },
      addExtSearch: function addExtSearch() {
        var xx = this;
        var checkExist = setInterval(function () {
          if (xx.prmFacetCtrl.facetService.results[0] && xx.prmFacetCtrl.facetService.results[0].name != xx.externalSearchOptions.facetName) {
            if (xx.prmFacetCtrl.facetService.results.name !== xx.externalSearchOptions.facetName) {
              xx.prmFacetCtrl.facetService.results.unshift({
                name: externalSearchOptions.facetName,
                displayedType: 'exact',
                limitCount: 0,
                facetGroupCollapsed: false,
                values: undefined
              });
            }
            clearInterval(checkExist);
          }
        }, 100);
      }
    };
  })
  .value('externalSearchOptions', {
    facetName: 'External Search',
    searchTargets: [
      { // WorldCat
        "name": "Worldcat",
        "url": "https://www.worldcat.org/search?q=",
        "img": "/primo-explore/custom/CENTRAL_PACKAGE/img/worldcat-logo.png",
        "alt": "Worldcat Logo",
        mapping: function mapping(queries, filters) {
          var query_mappings = {
            'any': 'kw',
            'title': 'ti',
            'creator': 'au',
            'subject': 'su',
            'isbn': 'bn',
            'issn': 'n2'
          };
          try {
            return queries.map(function (part) {
              var terms = part.split(',');
              var type = query_mappings[terms[0]] || 'kw';
              var string = terms[2] || '';
              var join = terms[3] || '';
              return type + ':' + string + ' ' + join + ' ';
            }).join('');
          } catch (e) {
            return '';
          }
        }
      },
      { // Google Scholar
        "name": "Google Scholar",
        "url": "https://scholar.google.com/scholar?q=",
        "img": "/primo-explore/custom/CENTRAL_PACKAGE/img/google-logo.png",
        "alt": "Google Scholar Logo",
        mapping: function mapping(queries, filters) {
          try {
            return queries.map(function (part) {
              return part.split(",")[2] || "";
            }).join(' ');
          } catch (e) {
            return '';
          }
        }
      }]
  });

//* End External Search *//

})();