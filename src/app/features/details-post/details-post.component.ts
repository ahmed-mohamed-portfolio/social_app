import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../shared/components/s-post/services/post.service';
import { SPostComponent } from '../../shared/components/s-post/s-post.component';
import { Post } from '../../core/interfaces/posts';

@Component({
  selector: 'app-details-post',
  imports: [SPostComponent],
  templateUrl: './details-post.component.html',
  styleUrl: './details-post.component.scss'
})


export class DetailsPostComponent {

  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly postService = inject(PostService)
  post: WritableSignal<Post> = signal({} as Post)

  ngOnInit(): void {
    this.getPost()
  }

  getPostId() :string | null {
    let  id: WritableSignal<string | null> = signal(null)

    this.activatedRoute.paramMap.subscribe({
       next: (urlParams) => { 
        id.set(urlParams.get('id')); 
      } })

      return id() ;
  }



  getPost() {
    this.postService.GetSinglePosts(this.getPostId()).subscribe({
      next: (res) => {
        console.log(res);
        
        this.post.set(res.post)
      }
    })
  }

}
