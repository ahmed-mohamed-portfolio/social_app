import { Component, inject, input, OnInit, signal, WritableSignal } from '@angular/core';
import { CreatePostComponent } from "../../shared/components/create-post/create-post.component";
import { SPostComponent } from "../../shared/components/s-post/s-post.component";
import { PostService } from '../../shared/components/s-post/services/post.service';
import { Doc } from '../../core/interfaces/posts';
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

  private readonly postService = inject(PostService);

  allPosts: WritableSignal<Doc[]> = signal([]);
  pageNumber: WritableSignal<number> = signal(1);
  loader = signal(false);
  allPagesCount: WritableSignal<number> = signal(0);



  ngOnInit(): void {
    initFlowbite();

    this.getAllPosts()

  }




  getAllPosts() {

    this.loader.set(true);
    this.postService.GetAllPosts(this.pageNumber()).subscribe({
      next: (res) => {
        console.log("getAllPosts res", res);

        this.allPagesCount.set(res.data.pages)
        this.allPosts.update(current => [...current, ...res.data.docs]);
        this.loader.set(false);


      },
      error: (err) => {
        console.log("err.message", err.message);
      }
    })

  }



  onScrollDown() {

    if (this.allPagesCount() === this.pageNumber() || this.pageNumber() < 1) return;

    this.pageNumber.update(v => v + 1);
    this.getAllPosts();

  }




  submetPOst(e: boolean) {

    if (e) {

      this.postService.GetAllPosts(this.pageNumber()).subscribe({
        next: (res) => {

          console.log(res);
          this.allPosts.update(posts => [res.data.docs.at(0)!, ...posts]);

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
      next: (res) => {

        this.allPosts.update(posts =>
          posts.map(existing => existing._id === res.data._id ? { ...existing, ...res.data } : existing)
        );
      },
      error: (err) => console.log(err)
    });
  }

  submetDeletePOst(post: Doc) {

    this.allPosts.update(posts =>
      posts.filter(existing => existing.id !== post.id)
    );

  }



}