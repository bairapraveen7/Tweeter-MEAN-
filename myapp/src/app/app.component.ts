import { Component } from '@angular/core';
import { response } from 'express';
import { CallreqService } from './callreq.service';
import {tweet} from './tweets';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { theusers } from './user';
import {array} from './array';
import { TweetRetweetersUsersV2Paginator } from 'twitter-api-v2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'twitters';
 
  // FOR MAGNIFYING GLASS ICON AT SEARCH BAR

  magnify=faMagnifyingGlass;

  // COFFE ICON DONT KNOW WHERE IS IT

  coff=faCoffee;

  val='';

  // TO STORE TWEETS SENT BY SERVER WHETHER IT IS FROM API OR DATABASE BY PYTHON
    
  public  tweets:tweet[]=[];

  // USERS WHO RETWEETED THE TWEETS

  public users:theusers[]=[];

  // TO STORE THE FAVOURITE TWEETS THAT WE STORED BY CLICKING BUTTON ADD TO FAVOURITE

  public tweetsfrombase:array[]=[];

  // IT STORES ONLY THE TWEETS WHICH MATCH THE WORD IN SEARCH BAR

  justthetweet:String[]=[];



 madeid:String='';

 // VARIABLE TO SEPARATE WHETHER TWEETS FROM DATABASE OR TWITTER API

 responseis = false;



 scrollup=false;

 scrolldown=true;

 theval=false;

 nodata=false;

  boolean=false;

  constructor(private callk:CallreqService ){}

  changeval(givenval:string){
    this.val=givenval;
  }

  

  // THE FUNCTION SEARCHES THE TWEETS WHICH MATCH THE WORD FROM TWEETS DATABASE AND STORES MATCHED TWEETS IN JUSTTHETWEETS ARRAY

  searchtweet(word:string){


    if(word.localeCompare("")==0){
      console.log(1);
      
    this.scrollup=false;
    this.scrolldown=true;
    }
    else{
    this.scrolldown=false;
    this.scrollup=true;
    }

    this.justthetweet=[];
    
     for(const item in this.tweetsfrombase){
       
      let str=this.tweetsfrombase[item].tweet.toLowerCase();
      if(str.includes(word))
      this.justthetweet.push(this.tweetsfrombase[item].tweet);
      
     }
     
  
    
  }

  // FUNCTION THAT ADDS THE FAVOURITE TWEETS TO THE DATABASE

  sendtodatabase(tweet:String){
    
     
  
    
    this.callk.sendtweet(tweet).subscribe((response)=>{
      

      this.tweetsfrombase=response;


    },(error) => {
      console.log("error is ",error);
    });

  }

  // TO DELETE THE TWEETS FROM DATABASE WHICH STORES FAVOURITE TWEETS THAT IS ADDED BY ADD TO FAVOURITE BUTTON
  
   

  deletefrombase(id:any){
    

    this.callk.cutit(id).subscribe((response)=>{
      this.tweetsfrombase=response;
      
    },(error)=>{
      console.log(error);
    });
  }

  // TO GET THE TWEETS FROM DATABASE THAT IS STORED BY PYTHON


  gettweets(){
    this.callk.getthem().subscribe((response)=>{
      this.tweets = response;
    },(error) =>{
      console.log("there is error");
    } );
  }

  // AS WE ARE USING ONLY ONE ARRAY TO STORE TWEETS FROM API AND DATABASE
  // WE NEED TO CHECK WHETHER WE GET UNDEFINED RESPONSE OR STRING RESPONSE

  checkresponse(itsresp:String){
 
    if(typeof(itsresp) == "string")
    return true;
    else
    return false;
  }

  // WE WILL SEND THE WORD TO TWITTER API TO GET TWEETS BASED ON THE WORD WE TYPE

  sendit(query:string){
    
    this.callk.sendreq(query).subscribe((response) =>{
      this.tweets=response;
      if(this.tweets.hasOwnProperty('body'))
       { this.nodata=true;
         this.tweets=[];

       }
      else{
        this.nodata=false;
      }
    },(error)=> {
      console.log("error is " , error);
    });
    
  }

  // CHECKS 


  checkif(id:String){
    if(this.madeid==id && this.boolean){
      return true;
    }
    return false;
  }

  checkname(id:String){
    if(this.madeid==id && !this.boolean){
      return true;
    }
    return false;
  }

  // RETURNS THE USERS WHO RETWEETED THE TWEET WITH ID

  retus(id:String){

    this.madeid=id;
    
    this.callk.sendtouser(id).subscribe((response)=>{

      this.users=response;
      this.boolean=false;
      if(!this.users){
        this.boolean=true;
      }
      
    },(error)=>{
      console.log("error is ",error);
    })

  }
}
