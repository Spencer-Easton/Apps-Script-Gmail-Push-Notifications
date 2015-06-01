//This example uses the library: MJ5317VIFJyKpi9HCkXOfS0MLm9v2IJHf with the 'GSA' Identifier.

// Run once to setup notifications
function setupGmailPush(){
  var token = getAuthorizationToken("saToken", "admin@myDomain.com",["https://www.googleapis.com/auth/gmail.readonly","https://www.googleapis.com/auth/pubsub"]); 
  Logger.log(makeTopic(token.token));
  Logger.log(subscribe(token.token));  
  Logger.log(grantPublishRights(token.token));  
  
}
// this is how you would request a token and enroll the email to send push notifications
// enrollEmail must be called once a week to keep notifications enabled
function enrollUser() {
  var testToken = getAuthorizationToken("userToken", "user@myDomain",["https://www.googleapis.com/auth/gmail.readonly"]); 
  Logger.log(enrollEmail(testToken.token));
}

function getAuthorizationToken(tokenDesc,email,scopes){
  var cache = PropertiesService.getScriptProperties();    
  var token = JSON.parse(cache.getProperty(tokenDesc));
  var nowTime = parseInt((Date.now()/1000).toString().substr(0,10));
  
  
  if(!token || (parseInt(token.experation) < nowTime)){
    token = requestToken(email || token.email,scopes || token.scopes);
    if(scopes)token.scopes = scopes;
    if(email)token.email = email;
    cache.setProperty(tokenDesc,JSON.stringify(token));
  }
  
  return token;
}

function requestToken(email,scopes){    
  var myJwt = GSA.GAS_JWT(PropertiesService.getScriptProperties().getProperty('RSA_Key'),
                          scopes,
                          'yourServiceAcoountEmail@developer.gserviceaccount.com',
                          email);    
  myJwt.generateJWT().requestToken();
  return {"token":myJwt.getToken(),"experation":myJwt.getExperation()};
}
