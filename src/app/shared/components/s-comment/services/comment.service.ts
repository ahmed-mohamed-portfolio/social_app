import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { addComment } from '../../../../core/interfaces/comment';
import { CreateCommentRes } from '../../s-post/interfaces/create-comment-res';
import { EditCommentRes } from '../interfaces/edit-comment-res';
import { DeleteCommentRes } from '../interfaces/delete-comment-res';

@Injectable({
  providedIn: 'root'
})

export class CommentService {

  private readonly http = inject(HttpClient)

  createComment(data: addComment, postId: string): Observable<CreateCommentRes> {
    return this.http.post<CreateCommentRes>(environment.baseUrl + `/post/${postId}/comment`, data)
  }

  updateComment(idComment: string, postId: string, data: object): Observable<EditCommentRes> {
    return this.http.put<EditCommentRes>(environment.baseUrl + `/post/${postId}/comment/${idComment}`, data)
  }

  deleteComment(idComment: string, postId: string): Observable<DeleteCommentRes> {
    return this.http.delete<DeleteCommentRes>(environment.baseUrl + `/post/${postId}/comment/${idComment}`)
  }

}
