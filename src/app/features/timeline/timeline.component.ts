import { ToastrService } from 'ngx-toastr';
import { Component, inject, input, OnInit, signal, WritableSignal } from '@angular/core';
import { CreatePostComponent } from "../../shared/components/create-post/create-post.component";
import { SPostComponent } from "../../shared/components/s-post/s-post.component";
import { PostService } from '../../shared/components/s-post/services/post.service';
import { Post } from '../../core/interfaces/posts';
import { PaginatorModule } from 'primeng/paginator';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { SkeletonCardComponent } from "../../shared/components/skeleton-card/skeleton-card.component";
import { initFlowbite } from 'flowbite';
import { NavbarComponent } from "../../core/layouts/main-layout/components/navbar/navbar.component";


@Component({
  selector: 'app-timeline',
  imports: [CreatePostComponent, SPostComponent, PaginatorModule, InfiniteScrollDirective, SkeletonCardComponent, NavbarComponent],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',

})


export class TimelineComponent implements OnInit {

  allPosts: WritableSignal<Post[]> = signal([]);
  pageNumber: WritableSignal<number> = signal(0);
  lastpagePostNum: WritableSignal<number> = signal(0);
  private readonly postService = inject(PostService);
  private toastrService = inject(ToastrService);

  isLoading = signal(false);
  loader = signal(false);

  


  ngOnInit(): void {
       initFlowbite();
   
    this.getLenthAndFirstGetAllPosts();

  }




  getLenthAndFirstGetAllPosts() {
    this.postService.GetAllPostsInfo().subscribe({
      next: (res) => {
        this.pageNumber.set(res.paginationInfo.numberOfPages);
        this.getAllPosts();
      },
      error: (err) => {
        this.toastrService.error(err.message, err.name);
      }
    })
  }




  getAllPosts() {

    this.loader.set(true);
    this.postService.GetAllPosts(this.pageNumber()).subscribe({
      next: (res) => {

        this.allPosts.update(posts => [...posts, ...res.posts.reverse()]);
        this.isLoading.set(false);
        this.loader.set(false);

        if (res.posts.length == 1) {
          this.pageNumber.update(v => v - 1);
          this.getAllPosts();
        }

      },
      error: (err) => {
        this.toastrService.error(err.message, err.name);
      }
    })

  }



  onScrollDown() {

    if (this.isLoading() || this.pageNumber() <= 1) return;

    this.isLoading.set(true);
    this.pageNumber.update(v => v - 1);
    this.getAllPosts();

  }




  submetPOst(e: boolean) {

    if (e) {


      this.postService.GetAllPostsInfo().subscribe({
        next: (res) => {


          this.postService.GetAllPosts(res.paginationInfo.numberOfPages).subscribe({
            next: (res) => {

              console.log(res);
              this.allPosts.update(posts => [res.posts.at(-1)!, ...posts]);

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
      next: (OnePost) => {
        this.allPosts.update(posts =>
          posts.map(existing => existing.id === OnePost.post.id ? { ...existing, ...OnePost.post } : existing)
        );
      },
      error: (err) => console.log(err)
    });
  }





  submetDeletePOst(post: Post) {

    this.allPosts.update(posts =>
      posts.filter(existing => existing.id !== post.id)
    );

  }



}