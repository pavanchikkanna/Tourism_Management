console.log("om nama shivaya");
let http=require('http');
let express=require('express');
let mongoose=require('mongoose');
let bodyParser=require('body-parser');
let app=express();
let bp=bodyParser.json();
var nodemailer = require('nodemailer');

mongoose.connect('mongodb://pavan:chikka1998@ds123465.mlab.com:23465/karunadu');
//package document 
let packageschema=new mongoose.Schema(
    {
    "name":String,
    "type": String,
    "cost": Number,
    "duration": String,
    "depaturedate":Date,
    "depatureaddress":String,
    "icon":String,
    "slides": [String],
    "itinerary": [String],
    "description":String,
    "visitingplaces": [String]
    }
);
//booked package document ,which is the subdocument of user document
let bookingschema=new mongoose.Schema(
    {
       
                "packageId":String,
                "packagename":String,
                "packageicon":String,
                "depaturedate":Date,
                "enddate":Date,
                "depatureaddress":String,
                "duration":String,
                "dobooking":Date,
                "adults":Number,
                "children":Number,
                "totalcost":Number,
                "payment":{"cardno":Number,"cardname":String,"dateofexpire":Date,"cvc":String}
        
    }
);
//user document
let userschema=new mongoose.Schema(
    {  
        "accountname":String,
        "email":String,
        "password":String,
        "phone":Number,
        "dob":Date,
        "address":{"street":String, "city":String, "district":String },
        "bookedpackages":[bookingschema]
            
        

    }
);
userschema.index({"email":1},{unique:true});//making the email field as index in schema level


let packagesModel=new mongoose.model("packages",packageschema);

let usersModel=new mongoose.model("users",userschema);
let bookingmodel=new mongoose.model("booking",bookingschema);

console.log("server running @ 3000");


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.listen(3000);

//nodemailer
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'pavanravikumar1998@gmail.com',
      pass: '9902587276'
    }
  });
//this routing is used for sigin purpose
app.post("/signin",bp,function(req,res)
{
   let sigiinMessage="";
    console.log("signin called");
    console.log(req.body);
   usersModel.find({"email":req.body.email},'password',function(err,data)
   {
       if(data.length!=0)
       {console.log(data[0])
        if(data[0].password==req.body.password)
        {
            sigiinMessage=req.body.email;
        }
        else
        {
        sigiinMessage="invalidPassword"
       }
    }
       else
       sigiinMessage="invalidemail";
       res.send({"message":sigiinMessage})
   });
   ;
});

//this routing is used for retrieving all packages present in database
//and sorting the query based on the depaturedate in ascending order
app.get("/packages",function(req,res){
    packagesModel.find({},null,{sort: 'depaturedate'},function(err,data){
        
        res.json(data);
    });   
});

//this routing is used for querying the package documents present in packages collection based on the type field
app.post("/fetchBySearch",bp,function(req,res)
{
    console.log(req.body.searchdata);
    packagesModel.find({"type":req.body.searchdata},function(err,data)
    {
        console.log("search request")
        res.json(data);
    })
})



//this routing is used for querying the package document based on the _id field
app.post("/fetchById",bp,function(req,res){
    console.log("fetch by id called");
    console.log(req.body.packageId);
    packagesModel.find({"_id":req.body.packageId},function(err,data){
        
        res.json(data);
    });   
});

////this routing is not used
app.get("/logout",function(req,res)
{   
    
  
   console.log("detroyed successfully");

});

//this routing is used for signup
app.post("/newuser",bp,function(req,res)
{ var signupmssg="invalid"
  usersModel.find({"email":req.body.email},'password',function(err,data)
  {
      if(data.length==0)
      {var mailOptions = {
        from: 'pavanravikumar1998@gmail.com',
        to: req.body.email,
        subject: 'karunadu tourism',
        text: 'Thank you for registering with karunadu!'
      // html:
       //'<p><b>Thank you </b> for regitration</p>' 
       
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            signupmssg="InvalidEmail"
            res.send({"message":signupmssg})
        } else {
            usersModel(req.body).save(function(err,data)
        {
            console.log("added user");
            signupmssg="valid"
            res.send({"message":signupmssg})
        });
          console.log('Email sent: ' + info.response);
        }
      });
        
      }
      else
      res.send({"message":signupmssg})
  })
});

//this routing is used for querying profile details of the user
app.post("/profile",bp,function(req,res)
{
   
    
  
       usersModel.find({"email":req.body.email},function(err,data)
        {
           res.json(data);
            console.log(data);

       });
  
});
//this routing is used for updating the profile details of the user
app.post("/profileUpdate",bp,function(req,res)
{
    console.log(req.body);
    usersModel.findOneAndUpdate({"email":req.body.email},{$set:{"accountname":req.body.accountname,
       "dob":req.body.dob,
    
     "phone":req.body.phone,
    "address.street":req.body.address.street,
"address.city":req.body.address.city,
"address.district":req.body.address.district}},{new: true},function(err,data)
    {
 console.log(data);
 res.send({"message":"ok"})
    });
  
});

//this routing is used for inserting the current bookedpackage info into bookedpackages(subdocument)
//present in user document
app.post("/booking",bp,function(req,res)
{
    
    var dt=new bookingmodel(req.body.details);
    console.log(dt);
    usersModel.findOneAndUpdate({"email":req.body.email},{$push:{"bookedpackages":dt}},function(err,data)
    {
        res.send({"message":"ok"})
     
    });

});
//ths function is used for generating array of dates with the help of no. of days 
//and start date
var getDateArray = function(start, days) {
    var arr = new Array();
    var dt = new Date(start);
    while (days--!=0) {
        arr.push(new Date(dt));
        dt.setDate(dt.getDate() + 1);
    }
    return arr;
}
//this routing is used for checking whether  the current booking package journey dates are present in any other 
//already booked packages of that user
app.post("/checkclash",bp,function(req,res)
{
   var userselected=getDateArray(req.body.depaturedate,req.body.duration);
  console.log(userselected);
   usersModel.find({"email":req.body.email},function(err,data)
   {
       var sending="ok";
           for(var i=0;i<data.length;i++)
           {
               for(var j=0;j<data[i].bookedpackages.length;j++)
               {
                   var generated=getDateArray(data[i].bookedpackages[j].depaturedate,data[i].bookedpackages[j].duration);
                   console.log(generated);
                  for(var k=0;k<userselected.length;k++)
                  {
                      for(var m=0;m<generated.length;m++)
                      {
                          //console.log(generated[m]);
                         // console.log(userselected[k]);
                          if(generated[m].getDate()==userselected[k].getDate()&&generated[m].getMonth()==userselected[k].getMonth()&&generated[m].getFullYear()==userselected[k].getFullYear())
                         sending="not ok";
                          else
                          continue;
                      }
                  }
               }
           }
           res.send({"message":sending});  

});
});

//this routing is used for querying user booked packages
app.post("/mybookedpackages",bp,function(req,res)
{ 
    console.log("working")
    usersModel.find({"email":req.body.email},'bookedpackages',function(err,data)
    {


    res.json(data)
        console.log(data);

   });
});
//this routing is used for cancel bookedpackage
app.post("/cancelbooking",bp,function(req,res)
{
    console.log(req.body);
    usersModel.findOneAndUpdate({"email":req.body.email},{$pull:{"bookedpackages":{"_id":req.body.id}}},function(err,data)
    {
        
      res.send({"message":"ok"})
    });
});
