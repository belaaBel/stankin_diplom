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
let vist = [];
let sql_visit = `SELECT * FROM Visits`;
   
    db.all(sql_visit, [], (err, rows) => {
    if (err){
      throw err;
    }

    rows.forEach((row) => {
      vist.push(row);
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
     res.render('index');
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
        role = arrFullname[i].role;
        console.log("hxhxhxhh" + role);
        name = arrFullname[i].fullname;
        res.render('password', {role: arrFullname[i].role, name: arrFullname[i].fullname, flag : flag, err: err});

    } else{
        let err = "Введен не верный логин или пароль";
        res.render('index_1.ejs', {err: err});
    }
});
//==============================================================================//
app.post("/password",urlencodedParser,function(req, res){
    password_alt = req.body.password_alt;
    password_new = req.body.password_new;
    password_new_replay = req.body.password_new_replay;
    
    arrFullname.forEach(function(item){
        // if(item.id == 0){
            id = item.id - 1;   
        // }
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
                    console.log(role);
                    console.log(`Row(s) updated: ${this.changes}`);
                   
                });   
            }
            else{
                flag = 1;
                err = "Пароли не совпадают";
                res.render('password', {role : role, name : name, err : err, flag : flag});
            }
        }
        else{
            flag = 1;
            err = "Новый пароль совпадает со старым";
            res.render('password', {role : role, name : name, err : err, flag : flag});
        }
    }
    else{
        flag = 1;
        err = "Введен неверный пароль";
        res.render('password', {role : role, name : name, err : err, flag : flag});
    }
    flag = 0;
    res.render('password', {role : role, name : name, err : err, flag : flag});
});


app.get("/password", function (req, res){
    login = req.query.name;
    password = req.query.password;

    res.render('password', {role : role, name : name, err : err, flag : flag});
});
//==============================================================================//
  app.get("/user",urlencodedParser, (req, res) =>{
  res.render('user', {usss: req.body, arr: arrFullname, role : role, name : name}); //user: req.body
  });



  
  app.get("/userAdd", function (req, res){
    let db = new sqlite3.Database('./users.db');
    let gr = req.query.group;
    let fullname = req.query.fullname;
    let firstname = req.query.name;
    let lastname = req.query.lastname;
    let name = fullname + " " + firstname + " " + lastname;
    let pas = gr;
    let role = req.query.role;

    if(gr != undefined && fullname != undefined && firstname != undefined && lastname != undefined && role != undefined) {
        let id;


        for(let i = 0; i < arrFullname.length; i++){
            id = i + 1;
        }
        id += 1;
 
        let insert_sql = `INSERT INTO User VALUES (?,?,?,?,?)`;
        
            db.run(insert_sql, [id, gr, gr, role, name], function(err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`Row(s) updated: ${this.changes}`);
             });  
        }

        
   
    res.render('userAdd');
  });

  app.get("/userDelete",urlencodedParser, (req, res) =>{
    res.render('userDelete', {arr: arrFullname, role : role, name : name});
  });
  app.post("/userDelete",urlencodedParser, (req, res) =>{
    let db = new sqlite3.Database('./users.db');
    let box = req.body.chr;
    let id;
    console.log("gtne");
    for(let i = 0; i < arrFullname.length; i++){
        if(box[i] != "Нет"){
            id = i + 1;
            let data = [id];
            console.log(id);
            let delete_sql = 'DELETE FROM user WHERE id = ?';
       
            db.run(delete_sql, [id], function(err) {
                if (err) {
                   return console.error(err.message);
                }
                console.log(`Row(s) updated: ${this.changes}`);
               
             });  
        }
        else{
            id = i + 1;
        }
    } 

    res.render('userDelete', {usss: req.body,arr: arrFullname, role : role, name : name});
  });

//==============================================================================//
  
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

app.post("/visit",urlencodedParser,function(req, res){
    let day = req.body.day;
    let visit = req.body.visit;
    let subject = req.body.subject;
    let id;
    let data = [];
let students_2 = [];
    for(let j = 0; j < arrFullname.length; j++){
        if (login == arrFullname[j].login){
            for(let i = 0, jj = 0; i < students.length; i++){
                students_2[jj] = students[i];
                jj++;
    }

        }
}
for(let i = 0; i < students_2.length; i++){
    data[i] = [day, subject, visit[i]];
    id = i+1;

    let update_sql = 'UPDATE Visits SET day = ?, subject = ?, visit = ? WHERE id = '+ id;

    db.run(update_sql, data[i], function(err) {
        if (err) {
        return console.error(err.message);
        }
        console.log(`Row(s) updated: ${this.changes}`);
    
    });  
} 

    res.render('visit', {arr: students_2, role : role, name: name} ); 
  });

  app.get("/visit",urlencodedParser, (req, res) =>{
   
    res.render('visit', {arr: students, role : role, name: name} ); //user: req.body
  });
  
//==============================================================================//   

let flag_add = 0;
  app.get("/students",urlencodedParser, (req, res) =>{
    res.render('students', {arr: students, role : role, name : name}); //user: req.body
  });
 
  app.post("/students",urlencodedParser,function(req, res){
    let group_std = [];
    let group = req.body.group;
    
    if (flag_add){
        
        let sql = `SELECT * FROM Students`;
   
        db.all(sql, [], (err, rows) => {
            if (err){
            throw err;
        }

        rows.forEach((row) => {
            group_std.push(row);
        });
        });

        flag_add = 0;
    }
    
    for(let i = 0; i < students.length; i++){
        if(students[i].group == group){
            group_std[i] = students[i];
        }
    } 
    
    res.render('students', {arr: group_std, role : role, name : name});
  });

