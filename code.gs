function doGet(){
  /* 
  
  
  Setup script in this order:
  0)run as webapp pointing to CloudAuthWindow();
  1)makeTopic()
  2)subscribe()
  3)grantPublishRights()  
  4)run as webapp pointing to GmailAuthWindow()
  */
  
  
  //return CloudAuthWindow() // run this once to get the token for the server
  return GmailAuthWindow(); // run this to enroll an email;
}




function doPost(e){
  var ss = SpreadsheetApp.openById('1YOhCmlvQm15EDEazuhI-FYevigeoB-lEgBEN0NYCdwo'); // change sheet id;
  var sheet = ss.getActiveSheet();
  
  var postdata = e.postData.getDataAsString();
  var message = Utilities.newBlob(Utilities.base64Decode(JSON.parse(postdata).message.data)).getDataAsString();
  var emailData = getHistoryData(JSON.parse(message).historyId); // not useful like this. Need to get last historyId for meaningful data;
  sheet.appendRow([new Date(), message,emailData]); 
  
  
  return 200;
  
}




function getHistoryData(historyId){
  var url = "https://www.googleapis.com/gmail/v1/users/me/history?startHistoryId="+historyId;
  var params =  {method:"GET",
                 headers:{"Authorization":"Bearer " + gmailAccountService().getAccessToken()},
                 contentType:"application/json",
                 muteHttpExceptions:true
                }
  var results = UrlFetchApp.fetch(url,params);
  return results.getContentText();
  
  
}
