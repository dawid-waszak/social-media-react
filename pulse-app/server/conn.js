const mongoose = require("mongoose");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require("express-session");

const app = express();

var ObjectId = mongoose.Types.ObjectId;

const status_friend_request_send = "status_friend_request_send";
const status_friend_request_waiting = "status_friend_request_waiting";
const status_friend = "status_friend";

// MONGOSE 

const uri = "mongodb://localhost:27017/pulse"

const connectToDb = async () => {
    mongoose.connect(uri);
}

connectToDb();

const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    friends: Array
});
  
const User = mongoose.models.User || mongoose.model('User', userSchema);

const postSchema = new mongoose.Schema({
    userId: ObjectId,
    content: String,
    userName: String,
    date: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

var con = mongoose.connection;

// -------------------------------
app.enable('trust proxy')
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, 
        maxAge: 600000,
        sameSite: 'lax'
    } // session timeout of 60 seconds
}));

app.post('/login', async function(req, res){
    
    if(req.session != null){
        const data = await User.findOne({email: req.body.mail, password: req.body.password});
        if(data){
            req.session.isLogged = true;
            req.session.name = data.fullname;
            req.session.mail = data.email;
            req.session.userId = data._id;
            res.send(data);
        }
        else{
            res.send({"userFound": "False"});
        }
    } 
});

app.get('/updateUser', async (req, res) => {
    if(req.session.isLogged == true){
        const data = await User.findOne({_id: req.session.userId});
        if(data){
            req.session.isLogged = true;
            req.session.name = data.fullname;
            req.session.mail = data.email;
            req.session.userId = data._id;
            res.send({"isLogged": true, data: data});
        }
    }
    else{
        res.send({"isLogged": false});
    }
}); 

app.post('/getUser', async function(req, res){
    const data = await User.find({email: req.body.mail});
    if(data.length > 0){
        res.send({userFound: true});
    }else{
        res.send({userFound: false});
    }
});

app.post('/createUser', function(req, res) {
    var newUser = null;
    newUser = new User({
        fullname: req.body.name,
        email: req.body.mail,
        password: req.body.password,
        friends: []
    });
    if(newUser != null){
        con.collection('users').insertOne(newUser);
        res.json({"success": true});
    }
});

app.get('/deleteSession', (req, res) => {
   if(req.session){
        req.session.destroy();
        res.send({"success": true});
   } 
});

app.post('/createPost', function(req, res){
    newPost = new Post({
        userId: req.session.userId,
        content: req.body.content,
        userName: req.session.name
    })
    con.collection('posts').insertOne(newPost);
    res.send({"success": true});
});

app.get('/getPosts', async (req, res) => {
    if(req.session){
        const friends = await User.findOne({_id: req.session.userId}).select('friends -_id').lean();
        var ids = [];
        for(let i = 0; i < friends.friends.length; i++){
            if(friends.friends[i].state == status_friend){
                const id = new ObjectId(String(friends.friends[i].userId));
                ids.push(id);
            }
        }
        ids.push(new ObjectId(req.session.userId));
        const data = await Post.find({userId: {$in: ids}}).sort({date: -1});
        res.send(data);
    } 
 });

 app.get('/friendsProposition', async (req, res) => {
    if(req.session.isLogged == true){
        const friendsList = await User.findOne({_id: req.session.userId}).select("friends -_id").lean();
        var ids = [];
        for(let i = 0; i < friendsList.friends.length; i++){
            const id = new ObjectId(String(friendsList.friends[i].userId));
            ids.push(id);
        }
        ids.push(new ObjectId(req.session.userId));
        var users = [];
        if(ids.length > 0){
            users = await User.find({_id: {$nin: ids}});
        }else{
            users = await User.find({});
        }
        res.send({"success": true, "friends": users});
    }
    else{
        res.send({"success": false});
    }
}); 

app.get('/friendsRequests', async (req, res) => {
    if(req.session.isLogged == true){
        const friendsList = await User.findOne({_id: req.session.userId}).select("friends -_id").lean();
        var ids = [];
        for(let i = 0; i < friendsList.friends.length; i++){
            if(friendsList.friends[i].state == status_friend_request_waiting){
                const id = new ObjectId(String(friendsList.friends[i].userId));
                ids.push(id);
            }
        }
        var users = [];
        if(ids.length > 0){
            users = await User.find({_id: {$in: ids}});
        }
        res.send({"success": true, "friendsReq": users});
    }
    else{
        res.send({"success": false});
    }
}); 

app.get('/friendsList', async (req, res) => {
    if(req.session.isLogged == true){
        const friendsIds = await User.findOne({_id: req.session.userId, 'friends.state': status_friend}).select("friends -_id").lean() || null;
        var ids = [];
        var friendsList = [];
        if(friendsIds != null){
            for(let i = 0; i < friendsIds.friends.length; i++){
                
                if(friendsIds.friends[i].state == status_friend){
                    ids.push(friendsIds.friends[i].userId);
                }
            }
            friendsList = await User.find({_id: {$in: ids}});
        }
        res.send({"success": true, "friends": friendsList});
    }
    else{
        res.send({"success": false});
    }
}); 

app.post('/sendFriendRequest', async function(req, res){
    if(req.session.isLogged == true){
        const friend = {
            userId: new ObjectId(req.session.userId),
            state: status_friend_request_waiting
        }
        const actualUser = {
            userId: new ObjectId(req.body.userId),
            state: status_friend_request_send
        }
        await User.findOneAndUpdate({_id: req.body.userId}, {$push: {friends: friend}});
        await User.findOneAndUpdate({_id: req.session.userId}, {$push: {friends: actualUser}});
        res.send({"success": true});
    }
    else{
        res.send({"success": false});
    }
});

app.post('/handleFriendRequest', async function(req, res){
    if(req.session.isLogged == true){
        if(req.body.state){
            await User.updateOne({
                _id: req.body.friendId, 
                'friends.userId': new ObjectId(req.session.userId)},
            {
                "$set": {'friends.$.state': status_friend}
            });
            await User.updateOne({
                _id: req.session.userId, 
                'friends.userId': new ObjectId(req.body.friendId)},
            {
                "$set": {'friends.$.state': status_friend}
            });
        }
        else{
            await User.updateOne({
                _id: req.body.friendId},
                {
                    $pull: {friends: {userId: new ObjectId(req.session.userId)}}
                });
            await User.updateOne({
                _id: req.session.userId},
                {
                    $pull: {friends: {userId: new ObjectId(req.body.friendId)}}
                });
        }
        res.send({"success": true});
    }
    else{
        res.send({"success": false});
    }
});

app.listen(3000, () => {
    console.log("Server running");
});

