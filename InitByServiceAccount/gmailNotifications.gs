var TOPIC = "projects/{SERVICE ACCOUNT PROJECTID}/topics/gmailPush";
var SUBSCRIPTION = "projects/{SERVICE ACCOUNT PROJECTID}/subscriptions/myGmailNotification";

function makeTopic(token, eBackoff){
  var eBackoff = eBackoff || 0;
  var options = {method:"PUT",
                 headers:{"Authorization": "Bearer "+token},
                 muteHttpExceptions:true,
                 contentType:"application/json"                 
                }
  var url = "https://pubsub.googleapis.com/v1beta2/"+TOPIC;
  Utilities.sleep(eBackoff);
  var results = UrlFetchApp.fetch(url, options);
  
  if(results.getResponseCode() != 200 &&  results.getResponseCode() != 409){
    if(eBackoff > 8000){
      throw new Error("Error creating topic");
    }
    if(eBackoff == 0){
      eBackoff = 500;
    }else{
      eBackoff *=2;      
    }
    results = makeTopic(eBackoff)
  }
  return results;
}



function subscribe(token, eBackoff){
  var eBackoff = eBackoff || 0;
  var payload = {
    "topic": TOPIC, 
    "pushConfig": {
      "pushEndpoint": "https://script.google.com/a/macros/ccsknights.org/s/AKfycbzuFMYaUBq4J7T31az-gEjRMbhBKB0Ad6qGMqbEGujfNR6WN5E/exec"
    }
  };
  
  var options = {method:"PUT",
                 headers:{"Authorization": "Bearer "+token},
                 muteHttpExceptions:true,
                 contentType:"application/json",
                 payload:JSON.stringify(payload)
                }
  Utilities.sleep(eBackoff);
  
  var url = "https://pubsub.googleapis.com/v1beta2/"+SUBSCRIPTION;
  var results = UrlFetchApp.fetch(url, options);    
  if(results.getResponseCode() != 200 && results.getResponseCode() != 409 ){
    if(eBackoff > 8000){
      throw new Error("Error creating subscription");
    }
    if(eBackoff == 0){
      eBackoff = 500;
    }else{
      eBackoff *=2;     
    }
    results = subscribe(eBackoff);  
  }
  return results;
}



function grantPublishRights(token, eBackoff){
  var eBackoff = eBackoff || 0;
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
                 headers:{"Authorization": "Bearer "+token},
                 muteHttpExceptions:true,
                 contentType:"application/json",
                 payload:JSON.stringify(payload)
                 
                }
  Utilities.sleep(eBackoff);
  var results = UrlFetchApp.fetch(url, options);  
   Logger.log("%s\n%s",results.getContentText(), results.getResponseCode());
   if(results.getResponseCode() != 200){
    if(eBackoff > 8000){
      throw new Error("Error granting publishing rights");
    }
    if(eBackoff == 0){
      eBackoff = 500;
    }else{
      eBackoff *=2;      
    }
    results = grantPublishRights(eBackoff)
  }
  
  return results;
  
}


function enrollEmail(usersToken,eBackoff){
  var eBackoff = eBackoff || 0;
  
  var url = "https://www.googleapis.com/gmail/v1/users/me/watch"
  
  
  var payload = {
    topicName: TOPIC  
  }
  
  var options = {method:"POST",
                 headers:{"Authorization": "Bearer "+usersToken},
                 muteHttpExceptions:true,
                 contentType:"application/json",
                 payload:JSON.stringify(payload)
                 
                }
  Utilities.sleep(eBackoff);
  var results = UrlFetchApp.fetch(url, options);  
  
   if(results.getResponseCode() != 200){
    if(eBackoff > 8000){
      throw new Error("Error enrolling Email");
    }
    if(eBackoff == 0){
      eBackoff = 500;
    }else{
      eBackoff *=2;      
    }
    results = enrollEmail(usersToken,eBackoff);
  }
  
  
  return results;
  
  
}
