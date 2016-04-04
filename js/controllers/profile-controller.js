angular.module('quoraApp')
.controller('ProfileCtrl', [ '$scope', function($scope){
	
	$scope.profileImg = "http://dummyimage.com/300/09.png/fff"
 
	/** listens for change event on the input file type 
	    TODO: might want to change this to a directive or something*/
	$("input:file").change(function (){
     	var fileName = $(this).val();
       
      var f = document.getElementById('file-input').files[0],
      r = new FileReader();
	  	r.onloadend = function(e){
		    var data = e.target.result;
				$scope.profileImg = data;
				$scope.$apply(); // update view
		  }

		  r.readAsDataURL(f);
  });
}])
