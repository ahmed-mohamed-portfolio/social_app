import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { allPosts, Post } from '../../../../core/interfaces/posts';
import { OnePost } from '../../../../core/interfaces/one-post';

@Injectable({
  providedIn: 'root'
})

export class PostService {
  
private readonly http = inject(HttpClient) 

createPost(data:object):Observable<any>{
   return  this.http.post(environment.baseUrl+'posts',data)
}

editPost(data:object,id:string):Observable<any>{
   return  this.http.put(environment.baseUrl+`posts/${id}`,data)
}

GetAllPosts(pageNumber:number):Observable<allPosts>{
   return  this.http.get<allPosts>(environment.baseUrl+`posts?page=${pageNumber}`)
}

GetAllPostsInfo():Observable<allPosts>{
   return  this.http.get<allPosts>(environment.baseUrl+`posts`)
}

GetSinglePosts(id:string|null):Observable<OnePost>{
   return  this.http.get<OnePost>(environment.baseUrl+`posts/${id}`)
}

GetUserPosts(id:string):Observable<any>{
   return  this.http.get(environment.baseUrl+`users/${id}/posts?limit=2`)
}

deletePost(id:string):Observable<any>{
   return  this.http.delete(environment.baseUrl+`posts/${id}`)
}

}
