const crypto = require('crypto')
const express = require('express');
const app = express();
const cors = require('cors')
const bodyparser = require('body-parser');
//const { getName } = require('country-list');

const mongodbclient = require('mongodb');
const bcrypt = require('bcrypt');
//const geoip = require('geoip-lite');
const saltRounds = 10;
const jwt =  require("jsonwebtoken");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors())
//dburl = "mongodb://localhost:27017/"
dburl="mongodb+srv://antonyrahul96:antonyrahul96@cluster0-lmgka.mongodb.net/test?retryWrites=true&w=majority"
busdb ="busdb"
buscollection = "buscollection"
routedb = "routedb"
routecollection ="routecollection"
usersDB = "usersDB"
userscollecton = "userscollection"
travelscollection = "travelscollection"
ticketdb ="ticketdb"
ticketcollection ="ticketcollection"

app.post('/loginuser', function (req, res) {
    console.log(req.body);
    mongodbclient.connect(dburl, function (err, client) {
        if (err) throw err;
        var db = client.db(usersDB);
        var findarr=
        {
        $or:[{email:req.body.email},{phone:req.body.email},{uniqueid:req.body.email}

        ]
    }
    var collname= userscollecton
    if(req.body.travels==true)
collname=travelscollection
            db.collection(collname).findOne(findarr, function (err, data) {
                if(data)
                {
                if (err) throw err;
                bcrypt.compare(req.body.password, data.password, function(err, result) {
                    if(err) throw err;
                   
                    if(result == true)
                    {
                    console.log("logged in")
                    var jwtToken = jwt.sign({id:data.id},'qazwsxedcrfv')
                    client.close();
                    res.status(200).json({
                        message: "LOGGED IN",
                        jwttoken: jwtToken,
                        name : data.name,
                        email:data.email,
                        accstatus :data.accstatus,
                        uniqueid:data.uniqueid,
                        status:200
                    });
                    

                }
                    else{
                        client.close();
                        res.status(401).json({
                            message: "Incorrect password"
                        })
                    
                    console.log("wrong creds")
                    }
                });

                
                
            }
            else
            {
                client.close();
                res.status(401).json({
                    message : "Incorrect username"
                })
            }
            })
            // Store hash in your password DB.
        


    });

})

app.post('/registeruser', function (req, res) {
    console.log(req.body);
    var uniqueid;
    crypto.randomBytes(4,(err, buf) => {
        if (err) throw err;
        uniqueid = buf.toString('hex');
        
        
        })
    mongodbclient.connect(dburl, function (err, client) {
        if (err) throw err;
        var db = client.db(usersDB);
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            if (err) throw err;
            var accstatus = "verified"
            var collname = userscollecton
            if(req.body.travels==true)
            {
                collname=travelscollection
            }
            var userData = {
                email: req.body.email,
                phone:req.body.phone,
                name: req.body.name,
                password: hash,
                uniqueid:uniqueid,
                accstatus:req.body.accstatus,
                
                
            }
            db.collection(collname).insertOne(userData, function (err, data) {
                if (err) throw err;
                client.close();
                res.json({
                    message: "saved",
                    data:data,
                    userdata:userData
                })
            })
            // Store hash in your password DB.
        });

       // client.close();
    });

})

