
//index page
var homeapp=angular.module("home",[]);
homeapp.controller("homeController",function($scope,$window)
{
  $scope.checksession=function() //checking for the session when the viewall button is clicked
  { 
    if($window.localStorage.getItem("userEmail"))
    {
      $window.location.href="packages.html"
    }
    else
   $window.location.href="login.html"
  }
  $scope.district=function()//if district image is clicked then store the relevant info in local storage
  {
    
  $window.localStorage.setItem('search','district');
    $window.location.href="packages.html";
  };
  $scope.nature=function()//if nature image is clicked then store the relevant info in local storage
  {
   
    $window.localStorage.setItem('search','nature');
    $window.location.href="packages.html";
  };
  $scope.historical=function()//if historical image is clicked then store the relevant info in local storage
  {
    
    $window.localStorage.setItem('search','historical');
    $window.location.href="packages.html";
  };
  $scope.devotional=function()//if devotional image is clicked then store the relevant info in local storage
  {
   
    $window.localStorage.setItem('search','devotional');
    $window.location.href="packages.html";
  };
  $scope.wildlife=function()//if wildlife image is clicked then store the relevant info in local storage
  {
   
    $window.localStorage.setItem('search','wildlife');
    $window.location.href="packages.html";
  };
  $scope.premium=function()//if premium image is clicked then store the relevant info in local storage
  {
   
    $window.localStorage.setItem('search','premium');
    $window.location.href="packages.html";
  };

});
homeapp.controller("navctrl",function($scope,$window)
{//this controller is used for making dynamic changes in navigation bar by checking session
  if($window.localStorage.getItem("userEmail"))
  {
    $scope.usericon=true;//show the usericon
  }
  else{
    $scope.loginRegister=true;//show login|register nav-item
  }
  $scope.logout=function() //ending the session
  {
    $window.localStorage.removeItem("userEmail");
   $window.location.href="index.html";
  }

});

//index page

//this for single page application 
//pages included in SPA are packages.html,load.html,discription.html and booking.html 
var app=angular.module("myapp",["ngRoute"]);
app.config(function($routeProvider){
  $routeProvider.when("/",{
      templateUrl:"load.html"
  }).when("/booking:packageId",{
    controller:"bookingController",
    templateUrl:"booking.html"
  }).when("/description:packageId",{
      controller:"descriptionController",
      templateUrl:"description.html"
  });
  });
//this controller is present in packages.html
app.controller("pkgsctrl",function($scope,$http,$window)
{
  if($window. localStorage.getItem("userEmail"))
  {
 //checking whether user as stored any info in localstorage ie; whether they are asking any particular type of packages
  //if any particular type of packages are asking then query the packages collection based on that type
  if(!$window.localStorage.getItem('search'))
 {
  
  $http.get("http://localhost:3000/packages").then(function(response){
  
  $scope.packages=response.data;
    
});
  

 } 
 else
 {
   let data={"searchdata":$window.localStorage.getItem('search')};
   $scope.searchbox=$window.localStorage.getItem('search');
   $window.localStorage.removeItem('search');
   $http.post("http://localhost:3000/fetchBySearch",data).then(function(response)
   {
     if(response.data.length!=0)
     {$scope.packages=response.data
      $scope.noResults=false;
     }
     else
     {$scope.packages=response.data
       $scope.noResults=true;
     }

   });
 }
 //this function is used for search system
 $scope.searching=function()
 {
   let data={"searchdata":$scope.searchbox};
   $http.post("http://localhost:3000/fetchBySearch",data).then(function(response)
   {
    if(response.data.length!=0)
     {$scope.packages=response.data
      $scope.noResults=false;
     }
     else
     {
      $scope.packages=response.data
       $scope.noResults=true;
     }


   });
 }
  }
  else
  {
    $window.location.href="login.html"
  }
 

});

