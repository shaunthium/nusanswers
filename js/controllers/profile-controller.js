angular.module('quoraApp')
.controller('ProfileCtrl', ['$stateParams','ezfb', '$scope', '$rootScope', '$http', '$state', function($stateParams, ezfb, $scope, $rootScope, $http, $state){
  // var base_url = "http://139.59.247.83/";
  var base_url = '';

  $scope.editMode = false;

  // Pull user's id from state params
  var id = $stateParams.profileId;

  console.log("in profile ctr");

  $scope.profileId = id;
  // Get user from id
  var user = $http({
    url: base_url + 'server/users/main.php',
    method: 'POST',
    data: {
      cmd: 'show',
      user_id: id
    }
  }).then(function(data) {

    console.log("got data", data);
    $scope.user = data.data;
    $rootScope.loading = false;
  })

  // Get profile img
  $http({
    url: 'http://graph.facebook.com/v2.5/' + id + '/picture?redirect=false&width=9999',
    method: 'GET',
    data: {
      width: '1000'
    }
  }).success(function(data) {
    $scope.profileImg = data.data.url;
  }).error(function(data) {
    $scope.profileImg = 'http://dummyimage.com/300/09.png/fff';
  });


  $scope.saveChanges = function(){

      var error = false;
      if(!$scope.temp.content || $scope.temp.content.length < 10){
          Materialize.toast('Error: profile body is too short!', 2000, 'error-toast');
          error = true;
      }
      if($scope.temp.title !== questionTitleFilter($scope.temp.title)){
          Materialize.toast('Error: content contains invalid characters!', 2000, 'error-toast');
          error = true;
      }
 
      if(error){return;}

      $scope.temp.content = $('#wysiwyg-editor-questionbody').trumbowyg('html');
      /*questionService.editQuestion($scope.post.id, $scope.temp.title, $scope.temp.content)
      .then(
          function(res){
              if(res.data){
                  $scope.post.title = $scope.temp.title;
                  $scope.post.content = $scope.temp.content;
                  Materialize.toast('Changes saved successfully!', 2000, 'success-toast');
                  $scope.editMode = !$scope.editMode;
              }
              else{
                  console.log("Error while editing question!");
              }
          },
          function(err){
              console.log("Error while editing question!");
          }
      );*/

      $scope.editMode = !$scope.editMode;
  }

  $scope.toggleEditMode = function(){
      console.log("HE")

      $scope.userInput = "";
      $scope.editMode = !$scope.editMode;
      if($scope.editMode){
          //$scope.temp.title = $scope.post.title;
          $('#wysiwyg-editor-questionbody').trumbowyg({
              fullscreenable: false,
              btns:['bold', 'italic']
          });
      }
      else{
          Materialize.toast('Changes not saved.', 2000, 'information-toast')
      }
  }

  // Get answers for user
  $http({
    url: base_url + 'server/answers.php',
    method: 'POST',
    data: {
      cmd: 'profileanswers',
      user_id: id
    }
  }).then(function(data) {
    $scope.profileAnswers = data.data;
  })

  // Get questions for user
  $http({
    url: base_url + 'server/questions.php',
    data: {
      cmd: 'get_all_qns_of_user',
      user_id: id
    },
    method: 'POST'
  }).then(function(data) {
    $scope.profileQuestions = data.data;
  })

  $scope.logout = function(){
    ezfb.logout(function(res) {
      // console.log(res);
    });
    $rootScope.currentUser = undefined;
    Materialize.toast('Successfully logged out', 2000, 'custom-toast')
    $state.go('home');
  }

}])
