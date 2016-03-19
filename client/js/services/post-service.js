/* This script should handle call to API and get data from server,
Have methods like postToAPI and fetchFromAPI and such, 
We can just inject this module in our controllers and call whenever we want*/

angular.module('quoraApp')

.factory('posts', [function(){
  var o = {
    posts: []
  };
  return o;
}])