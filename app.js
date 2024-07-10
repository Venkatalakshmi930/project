angular.module('loginApp', [])
.controller('LoginController', function($scope, $http) {
  $scope.login = function() {
    // Reset message
    $scope.message = '';

    // Validate username
    if (!$scope.username || /^\d+$/.test($scope.username)) {
      $scope.message = 'Please enter a valid username (cannot be numbers only).';
      return;
    }

    // Validate password
    if (!$scope.password) {
      $scope.message = 'Password is required.';
      return;
    }

    // If validations pass, make HTTP POST request
    $http.post('http://localhost:3000/login', {
      username: $scope.username,
      password: $scope.password
    }).then(function(response) {
      if (response.data.success) {
        $scope.message = response.data.message;
        alert('Login successful!');
      } else {
        $scope.message = response.data.message;
      }
    }).catch(function(error) {
      console.error('Error:', error);
    });
  };
});
