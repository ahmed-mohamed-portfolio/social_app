import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CreatePostComponent } from "../../shared/components/create-post/create-post.component";
import { SPostComponent } from "../../shared/components/s-post/s-post.component";
import { PostService } from '../../shared/components/s-post/services/post.service';
import { Post } from '../../core/interfaces/posts';
import { PaginatorModule } from 'primeng/paginator';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { SkeletonCardComponent } from "../../shared/components/skeleton-card/skeleton-card.component";


@Component({
  selector: 'app-timeline',
  imports: [CreatePostComponent, SPostComponent, PaginatorModule, InfiniteScrollDirective, SkeletonCardComponent],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',

})


export class TimelineComponent implements OnInit {


  private readonly postService = inject(PostService);
  allPosts: WritableSignal<Post[]> = signal([]);
  pageNumber: WritableSignal<number> = signal(0);
  lastpagePostNum: WritableSignal<number> = signal(0);

  isLoading = signal(false);
  loader = signal(false);


  ngOnInit(): void {

    this.getLenthAndFirstGetAllPosts()

  }


  getLenthAndFirstGetAllPosts() {
    this.postService.GetAllPostsInfo().subscribe({
      next: (res) => {
        this.pageNumber.set(res.paginationInfo.numberOfPages)
        this.getAllPosts();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }


  getAllPosts() {

    this.loader.set(true);
    this.postService.GetAllPosts(this.pageNumber()).subscribe({
      next: (res) => {

        console.log(res);

        this.allPosts.update(posts => [...posts, ...res.posts.reverse()]);
        this.isLoading.set(false);
        this.loader.set(false)

        if(res.posts.length==1){
              this.pageNumber.update(v => v - 1);
                  this.getAllPosts();

        }

      },
      error: (err) => {
        console.log(err);
      }
    })

  }


  onScrollDown() {

    if (this.isLoading() || this.pageNumber()<=1 ) return;

    this.isLoading.set(true);
    this.pageNumber.update(v => v - 1);
    this.getAllPosts();

  }



  submetPOst(e: boolean) {
    console.log(e);
    if (e) {

      
    this.postService.GetAllPostsInfo().subscribe({
      next: (res) => {

      
      this.postService.GetAllPosts(res.paginationInfo.numberOfPages).subscribe({
        next: (req) => {

          console.log(req);
          this.allPosts.update(posts => [req.posts.at(-1)!,...posts]);

        },
        error: (err) => {
          console.log(err);
        }
      })

      },
      error: (err) => {
        console.log(err);
      }
    })

      e = false;
    }

  }


  submetEditPOst(postId: string | null) {
    if (!postId) {
      return;
    }

    this.postService.GetSinglePosts(postId).subscribe({
      next: ( OnePost ) => {
        this.allPosts.update(posts =>
          posts.map(existing => existing.id === OnePost.post.id ? { ...existing, ...OnePost.post } : existing )
        );
      },
      error: (err) => console.log(err)
    });
  }



  
}
