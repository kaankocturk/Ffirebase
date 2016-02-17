'use strict';

var app = angular.module('fireApp');

app.controller('mainCtrl', function($scope, List, User) {
  $scope.user = User;
  $scope.list = List;

  $scope.add = function(desc) {
    $scope.list.$add({
      desc: desc,
      isComplete: false
    });
    $scope.desc = '';
  };
});

app.controller('profileCtrl', function($scope, Profile, fbAuth){
  var authData = fbAuth.$getAuth();
  $scope.profile = Profile(authData.uid);
  $scope.update = function(user){
    $scope.profile.name = user.name;
    $scope.profile.age = user.age;
    $scope.profile.gender = user.gender;
    $scope.profile.$save();
  }
  console.log('profileCtrl');
  console.log($scope.profile);
});


app.controller('navCtrl', function($scope, $state, Auth, fbAuth) {
  fbAuth.$onAuth(function(authData) {
    console.log('authData:', authData);
    $scope.authData = authData;
  });

  $scope.logout = function() {
    Auth.logout();
    $state.go('home');
  };

});



app.controller('userCtrl', function($scope, $state, Auth) {
  $scope.state = $state.current.name.split('.')[1];

  $scope.submit = function() {
    if ($scope.state === 'login') {
      Auth.login($scope.user)
      .then(function() {
        $state.go('home');
      }, function() {
        $scope.user.password = '';
        alert('Invalid email or password.');
      });
    } else {
      if($scope.user.password !== $scope.user.password2) {
        $scope.user.password = $scope.user.password2 = '';
        return alert('Passwords must match');
      }

      Auth.register({
        email: $scope.user.email,
        password: $scope.user.password
      })
      .then(function(authData) {
        console.log('authData:', authData);
        $state.go('home');
      }, function(err) {
        alert('error in console');
        console.error(err);
      });
    }
  };
});
