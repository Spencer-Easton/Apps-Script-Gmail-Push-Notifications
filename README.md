# Apps-Script-Gmail-Push-Notifications
A very rough example on how to get push notification from gmail in Google Apps Script

note: I added a initByServiceAccount folder. In there you can see an example on how to create the notiofication pub/sub and enroll users in your domain.

Some setup notes:
For this to work you must first publish your script as a draft to the chrome webstore. Then in the dev console add your scripts published webapp URL without the trailing '/exec' to APIs & Auth -> Push

This uses the Oauth2 Library for authentication:
MswhXl8fVhTFUH_Q3UOJbXvxhMjh3Sh48  
https://github.com/googlesamples/apps-script-oauth2

Enable the APIs: Google Cloud Pub/Sub and Gmail Api  
Generate web credentials. Add the client_id and client_secret to the script properties.

Change the TOPIC and SUBSCRIPTION strings for your own project id, topic and subscriptions names. The names can be whatever you choose and are simply frendly names to use for reference.

var TOPIC = "projects/{Your Dev Console ProjectId}/topics/{Topic Name}";   
var SUBSCRIPTION = "projects/{Your Dev Console ProjectId}/subscriptions/{Subscription Name}";

0) run as webapp pointing to CloudAuthWindow();  
1)makeTopic()  
2)subscribe()  
3)grantPublishRights()  
4)run as web app pointing to GmailAuthWindow()  
5)Logging will start at this point.  
6) enrollEmail() must be ran atleast one a week to remain active.  

