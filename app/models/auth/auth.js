app.controller('LoginCtrl', function($scope, Request, $window, $timeout, $state, UserService, $http, $rootScope, Utill, $mdToast) {
    $scope.loginData = {};
    $scope.messages = { success: "", error: "" };
    $scope.showLoader = false;

    $scope.postData1 = {};
    $scope.messages = { success: "", error: "" };
    $scope.loginMessages = { success: "", error: "" };
    $scope.login = 1;
    $scope.isLoggedIn = false;

    $scope.postData1.hasEmail = false;

    $scope.login = function() {
        Utill.startLoader()

        $scope.postData.email = "demo@kaimun.com";
        $scope.postData.password = "demopassword";
        Request.post('rest-auth/login/', $scope.loginData).then(function(res) {

            Utill.endLoader();
            UserService.saveToken(res.data.token);
            $state.go('app.dashboard');
            Request.get('users/' + res.data.user.pk + '/').then(function(res) {
                Utill.showSuccess('Login Successful');
                UserService.saveCurrentUser(res.data);
                $rootScope.currentUser = UserService.getCurrentUser();
                $rootScope.user = $rootScope.currentUser;
                $scope.isLoggedIn = true;

            }, function(res) {
                Utill.endLoader()
                Utill.showError("Something went wrong")
            });

        }, function(res) {
            $scope.errors = res.data;
            Utill.endLoader()
            Utill.showError("Something went wrong")
        });

        $timeout(function() {
            $scope.messages.success = '';
            $scope.errors = '';
        }, 6000);
    };
});

app.controller('RegistrationCtrl', function($scope, Request, $rootScope, $timeout, $state, $http, UserService, Utill) {
    $scope.postData = {};
    $scope.showLoader = false;

    $scope.signup = function() {
        Utill.startLoader()
        $scope.postData.username = $scope.postData.email;
        $scope.postData.password2 = $scope.postData.password1;
        Request.post('rest-auth/registration/', $scope.postData).then(function(res) {
            Utill.endLoader();
            $state.go('access.go-to-confirm');
        }, function(res) {
            $scope.errors = res.data;
            Utill.endLoader() 
            Utill.showError("Something Went Wrong")
                   
        });
    };

});

app.controller('ForgotCtrl', function($scope, Request, $timeout, $state, $mdToast, Utill) {
    $scope.messages = { success: '', error: '' };
    $scope.postData = {};
    $scope.showLoader = false;
    $scope.forgotPassword = function() {
        console.log('forgot')
        Request.post('rest-auth/password/reset/', $scope.postData).then(function(res) {
                console.log(res.data);
                Utill.showSuccess('A Password Reset Link Been Sent to Your email')
                $scope.postData = "";
                $state.go('access.forgot-password');
            },
            function(res) {
                $scope.errors = res.data;
            });
        $timeout(function() {
            $scope.messages.success = '';
            $scope.messages.error = '';
        }, 6000);
    }
});

app.controller('ResetCtrl', function($scope, Request, $timeout, $state, $stateParams, $rootScope) {
    $scope.messages = { success: '', error: '' };
    $scope.postData = {};
    $scope.showLoader = false;
    $scope.postData.uid = $stateParams.userId;
    $scope.postData.token = $stateParams.token;
    $scope.resetPassword = function() {
        Utill.startLoader()
            // console.log($scope.postData)
        Request.post('rest-auth/password/reset/confirm/', $scope.postData).then(function(res) {
                Utill.endLoader();
                Utill.showSuccess("Password Reset Successful");
                $timeout(function() {
                    $state.go('access.signin')
                }, 2000);
            },
            function(res) {
                $scope.errors = res.data;
                Utill.endLoader();
                Utill.showError("Password Reset Failed");
            });

    }
});

app.controller('EmailVerificationCtrl', function($scope, $mdToast, $location, Request, $timeout, $state, UserService, $http, $rootScope, $stateParams, Utill) {
    $scope.postData = {};
    $scope.postData.key = $stateParams.key;
    Utill.startLoader();
    $scope.verifyEmail = function() {
        Request.post('rest-auth/registration/verify-email/', $scope.postData).then(function(res) {
                Utill.endLoader();
                Utill.showSuccess('Account Has Been Successfully verified')
                $timeout(function() {
                    $state.go('access.signin')
                }, 6000);
            },

            function(err) {
                Utill.endLoader()
                Utill.showError('Something Went Wrong')

                $scope.errors = err.data;

            });
        $timeout(function() {
            $scope.success = '';
            $scope.errors = '';
        }, 6000);
    };
    $scope.verifyEmail();
});

app.controller('EmailVerificationResendCtrl', function($scope, Utill, $location, Request, $timeout, $state, UserService, $http, $rootScope, $stateParams) {
    $scope.postData = {};
    $scope.messages = { success: "", error: "" };

    $scope.currentUser = UserService.getCurrentUser();
    $scope.resendEmail = function() {
        Utill.startLoader()
        Request.get('/auth/user/' + $scope.currentUser._id + '/resend-confirmation').then(function(res) {
                Utill.endLoader()
                if (res.data.success) {
                    Utill.showSuccess('Resent')
                    $scope.messages.success = res.data.message;
                }
            },
            function(err) {
                $scope.messages.error = err.data.message;
                $scope.endLoader();
                $scopes.showError('Something Went Wrong')

            });

        $timeout(function() {
            $scope.messages.success = '';
            $scope.messages.error = '';
        }, 6000);
    }
});