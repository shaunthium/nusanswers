'use strict';

angular.module('quoraApp')
	.service('questionService', ['$q', '$http', function($q, $http){

		var base_url = "path/to/our/php/script",
			canceller;

		// Just hardcoded atm
		var posts = [{
								  id:0,
								  title: 'When does Indian open on Sundays?',
								  category: 'Latest',
								  author: {name:'User1', karma:100, userid: 1},
								  views: 10,
								  desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel scelerisque quam. Pellentesque ut mattis tellus. Donec maximus elementum nibh eget gravida. In sed leo a lectus suscipit porta. Fusce ornare sem vel sem viverra tempor. Aenean et tempus sapien. Donec sit amet mollis nibh. Suspendisse interdum, ipsum a maximus mattis, ipsum nibh viverra ipsum, eget facilisis enim mauris vitae urna. Mauris vulputate libero sed dapibus tristique. Nullam at ante a nisi porttitor rhoncus.',
									upvotes:0,
									comments: [
								 		{author: {name:'Bob', karma:100, userid: 4}, body:'Some comment content', upvotes:0, liked : false, reported : false},
								 		{author: {name:'Eric', karma:120, userid: 5}, body:'Some comment content2222 ome comment content2233322', upvotes:1, liked : false, reported : false}
								 	]},
								 {
								  id:1,
								  title: 'Why is nobody asking questions during lecture?',
								  category: 'Lectures',
								  author: {name:'User2', karma:200, userid: 2},
								  views: 25,
								  desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.In sed leo a lectus suscipit porta. Suspendisse interdum, ipsum a maximus mattis, ipsum nibh viverra ipsum, eget facilisis enim mauris vitae urna. Mauris vulputate libero sed dapibus tristique. Nullam at ante a nisi porttitor rhoncus.',
									upvotes:0,
									comments: [
								 		{author: {name:'Bob', karma:100, userid: 4}, body:'Some comment content', upvotes:0, liked : false, reported : false},
								 		{author: {name:'Eric', karma:120, userid: 5}, body:'Some comment content2222 ome comment content2222222333', upvotes:0, liked : false, reported : false}
								 	]
								},
								{
								  id:2,
								  title: 'When does starbucks close on public holidays?',
								  category: 'UTown',
								  author: {name:'Steven', karma:7, userid: 3},
								  views: 25,
								  desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel scelerisque quam. Pellentesque ut mattis tellus.  Aliquam vel scelerisque quam. Pellentesque ut mattis tellus.',
									upvotes:0,
									comments: [
								 		{author: {name:'Bob', karma:100, userid: 4}, body:'Some comment content', upvotes:0, liked : false, reported : false},
								 		{author: {name:'Eric', karma:120, userid: 5}, body:'Some comment content2222', upvotes:0, liked : false, reported : false}
								 	]
								}];

		function getQuestions(){

			//canceller = $q.defer();

			return posts;

			//var queryString = "base_url + 'PublicTollParkings/' + app_id + '?latitude=' + myPos.A + '&longitude=' + myPos.F + '&radius=' +
			//								    	  radius + '&format=json';"

			//return $http.get(queryString, {timeout: canceller.promise});

		}

		function cancelCall(){

			canceller.resolve("User cancelled call");

		}

		return {
			getQuestions: getQuestions,
			cancelCall: cancelCall
		}

	}]);
