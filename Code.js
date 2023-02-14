var urlMatrix = "https://docs.google.com/spreadsheets/d/1NccGUWEashvVzXSQlaJPEkhlKGcMofqW11tNf4UFr8Y/";
var sSheetMatrix = SpreadsheetApp.openByUrl(urlMatrix);
var clientSheet = sSheetMatrix.getSheetByName("CLIENTS");
var countySheet = sSheetMatrix.getSheetByName("COUNTY");
var deletedClientsSheet = sSheetMatrix.getSheetByName("deletedCLIENTS");

function doGet(e){ 
  let temp = "MainPage/IndexPage";
  if('temp' in e.parameters){    
    temp = e.parameters['temp'][0];
    console.log(temp);
  }
  try{
    console.log(temp);

    const html = HtmlService.createTemplateFromFile(temp);
    var output = html.evaluate().setTitle("Wizer Energy LTD");
    output.addMetaTag('viewport','width = device-width, initial-select');

    return output;
  }
  catch(err){
    return ContentService.createTextOutput(JSON.stringify(err));
  }
  /*
  var html = HtmlService.createTemplateFromFile("MainPage/IndexPage");
  var output = html.evaluate().setTitle("Wizer Energy LTD");
  output.addMetaTag('viewport','width = device-width, initial-select');
  //console.log(output);
  return output;
  */
 /*
  if(e.queryString !=='')
  {
    switch(e.target.id)
    {
      case "Customer-Page":
        setPage("Customer-Page");
        return HtmlService
          .createTemplateFromFile("MainPage/CustomerInfo/CustomerPage")
          .evaluate()
          .addMetaTag('viewport','width = device-width, initial-select')
          .setTitle("Wizer Energy LTD");
        break;
      default:
        setPage("MainPage/IndexPage");
        return HtmlService
          .createTemplateFromFile("MainPage/IndexPage")
          .evaluate()
          .addMetaTag('viewport','width = device-width, initial-select')
          .setTitle("Wizer Energy LTD");
        break;
    }
  }
  else
  {
    setPage("MainPage/IndexPage");
    return HtmlService
      .createTemplateFromFile("MainPage/IndexPage")
      .evaluate()
      .addMetaTag('viewport','width = device-width, initial-select')
      .setTitle("Wizer Energy LTD");
  }
  */
}

function getScriptUrl(){
  const url = ScriptApp.getService().getUrl();
  return url;
}
function includeHeaderHTML(fileName){
  const url = getScriptUrl();
  let html = HtmlService.createHtmlOutputFromFile(fileName).getContent();
  html = html.replace(/\?temp/g, url+'?temp');

  return html;
}

function includeHTML(fileName){
  //return HtmlService.createHtmlOutputFromFile(fileName).getContent();
  var output = HtmlService.createTemplateFromFile(fileName).evaluate().getContent();
  return output;
}

function obtenerContenidoHTML(page){
  //const contenidoHTML = HtmlService.createHtmlOutputFromFile(page).getContent();
  console.log(page);

  switch(page)
    {
      case "Customer-Page":
        setPage("Customer-Page");
        return HtmlService
          .createTemplateFromFile("MainPage/CustomerInfo/Customer-Page")
          .evaluate()
          .addMetaTag('viewport','width = device-width, initial-select')
          .setTitle("Wizer Energy LTD");
        break;
      default:
        setPage("MainPage/IndexPage");
        return HtmlService
          .createTemplateFromFile("MainPage/IndexPage")
          .evaluate()
          .addMetaTag('viewport','width = device-width, initial-select')
          .setTitle("Wizer Energy LTD");
        break;
    }  
  //var contenidoHTML = HtmlService.createTemplateFromFile(urlPage).evaluate().getContent();
  //return contenidoHTML;
}
// -----------------------------------------
function uploadFiles(obj){
  
  var url ="1DqkJ7OikWfdtMdFMskQcZy3mBCyIpOj5";
  Logger.log("star");
  var file = Utilities.newBlob(obj.bytes, obj.mimeType, obj.filename);
  
  var folder = DriveApp.getFolderById(url);
  
  var createFile = folder.createFile(file);
  
  return createFile.getId();

}
//---------------------------------------------
function addNewClient(form){

  //Logger.log(form);

  const clientId = getNewID(clientSheet);
  const clientNumber = form.clientName;
  const clientEmail = form.clientEmail;
  const clientPhoneNumber = form.clientPhoneNumber;
  const clientAddress = form.clientAddress;
  const clientCounty = form.clientCounty;
  const clientEirCode = form.clientEirCode;
  const clientMPRN = form.clientMPRNNumber;
  const clientBuiltYear = form.clientBuiltYear;
  const clientDescription = form.clientDescription;
  const clientInfoLog = "Created " + Date();
  //Logger.log([clientSPVNumber,clientNumber,clientEmail,clientPhoneNumber,clientAddress,clientCounty,clientEirCode,clientMPRN,clientBuiltYear,clientDescription]);

  clientSheet.appendRow([
    clientId,
    clientNumber,
    clientEmail,
    clientPhoneNumber,
    clientAddress,
    clientCounty,
    clientEirCode,
    clientMPRN,
    clientBuiltYear,
    clientDescription,
    clientInfoLog,
    1
  ]);

  return "Client added";
}

