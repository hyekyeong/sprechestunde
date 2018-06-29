var React = require('express-react-views');
var express = require('express');
var bodyParser = require('body-parser');
const cors = require("cors");
var app = express();
var request = require("request");

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});


app.set('port', process.env.PORT || 3002);
var server = app.listen(app.get('port'), function () {
    console.log("app started in port 3002");
});

// serves the index.html
app.use(express.static(__dirname +'/'));

// View Engine Setup
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', React.createEngine());

// mysql Connection
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "nodeuser",
    password: "mysqlpw",
    database: "sakaidatabase"
});

con.connect(function(err) {
    if(err) throw err;
    console.log("mysql conneted!");
});


app.post('/', function(req,res){
    const data = req.body.user_id;
    res.render('default', { userId: data });
});

/*
const selLect = 'SELECT distinct l.USER_ID, l.VALUE, u.FIRST_NAME, u.LAST_NAME, u.EMAIL, u.TYPE FROM sakai_user AS u, sakai_user_property AS l WHERE l.USER_ID=u.USER_ID AND l.name="kvv_department"';
const selTypeList = 'SELECT distinct l.USER_ID, l.VALUE, u.FIRST_NAME, u.LAST_NAME, u.EMAIL, o.TYPE, o.Start_date,o.End_date, o.Day, o.Web_site, o.Location, o.Start_time, o.End_time  FROM sakai_user AS u, sakai_user_property AS l, officehours_type_property AS o WHERE l.USER_ID=u.USER_ID AND l.name="kvv_department" AND u.USER_ID=o.USER_ID;';
const selType = 'SELECT * from officehours_type_property WHERE USER_ID="'+data.id+'"';
*/

app.post('/user', function(req,res){
    const data = req.body;
    const selUser = 'SELECT USER_ID FROM sakai_user_property WHERE USER_ID="'+data.id+'" and name="kvv_lecturer" and value="true"';
    const getEid = 'SELECT EID FROM sakai_user_id_map WHERE USER_ID="'+data.id+'";';

    con.query(getEid, function(err, Eid){
        if(err) throw err;
        con.query(selUser, function(err, isLecturer){
            if (err) throw err;
            if (isLecturer.length < 1) {
                 res.send({ "isLecturer": false, Eid: Eid[0].EID });
            } else {
                res.send({"isLecturer": true, Eid: Eid[0].EID });
            };
        }); 
    })
    
});

app.post('/lecturer', function(req,res){
    const data = req.body;
    const selType = 'SELECT * from officehours_type_property WHERE USER_ID="'+data.id+'"';

    con.query(selType, function(err,result){
        if(err) throw err;
        if(result.length < 1) {
             res.send({ "hasType": false });
        } else {
            const getSignupUrl = 'SELECT TOOL_ID from sakai_site_tool where REGISTRATION="sakai.signup" and SITE_ID="~'+data.id+'"'
            con.query(getSignupUrl, function(err, toolId){
                if(err) throw err;
                if(toolId.length < 1){
                    res.send({ "hasType": true, "typeData": result, "signupUrl": null });
                }else {
                    res.send({ "hasType": true, "typeData": result, "signupUrl": toolId });
                }
            });
        }
    })
});

app.get('/toolid', function(req, res){
    const selType = 'SELECT * from sakai_site_tool where REGISTRATION="sakai.signup"';

    con.query(selType, function(err, toolId){
        if(err) throw err;
        res.send({ toolId: toolId });
    })

});

app.get('/list', function(req, res){
    const selLect = 'SELECT distinct l.USER_ID, l.VALUE, CONCAT(u.FIRST_NAME, " ", u.LAST_NAME) AS NAME, u.EMAIL, o.TYPE, o.Start_date,o.End_date, o.Day, o.Web_site, o.Location, o.Start_time, o.End_time  FROM sakai_user AS u, sakai_user_property AS l, officehours_type_property AS o WHERE l.USER_ID=u.USER_ID AND l.name="kvv_department" AND u.USER_ID=o.USER_ID;';
    const selSignup = 'SELECT tbl.* FROM (SELECT title, location, creator_user_id, start_time, end_time FROM signup_meetings WHERE start_time > NOW() ORDER BY start_time ASC) as tbl GROUP BY tbl.creator_user_id;';

    con.query(selLect, function(err, result){
        if(err) throw err;
        con.query(selSignup, function(err, signup){
            if(err) throw err;
            res.send({ list: result, signup: signup});
        });
    });
});

app.post('/inserttype', function(req,res){
    const data = req.body;
    const createType = "INSERT INTO officehours_type_property ( USER_ID, TYPE, Web_site, Location, Start_date, End_date, Start_time, End_time, Day ) VALUES ( '"+data.id+"', '"+data.type+"', '"+data.web_site+"', '"+data.location+"', '"+data.start_date+"', '"+data.end_date+"', '"+data.start_time+"', '"+data.end_time+"', '"+data.day+"' )";
    
    con.query(createType, function(err, result){
        console.log(result);
    });  
});

