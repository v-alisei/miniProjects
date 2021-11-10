//todo
/*
доделать шум +
сделать защиту от дураков для веб сервера +
изменить бд с коннектами +
определится с протоколом подсчета средств +
удалить привязку к нику +
создать бд с пользователями +
сделать добавление пользователей +
сделать функцию отчета +

сделать запрос на вывод
сделать просмотрщик
доделать пререадресатор (куки)
улучшить юай (отправлять ссылку)
развернуть на хостинге
*/







const domain = "localhost/"
const noise = "e6254db4aed8b7ca7fb250aa34";



const advertisersTable = {
  cola:"https://coca-cola.by/",
  fanta:"https://www.coca-cola.ru/brands/fanta"
}
const CostPerClick = {
  cola:0.02,
  fanta:0.04
}


let mysql = require('mysql2');
let mysqlSettings = {
  host: "localhost",
  user: "root",
  password: "#########",
  database: "tgbot"
}






const TelegramBot = require('node-telegram-bot-api');
const token = '#######################';
const bot = new TelegramBot(token, {polling: true} );






















// ___.           __     .__        __                 _____                     
// \_ |__   _____/  |_   |__| _____/  |_  ____________/ ____\____    ____  ____  
//  | __ \ /  _ \   __\  |  |/    \   __\/ __ \_  __ \   __\\__  \ _/ ___\/ __ \ 
//  | \_\ (  <_> )  |    |  |   |  \  | \  ___/|  | \/|  |   / __ \\  \__\  ___/ 
//  |___  /\____/|__|____|__|___|  /__|  \___  >__|   |__|  (____  /\___  >___  >
//      \/         /_____/       \/          \/                  \/     \/    \/





let keyboard = { 
  "reply_markup": {
    "inline_keyboard": [
      [
        {
          text: 'каталог рекламодателей',
          callback_data: 'showPartners'
        }
      ],
      [
        {
          text: 'кабинет',
          callback_data: 'report'
        }
      ],
      [
        {
          text: 'запрос на вывод',
          callback_data: 'getMoney'
        }
      ],
      [
        {
          text: 'написать в саппорт',
          callback_data: 'callSupport'
        }
      ]
    ]
  }
}

let partners_keyboard ={
  "reply_markup": {
    "inline_keyboard":[
      [
        {
          text: 'CocaCola (0.02$/c)',
          callback_data: 'CocaCola'
        }
      ],
      [
        {
          text: 'Fanta (0.04$/c)',
          callback_data: 'Fanta'
        }
      ],
    ]
  }
}


bot.on('message', (msg) => {
  let chatId = msg.chat.id;
  if(msg.text == "/start") {
    bot.sendMessage(chatId, "*приветственное сообщение*")
    registerUser(chatId, msg.from.username)
  }
  bot.sendMessage(chatId, "чем помочь?", keyboard);
});



bot.on("callback_query", (query)=>{
  let chatId = query.message.chat.id;

  if(query.data == "showPartners"){
    bot.sendMessage(chatId, "кого пиарить будете?" , partners_keyboard)
  } 
  else if (query.data == "report"){
    report(chatId)
  } 
  else if (query.data == "getMoney"){
    bot.sendMessage(chatId, "coming soon", keyboard)
  } 
  else if (query.data == "callSupport"){
    bot.sendMessage(chatId, "вам сюда: *ссылка на акк саппорта*", keyboard)
  }


  else if (query.data == "Fanta"){
    generateLink("fanta", chatId);
  }
  else if (query.data == "CocaCola"){
    generateLink("cola", chatId);
  }
})























// .__                          ___________                   __  .__                      
// |__| ____   ____   __________\_   _____/_ __  ____   _____/  |_|__| ____   ____   ______
// |  |/    \ /    \_/ __ \_  __ \    __)|  |  \/    \_/ ___\   __\  |/  _ \ /    \ /  ___/
// |  |   |  \   |  \  ___/|  | \/     \ |  |  /   |  \  \___|  | |  (  <_> )   |  \\___ \ 
// |__|___|  /___|  /\___  >__|  \___  / |____/|___|  /\___  >__| |__|\____/|___|  /____  >
//         \/     \/     \/          \/             \/     \/                    \/     \/ 



