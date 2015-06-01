var TOPIC = "projects/api-project-772466249334/topics/gmailPush";
var SUBSCRIPTION = "projects/api-project-772466249334/subscriptions/myGmailNotification";

function pubsubService() {
  return OAuth2.createService('cloud')
      .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
      .setTokenUrl('https://accounts.google.com/o/oauth2/token')
      .setClientId(PropertiesService.getScriptProperties().getProperty('client_id'))
      .setClientSecret(PropertiesService.getScriptProperties().getProperty('client_secret'))
      .setCallbackFunction('serverAuthCallback')
      .setPropertyStore(PropertiesService.getScriptProperties())
      .setScope('https://www.googleapis.com/auth/pubsub')
      .setParam('login_hint', Session.getActiveUser().getEmail())
      .setParam('access_type', 'offline')
      .setParam('approval_prompt', 'force');
}


function CloudAuthWindow() {
  var cloudService = pubsubService();
  if (!cloudService.hasAccess()) {
    var authorizationUrl = cloudService.getAuthorizationUrl();
    var template = HtmlService.createTemplate(
        '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. ');
    template.authorizationUrl = authorizationUrl;
    var page = template.evaluate();
  return page;
  } else {
  return HtmlService.createHtmlOutput("Service already authorized");
  }
}

function serverAuthCallback(request) {
  var cloudService = pubsubService();
  var isAuthorized = cloudService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}





function makeTopic(){
  
  var options = {method:"PUT",
                 headers:{"Authorization": "Bearer "+pubsubService().getAccessToken()},
                 muteHttpExceptions:true,
                 contentType:"application/json"                 
                }
  var url = "https://pubsub.googleapis.com/v1beta2/"+TOPIC;
  var results = UrlFetchApp.fetch(url, options);  
  Logger.log(results)
  
}



function subscribe(){
  
  
  var payload = {
    "topic": TOPIC, 
    "pushConfig": {
      "pushEndpoint": "https://script.google.com/a/macros/ccsknights.org/s/AKfycbzuFMYaUBq4J7T31az-gEjRMbhBKB0Ad6qGMqbEGujfNR6WN5E/exec"
    }
  };
  
  
  var options = {method:"PUT",
                 headers:{"Authorization": "Bearer "+pubsubService().getAccessToken()},
                 muteHttpExceptions:true,
                 contentType:"application/json",
                 payload:JSON.stringify(payload)
                 
                }
  var url = "https://pubsub.googleapis.com/v1beta2/"+SUBSCRIPTION;
  var results = UrlFetchApp.fetch(url, options);  
  Logger.log(results)
  
  
}



function grantPublishRights(){
  
  var url = "https://pubsub.googleapis.com/v1beta2/"+TOPIC+":setIamPolicy";
  var payload = {
  "policy": {
    "bindings": [{
      "role": "roles/pubsub.publisher",
      "members": ["serviceAccount:gmail-api-push@system.gserviceaccount.com"],
    }],
  }
};
  
  
   
  var options = {method:"POST",
                 headers:{"Authorization": "Bearer "+pubsubService().getAccessToken()},
                 muteHttpExceptions:true,
                 contentType:"application/json",
                 payload:JSON.stringify(payload)
                 
                }
  
   var results = UrlFetchApp.fetch(url, options);  
  Logger.log(results);
  
}


function enrollEmail(){
 
  
  var url = "https://www.googleapis.com/gmail/v1/users/me/watch"


var payload = {
  topicName: TOPIC  
}
  
var options = {method:"POST",
                 headers:{"Authorization": "Bearer "+gmailAccountService().getAccessToken()},
                 muteHttpExceptions:true,
                 contentType:"application/json",
                 payload:JSON.stringify(payload)
                 
                }
  
   var results = UrlFetchApp.fetch(url, options);  
  Logger.log(results);

  
}
