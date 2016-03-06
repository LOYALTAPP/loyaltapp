angular.module('starter.controllers', ['ionic','ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state) {
  $scope.logout = function(){
    localStorage.removeItem("user", null);
    $state.go("login");
  }
  $scope.user = localStorage.getItem("user");
  $scope.user = JSON.parse($scope.user);
})

.controller('TransactionsCtrl', function($scope, dataService) {
  $scope.userTransactions = dataService.transactions;
})
.controller('ProfileCtrl', function($scope){
  $scope.user = localStorage.getItem("user");
  $scope.user = JSON.parse($scope.user);
})
.controller('PartnersCtrl', function($scope, dataService){
  $scope.partners = dataService.partners;
})
.controller('PartnerDetailsCtrl', function($scope, dataService, $stateParams){
  var partner = dataService.partners.filter(function(par){
      return  par.id.toString() == $stateParams.partnerId;
  });
  $scope.selectedPartner = partner[0];
})
.controller('TransactionCtrl', function($scope, $stateParams, $rootScope, dataService) {
  var transactionId = $stateParams.transactionId;
  $scope.details = dataService.transactionDetails;
})
.controller('CardCtrl', function($scope, $http, $rootScope, $cordovaBarcodeScanner){
  var self = this;
  $scope.user = localStorage.getItem("user");
  self.user = $scope.user = JSON.parse($scope.user);
  $scope.cardDetails = {name: "", id: "", email: "", balance: ""};
  $scope.ScanCard = function(){
    /*$cordovaBarcodeScanner.scan().then(function(imageData){
        alert(imageData.text);
    }, function(error){
        alert("Error while scanning : " + error);
    });*/
    $http.post("http://localhost:8101/scan", {"qrCode" : '0e8fcd912f652c65104ee90cfbef5298bc4298aacceddc7d75a741'}).success(function(data, e){
    //$http.post("https://qrgen-ontechedge.c9.io/scan", {"qrCode" : '0e8fcd912f652c65104ee90cfbef5298bc4298aacceddc7d75a741'}).success(function(data, e){
        $scope.cardDetails.name = data.name;
        $scope.cardDetails.id = 12321;
        $scope.cardDetails.email = data.email;
        $scope.cardDetails.balance = data.balance;
    });
  };
  $rootScope.$on("loginsuccessful", function(){
      $scope.user = localStorage.getItem("user");
      self.user = $scope.user = JSON.parse($scope.user);
      localStorage.setItem("user", JSON.stringify(self.user));
  })
  $scope.Cancel = function(){
    if(confirm("You are you sure you want to cancel ? ")){
      $scope.cardDetails = {name: "", id: "", email: "", balance: ""}; 
    }
  }
})
.controller("LoginCtrl", function($scope, $cordovaBarcodeScanner, $cordovaOauth, $http, $state, loginFactory){
  //if localStorage has some credentials, redirect theuser to the mail page, else show the credentials
  if(localStorage.getItem("user") != null){
    $state.go("app.cardhome");
  }
  
  $scope.SignIn = function(){
    var loginDetails = {};
    loginDetails.name = "techycode";
    loginDetails.email = "imtechycode@gmail.com";
    loginDetails.provider = "google";
    loginDetails.shareinfo = true;
    localStorage.setItem("user", JSON.stringify(loginDetails));
    loginFactory.postLogin();
    $state.go("app.cardhome");
    return;
  }
  $scope.LoginWithGoogle = function(){
    var loginDetails = {};
    loginDetails.name = "techycode";
    loginDetails.email = "imtechycode@gmail.com";
    loginDetails.provider = "google";
    loginDetails.shareinfo = true;
    localStorage.setItem("user", JSON.stringify(loginDetails));
    loginFactory.postLogin();
    $state.go("app.cardhome");
    return;
    
    try{  
      $cordovaOauth.google("75670157293-8bjfof6jaidmjub049e6424uv6ks5igu.apps.googleusercontent.com", 
          ["email","profile"]).then(function(result){
        var accessToken = result.access_token;
        $http.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + accessToken).then(function(result, data){
          var loginDetails = {};
          loginDetails.email = result.data.email;
          loginDetails.name = result.data.name;
          loginDetails.provider = "google";
          loginDetails.shareinfo = true;
          localStorage.setItem("user", JSON.stringify(loginDetails));
          loginFactory.postLogin();
          $state.go("app.cardhome");
        }, function(error){
          alert("Error : " + JSON.stringify(error));
        });
      },function(error){
        alert("ERROR GIAML : " + error);
      });
    }
    catch(Error){
      alert("Eror : " + Error);
    }
  }
  $scope.LoginWithFacebook = function(){
    var loginDetails = {};
    loginDetails.name = "techycode";
    loginDetails.email = "imtechycode@gmail.com";
    loginDetails.provider = "facebook";
    localStorage.setItem("user", JSON.stringify(loginDetails));
    loginFactory.postLogin();
    $state.go("app.search");
    return;
    
    $cordovaOauth.facebook("411152612427103", ["email"]).then(function(result) {
            $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: result.access_token, fields: "email,id,name,gender,location,website,picture,relationship_status", format: "json" }}).then(function(result) {
                var data = result.data;
                var loginDetails = {};
                loginDetails.email = result.data.email;
                loginDetails.name = result.data.name;
                loginDetails.provider = "facebook";
                loginDetails.shareinfo = true;
                localStorage.setItem("user", JSON.stringify(loginDetails));
                loginFactory.postLogin();
                $state.go("app.search");
            }, function(error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });
        }, function(error) {
            alert("There was a problem signing in!  See the console for logs");
            console.log(error);
        });
  }
})
.factory("loginFactory", function($rootScope){
  var loginServices = {
    postLogin: function(){
      $rootScope.$broadcast("loginsuccessful");
    }
  }
  return loginServices;
})
.service("dataService", function(){
  this.partners = [
    { title: 'Kalyan Bhel', area: 'Vimannagar', address : 'Near police station', id: 1, phone : 9988987676, source:"img/kalbhel.jpg" },
    { title: 'Chaitanyas Parathas', area: 'Vimannagar', address : 'Opposite Krishna Restaurant', id: 2,  phone : 9988987654,source : "img/chai.png" },
    { title: 'Krishna Restaurant',area: 'Vimannagar', address : 'Near pheonix mall', id: 3,  phone : 8768987676, source : "img/krish.jpg" },
    { title: 'Malaka Spice',area: 'Vimannagar', address : 'Near temple', id: 6,  phone : 7767656789,source : "img/mala.jpg" },
    { title: 'Kalyan Bhel', area: 'Vimannagar', address : 'Near police station', id: 1, phone : 9988987676, source:"img/kalbhel.jpg" },
    { title: 'Chaitanyas Parathas', area: 'Vimannagar', address : 'Opposite Krishna Restaurant', id: 2,  phone : 9988987654,source : "img/chai.png" },
    { title: 'Krishna Restaurant',area: 'Vimannagar', address : 'Near pheonix mall', id: 3,  phone : 8768987676, source : "img/krish.jpg" },
    { title: 'Malaka Spice',area: 'Vimannagar', address : 'Near temple', id: 6,  phone : 7767656789,source : "img/mala.jpg" }
  ];
  this.transactions = [
    { title: 'Kalyan Bhel', balance: 130, area: 'Vimannagar', address : 'Near police station', id: 1, phone : 9988987676, source:"img/kalbhel.jpg" },
    { title: 'Chaitanyas Parathas', balance: 200, area: 'Vimannagar', address : 'Opposite Krishna Restaurant', id: 2,  phone : 9988987654,source : "img/chai.png" },
  ];
  this.transactionDetails = 
    { id: 1, balance: 130, title : 'Kalyan Bhel', area : 'Vimannagar', 
        breakup: [{date: (new Date()).toLocaleString(), points : 100, transType : 'Added'},{date: (new Date()).toLocaleString(), points : 60, transType : 'Added'},{date: (new Date()).toLocaleString(), points : 30, transType : 'Deducted'}]  
    }
})