function registerUser(chatId, name){
  let con = mysql.createConnection(mysqlSettings);
  con.connect(()=>{
    con.query(`insert into users values (${chatId}, "${name}", 0.0)`,(err, res)=>{})
  })
}






function generateLink(brand, chatId){
  let linkId
  let con = mysql.createConnection(mysqlSettings);
  con.connect((err)=>{
    getMaxId()
  })
  function getMaxId(){
    con.query("select max(id) from links",(err, res)=>{
      linkId = res[0]["max(id)"] + 1;
      addLinkToDB()
    })
  }
  function addLinkToDB(){
    con.query(`insert into links values (${linkId}, "${brand}", ${chatId}, 0)`, (err, res)=>{
      sendLinkToChat()
    })
  }
  function sendLinkToChat(){
    bot.sendMessage(chatId, domain + noise + linkId, keyboard)
    con.end();
  }
}












function report(chatId){
  let linksData
  let moneyToAdd = 0
  let con = mysql.createConnection(mysqlSettings);
  connect()
  function connect(){
    con.connect((err)=>{
      queryLinksData()
    })
  }
  function queryLinksData(){
    con.query(`select brand, ucount from links where chatid=${chatId}`, (err, res)=>{
      linksData = res
      calculate()
    })
  }
  function calculate(){
    for(let i = 0; i < linksData.length; i++){
      try {
        moneyToAdd += linksData[i]["ucount"] * CostPerClick[linksData[i]["brand"]]
      } catch (err){
        if (err) console.log("mb data corrupted")
      }
    }
    ucountNullify()
  }
  function ucountNullify(){
    con.query(`update links set ucount=0 where chatid=${chatId}`, (err, res)=>{
      addMoney()
    })
    
  }
  function addMoney(){
    con.query(`update users set money = money + ${moneyToAdd} where chatid=${chatId}`, (err, res)=>{
      queryMoney()
    })
  }
  function queryMoney(){
    con.query(`select money from users where chatid=${chatId}`, (err, res)=>{
      bot.sendMessage(chatId, "ваш счет: " + res[0]["money"]+"$", keyboard)
      con.end();
    })
  }
}









function getMoney(){

}
































// __      __      ___.     _________                                
// /  \    /  \ ____\_ |__  /   _____/ ______________  __ ___________ 
// \   \/\/   // __ \| __ \ \_____  \_/ __ \_  __ \  \/ // __ \_  __ \
//  \        /\  ___/| \_\ \/        \  ___/|  | \/\   /\  ___/|  | \/
//   \__/\  /  \___  >___  /_______  /\___  >__|    \_/  \___  >__|   
//        \/       \/    \/        \/     \/                 \/      



const http = require("http");

http.createServer(function(request, response){
  let con;
  let url = request.url;
  let linkId = url.slice(noise.length + 1);
  let ip = request.socket.remoteAddress
  let ua = request.headers['user-agent'].slice(0, 59)
  let time = new Date().toISOString().slice(0, 19).replace('T', ' ');
  let AdLink


  if (url == "/favicon.ico") response.end()
  else {
    con = mysql.createConnection(mysqlSettings);
    con.connect((err)=>{
      getBrand()
    })
  }
  

  function getBrand(){
    con.query(`select brand from links where id=${linkId}`, (err,result)=>{
      if (err){
        response.end("<h1>link corrupted</h1>")
        con.end()
      } 
      else {
        AdLink = advertisersTable[result[0]["brand"]]
        addConnectionToDB()
      }
    })
  }
  function addConnectionToDB(){
    con.query(
    `insert into connections values (${linkId}, "${ip}", "${ua}", "${time}")`, (err,res)=>{
      increaseCounter()
    })
  }
  function increaseCounter(){
    con.query(`UPDATE links SET ucount = ucount + 1 where id=${linkId}`, (err,res)=>{
      respond()
    })
  }
  function respond(){
    response.end(`
      <!DOCTYPE html>
      <body>
        <script>
          if (document.cookie == "") {
            document.cookie == "wasHere=true"
            window.location.replace("${AdLink}")
          } else {
            window.location.replace("${AdLink}"+"?w=t")
          }
        </script>
      </body>
    `)
    con.end()
  }
}).listen(80);