app.post('/changetype', function(req,res){
    const data = req.body;
    const changeType = "UPDATE officehours_type_property SET TYPE='"+data.type+"', Web_site='"+data.web_site+"', Location='"+data.location+"', Start_date='"+data.start_date+"', End_date='"+data.end_date+"', Start_time='"+data.start_time+"', End_time='"+data.end_time+"', Day='"+data.day+"' WHERE USER_ID='"+data.id+"'";
    
    con.query(changeType, function(err, result){
        console.log(result);
    });  
});

app.post('/getpermission', function(req,res){
    const data = req.body;
    const getSessionId = 'http://localhost:8080/sakai-ws/rest/portallogin/loginAndCreate?id=admin&pw=test&firstName=dummywert&lastName=dummywert&eMail=dummywert';

    request(getSessionId, function(err, response, body){
        if(err) throw err;
        if((response && response.statusCode) === 200 ){
            const sessionId = body;
            const getSiteId ='SELECT USER_ID FROM sakai_user_id_map WHERE EID="'+data.Eid+'";';
            con.query(getSiteId, function(err, result){
                if(err) throw err;
                const userId = result[0].USER_ID;
                if(userId === data.siteId){
                    //const getMaintain = 'http://localhost:8080/sakai-ws/rest/sakai/addMemberToAuthzGroupWithRole?sessionid='+sessionId+'&eid='+data.Eid+'&authzgroupid=/site/~'+data.siteId+'&roleid=maintain';
                   // request(getMaintain, function(err, response, body){
                    //    if(err) throw err;
                    //    console.log("maintain",body);
                    //});
                } else {
                    const getPermission = 'http://localhost:8080/sakai-ws/rest/sakai/addMemberToAuthzGroupWithRole?sessionid='+sessionId+'&eid='+data.Eid+'&authzgroupid=/site/~'+data.siteId+'&roleid=access';

                    request(getPermission, function(err, response, body){
                        if(err) throw err;
                        console.log("access",body);
                    });

                }
            });
            
        };
    });
});

app.post('/usesignup', function(req,res){
    const data = req.body;
    const getSessionId = 'http://localhost:8080/sakai-ws/rest/portallogin/loginAndCreate?id=admin&pw=test&firstName=dummywert&lastName=dummywert&eMail=dummywert';
    const checkSignupTool = 'SELECT * from sakai_site_tool where REGISTRATION="sakai.signup" and SITE_ID="~'+data.id+'"';
    const getSignupUrl = 'SELECT TOOL_ID from sakai_site_tool where REGISTRATION="sakai.signup" and SITE_ID="~'+data.id+'"';
    
    con.query(checkSignupTool, function(err, result){
        if(err) throw err;
        if(result.length < 1) {
            request(getSessionId, function(error, response, body){
                if(error) throw error;
                if((response && response.statusCode) === 200 ){
                    const sessionId = body;
                    const addSignupTool = 'http://localhost:8080/sakai-ws/rest/sakai/addToolAndPageToSite?sessionid='+sessionId+'&siteid=~'+data.id+'&toolid=sakai.signup&pagetitle=Sign-up&tooltitle=Sign-up&pagelayout=0&position=0&popup=0';
                    request(addSignupTool, function(error, response, body){
                        if(error) throw error;
                        if((response && response.statusCode) === 200 ){
                            console.log(body);
                            con.query(getSignupUrl, function(err, result){
                                if(err) throw err;
                                res.send({ signupUrl: result });
                            });  
                        }
                    });

                };
            });
        } else {
            con.query(getSignupUrl, function(err, result){
                if(err) throw err;
                res.send({ signupUrl: result });
            });  
        }
    });
});

app.post('/changewebsite', function(req,res){
    const data = req.body;
    const changeWebsite = "UPDATE officehours_type_property SET Web_site='"+data.website+"' WHERE USER_ID='"+data.id+"'";

    con.query(changeWebsite, function(err, result){
        if(err) throw err;
        console.log(result);
    });
});

app.post('/changelocation', function(req,res){
    const data = req.body;
    const changeLocation = "UPDATE officehours_type_property SET Location='"+data.location+"' WHERE USER_ID='"+data.id+"'";

    con.query(changeLocation, function(err, result){
        if(err) throw err;
        console.log(result);
    });
});

app.post('/changedate', function(req,res){
    const data = req.body;
    const changeDate = "UPDATE officehours_type_property SET Start_date='"+data.start_date+"', End_date='"+data.end_date+"', Start_time='"+data.start_time+"', End_time='"+data.end_time+"', Day='"+data.day+"' WHERE USER_ID='"+data.id+"'";
    
    con.query(changeDate, function(err, result){
        if(err) throw err;
        console.log(result);
    });
});