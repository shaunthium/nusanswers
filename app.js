/*Main config of the app, handles the different views and should also keep track
of the history. Each view is attached to its controller*/

angular.module('quoraApp', ['ui.router'])

	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	  $stateProvider
	    .state('home', {
	      url: '/home',
	      templateUrl: '/views/home.html',
	      controller: 'HomeCtrl as homectrl',
	    })

	    .state('qa', {
		  url: '/qa',
		  params:{'currPost': null},
		  templateUrl: '/views/question-answers.html',
		  controller: 'QACtrl'
		})

		.state('profile', {
		  url: '/profile',
		  templateUrl: '/views/profile.html',
		  controller: 'ProfileCtrl'
		});

	  $urlRouterProvider.otherwise('home');

	}])
