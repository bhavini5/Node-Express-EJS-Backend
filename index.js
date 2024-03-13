var express=require('express');
const mysql=require("mysql");
const app=express();
const port=8080;
var bodyParser=require("body-parser");//middleware
const path=require("path");
const methodOverride = require('method-override');
const{v4:uuidv4}=require('uuid');
const { connect } = require('http2');


var cors = require("cors");
app.use(cors());
app.use(express.static('public')); 
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({ extended: false }));//parsing data
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.use(express.json());

const connection=mysql.createConnection({
    host:'localhost',
    user: 'root',
    database :'fmblog',
    password:'@-Bhavini.05',
});

//login
app.get("/",(req,res)=>{
    res.render("Mlogin.ejs");
})
app.post("/Mlogin", (req, res) => {
    let { name, password } = req.body;
    console.log(req.body);
    let q = `SELECT * FROM user WHERE username = ?`;
    connection.query(q, [name], (err, result) => {
      if (err) {
        console.log(err);
        return res.send("Error fetching user details");
      }
  
      if (result.length > 0) {
        let user = result[0];
        console.log(user);
        console.log("User details:", user);
  
        if (user.password === password) {
          // Successful login
          res.redirect("/home");
        } else {
          res.send("Wrong Password");
        }
      } else {
        res.send("User not found");
      }
    });

  });
  
  app.get("/add/user",(req,res)=>{
    res.render("user.ejs");
})
app.post("/add/user", (req, res) => {
    let { userid, name, username, dob, password, email } = req.body;
    console.log(req.body);
    let q = `INSERT INTO user ( userid,name, username, dob, password, email) VALUES (?, ?, ?, ?, ?, ?)`;
    
    try {
        connection.query(q, [userid,name, username, dob, password, email], (err, result) => {
            if (err) {
                console.error(err);
                res.send("Error in database");
            } else {
                res.redirect("/show/user");
            }
        });
    } catch (err) {
        console.error(err);
        res.send("Some error occurred");
    }
});

//contact_us
app.get("/contact_us",(req,res)=>{
    res.render("contact.ejs",);
})
app.post("/contact_us", (req, res) => {
    console.log(req.body);

    let {id,name,email,subject } = req.body;
    let q = `INSERT INTO contact(id,name,Email,Message)VALUES (?,?, ?, ?)`;
    try {
        connection.query(q, [id, name,email,subject], (err, result) => {
            if (err) {
                console.log("Error occurred while inserting data ",err);
                return res.send("Error occurred while inserting data");
            }
            res.status(200).send("Data saveed..");
        });
    } catch (err) {
        console.log("Some error occurred in the database",err);
        res.send("Some error occurred in the database");
    }
});

app.post("/show/contacts",(req,res)=>{
    let q=`SELECT * FROM contact`;
    try{
        connection.query(q,(err,result)=>{
        if(err)throw err;
        res.render("showContact",{result:result});
    })
}
    catch (err) {
        console.log(err);
        res.send("Some error occurred in the database");
    }
});

app.get("/home",(req,res)=>{
    res.render("home.ejs");
})



app.get("/employee",(req,res)=>{
    let q=`Select * FROM Employee`;

    try{
        connection.query(q,function(err,result){
        if(err)throw err;
        res.render("show_employee.ejs",{result});
    })
}
catch(err){
    console.log(err);
    res.send("some err in db");
}
})
app.get("/employee/add",(req,res)=>{
    connection.query("Select * from Employee",function(err,result){
        if(err)throw err;
        res.render("employee.ejs");
    })
})
app.delete("/:id/employee/delete",(req,res)=>{
    let {id}=req.params;
    let q=`DELETE FROM program_schedule WHERE Empid = ${id}`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let q1=`DELETE FROM Employee WHERE Empid = ${id}`;
            try{
                connection.query(q1,(err,result)=>{
                if(err)throw err;
                res.redirect("/employee");

            })
        }
        catch(err){
            console.log(err);
            res.send("some err in database"); 
        }
            
        });
    } catch (err) {
        console.log(err);
        res.send("Error in database");
    }
})

