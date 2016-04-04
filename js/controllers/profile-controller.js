/*Controls the details of the posts */

angular.module('quoraApp')
.controller('ProfileCtrl', [ '$scope', function($scope){
	
	$scope.profileImg = "http://dummyimage.com/300/09.png/fff"


	$("input:file").change(function (){
			console.log("lol")
     	var fileName = $(this).val();
       
      var f = document.getElementById('file-input').files[0],
      r = new FileReader();
	  	r.onloadend = function(e){
		    var data = e.target.result;
		    console.log("data", data);

			// Update database here
				$scope.profileImg = data;
				$scope.$apply();

		  }

		  r.readAsDataURL(f);

  });


}])