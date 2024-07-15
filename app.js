angular.module('userApp', [])
.controller('RegisterController', function($scope, $http) {
  $scope.user = {
    firstName: '',
    lastName: '',
    email: '',
    age: null,
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  };

  $scope.message = '';
  $scope.passwordInputType = 'password';
  $scope.confirmPasswordInputType = 'password';

  $scope.togglePasswordVisibility = function(fieldId) {
    if (fieldId === 'password') {
      $scope.passwordInputType = $scope.passwordInputType === 'password' ? 'text' : 'password';
    } else if (fieldId === 'confirmPassword') {
      $scope.confirmPasswordInputType = $scope.confirmPasswordInputType === 'password' ? 'text' : 'password';
    }
  };

  $scope.register = function() {
    $scope.message = '';

    // Validate First Name
    if (!$scope.user.firstName || $scope.user.firstName.length < 4) {
      alert('First name must contain at least 4 characters.');
      return;
    }

    // Validate Last Name
    if (!$scope.user.lastName || $scope.user.lastName.length < 4) {
      alert('Last name must contain at least 4 characters.');
      return;
    }

    // Validate Email
    if (!$scope.user.email || !/@/.test($scope.user.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Validate Age
    if (!$scope.user.age || $scope.user.age < 1 || $scope.user.age > 100) {
      alert('Age must be between 1 and 100.');
      return;
    }

    // Validate Password
    if (!$scope.user.password || $scope.user.password.length < 5) {
      alert('Password must be at least 5 characters.');
      return;
    }

    // Validate Confirm Password
    if ($scope.user.password !== $scope.user.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    // Validate Phone Number
    if (!$scope.user.phoneNumber || !/^[1-9]\d{9}$/.test($scope.user.phoneNumber)) {
      alert('Phone number must be 10 digits.');
      return;
    }

    // If all validations pass, make HTTP POST request
    $http.post('http://localhost:3000/register', $scope.user).then(function(response) {
      if (response.data.success) {
        alert('Registration successful!');
        $scope.user = {};  // Clear form fields
      } else {
        alert(response.data.message);
      }
    }).catch(function(error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    });
  };
})
.controller('LoginController', function($scope, $http) {
  $scope.username = '';
  $scope.password = '';
  $scope.message = '';

  $scope.login = function() {
    $scope.message = '';

    $http.post('http://localhost:3000/login', { username: $scope.username, password: $scope.password }).then(function(response) {
      $scope.message = response.data.message;
      if (response.data.success) {
        alert('Login successful!');
      } else {
        alert('Login failed!');
      }
    }).catch(function(error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    });
  };
})
.controller('ForgotPasswordController', function($scope, $http) {
  $scope.email = '';
  $scope.message = '';

  $scope.sendResetLink = function() {
    $scope.message = '';

    $http.post('http://localhost:3000/forgot-password', { email: $scope.email }).then(function(response) {
      $scope.message = response.data.message;
      if (response.data.success) {
        alert('Password reset link sent to your email!');
      } else {
        alert('Failed to send reset link.');
      }
    }).catch(function(error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    });
  };
});
