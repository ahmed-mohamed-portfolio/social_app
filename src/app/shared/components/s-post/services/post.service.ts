import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { Doc, postsReturn, singlePost, userPosts } from '../../../../core/interfaces/posts';
import { DeletePostRes } from '../interfaces/delete-post-res';


@Injectable({
   providedIn: 'root'
})

export class PostService {

   private readonly http = inject(HttpClient)

   createPost(data: object): Observable<any> {
      return this.http.post(environment.baseUrl + '/post', data)
   }

   GetAllPosts(pageNumber: number): Observable<postsReturn> {
      return this.http.get<postsReturn>(environment.baseUrl + `/post?page=${pageNumber}`)
   }

   editPost(data: object, id: string): Observable<any> {
      console.log("dataEdit", data);

      return this.http.patch(environment.baseUrl + `/post/${id}`, data)
   }

   GetSinglePosts(id: string | null): Observable<singlePost> {
      return this.http.get<singlePost>(environment.baseUrl + `/post/${id}`)
   }

   GetUserPosts(userId: string): Observable<userPosts> {
      return this.http.get<userPosts>(environment.baseUrl + `/post/user/${userId}`)
   }

   deletePost(id: string): Observable<DeletePostRes> {
      return this.http.delete<DeletePostRes>(environment.baseUrl + `/post/${id}`)
   }

}
