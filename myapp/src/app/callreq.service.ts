import { Injectable } from '@angular/core';
import { TtwwService } from './ttww.service';

@Injectable({
  providedIn: 'root'
})
export class CallreqService {

  constructor(private ttwwService:TtwwService) { }

// WE WILL SEND THE WORD TO TWITTER API TO GET TWEETS BASED ON THE WORD WE TYPE


  sendreq(query:string){
   return  this.ttwwService.get('first/'+query);
  }

  // TO GET THE TWEETS FROM DATABASE THAT IS STORED BY PYTHON


  getthem(){
    return this.ttwwService.againget();
  }

  // GETS THE FAVOURITE TWEETS FROM DATABASE


  getdata(){

    return this.ttwwService.getfrombase();
  }

  // // FUNCTION THAT ADDS THE FAVOURITE TWEETS TO THE DATABASE

  sendtweet( tweet:String){
 
    
   return this.ttwwService.givetweet(tweet);
  }

  // TO DELETE THE TWEETS FROM DATABASE WHICH STORES FAVOURITE TWEETS THAT IS ADDED BY ADD TO FAVOURITE BUTTON
  

  cutit(id:any){
   
    return this.ttwwService.deletebase(id);
  }

  // RETURNS THE USERS WHO RETWEETED THE TWEET WITH ID


  sendtouser(id:String){
    return this.ttwwService.getuser('getliked/'+id)
  }
}
