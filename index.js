let fs = require('fs');
let express = require('express');
let bodyParser = require('body-parser');

let urlencodedParser = bodyParser.urlencoded({extended: false});

let app = express();

var sqlite3 = require('sqlite3').verbose();


app.set('view engine','ejs');

app.use("/public", express.static('public'));

//==============================================================================//
let db = new sqlite3.Database('./users.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the users.db database.');
});

let arrFullname = [];
let role = "";
let name = "";
let id;
let sql = `SELECT * FROM User`;
   
db.all(sql, [], (err, rows) => {
    if (err){
      throw err;
    }

    rows.forEach((row) => {
      arrFullname.push(row);
    });
});
let err = '';
let login = '';
let password = '';
let i;
let password_alt = '';
let password_new = '';
let password_new_replay = '';
let flag = 1;
let nameK = '';

app.get('/',urlencodedParser, (req, res) =>{
     res.render('index');//, {usss: req.body, arr: arrFullname});
});

app.post('/', urlencodedParser, function(req, res){
    arrFullname.forEach(function(item){
        if(item.login == req.body.name){
            login = req.body.name;
            i = item.id;
            console.log("ID:" + i);
        }
    });

    arrFullname.forEach(function(item){
        if(item.password == req.body.password){
            password = req.body.password;
        }
    });

    if (password != '' && login != ''){
        //res.send(`${req.body.name} - ${req.body.password}`)
        console.log("ROLE:" + arrFullname[i].role + "name:" + arrFullname[i].fullname);
        role = arrFullname[i].role;
        name = arrFullname[i].fullname;
        res.render('password', {role: arrFullname[i].role, name: arrFullname[i].fullname, flag : flag, err: err});

    } else{
        let err = "Введен не верный логин или пароль";
        res.render('index_1.ejs', {err: err});
        //res.send("you shell not pass!!!");
    }

    //================================================//
    // password_alt = req.body.password_alt;
    // password_new = req.body.password_new;
    // password_new_replay = req.body.password_new_replay;

    // if(password == password_alt){
    //     if(password_new != password_alt){
    //         if(password_new_replay == password_new){
    //             //flag = 0;
    //             console.log('Yes');
    //             let data = [password_new];
    //             let update_sql = 'UPDATE User SET password = ? WHERE id=' + i;

    //             db.run(update_sql, data, function(err) {
    //                 if (err) {
    //                   return console.error(err.message);
    //                 }
    //                 console.log(`Row(s) updated: ${this.changes}`);
                   
    //             });
    //             db.close();
    //         }
    //         else{
    //             console.log('Error');
    //             flag = 1;
    //             err = "Пароли не совпадают";
    //             res.render('password', {role : role, name : name, err : err, flag : flag});
    //         }
    //     }
    //     else{
    //         console.log('Error');
    //         flag = 1;
    //         err = "Новый пароль совпадает со старым";
    //         res.render('password', {role : role, name : name, err : err, flag : flag});
    //     }
    // }
    // else{
    //     console.log('Error');
    //     flag = 1;
    //     err = "Введен неверный пароль";
    //     res.render('password', {role : role, name : name, err : err, flag : flag});
    // }
    // flag = 0;
     //flag
});
//================kot
app.post("/password",urlencodedParser,function(req, res){
    password_alt = req.body.password_alt;
    password_new = req.body.password_new;
    password_new_replay = req.body.password_new_replay;
    console.log("pass"+password);
    console.log("login"+login);
    
    arrFullname.forEach(function(item){
        
            console.log(item.id);
if(item.id == 0){
    id = item.id;
    console.log("item.id" + id);
}
            // id = item.id;
            // console.log("ID:" + id);
       
    });

    if(password == password_alt){
        if(password_new != password_alt){
            if(password_new_replay == password_new){
                flag = 0;
                console.log('Yes');
                let data = [password_new];
               
                let update_sql = 'UPDATE User SET password = ? WHERE id =' + id;

                db.run(update_sql, data, function(err) {
                    if (err) {
                       return console.error(err.message);
                    }
                    console.log(`Row(s) updated: ${this.changes}`);
                   
                });
                db.close();
            }
            else{
                console.log('Error');
                flag = 1;
                err = "Пароли не совпадают";
                res.render('password', {role : role, name : name, err : err, flag : flag});
            }
        }
        else{
            console.log('Error');
            flag = 1;
            err = "Новый пароль совпадает со старым";
            res.render('password', {role : role, name : name, err : err, flag : flag});
        }
    }
    else{
        console.log('Error');
        flag = 1;
        err = "Введен неверный пароль";
        res.render('password', {role : role, name : name, err : err, flag : flag});
    }
    flag = 0;
    res.render('password', {role : role, name : name, err : err, flag : flag});
});

//==============================================================================//
app.get("/password", function (req, res){
    login = req.query.name;
    password = req.query.password;
    console.log("login="+login+"   password="+password);
    res.render('password', {role : role, name : name, err : err, flag : flag});
});
//==============================================================================//
  app.get("/user",urlencodedParser, (req, res) =>{
    for(let i = 0; i < arrFullname.length; i++){
        console.log(arrFullname[i]);
    }

  res.render('user', {usss: req.body, arr: arrFullname, role : role, name : name}); //user: req.body
  });
  
  let students = []

  let std_sql = `SELECT * FROM Students`;
   
  db.all(std_sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      students.push(row);
    });
  });
//==============================================================================//
  app.get("/visit",urlencodedParser, (req, res) =>{
    res.render('visit', {usss: req.body, arr: students, role : role, name: name} ); //user: req.body
  });
  
   
  app.get("/students",urlencodedParser, (req, res) =>{
    for(let i = 0; i < students.length; i++){
        console.log(students[i]);
    }

    res.render('students', {usss: req.body, arr: students, role : role, name : name} ); //user: req.body
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

  

  

  app.get("/studentAdd", function (req, res){
    res.render('studentAdd');
  });

  app.get("/userAdd", function (req, res){
    res.render('userAdd');
  });

  app.get("/report_st", function (req, res){
    res.render('report_st', {role : role, name: name});
  });

  app.get("/report_dek", function (req, res){
    res.render('report_dek', {role : role, name : name});
  });

  app.get("/objects", function (req, res){
    res.render('objects');
  });

  app.get("/teachers", function (req, res){
    res.render('teachers', {role : role, name : name});
  });

  app.get("/index_1", function (req, res){
    res.render('index_1');
  });
  app.listen(3001)