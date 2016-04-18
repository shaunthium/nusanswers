/*Main config of the app, handles the different views and should also keep track
of the history. Each view is attached to its controller*/

angular.module('quoraApp', ['ezfb', 'ui.router', 'ngAnimate', 'ngSanitize'])

.config(['ezfbProvider', '$stateProvider', '$urlRouterProvider', function(ezfbProvider, $stateProvider, $urlRouterProvider) {

    var QUESTION_TITLE_MIN_LENGTH = 6;

	  $stateProvider
	    .state('home', {
	      url: '/home',
	      templateUrl: '/views/home.html',
	      controller: 'HomeCtrl',
	    })

	    .state('qa', {
  		  url: '/qa/:questionId',
  		  // params:{'currPost': null},
  		  templateUrl: '/views/question-answers.html',
  		  controller: 'QACtrl'
		  })

  		.state('profile', {
  		  url: '/profile/:profileId',
  		  templateUrl: '/views/profile.html',
  		  controller: 'ProfileCtrl'
  		})

      .state('404', {
        templateUrl: '/views/404.html'
      });

	  $urlRouterProvider.otherwise('home');

    ezfbProvider.setInitParams({
      // This is my FB app id for plunker demo app
      appId: '1616624788586225',

      // Module default is `v2.4`.
      // If you want to use Facebook platform `v2.3`, you'll have to add the following parameter.
      // https://developers.facebook.com/docs/javascript/reference/FB.init
      version: 'v2.4'
    });

    // Default init function
    var _defaultInitFunction = ['$window', 'ezfbInitParams', function ($window, ezfbInitParams) {
      // Initialize the FB JS SDK
      $window.FB.init(ezfbInitParams);
    }];

    // Default load SDK function
    var _defaultLoadSDKFunction = [
             '$window', '$document', 'ezfbAsyncInit', 'ezfbLocale',
    function ($window,   $document,   ezfbAsyncInit,   ezfbLocale) {
      // Load the SDK's source Asynchronously
      (function(d){
        var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement('script'); js.id = id; js.async = true;
        js.src = "//connect.facebook.net/" + ezfbLocale + "/sdk.js";
        // js.src = "//connect.facebook.net/" + ezfbLocale + "/sdk/debug.js";  // debug
        ref.parentNode.insertBefore(js, ref);
      }($document[0]));

      $window.fbAsyncInit = ezfbAsyncInit;
    }];
	}])
