app.controller('DashCtrl', ['$scope', 
'$stateParams',
'$window', 
'$state', 
'$http', 
'$timeout',
'$rootScope',
'UserService', 
'Request', 
'$localStorage', 
'Utill',
function($scope, $stateParams, $window, $state, $http,  $timeout,$rootScope, UserService,  Request,  $localStorage,  Utill) { 
        $scope.postData = {};
        $scope.errors = [];
        $rootScope.user = UserService.getCurrentUser();
        $scope.validAccount = false;
        $scope.step2 = false;
        $scope.step1 = false;
        $scope.showRavePayButton = false;
        $scope.toggleStep2 = function(){
             $scope.step2 = true;
             $scope.step1 = false;
        }

        $scope.toggleStep1 = function(){
                $scope.step1 = true;
        }

        $scope.getCountries = function(){
                Request.get('countries/').then(function(res){
                    $scope.countries = res.data;
                })
        }


        $scope.getCountries();


        $scope.selectCountry = function(country){
                country.selectedCountry = true;
                $scope.selectedCountry = country.iso_code;
                $scope.currency_code = country.currency;
                $scope.getBanks(country.iso_code);
                $scope.step1 = true;
                $scope.step2 = false;
        }

        $scope.getBanks = function(country){
               $scope.postData.country = country;
               Utill.startLoader();
                Request.post('transactions/get_banks/', $scope.postData).then(function(res){
                     $scope.banks = res.data.banks.data;
                     console.log(res.data)
                     Utill.endLoader();
                }, function(res){
                        Utill.endLoader();

                })
        }

        // $scope.getBanks();

        $scope.resolveAccount =  function(){
                $scope.postData.currency = $scope.selectedCountry;
                Utill.startLoader()
                Request.post('transactions/resolve_account/', $scope.postData).then(function(res){
                     $scope.validAccount = true; 
                     $scope.account_name = res.data.account.data.account_name;
                     Utill.endLoader();
                     Utill.showSuccess("Account Valid")
                }, function(res){
                    Utill.endLoader();
                    Utill.showError("Account Invalid")
                })
        }

        $scope.sendDepositRequest = ()=>{
                Utill.startLoader()
                $scope.postData.currency = $scope.currency_code;
                Request.post('transactions/ravepayment_request/', $scope.postData).then((res)=>{
                    Utill.endLoader()
                    $scope.showRavePayButton = true;  
                    $scope.amount = res.data.payload.amount;
                    $scope.reference = res.data.payload.txref;
                    $scope.email = res.data.payload.customer_email;
                    $scope.customer = {
                        firstName: res.data.payload.customer_firstname,
                        lastName: res.data.payload.customer_lastname,
                        currency: res.data.payload.currency,
                        country: res.data.payload.country
                    };
                    $scope.website = {
                        title: res.data.payload.custom_name,
                        description: res.data.payload.custom_description,
                        logo: res.data.payload.custom_logo
                    };
                    $scope.integrityHash = res.data.integrityHash;
                }, function(error){
                    Utill.endLoader()
                    Utill.showError("Something Went Wrong")
                  })
            }

            $scope.send = function (response) {
                response.amount = $scope.amount;
                $scope.postData.txRef = response.data.data.txRef; 
                $scope.postData.amount = $scope.amount;
                Request.post('transactions/ravepay_deposit/', $scope.postData).then((res)=>{
                    $scope.successFulTx = true;
                    $scope.step1 = false;
                    $scope.step2 = false;
                    $scope.postData = null;
                    $timeout(function() {
                        $scope.getUser();
                        Utill.showSuccess('Transaction Completed!!!')
                     }, 4000);
                }, (err)=>{
                    Utill.endLoader();
                    Utill.showError("Something went wrong");
                })
            };
        //     $scope.reset() =  function(){
        //         $scope.step1 = false;
        //         $scope.step2 = false;
        //     }
        //     0690000031
        
}])




































































