app.get('/genRouteId', function (req, res) {
    
    var routeid;
    crypto.randomBytes(4,(err, buf) => {
        if (err) throw err;
        routeid = buf.toString('hex');
        res.json({
            message: "saved",
            routeid:routeid
        })
        
        })
    })
    app.post('/addbus',function(req,res){
        console.log(req.body)

        mongodbclient.connect(dburl, function (err, client) {
            if (err) throw err;
            var db = client.db(busdb);
            
          
                db.collection(buscollection).insertOne(req.body, function (err, data) {
                    if (err) throw err;
                    client.close();
                    res.json({
                        message: "saved",
                        
                })
                // Store hash in your password DB.
            
    
           // client.close();
        });
    
    })

    })

    app.post('/getbusforid', function (req, res) {
        console.log(req.body);
        mongodbclient.connect(dburl, function (err, client) {
            useUnifiedTopology: true

            if (err) throw err;
            var db = client.db(busdb);
         
               
                    db.collection(buscollection).find(req.body).toArray(function (err, data) {
                        if (err) throw err;
                        client.close();
                        res.json({
                            message: "saved",
                            data:data
                        })
                    })
                
              
                // Store hash in your password DB.
            
    
           // client.close();
        });
    
    })

    app.post('/addroute',function(req,res){
        console.log(req.body)
       

        mongodbclient.connect(dburl, function (err, client) {
            if (err) throw err;
            var db = client.db(routedb);
            
          
                db.collection(routecollection).insertOne(req.body, function (err, data) {
                    if (err) throw err;
                    client.close();
                    res.json({
                        message: "saved",
                        
                })
                // Store hash in your password DB.
            
    
           // client.close();
        });
    
    })

    })

    app.post('/getroutesforid', function (req, res) {
        console.log(req.body);
        mongodbclient.connect(dburl, function (err, client) {
            useUnifiedTopology: true

            if (err) throw err;
            var db = client.db(routedb);
         
               
                    db.collection(routecollection).find(req.body).toArray(function (err, data) {
                        if (err) throw err;
                        client.close();
                        res.json({
                            message: "saved",
                            data:data
                        })
                    })
                
              
                // Store hash in your password DB.
            
    
           // client.close();
        });
    
    })

    app.post('/editroute', function (req, res) {
        console.log(req.body);
        mongodbclient.connect(dburl, function (err, client) {
            if (err) throw err;
            var db = client.db(routedb);
            
                
                var filter ={
                    routeid : req.body.routeid
                    
                }
                console.log(filter)
              
                db.collection(routecollection).updateOne(filter,{$set:req.body}, function (err, data) {
                    if (err) throw err;
                    client.close();
                    res.json({
                        message: "sucess"
                    })
                })
                // Store hash in your password DB.
        
    
           // client.close();
        });
    
    })

    app.post('/approvebus', function (req, res) {
        console.log(req.body);
        mongodbclient.connect(dburl, function (err, client) {
            useUnifiedTopology: true
            if (err) throw err;
            var db = client.db(busdb);
         var updatedata=
         {
             $set:{
                 status:"approved"
             }
         }
               
                    db.collection(buscollection).findOneAndUpdate(req.body,updatedata,function (err, data) {
                        if (err) throw err;
                        client.close();
                        res.json({
                            message: "saved",
                            
                        })
                    })
                
              
                // Store hash in your password DB.
            
    
           // client.close();
        });
    
    })

    app.post('/approvetravels', function (req, res) {
        console.log(req.body);
        mongodbclient.connect(dburl, function (err, client) {
            useUnifiedTopology: true
            if (err) throw err;
            var db = client.db(usersDB);
         var updatedata=
         {
             $set:{
                 accstatus:"approved"
             }
         }
               
                    db.collection(travelscollection).findOneAndUpdate(req.body,updatedata,function (err, data) {
                        if (err) throw err;
                        client.close();
                        res.json({
                            message: "saved",
                            
                        })
                    })
                
              
                // Store hash in your password DB.
            
    
           // client.close();
        });
    
    }
    
    )

    app.post('/getpendingregs', function (req, res) {
        console.log(req.body);
        mongodbclient.connect(dburl, function (err, client) {
            useUnifiedTopology: true

            if (err) throw err;
            var db = client.db(usersDB);
         
               
                    db.collection(travelscollection).find(req.body).toArray(function (err, data) {
                        if (err) throw err;
                        client.close();
                        res.json({
                            message: "saved",
                            data:data
                        })
                    })
                
              
                // Store hash in your password DB.
            
    
           // client.close();
        });
    
    })

    app.get('/getallavialroutes', function (req, res) {
        console.log(req.body);
        mongodbclient.connect(dburl, function (err, client) {
            useUnifiedTopology: true

            if (err) throw err;
            var db = client.db(routedb);
         
               
                    db.collection(routecollection).find().toArray(function (err, data) {
                        if (err) throw err;
                        client.close();
                        res.json({
                            message: "saved",
                            data:data
                        })
                    })
                
              
                // Store hash in your password DB.
            
    
           // client.close();
        });
    
    })

    app.post('/addticket',function(req,res){
        console.log(req.body)
        var ticketid;
        crypto.randomBytes(4,(err, buf) => {
            if (err) throw err;
            ticketid = buf.toString('hex');
            // res.json({
            //     message: "saved",
            //     routeid:routeid
            // })
            req.body.ticketid=ticketid
            
            })
            

        mongodbclient.connect(dburl, function (err, client) {
            if (err) throw err;
            var db = client.db(ticketdb);
            
          
                db.collection(ticketcollection).insertOne(req.body, function (err, data) {
                    if (err) throw err;
                    client.close();
                    res.json({
                        message: "saved",
                        
                })
                // Store hash in your password DB.
            
    
           // client.close();
        });
    
    })

    })

    app.post('/gettickets', function (req, res) {
        console.log(req.body);
        mongodbclient.connect(dburl, function (err, client) {
            useUnifiedTopology: true

            if (err) throw err;
            var db = client.db(ticketdb);
         
               
                    db.collection(ticketcollection).find().toArray(function (err, data) {
                        if (err) throw err;
                        client.close();
                        res.json({
                            message: "saved",
                            data:data
                        })
                    })
                
              
                // Store hash in your password DB.
            
    
           // client.close();
        });
    
    })

    app.post('/cancelticket', function (req, res) {
        console.log(req.body);
        mongodbclient.connect(dburl, function (err, client) {
            useUnifiedTopology: true

            if (err) throw err;
            var db = client.db(ticketdb);
         
            var updatedata=
            {
                $set:{
                    ticketstatus:"cancelled"
                }
            }
                    db.collection(ticketcollection).findOneAndUpdate(req.body,updatedata,function (err, data) {
                        if (err) throw err;
                        client.close();
                        res.json({
                            message: "saved",
                            data:data
                        })
                    })
                
              
                // Store hash in your password DB.
            
    
           // client.close();
        });
    
    })

    

    app.post('/updateseatcount', function (req, res) {
        console.log(req.body);
        mongodbclient.connect(dburl, function (err, client) {
            useUnifiedTopology: true

            if (err) throw err;
            var db = client.db(routedb);
            var finddata=
            {
                routeid:req.body.routeid
            }
         
            
               var updatedata={$inc:{
                    bookedseats : +req.body.bookedseats,
                    price: +req.body.bookedseats*10

                }
                }
                    db.collection(routecollection).findOneAndUpdate(finddata,updatedata,function (err, data) {
                        if (err) throw err;
                        client.close();
                        res.json({
                            message: "saved",
                            data:data
                        })
                    })
                
              
                // Store hash in your password DB.
            
    
           // client.close();
        });
    
    })

    
    

    app.get('/getallaccounts', function (req, res) {
        console.log(req.body);
        mongodbclient.connect(dburl, function (err, client) {
            useUnifiedTopology: true

            if (err) throw err;
            var db = client.db(usersDB);
         
               
                    db.collection(userscollecton).find().toArray(function (err, data) {
                        if (err) throw err;
                        client.close();
                        res.json({
                            message: "saved",
                            data:data
                        })
                    })
                
              
                // Store hash in your password DB.
            
    
           // client.close();
        });
    
    })

    

    app.post('/suspendaccount', function (req, res) {
        console.log(req.body);
        mongodbclient.connect(dburl, function (err, client) {
            useUnifiedTopology: true

            if (err) throw err;
            var db = client.db(usersDB);
            
         
            
               var updatedata={$set:{
                    accstatus :"pending",
                    

                }
                }
                    db.collection(userscollecton).findOneAndUpdate(req.body,updatedata,function (err, data) {
                        if (err) throw err;
                        client.close();
                        res.json({
                            message: "saved",
                            data:data
                        })
                    })
                
              
                // Store hash in your password DB.
            
    
           // client.close();
        });
    
    })

    

    app.post('/getuserprofileinfo', function (req, res) {
        console.log(req.body);
        var collname = userscollecton
        if(req.body.isTravels==true)
        {
            collname=travelscollection
        }
        mongodbclient.connect(dburl, function (err, client) {
            useUnifiedTopology: true

            if (err) throw err;
            var db = client.db(usersDB);
         var finddata ={
             email:req.body.email,
             uniqueid:req.body.uniqueid
         }
               
                    db.collection(collname).findOne(finddata,function (err, data) {
                        if (err) throw err;
                        client.close();
                        res.json({
                            message: "saved",
                            data:data
                        })
                    })
                
              
                // Store hash in your password DB.
            
    
           // client.close();
        });
    
    })



    
    app.post('/editprofile', function (req, res) {
        console.log(req.body);
        var collname = userscollecton
        if(req.body.isTravels==true)
        {
            collname=travelscollection
        }
        mongodbclient.connect(dburl, function (err, client) {
            useUnifiedTopology: true

            if (err) throw err;
            var db = client.db(usersDB);
            
         
            var finddata=
            {
                uniqueid:req.body.uniqueid
            }
               var updatedata={$set:{
                    email :req.body.email,
                    name:req.body.name,
                    phone:req.body.phone
                    }
                }
                    db.collection(collname).findOneAndUpdate(finddata,updatedata,function (err, data) {
                        if (err) throw err;
                        client.close();
                        res.json({
                            message: "saved",
                            data:data
                        })
                    })
                
              
                // Store hash in your password DB.
            
    
           // client.close();
        });
    
    })




app.listen(process.env.PORT, function () {

    console.log("listening on port 4123");
});
