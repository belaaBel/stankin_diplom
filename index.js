let fs = require('fs');
let express = require('express');
let bodyParser = require('body-parser');

let urlencodedParser = bodyParser.urlencoded({extended: false});

let app = express();

var sqlite3 = require('sqlite3').verbose();


app.set('view engine','ejs');

app.use("/public", express.static('public'));

let db = new sqlite3.Database('./users.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the users.db database.');
  });
  let arrFullname = []

  let sql = `SELECT * FROM User`;
   
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      //console.log(row.name);
      arrFullname.push(row);
      console.log(arrFullname);
    });
  });
  
  app.get("/",urlencodedParser, (req, res) =>{
    //    for(let i = 0; i < arrFullname.length; i++){
    //       console.log(arrFullname[i]);
    //   }

    res.render('index', {usss: req.body, arr: arrFullname}); //user: req.body
  });

   app.post('/', urlencodedParser, function(req, res){
    //   if(!req.body) return res.sendStatus(400)
    //     console.log(req.body);
    if(!req.body) return res.sendStatus(400);
    console.log(req.body);

    var login = '';
    var password = '';

    arrFullname.forEach(function(item){
        console.log(item.login.toString());
        console.log(req.body.name.toString());
        if(item.login.toString() == req.body.name.toString()){
            login = req.body.name.toString();
        }
    });

    arrFullname.forEach(function(item){
        console.log(item.login.toString());
        if(item.password.toString() == req.body.password.toString()){
            password = req.body.password.toString();
        }
    });

    console.log(`login = ${login} and password = ${password}`);
    if(password != '' && login != ''){
        res.send(`${req.body.name} - ${req.body.password}`)
    } else {
        res.send("you shell not pass!!!");
    }



     // res.render('index', {usss: req.body, arr: arrFullname});
    });
  
  app.get("/user",urlencodedParser, (req, res) =>{
    for(let i = 0; i < arrFullname.length; i++){
        console.log(arrFullname[i]);
    }

  res.render('user', {usss: req.body, arr: arrFullname}); //user: req.body
  });
  
  let students = []

  let std_sql = `SELECT * FROM Students`;
   
  db.all(std_sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row.name);
      students.push(row);
      console.log(students);
    });
  });
  
  app.get("/visit",urlencodedParser, (req, res) =>{
      for(let i = 0; i < students.length; i++){
          console.log(students[i]);
      }
  
   res.render('visit', {usss: req.body, arr: students} ); //user: req.body
  });
  
   
  app.get("/students",urlencodedParser, (req, res) =>{
    for(let i = 0; i < students.length; i++){
        console.log(students[i]);
    }

    res.render('students', {usss: req.body, arr: students} ); //user: req.body
  });

  app.get("/studentsDelete",urlencodedParser, (req, res) =>{
    for(let i = 0; i < students.length; i++){
        console.log(students[i]);
    }

    res.render('studentsDelete', {usss: req.body, arr: students} ); //user: req.body
  });

  app.get("/userDelete",urlencodedParser, (req, res) =>{
    for(let i = 0; i < students.length; i++){
        console.log(students[i]);
    }

    res.render('userDelete', {usss: req.body, arr: students} ); //user: req.body
  });




  app.get("/password", function (req, res){
    res.render('password');
  });

  app.get("/studentAdd", function (req, res){
    res.render('studentAdd');
  });

  app.get("/userAdd", function (req, res){
    res.render('userAdd');
  });

  app.get("/report_st", function (req, res){
    res.render('report_st');
  });

  app.get("/report_dek", function (req, res){
    res.render('report_dek');
  });

  app.get("/objects", function (req, res){
    res.render('objects');
  });

  app.get("/teachers", function (req, res){
    res.render('teachers');
  });

  app.listen(3001)