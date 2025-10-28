import { Component, inject, input, OnInit, signal, WritableSignal } from '@angular/core';
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


export class TimelineComponent implements OnInit{


  private readonly postService = inject(PostService);
  allPosts: WritableSignal<Post[]> = signal([]);
  pageNumber: WritableSignal<number> = signal(0);
  lastPageNumber: WritableSignal<number> = signal(0);
  isLoading = signal(false);
  loader = signal(false);


  ngOnInit(): void {

    
    this.postService.GetAllPostsInfo().subscribe({
      next:(res)=>{
        this.pageNumber.set(res.paginationInfo.numberOfPages)
        this.getAllPosts();
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
    
  }


  getAllPosts() {

    this.loader.set(true) ;
    this.postService.GetAllPosts(this.pageNumber()).subscribe({
      next: (req) => {

        console.log(req);
        this.allPosts.update(posts => [...posts, ...req.posts.reverse()]);
        this.isLoading.set(false);
        this.loader.set(false)

      },
          error:(err)=>{
          console.log(err);
        }
    })

  }


  onScrollDown() {

    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.pageNumber.update(v => v - 1);
    this.getAllPosts();

  }
  
}