app.controller("logctrl",function($scope,$window)
{
$scope.logout=function()
{
 $window.localStorage.removeItem("userEmail");
 $window.location.href="index.html";
}

  
});
//this controller is present in description.html 
app.controller("descriptionController",function($scope,$http,$routeParams,$window){

  if($window. localStorage.getItem("userEmail"))
  {
    let data={"packageId":$routeParams.packageId};
    $http.post("http://localhost:3000/fetchById",data).then(function(response){
      //formating the date to dd/mm/yyy because it is in UTC format
    let d=new Date(response.data[0].depaturedate);
    let enddate=new Date(response.data[0].depaturedate);
    let visitingplaces="";
    response.data[0].depaturedate=d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear();  
    for(var i=1;i<=response.data[0].duration;i++)
    {
       enddate.setDate(enddate.getDate()+1)
    }
    response.data[0].enddate=enddate.getDate()+'/'+(enddate.getMonth()+1)+'/'+enddate.getFullYear();
    for(var j=0;j<response.data[0].visitingplaces.length;j++)
     visitingplaces=visitingplaces+","+response.data[0].visitingplaces[j];
     response.data[0].places=visitingplaces;
    $scope.details=response.data;
      console.log("given");
      
  });
  }
  else
  {
    $window.location.href='login.html'
  }


});
//this controller is present in booking.html
 app.controller("bookingController",function($scope,$http,$routeParams,$window)
 {
  if($window. localStorage.getItem("userEmail"))
  {
    let data={"packageId":$routeParams.packageId};
    var total;
    var adultprice;
    var childprice=0;
    var duration;
    var depatureaddress;
    var depaturedate;
    var packagename;
    var icon;
    //get the info of a booking package and hold those data in above variables
    $http.post("http://localhost:3000/fetchById",data).then(function(response){
     var details=response.data;
    
   for(var i=0;i<details.length;i++)
   {
    $scope.price=details[i].cost;
    duration=details[i].duration;
    depatureaddress=details[i].depatureaddress;
    depaturedate=details[i].depaturedate;
    packagename=details[i].name;
    icon=details[i].icon;
    total=$scope.price;
    adultprice=total;
   }
   });
   // - button of number of adults
   $scope.decradult=function()
   {
     if(($scope.countad)-1==0)
     $scope.countad=1;
     else
     
       $scope.countad--;
     adultprice=total*$scope.countad;
     $scope.price=adultprice+childprice;
   
  }
  // + button of number of adults
   $scope.incradult=function()
   {
    $scope.countad++;
    adultprice= total*$scope.countad;
    $scope.price=adultprice+childprice;
   }
   // + button of number of children
   $scope.incrchild=function()
   {
    $scope.countcd++;
    childprice=total*$scope.countcd*0.5;
    $scope.price=adultprice+childprice;
   }
   // - button of number of children
   $scope.decrchild=function()
   {
     if(($scope.countcd)-1<0)
     $scope.countcd=0;
     else
     $scope.countcd--;
     childprice=total*$scope.countcd*0.5;
     $scope.price=adultprice+childprice;
   }
   //this function is used for checking whether the current booking package journey dates are present in any other
   //already booked packages of that user 
   $scope.dateclash=function()
   {
     let data={
       "duration":duration,
       "depaturedate":depaturedate,
       "email":$window.localStorage.getItem("userEmail")
     }
    $http.post("http://localhost:3000/checkclash",data).then(function(response)
    {
      if(response.data.message=="not ok")
      $scope.sorry=true;
      else
      $scope.payment=true;
        $scope.paybutton=true;  
    });
    
   }
  //if their is no dateofclash then this function will be called
  $scope.submitbooking=function()
  { $scope.errormessage=false;
    
     
      var enddate=new Date(depaturedate);
    for(var j=1;j<=duration;j++)
    {
       enddate.setDate(enddate.getDate()+1)
    }
  
    let data={
                  "email":$window.localStorage.getItem("userEmail"),
                  "details":{
                    "packageId":$routeParams.packageId,
                    "packagename":packagename,
                    "packageicon":icon,
                    "enddate":enddate,
                    "depaturedate":depaturedate,
                    "depatureaddress":depatureaddress,
                    "duration":duration,
                    "adults":$scope.countad,
                    "children":$scope.countcd,
                    "dobooking": new Date(),
                    "totalcost":$scope.price,
                    "payment":{"cardno":$scope.cardno,"cardname":$scope.cardname,"dateofexpire":$scope.dateofexpire,"cvc":$scope.cvc}
                  }
    }
    $http.post("http://localhost:3000/booking",data).then(function(response)
    {
          if(response.data.message=="ok")
          $window.location.href="bookedpackages.html";
  
    });
    }
  
  }
  else
  {
    $window.location.href="login.html"
  }
 


});
//this for single page application 



