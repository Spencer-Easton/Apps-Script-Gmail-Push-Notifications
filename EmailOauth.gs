function gmailAccountService() {
  return OAuth2.createService('cloud')
      .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
      .setTokenUrl('https://accounts.google.com/o/oauth2/token')
      .setClientId(PropertiesService.getScriptProperties().getProperty('client_id'))
      .setClientSecret(PropertiesService.getScriptProperties().getProperty('client_secret'))
      .setCallbackFunction('clientAuthCallback')
      .setPropertyStore(PropertiesService.getUserProperties())
      .setScope('https://www.googleapis.com/auth/gmail.readonly')
      .setParam('login_hint', Session.getActiveUser().getEmail())
      .setParam('access_type', 'offline')
      .setParam('approval_prompt', 'force');
}


function GmailAuthWindow() {
  var gmailService = gmailAccountService();
  if (!gmailService.hasAccess()) {
    var authorizationUrl = gmailService.getAuthorizationUrl();
    var template = HtmlService.createTemplate(
        '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. ');
    template.authorizationUrl = authorizationUrl;
    var page = template.evaluate();
  return page;
  } else {
  return HtmlService.createHtmlOutput("Service already authorized");
  }
}

function clientAuthCallback(request) {
  var gmailService = gmailAccountService();
  var isAuthorized = gmailService.handleCallback(request);
  if (isAuthorized) {
    enrollEmail();
    return HtmlService.createHtmlOutput('Success! You can close this tab.  ');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}

