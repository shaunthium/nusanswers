
/*angular.module('quoraApp')

.directive('notifications', function(){
	return {
		restrict:'E',
		controller: function(){

		
		},
		link:function(scope, element, attributes){
			
			console.log("hej");
			
			scope.myFunction = function() {
				console.log("hello");
			    document.getElementById("myDropdown").classList.toggle("show");
			}

			// Close the dropdown menu if the user clicks outside of it
			window.onclick = function(event) {
			  if (!event.target.matches('.dropbtn')) {

			    var dropdowns = document.getElementsByClassName("dropdown-content");
			    for (var i = 0; i < dropdowns.length; i++) {
			      var openDropdown = dropdowns[i];
			      if (openDropdown.classList.contains('show')) {
			        openDropdown.classList.remove('show');
			      }
			    }
			  }
			}
				
		}, 
		template:   '<div class="dropdown">' +
				     '<button ng-click="myFunction()" class="dropbtn">Dropdown</button>' +
					 '<div id="myDropdown" class="dropdown-content">' +
					    '<a href="#">Link 1</a>' +
					    '<a href="#">Link 2</a>' +
					    '<a href="#">Link 3</a>' +
					  '</div>'+
					'</div>'
	}
});*/

/*angular.module('quoraApp')



.directive('voteContainer', function(){

	return {
		restrict: 'A',
		link: function(scope, element, attrs){

			var dom_element = element[0];
			element.css('height', document.getElementById('post-text-container').clientHeight);
			
		}

	}

})*/