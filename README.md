# Apps-Script-Gmail-Push-Notifications
A very rough example on how to get push notification from gmail in Google Apps Script

Some setup notes:
For this to work you must first publish your script as a draft to the chrome webstore. Then in the dev console add your scripts published webapp URL without the trailing '/exec' to APIs & Auth -> Push

Enable the APIs: Google Cloud Pub/Sub and Gmail Api

This uses the Oauth2 Library for authentication:  
https://github.com/googlesamples/apps-script-oauth2

0) run as webapp pointing to CloudAuthWindow();  
1)makeTopic()  
2)subscribe()  
3)grantPublishRights()  
4)run as web app pointing to GmailAuthWindow()
5) enrollEmail() must be ran atleast one a week to remail active.
5)Logging will start at this point.
