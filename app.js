
// IMPORTING ALL REQUIRED  MODULES

const express = require("express");
const mongoose = require('mongoose');
const needle = require('needle');
const cors=require('cors');
const app=express();
const { Kafka } = require("kafkajs")




// The code below sets the bearer token from your environment variables
// To set environment variables on macOS or Linux, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'
const token = 'AAAAAAAAAAAAAAAAAAAAAB7sdAEAAAAATWzu8ctz%2FhPaUDCxqPnygkcexJk%3DqvvUvHjNrUjXYgQJQDlEs0N1HQ5mv3z0DzIjHFjCntZ91yrqam';



// the client ID lets kafka know who's producing the messages
const clientId = "my-app"
// we can define the list of brokers in the cluster
const brokers = ["localhost:9092"]
// this is the topic to which we want to write messages
const topic = "thefirst1"

// initialize a new kafka client and initialize a producer from it
const kafka = new Kafka({ clientId, brokers });

const producer = kafka.producer();

var tweetis=[];

// we define an async function that writes a new message each second
const tokafka = async (tweet) => {
	await producer.connect()
	let i = 0

	// after the produce has connected, we start an interval time
		try {
			// send a message to the configured topic with
			// the key and value formed from the current value of `i`
			await producer.send({
				topic,
				messages: [
					{
						key: tweet.id,
						value: tweet.text,
					},
				],
			})

			// if the message is written successfully, log it and increment `i`
			 
		} catch (err) {
			console.error("could not write message " + err)
		}
}

//THE TWO SCHEMAS

const respschema = new mongoose.Schema({
  id : String,
  text : String,
  response:String
})

const tweetschema = new mongoose.Schema({
  tweet:Object
});

//THE TWO MODELS

const Tweet = new mongoose.model('tweet',tweetschema);

const Resptweet = new mongoose.model('resptweet',respschema);


app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin","*"); // update to match the domain you will make the request from
    //res.header();
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // CONNECTING TO MONGODB

  mongoose.connect("mongodb+srv://praveenb:Technothlon@getsganga.pgyia.mongodb.net/userd",{useNewUrlParser:true});


  //getting id and text of tweets

async function getRequest(thetext) {

    const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";

    // Edit query parameters below
    // specify a search query, and any additional fields that are required
    // by default, only the Tweet ID and text fields are returned
    const params = {
        'query':thetext
         
    }

    const res = await needle('get', endpointUrl, params, {
        headers: {
            "authorization": `Bearer ${token}`
        }
    })

    if (res.body) {
        return res.body;
    } else {
        throw new Error('Unsuccessful request');
    }
}

 //getting who liked the tweet

 async function getliked(id) {
    // These are the parameters for the API request
    // by default, only the Tweet ID and text are returned

     
    
    const endpointURL = `https://api.twitter.com/2/tweets/`+id+`/retweeted_by`;
    
  
    // this is the HTTP header that adds bearer token authentication
    const res = await needle("get", endpointURL , {
      headers: {
        "User-Agent": "v2LikedTweetsJS",
        authorization: `Bearer ${token}`
      },
    });
  
    if (res.body) {
      return res.body;
    } else {
      throw new Error("Unsuccessful request");
    }
  }
  

 
//making tweets goto kafka

async function takehim(data){
try{
  var length = data.length;
  const respit = await data.map(function(eachtweet,index){
    tweetis.push(eachtweet);
    tokafka(eachtweet).catch((err) => {
      throw new Error("Unsuccessful");
    });
  });

  
  

  return respit;

}
catch{
  throw new Error("Unsuccessful");
}
  
}

// GETTING THE TWEETS FROM DATABASE WHICH IS STORED BY PYTHON

app.get("/againget",function(req,res){

  Resptweet.find({},(err,results) =>{
              
    res.json(results);
  });


});
 

//calling to get the id and text of tweets

app.get("/first/:query",function(req,res){

    const query=req.params.query;

    (async  () => {

        try {
            // Make request
            const response = await getRequest(query);
            const {data,meta}=response;
            if(!data)
            res.json({'body':'no tweets on this word'});
            else{
              
              let response = await takehim(data);
             res.json(data);
          }
    
        } catch (e) {
            console.log(e);
            process.exit(-1);
        }
    })();
 
});

//calling to get who liked the tweet

app.get("/getliked/:id",function(req,res){

   const id=req.params.id;

    (async () => {
        try {
          // Make request
          const response = await getliked(id);
          const {data,meta}=response;
          res.json(data);
        } catch (e) {
          console.log(e);
          process.exit(-1);
        }
      })();
 
});

// STORING THE TWEET SENT BY ANGULAR APPLICATION TO THE DATABASE(FAVOURITE)

app.get("/gettodatabase/:tweet",function(req,res){

  let thetw=req.params.tweet;

  //VARIABLE TO STORE THE TEXT OF TWEET OF GIVEN ID
   
  let club="";


  tweetis.map(function(eachtweet){
console.log(eachtweet.id);
    if(eachtweet.id==thetw){
      club=eachtweet.text;
    }
  });

//CREATING THE ITEM OF MONGODB

  const item=new Tweet({
    tweet:club
  });

  try{

    // SAVING THE ITEM IN MONGODB

   item.save(function(err){
     if(err){
       console.log(err);
     }
     else{
       Tweet.find({},function(err,results){
        res.json(results);
       });
     }
   });
  
  }

  // IF ERROR IN SAVING ITEM IN MONGODB
    
  catch(err){
    console.log(err);

  }
          
       
  });

  //DELETING THE ITEM FROM DATABASE

  app.get("/delete/:id",function(req,res){
   
    let id=req.params.id;
    
    Tweet.deleteOne({_id:id},function(err,results){
      if(err)
      console.log(err);
      else{
        Tweet.find({},function(err,results){
          res.json(results);
        });
      }
    })
  });

  // GETTING TWEETS FROM THE DATABASE STORED BY PYTHON

  app.get("/gettweets",function(req,res){
  
    try{
     Tweet.find({},function(err,results){
       res.json(results);


     });
    
    }
    catch(err){
      console.log(err);
    }
  
     
            
         
    });

app.listen(3000,function(){
    console.log("server is listening");
});