//login page 
var loginapp=angular.module("myloginapp",[]);
loginapp.controller("signinctrl",function($scope,$http,$window,$rootScope)
{//validate and store the email in localStorage
  $scope.checkuser=function()
  {
    let data={
      "email":$scope.Email,
      "password":$scope.password
    } ;

    $http.post("http://localhost:3000/signin",data)
    .then(function(response){
        
     
        if(response.data.message=="invalidemail")
        {
          $rootScope.messageData="Invalid Email";
          $rootScope.sssiginmessage=true;
    
        }
    else if(response.data.message=="invalidPassword")
    {
      
      $rootScope.messageData="Invalid Password";
      $rootScope.sssiginmessage=true;
  
    }
         
    else
        {

          $window.localStorage.setItem("userEmail",response.data.message);
          $window.location.href="index.html";

        }
        
       
        
    });
    

  }
 
    
});

loginapp.controller("signupctrl",function($scope,$http,$rootScope)
{//validate and adduser to database
    $scope.newuser=function()
    {
      let data={

        "email":$scope.emailgiven,
        "password":$scope.password,
        "accountname":$scope.accountname,
        "address":{"street":" ", "city":" ", "district":" " }
      }
      $http.post("http://localhost:3000/newuser",data)
      .then(function(response){
          if(response.data.message=="valid")
          {
            $rootScope.sssigup1message=false;
            $rootScope.invalidEmail=false;
            $rootScope.sssigupmessage=true;
            $scope.emailgiven=null;
            $scope.accountname=null;
            $scope.password=null;
          }
          else if(response.data.message=="InvalidEmail")
          { $rootScope.sssigup1message=false;
            $rootScope.sssigupmessage=false;
           $rootScope.invalidEmail=true
          }
          else
          {
            $rootScope.sssigupmessage=false;
            $rootScope.invalidEmail=false;
            $rootScope.sssigup1message=true;
          }
        
      });
    }
});

//login page


//profile.html page
var profileapp=angular.module("profile",[]);

profileapp.controller("profilectrl",function($scope,$http,$window)
{ 
  
  if($window.localStorage.getItem("userEmail"))
  {
     //retrieve the basic details of the user and keep track any changes to the input fields
     let data={"email":$window.localStorage.getItem("userEmail")}
     $http.post("http://localhost:3000/profile",data).then(function(response){
   
      $scope.accountname=response.data[0].accountname;
      $scope.phone=response.data[0].phone;
   let d =new Date(response.data[0].dob);
     $scope.dob=d;
      $scope.street=response.data[0].address.street;
      $scope.city=response.data[0].address.city;
      $scope.district=response.data[0].address.district;
   });

$scope.savechanges=function()
{
  var data ={
   
    "accountname":$scope.accountname,
    "email":$window.localStorage.getItem("userEmail"),
    
    "phone":$scope.phone,
    "dob":$scope.dob,
  
    "address":{"street":$scope.street, "city":$scope.city, "district":$scope.district }
  }
  $http.post("http://localhost:3000/profileUpdate",data).then(function(response)
  {
         if(response.data.message=="ok")
         {
              $window.location.href="profile.html";
    
         }
       
  });
 
} ; 

$scope.resetchanges=function()
{
 $window.location.reload();
};
    
  }
 else
 {
   $window.location.href="login.html"
 }

});
profileapp.controller("logctrl",function($window,$scope)
{
  $scope.logout=function()
  {
   $window.localStorage.removeItem("userEmail");
   $window.location.href="index.html";
  }
  
});
//profile.html page

//bookedpackages.html page
var bookedapp=angular.module("mybookings",[]);