app.post("/employee/add",(req,res)=>{
    // res.send("post working");
    // let empid=uuidv4();
    let{id,name,add1,add2,DOB,DOJ,Salary,dropdown}=req.body;
    let q = `INSERT INTO employee (Empid,name, add1, add2, DOB, DOJ, Salary,post)
             VALUES (?, ?, ?, ?, ?, ?, ?,?)`;

    try {
        connection.query(q, [id,name, add1, add2, DOB, DOJ, Salary, dropdown], (err, result) => {
        if(err)throw err;
        console.log(result);
        res.redirect("/employee");
    })
}
catch(err){
    console.log(err);
    res.send("some err in database");
}
})

//RINGTONES
app.get("/show/ringtone",(req,res)=>{
    
    let q=`SELECT * FROM ringtone `;
    try{
        connection.query(q,(err,result)=>{
        if(err)throw err;
        res.render("showRingtone.ejs",{result});
    })
}
catch(err){
    console.log(err);
    res.send("some err in database"); 
}
})
app.delete("/:id/ringtone/delete",(req,res)=>{
    let {id}=req.params;
    let q=`DELETE FROM ringtone_review WHERE rid = ${id}`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let q1=`DELETE FROM ringtone WHERE rid = ${id}`;
            try{
                connection.query(q1,(err,result)=>{
                if(err)throw err;
                res.redirect("/show/ringtone");
            })
        }
        catch(err){
            console.log(err);
            res.send("some err in database"); 
        }
            
        });
    } catch (err) {
        console.log(err);
        res.send("Error in database");
    }
})



app.get("/add/ringtone",(req,res)=>{
    res.render("addRingtone.ejs")
})
app.post("/add/ringtone",(req,res)=>{

    let {rid,title,song_name,duration,file_name}=req.body;
    let q=`INSERT INTO ringtone (rid,title,song_name,duration,filename)
    VALUES(?,?,?,?,?)`;
    try{
        connection.query(q,[rid,title,song_name,duration,file_name],(err,result)=>{
            if(err)throw err;
            res.redirect("/show/ringtone");
        })
    }
    catch(err){
        console.log(err);
        res.send("some err in database"); 
    }
})

app.get("/:id/reviews",(req,res)=>{
    
     let {id}=req.params;
    let q = `SELECT * FROM ringtone_review WHERE rid = '${id}'`;
    try{
        connection.query(q,(err,result)=>{
        if(err)throw err;
        res.render("showReviews_S.ejs",{result});
        })
    }
    catch(err){
        console.log(err);
        res.send("some err in database"); 
    }
})

app.get("/:id/add/review", (req, res) => {
    let { id } = req.params;
    res.render("login.ejs", { id });
  });
  
//login POST request
app.post("/:id/add/review", (req, res) => {
    
    let { name, password } = req.body;
    let q = `SELECT * FROM user WHERE userid = ?`;
    connection.query(q, [name], (err, result) => {
        let user=result[0];
      if (err) {
        console.log(err);
        return res.send("Error fetching user details");
      }
      if (result.length > 0) {
        let resp = result[0];
        let { id } = req.params;
        if (resp.password === password) {
          res.render("addReview.ejs", { user,id });
        } else {
          res.send("Wrong Password");
        }
      } else {
        res.send("User not found");
      }
    });
  });

  // Handle adding review POST request
  app.post("/:id/add/review/submit", (req, res) => {
    let{id}=req.params;
    let { userid, content } = req.body;
    // let rvid = uuidv4();
    let q = `INSERT INTO ringtone_review ( rid, userid, review) VALUES (?, ?, ?)`;
    connection.query(q, [id, userid, content], (err, result) => {
      if (err) {
        console.log(err);
        res.send("Error adding review");
      }
      res.redirect(`/${id}/reviews`);
    });
  });


//login to review
app.get("/:id/login",(req,res)=>{
    let {id}=req.params;
    res.render("login.ejs",{id});
})
app.post("/:id/add/review",(req,res)=>{
    let{name,password}=req.body;
    let q=`SELECT password FROM user WHERE userid = ?`
    try{
        connection.query(q,[name],(err,result)=>{
            if(err)throw err;
            let user=result[0];
            if(user.password!=password){
                res.send("Wrong Password");
            }
            else{
                res.redirect("/:id/add/review");
            }

        })
    }
    catch{
        console.log(err);
        res.send("some err in database"); 
    }
})
//BLOGS
app.get("/show/blog",(req,res)=>{
    
    let q=`SELECT * FROM blog `;
    try{
        connection.query(q,(err,result)=>{
        if(err)throw err;
        res.render("showBlog.ejs",{result});
    })
}
catch(err){
    console.log(err);
    res.send("some err in database"); 
}
})


