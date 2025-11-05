import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { addComment } from '../../../../core/interfaces/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private readonly http=inject(HttpClient)

  createComment(data:addComment):Observable<any>{
    return this.http.post(environment.baseUrl + `${'comments'}`,data)
  }
  
  getPostComment(idPost:string):Observable<any>{
    return this.http.get(environment.baseUrl+`posts/${idPost}/comments`)
  }

  // https://linked-posts.routemisr.com/comments/664d47ffbc90df274cc45b00

  updateComment(idComment:string,data:object):Observable<any>{
    return this.http.put(environment.baseUrl+`comments/${idComment}`,data)
  }

    deleteComment(idComment:string):Observable<any>{
    return this.http.delete(environment.baseUrl+`comments/${idComment}`)
  }


}