bookedapp.controller("mybkgctrl",function($scope,$http,$window){

  if($window. localStorage.getItem("userEmail"))
  {
    var cancelling=[];//this array is used for storing packages which still have cancellation options
    var noncancelling=[];//this array is used for storing packages which doesnot have cancellation options
    let data={"email":$window.localStorage.getItem("userEmail")}
    var today=new Date();
    var tomorrow=new Date();
    tomorrow.setDate(tomorrow.getDate()+1);
      $http.post("http://localhost:3000/mybookedpackages",data).then(function(response)
      {
       if(response.data[0].bookedpackages.length<=0)
       {
             $scope.empty=true;
       }
       else
       {
        for(var i=0;i<response.data[0].bookedpackages.length;i++)
        {
          var d= new Date(response.data[0].bookedpackages[i].dobooking);
          d.setDate(d.getDate()+1);
          if((d.getDate()==today.getDate()||d.getDate()==tomorrow.getDate())&&(d.getMonth()==today.getMonth()||d.getMonth()==tomorrow.getMonth())&&(d.getFullYear()==today.getFullYear()||d.getFullYear()==tomorrow.getFullYear()))
          {let dobooking=new Date(response.data[0].bookedpackages[i].dobooking);
            let depaturedate=new Date(response.data[0].bookedpackages[i].depaturedate);
            let enddate=new Date(response.data[0].bookedpackages[i].enddate)
            response.data[0].bookedpackages[i].dobooking=dobooking.getDate()+'/'+(dobooking.getMonth()+1)+'/'+dobooking.getFullYear();
            response.data[0].bookedpackages[i].depaturedate=depaturedate.getDate()+'/'+(depaturedate.getMonth()+1)+'/'+depaturedate.getFullYear();
            response.data[0].bookedpackages[i].enddate=enddate.getDate()+'/'+(enddate.getMonth()+1)+'/'+enddate.getFullYear();
            cancelling.push(response.data[0].bookedpackages[i]);
          }
          else
         {
          let dobooking=new Date(response.data[0].bookedpackages[i].dobooking);
          let depaturedate=new Date(response.data[0].bookedpackages[i].depaturedate);
          let enddate=new Date(response.data[0].bookedpackages[i].enddate)
          response.data[0].bookedpackages[i].dobooking=dobooking.getDate()+'/'+(dobooking.getMonth()+1)+'/'+dobooking.getFullYear();
          response.data[0].bookedpackages[i].depaturedate=depaturedate.getDate()+'/'+(depaturedate.getMonth()+1)+'/'+depaturedate.getFullYear();
          response.data[0].bookedpackages[i].enddate=enddate.getDate()+'/'+(enddate.getMonth()+1)+'/'+enddate.getFullYear();
         
    
         noncancelling.push(response.data[0].bookedpackages[i])
         } 
        }
    $scope.cancelling=cancelling;
    $scope.noncancelling=noncancelling;
       }
    
      });
      //if cancel button is clicked 
      $scope.cancellation=function(id)
    {
      if (confirm("Are sure want to cancel ")) {
        let data={
           'id':id,
          "email":$window.localStorage.getItem("userEmail") }
           $http.post("http://localhost:3000/cancelbooking",data).then(function(response)
           {
                if(response.data.message=="ok")
                $window.location.href="bookedpackages.html";
    
           });
    
      } else {
        
      }
    }
  }
  else
  {
    $window.location.href="login.html"
  }


});
bookedapp.controller("logctrl",function($window,$scope)
{
  $scope.logout=function()
{
 $window.localStorage.removeItem("userEmail");
 $window.location.href="index.html";
}

});
//bookedpackages.html page


//aboutus page 
var aboutapp=angular.module("aboutus",[])
aboutapp.controller("abt_nav_ctrl",function($window,$scope)
{//this controller is used for making dynamic changes in navigation bar by checking session
  if($window. localStorage.getItem("userEmail"))
  {
    $scope.usericon=true;//show the usericon
  }
  else{
    $scope.loginRegister=true;//show login|register nav-item
  }
  $scope.logout=function() //ending the session
  {
    $window.localStorage.removeItem("userEmail");
   $window.location.href="index.html";
  }

});
aboutapp.controller("messagectrl",function($scope,$http)
{
  $scope.send=function()
  {
    let data={
      "name":$scope.name,
      "email":$scope.email,
      "subject":$scope.subject,
      "message":$scope.message
    }
    $http.post("http://localhost:3000/contactus",data).then(function(response)
           {
                if(response.data.message=="ok")
                $scope.successalert=true;
               else
               $scope.dangeralert=true;
    
           });
  }
})

//reset.html
var resetapp=angular.module("reset",[]);
resetapp.controller("logctrl",function($window,$scope)
{
  $scope.logout=function() //ending the session
  {
    $window.localStorage.removeItem("userEmail");
   $window.location.href="index.html";
  }
})
resetapp.controller("resetctrl",function($window,$scope,$http)
{
 if($window.localStorage.getItem("userEmail"))
 {
  $scope.updatepswd=function()
  {
    if($scope.Email==$window.localStorage.getItem("userEmail"))
    {
      let data={
        "email":$scope.Email,
        "password":$scope.password
      } ;
      $http.post("http://localhost:3000/resetpswd",data).then(function(response)
           {
                if(response.data.message=="ok")
                $scope.successalert=true;
                $scope.dangeralert=false;
    
           });
    }
    else
    {
     $scope.dangeralert=true;
     $scope.successalert=false;
    }

  }
 }
 else
 {
   $window.location.href="login.html"
 }
})


//reset.html