app.delete("/:id/blog/delete",(req,res)=>{
    let {id}=req.params;
    let q=`DELETE FROM blog_comment WHERE bid = ${id}`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let q1=`DELETE FROM blog WHERE bid = ${id}`;
            try{
                connection.query(q1,(err,result)=>{
                if(err)throw err;
                res.redirect("/show/blog");
            })
        }
        catch(err){
            console.log(err);
            res.send("some err in database"); 
        }
            
        });
    } catch (err) {
        console.log(err);
        res.send("Error in database");
    }
})
//update 
app.patch("/:id/blog/edit",(req,res)=>{
    let {id}=req.params;
    let newContent = req.body.content.replace(/'/g, "''");
    let q=`UPDATE blog SET content='${newContent}' WHERE bid='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw (err);
            res.redirect("/show/blog");
        });
    } catch (err) {
        console.log(err);
        res.send("Error in database");
    }
    
})
app.get("/:id/blog/edit", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM blog WHERE bid=${id}`;

    try {
        connection.query(q, (err, result) => {
            if (err) {
                console.log(err);
                res.send("Error in database");
                return;
            }
            res.render("editBlog.ejs", {result});
        });
    } catch (err) {
        console.log(err);
        res.send("Error in database");
    }
});


app.get("/add/blog",(req,res)=>{
    res.render("addBlog.ejs")
})
app.post("/add/blog",(req,res)=>{

    let {bid,blog_title,content}=req.body;
    let q=`INSERT INTO blog (bid,blog_title,content)
    VALUES(?,?,?)`;
    try{
        connection.query(q,[bid,blog_title,content],(err,result)=>{
            if(err)throw err;
            res.redirect("/show/blog");
        })
    }
    catch(err){
        console.log(err);
        res.send("some err in database"); 
    }
})
app.get("/:id/blog/reviews", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM blog_comment WHERE bid = '${id}'`;
    
    try {
        connection.query(q, (err, result) => {        
            if(err)throw err;
            res.render("showReviewBlog.ejs", { result });
        });
    } catch (err) {
        console.log(err);
        res.send("Some error occurred in the database");
    }
});


app.get("/:id/add/blog/review", (req, res) => {
    let { id } = req.params;
    res.render("Blogin.ejs", { id });
  });
  
//login POST request
app.post("/:id/add/blog/reviews", (req, res) => {
    
    let { name, password } = req.body;
    let q = `SELECT * FROM user WHERE userid = ?`;
    connection.query(q, [name], (err, result) => {
        let user=result[0];
      if (err) {
        console.log(err);
        return res.send("Error fetching user details");
      }
      if (result.length > 0) {
        let resp = result[0];
        let { id } = req.params;
        if (resp.password === password) {
          res.render("addReviewBlog.ejs", { user,id });
        } else {
          res.send("Wrong Password");
        }
      } else {
        res.send("User not found");
      }
    });
  });

  // Handle adding review POST request
  app.post("/:id/add/blog/review/submit", (req, res) => {
    
    let { id,userid, content } = req.body;
    // let rvid = uuidv4();
    let q = `INSERT INTO blog_comment (bid, userid, comment) VALUES (?,?, ?)`;
    connection.query(q, [id, userid, content], (err, result) => {
      if (err) {
        console.log(err);
        res.send("Error adding review");
      }
      res.redirect(`/${id}/blog/reviews`); 
    });
  });


//login to review
app.get("/:id/Blogin",(req,res)=>{
    let {id}=req.params;
    res.render("Blogin.ejs",{id});
})
app.post("/:id/add/blog/reviews",(req,res)=>{
    let{id}=req.params;
    let{name,password}=req.body;
    let q=`SELECT password FROM user WHERE userid = ?`
    try{
        connection.query(q,[name],(err,result)=>{
            if(err)throw err;
            let user=result[0];
            if(user.password!=password){
                res.send("Wrong Password");
            }
            else{
                res.redirect("/:id/add/blog/reviews");
            }

        })
    }
    catch{
        console.log(err);
        res.send("some err in database"); 
    }
})


//user
app.get("/show/user",(req,res)=>{
    let q=`SELECT * FROM user`;
    try{
        connection.query(q,(err,result)=>{
            if(err)throw err;
            res.render("showUser.ejs",{result});
        })
    }
    catch(err){
        console.log(err);
        res.send("some err in database"); 
    }
})
app.delete("/:id/user/delete",(req,res)=>{
    let{id}=req.params;
    let q=`DELETE FROM blog_comment WHERE userid='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) {
                console.log(err);
                res.send("Error in database");
                return;
            }
            let q1=`DELETE FROM ringtone_review WHERE userid='${id}'`;
            try{
                connection.query(q1,(err,result)=>{
                if(err)throw err;
                let q2=`DELETE FROM user where userid='${id}'`;
                try {
                    connection.query(q2,(err,result)=>{
                    if(err)throw err;
                    })

                } catch (err) {
                    console.log(err);
                res.redirect("/show/user"); 
                }
        })
            }
            
            catch(err){
                 console.log(err);
                res.send("some err in database"); 
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Error in database");
    }
})


