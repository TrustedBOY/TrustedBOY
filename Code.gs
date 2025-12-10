//must be inplemented in "https://script.google.com"

function doGet(e) {
  return HtmlService.createHtmlOutput("OK");
}

function doPost(e) {
  var name = e.parameter.name;
  var email = e.parameter.email;
  var message = e.parameter.message;

  var recipient = "amirsaebi.05@gmail.com";
  var subject = "New Message from TrustedBOY Website";

  var body =
    "Name: " + name + "\n" +
    "Email: " + email + "\n" +
    "Message: " + message + "\n\n" +
    "Sent at: " + new Date() + "\n\n\n\n" +
    "#contact_handler";

  GmailApp.sendEmail(recipient, subject, body);

  return HtmlService.createHtmlOutput("OK");
}