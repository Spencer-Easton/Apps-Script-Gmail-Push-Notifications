function doGet(){
  // return pubsubService() // run this once to get the token for the server
  return GmailAuthWindow(); // run this to enroll an email;
}




function doPost(e){
  var ss = SpreadsheetApp.openById('1YOhCmlvQm15EDEazuhI-FYevigeoB-lEgBEN0NYCdwo');
  var sheet = ss.getActiveSheet();
  
  var postdata = e.postData.getDataAsString();
  var message = Utilities.newBlob(Utilities.base64Decode(JSON.parse(postdata).message.data)).getDataAsString();
  var emailData = getHistoryData(JSON.parse(message).historyId);
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