//program
app.get("/show/program",(req,res)=>{
    let q=`SELECT * FROM program_schedule`;
    try{
        connection.query(q,(err,result)=>{
            if(err)throw err;
            res.render("showProgram.ejs",{result});
        })
    }
    catch(err){
        console.log(err);
        res.send("some err in database"); 
    }
})

app.delete("/:id/program/delete", (req, res) => {
    let { id } = req.params;
    let q = `DELETE FROM program_schedule WHERE psid='${id}'`;

    try {
        connection.query(q, (err, result) => {
            if (err) {
                console.log(err);
                res.send("Error in database");
                return;
            }
            res.redirect("/show/program");
        });
    } catch (err) {
        console.log(err);
        res.send("Error in database");
    }
});



app.get("/:id/add/program",(req,res)=>{
    let{id}=req.params;
    res.render("addProgram.ejs",{id});
})

app.post("/:id/add/program", (req, res) => {
    let { psid, prg_title,description, start_time, end_time, date,empid } = req.body;
    let q = `INSERT INTO program_schedule (psid, prg_title,description, start_time, end_time, date, empid) VALUES (?, ?, ?, ?, ?, ?,?)`;
    
    try {
        connection.query(q, [psid, prg_title,description, start_time, end_time, date, empid], (err, result) => {
            if (err) {
                console.error(err);
                res.send("Error in database");
            } else {
                res.redirect("/show/program");
            }
        });
    } catch (err) {
        console.error(err);
        res.send("Some error occurred");
    }
});




//artist
// app.get("/show/artist",(req,res)=>{
//     let q=`SELECT aid,aname FROM artist`;
//     try{
//         connection.query(q,(err,result)=>{
            
//             if(err)throw err;
//             res.render("showartists.ejs",{result});
//         })
//     }
//     catch(err){
//         console.log(err);
//         res.send("some err in database"); 
//     }
    
// })
// app.get("/:id/artist",(req,res)=>{
//     let {id}=req.params
//     let q=`SELECT * FROM artist WHERE aid='${id}'`;
//     try{
//         connection.query(q,(err,result)=>{
//             let user=result[0];
//             if(err)throw err;
//             res.render("showartist.ejs",{user});
//         })
//     }
//     catch(err){
//         console.log(err);
//         res.send("some err in database"); 
//     }
// })



// app.get("/add/artist",(req,res)=>{
//     res.render("addArtist.ejs");
// })


// app.post("/show/artist",(req,res)=>{
//     let{id,name,email,dob}=req.body;
//     let q = `INSERT INTO artist(aid,aname,email,dob)VALUES (?, ?, ?, ?)`;
//     try {
//         connection.query(q, [id,name,email,dob], (err, result) => {
//             if (err) {
//                 console.log(err);
//                 return res.send("Error occurred while inserting data");
//             }
//             res.redirect("/show/artist");
//         });
//     } catch (err) {
//         console.log(err);
//         res.send("Some error occurred in the database");
//     }

// })
app.listen(port,()=>{
    console.log("app listening on port 8080");
})