//==============================================================================// 

  app.get("/studentAdd", function (req, res){

    let db = new sqlite3.Database('./users.db');
    let gr = req.query.famill;
    let kod = req.query.kod;
    let fullname = req.query.fullname;
    let firstname = req.query.firstname;
    let lastname = req.query.lastname;
    let name = fullname + " " + firstname + " " + lastname;

    if(gr != undefined && fullname != undefined && kod != undefined && firstname != undefined && lastname != undefined) {
        console.log("ddd");
        flag = 1;
        let id;
        let data;

        for(let i = 0; i < students.length; i++){
            id = i + 1;
        }
        id += 1;
        data = [id,gr,name,kod];
        let insert_sql = `INSERT INTO Students VALUES (?,?,?,?)`;
        
            db.run(insert_sql, [id, gr, name, kod], function(err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`Row(s) updated: ${this.changes}`);
             });  
        }

        
   
    res.render('studentAdd', {role : role, name : name});
  });

  app.post("/studentAdd", function (req, res){

    res.render('studentAdd', {role : role, name : name});
  });

  //==============================================================================//
  app.get("/studentsDelete",urlencodedParser, (req, res) =>{
    res.render('studentsDelete', {arr:students, role : role, name : name});
  });


  app.post("/studentsDelete",urlencodedParser, (req, res) =>{
    let box = req.body.ch;
    let id;
    console.log(box);
    for(let i = 0; i < students.length; i++){
        if(box[i] != "Нет"){
            id = i + 1;
            let data = [id];
            console.log(id);
            let delete_sql = 'DELETE FROM Students WHERE ID = ?';
       
            db.run(delete_sql, data, function(err) {
                if (err) {
                   return console.error(err.message);
                }
                console.log(`Row(s) updated: ${this.changes}`);
               
             });  
        }
        else{
            id = i + 1;
        }
    } 

    res.render('studentsDelete', {arr: students, role : role, name : name});
  });


  

  let grp;
  let month;



  app.get("/report_st", function (req, res){
    var d = new Date();
    let vist = [];
let sql_visit = `SELECT * FROM Visits`;
   
    db.all(sql_visit, [], (err, rows) => {
    if (err){
      throw err;
    }

    rows.forEach((row) => {
      vist.push(row);
    });
});

    grp = req.query.grp;
    month = d.getMonth() + 1;

    switch(month){
        case 4: month = "апрель";
    }
    month = req.query.mnth;
    res.render('report_st', {role : role, name: name});
  });

  app.post("/report_st", function (req, res){
   
    res.render('report_st', {role : role, name: name});
  });

  //==============================================================================//
  
  app.get("/report_dek", function (req, res){
    let vist = [];
    let sql_visit = `SELECT * FROM Visits`;
       
        db.all(sql_visit, [], (err, rows) => {
        if (err){
          throw err;
        }
    
        rows.forEach((row) => {
          vist.push(row);
        });
    });
    grp = req.query.grp;
    month = req.query.mnth;
    res.render('report_dek', {role : role, name : name});
  });

  app.post("/report_dek", function (req, res){
    
    res.render('report_dek', {role : role, name : name});
  });

 
  app.get("/report", function (req, res){ 
    let std = [];
   
    let std_visit = [];
    let visit = [];

    for(let i = 0, j = 0; i < vist.length; i++){
        if(vist[i].group == grp){
            std_visit[j] = vist[i];
            visit[j] = vist[i];
            if(std_visit[j].visit == "+"){
                std_visit[j].visit = "0";
                visit[j].visit = "";
            }
            if(std_visit[j].visit == "1/2"){
                std_visit[j].visit = "1/2";
                visit[j].visit = "1/2";
            }
            if(std_visit[j].visit == "H" || std_visit[j].visit == "H"){
                std_visit[j].visit = "2";
                visit[j].visit = "";
            }
            if(std_visit[j].visit == "X"){
                std_visit[j].visit = "2";
               visit[j].visit = "2";
            }
            j++;
        }
    } 
    res.render('report', {group : grp, month : month, visit : std_visit, visit_uv : visit});
  });

  app.post("/report", function (req, res){
    
    res.render('report');
  });
  app.get("/objects", function (req, res){
    let route = req.query.route;
    let course = req.query.course;
    let semester = req.query.semester;
    let sub = req.query.sub;
    
    let insert_teach = `INSERT INTO Subject (route, course, semester, subject) VALUES (?,?,?,?)`;
        
    db.run(insert_teach, [route, course, semester, sub], function(err) {
        if (err) {
            return console.error(err.message);
        }
            console.log(`Row(s) updated: ${this.changes}`);
        });  
    res.render('objects', {role : role, name : name});
  });

  app.get("/teachers", function (req, res){
    let department = req.query.department;
    let sub = req.query.sub;
    let fio = req.query.name;
    let id;
    let teach = [];
   
    
    let insert_teach = `INSERT INTO Teachers (department, fullname_teachers, subject) VALUES (?,?,?)`;
        
    db.run(insert_teach, [department, fio, sub], function(err) {
        if (err) {
            return console.error(err.message);
        }
            console.log(`Row(s) updated: ${this.changes}`);
        });  
        
    res.render('teachers', {role : role, name : name});
  });

  app.post("/teachers", function (req, res){
    
    res.render('teachers', { role : role, name : name});
  });

  app.get("/index_1", function (req, res){
    res.render('index_1');
  });
  app.listen(3001)