function getNewID(sheet){
  let id = 1;

  if(sheet.getLastRow() === 1)
  {
    return id;
  }
  
  const ids = sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues().map(id =>id[0]);
  let maxId = 0;

  ids.forEach(id =>{
    if(id > maxId){
      maxId = id;
    }
  } );

  return maxId + 1;
}
//----------------------------------------------------------------

function readClients(){
  const dataClients = clientSheet.getDataRange().getDisplayValues();
  dataClients.shift();                                                 //remueve primer elemento del excel (titulos de columnas)

  if(dataClients.length === 0){
    return "No Clients Info";
  }

  return dataClients;
}

function readClientsNew(){
  const dataClients = clientSheet.getDataRange().getDisplayValues();
  dataClients.shift();                                                 //remueve primer elemento del excel (titulos de columnas)

  if(dataClients.length === 0){
    return "No Clients Info";
  }
  
  var dataReturn = new Array();
  
  dataClients.forEach(client =>{
    if(client[11] == 1){
      var row = {
                  clientID: client[0],
                  Name: client[1],
                  Email: client[2],
                  Phone: client[3],
                  Address: client[4],
                  County: client[5],
                  EirCode: client[6],
                  MPRN: client[7],
                  BuiltYear: client[8],
                  Description: client[9],
                  TimeStamp: client[10],
                  Active: client[11]
      };
      dataReturn.push(row);
    }    
  });
  return dataReturn;
}
//----------------------------------------------------------------

function readCounties(){
  const dataCounties = countySheet.getDataRange().getDisplayValues();
  dataCounties.shift();

  if(dataCounties.length === 0){
    return "There is no county saved";
  }

  return dataCounties;
}
//----------------------------------------------------------------

function editClient(form){
  //console.log(form);
  const clientId = parseInt(form.clientId) + 1;
  const clientNumber = form.clientName;
  const clientEmail = form.clientEmail;
  const clientPhoneNumber = form.clientPhoneNumber;
  const clientAddress = form.clientAddress;
  const clientCounty = form.clientCounty;
  const clientEirCode = form.clientEirCode;
  const clientMPRN = form.clientMPRNNumber;
  const clientBuiltYear = form.clientBuiltYear;
  const clientDescription = form.clientDescription;
  const clientInfoLog = "Edited on " + Date();
  
  clientSheet.getRange(clientId,1).setValue(form.clientId);
  clientSheet.getRange(clientId,2).setValue(clientNumber);
  clientSheet.getRange(clientId,3).setValue(clientEmail);
  clientSheet.getRange(clientId,4).setValue(clientPhoneNumber);
  clientSheet.getRange(clientId,5).setValue(clientAddress);
  clientSheet.getRange(clientId,6).setValue(clientCounty);
  clientSheet.getRange(clientId,7).setValue(clientEirCode);
  clientSheet.getRange(clientId,8).setValue(clientMPRN);
  clientSheet.getRange(clientId,9).setValue(clientBuiltYear);
  clientSheet.getRange(clientId,10).setValue(clientDescription);
  clientSheet.getRange(clientId,11).setValue(clientInfoLog);

  //Logger.log([clientId,clientNumber,clientEmail,clientPhoneNumber,clientAddress,clientCounty,clientEirCode,clientMPRN,clientBuiltYear,clientDescription,clientInfoLog]);

  return "Client Edited";
}
//----------------------------------------------------------------  DELETE FROM CLIENT TABLE
function deleteClient(form){

  var logTimeStamp = "Deleted on " + Date();
  const clientRow = parseInt(form.deleteClientId) + 1;
  clientSheet.getRange(clientRow,11).setValue(logTimeStamp);
  clientSheet.getRange(clientRow,12).setValue(0);
  

  //ADD REGISTER IN DELETEDCLIENT TABLE
  const deletedId = getNewID(deletedClientsSheet);
  const deletedClientId = form.deleteClientId;
  const deletedReason = form.deleteReason;
  const deletedDescription = form.deleteClientDescription;
  const deletedTimeStamp = logTimeStamp;

  deletedClientsSheet.appendRow([
    deletedId,
    deletedClientId,
    deletedReason,
    deletedDescription,
    deletedTimeStamp
  ]);

  return "Cliente deleted";
}