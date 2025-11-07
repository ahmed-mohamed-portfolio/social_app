import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../shared/components/s-post/services/post.service';
import { SPostComponent } from '../../shared/components/s-post/s-post.component';
import { Post } from '../../core/interfaces/posts';
import { NavbarComponent } from "../../core/layouts/main-layout/components/navbar/navbar.component";

@Component({
  selector: 'app-details-post',
  imports: [SPostComponent, NavbarComponent],
  templateUrl: './details-post.component.html',
  styleUrl: './details-post.component.scss'
})


export class DetailsPostComponent implements OnInit {

  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly postService = inject(PostService)
  post: WritableSignal<Post> = signal({} as Post)



ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe({
    next: (params) => {
      const id = params.get('id');
      if (!id) { return; }
      this.postService.GetSinglePosts(id).subscribe({
        next: (res) => {this.post.set(res.post);}
        ,error:(err)=>{console.log(err);}
      });
    },error:(err)=>{console.log(err);}
  });

}


}
