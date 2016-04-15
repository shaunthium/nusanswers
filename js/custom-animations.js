angular.module('quoraApp')
.animation('.slide', [function() {
  return {
    // make note that other events (like addClass/removeClass)
    // have different function input parameters
    enter: function(element, doneFn) {

      // console.log("entering")
      jQuery(element).fadeIn(500, doneFn);

      // remember to call doneFn so that angular
      // knows that the animation has concluded
    },

    move: function(element, doneFn) {
      // console.log("moving")
      jQuery(element).fadeIn(500, doneFn);
    },

    leave: function(element, doneFn) {
      // console.log("leaving")
      jQuery(element).fadeOut(500, doneFn);
    }
  }
}]);
