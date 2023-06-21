import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tweet} from './tweets';
import { theusers } from './user';
import { array } from './array';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TtwwService {

  readonly ROOT_URL;

  constructor(private http:HttpClient) { 

    this.ROOT_URL="http://localhost:3000";

  }

  // WE WILL SEND THE WORD TO TWITTER API TO GET TWEETS BASED ON THE WORD WE TYPE


  get(url:String):Observable<tweet[]>{
    
    return this.http.get<tweet[]>(this.ROOT_URL+"/"+url);
  }

   // TO GET THE TWEETS FROM DATABASE THAT IS STORED BY PYTHON


  againget():Observable<tweet[]>{
    return this.http.get<tweet[]>(this.ROOT_URL+"/againget");
  }

  // GETS THE FAVOURITE TWEETS FROM DATABASE


  getfrombase():Observable<array[]>{
      
    return this.http.get<array[]>(this.ROOT_URL + "/gettweets");
  }

   // FUNCTION THAT ADDS THE FAVOURITE TWEETS TO THE DATABASE



  givetweet(tweet:String):Observable<array[]>{
    return this.http.get<array[]>(this.ROOT_URL+"/gettodatabase/"+tweet);
  }

  // TO DELETE THE TWEETS FROM DATABASE WHICH STORES FAVOURITE TWEETS THAT IS ADDED BY ADD TO FAVOURITE BUTTON
  

  deletebase(id:any):Observable<array[]>{
     
    return this.http.get<array[]>(this.ROOT_URL+"/delete/"+id);
  }

  // RETURNS THE USERS WHO RETWEETED THE TWEET WITH ID


  getuser(url:String):Observable<theusers[]>{

    return this.http.get<theusers[]>(this.ROOT_URL+"/"+url);
  }
}
