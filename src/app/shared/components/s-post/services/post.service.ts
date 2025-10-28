import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { allPosts } from '../../../../core/interfaces/posts';

@Injectable({
  providedIn: 'root'
})

export class PostService {
  
private readonly http = inject(HttpClient) 

createPost(data:object):Observable<any>{
   return  this.http.post(environment.baseUrl+'posts',data)
}

GetAllPosts(pageNumber:number):Observable<allPosts>{
   return  this.http.get<allPosts>(environment.baseUrl+`posts?page=${pageNumber}`)
}

GetUserPosts(id:string):Observable<any>{
   return  this.http.get(environment.baseUrl+`users/${id}/posts?limit=2`)
}


}
