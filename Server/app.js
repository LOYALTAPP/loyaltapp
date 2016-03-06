var qr = require('qr-image');
var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var crypto = require("crypto"),algorithm = 'aes-256-ctr',password = 'd6F3Efeq';

app.use(bodyParser());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers', 
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
  );
  if ('OPTIONS' === req.method) {
    res.status(200).end();
  } else {
    next();
  }
});
//apis for merchants
app.post("/scan", function(req, res){
  var qrCode = req.body.qrCode;
  var decryptedQrCode = decrypt(qrCode);
  var splitQrcode = decryptedQrCode.split("|~|");
  //get the details from databse and return json
  var userDetails = {};
  userDetails.email = splitQrcode[0];
  userDetails.name = splitQrcode[1];
  userDetails.balance = 400; 
  res.json(userDetails);
});
app.post("/updateUserPoints", function(req, res){
  //this method will update the points in users cards
  //1. get the useremail from the req
  //2. get the balance from the username
  //3. get points from the req and the type of update(1.add 2.redeem)
  //4. if the req is 1.add, add the points to the balance of the user
  //5. if the req is 2.redeem, remove the points from the balance of the user.
});
app.post("/updateProfilePersonal", function(req, res){
  //this method will update the merchants profile
  //update merchants personal profile with the following information
  //address, mobile, landline, merchant image
});
app.post("/updateProfilePoints",function(req, res){
  //this method will update the merchants points profile
});
app.post("/MerchantTransactions", function(req, res){
  //this method will get the merchant transactions
  var merchantEmail = req.body.email;
  //in case merchant is looking for a transaction for a particular user
  var useremail = req.body.useremail;
  //in case merchant is looking for a transactions withina particular date
  var fromDate = req.body.fromDate;
  var toDate = req.body.toDate;
  //get the transaction details from database and sent it to the merchant
});
/*encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}*/
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password);
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}
//apis for users
api.get("/merchants",function(req, res){
  //get all the merchants
  var searchTerm = req.params.searchTerm;
  //get merchants based on searchTerm or all merchants
});
api.post("/updateUserProfile", function(req, res){
  //update the user profile data
});
//method to generate teh qrcode
app.post("/genqr",function(req, res){
  var emailId = req.body.email;
  var name = req.body.name;
  console.log("data passed : " + emailId + " - " + name);
  //generate the card based on the emailidname and number
  var encryptedQRCode = encrypt(emailId + "|~|" + name);
  console.log("encrypted qrcode : " +  encryptedQRCode);
  var code = qr.image(encryptedQRCode, { type: 'svg' });
  res.type('svg');
  code.pipe(res);
});
/*var hw = encrypt("jayant4u@gmail.com|~|jayant")
console.log(hw);
// outputs hello world
console.log(decrypt(hw));*/
app.listen(8101);
//app.listen(process.env.PORT, process.env.IP);