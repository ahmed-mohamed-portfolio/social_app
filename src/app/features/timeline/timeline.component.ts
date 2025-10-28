import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CreatePostComponent } from "../../shared/components/create-post/create-post.component";
import { SPostComponent } from "../../shared/components/s-post/s-post.component";
import { PostService } from '../../shared/components/s-post/services/post.service';
import { Post } from '../../core/interfaces/posts';
import { Skeleton } from 'primeng/skeleton';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-timeline',
  imports: [CreatePostComponent, SPostComponent, Skeleton, PaginatorModule, InfiniteScrollDirective],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',

})


export class TimelineComponent {

  allPosts: WritableSignal<Post[]> = signal([])
  pageNumber: WritableSignal<number> = signal(11)
  isLoading = signal(false);
  private readonly postService = inject(PostService)


  ngOnInit(): void {
    this.getAllPosts();
  }


  getAllPosts(pageNumber: number = 11) {

    this.postService.GetAllPosts(pageNumber).subscribe({
      next: (req) => {
        console.log(req);
        this.allPosts.update(posts => [...posts, ...req.posts.reverse()]);
        this.isLoading.set(false);

      }
    })

  }

  onScrollDown() {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.pageNumber.update(v => v - 1)
    this.getAllPosts(this.pageNumber())

  }

  

  
}
