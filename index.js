var express = require('express')
var app = express()
var bodyParser = require('body-parser')

const sqlite3 = require('sqlite3');
const axios = require('axios')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

var startName = "/start"
var infoName = "/info"

//This is the route the API will call
app.post('/new-message', function(req, res) {
  const { message } = req.body

  //Each message contains "text" and a "chat" object, which has an "id" which is the chat id

  if (!message) {
    // In case a message is not present, or if our message does not have the word marco in it, do nothing and return an empty response
    return res.end()
  }

  console.log("Received msg: " + message.text)

  if (message.text.toLowerCase() == startName){
    SendResponse(res, message.chat.id, "<i>Hello!<i> Please enter name to get its nutrition information")
  }
  else if (message.text.toLowerCase() == infoName){
    SendResponse(res, message.chat.id, "Here is info present")
  }
  else{
    GetInfoFromDatabase(message.text, res, message.chat.id, SendResponse);
  }
})

let db = new sqlite3.Database("database.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database");
  // databaseRes = GetInfoFromDatabase('Яблуко', OnInformationReceived)
});

// Finally, start our server
app.listen(3000, function() {
  console.log('Telegram app listening on port 3000!')
})



<!-- FUNCTIONS -->

function SendResponse(res, chatId, resultText)
{
  // If we've gotten this far, it means that we have received a message containing the word "marco".
  // Respond by hitting the telegram bot API and responding to the approprite chat_id with the word "Polo!!"
  // Remember to use your own API toked instead of the one below  "https://api.telegram.org/bot<your_api_token>/sendMessage"
  axios
    .post(
      'https://api.telegram.org/bot698132452:AAF1F9qxVGJofjelHtHuhShBfi5Ojr4Gx60/sendMessage',
      {
        chat_id: chatId,
        text: resultText
      }
    ).then(response => {
      // We get here if the message was successfully posted
      console.log('Response send')
      res.end('ok')
    })
    .catch(err => {
      // ...and here if it was not
      console.log('Error :', err)
      res.end('Error :' + err)
    })

}

function GetInfoFromDatabase(productName, res, chatId, callback)
{
  let sql = `SELECT Reccomendation reccomendation,
                  CalloriesAmount callories
           FROM NUTRITION_INFO
           WHERE ProductName  = ?`;
 
  // first row only
  db.get(sql, [productName], (err, row) => {
    if (err) {
      return console.error(err.message)
    }
    if (row){
      callback(res, chatId, row)
    }
    else{
      callback(res, chatId, "No info about this product yet(")
    }
  });
}
<!-- END FUNCTIONS -->