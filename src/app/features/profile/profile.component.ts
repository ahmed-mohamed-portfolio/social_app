import { ToastrService } from 'ngx-toastr';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ProfileDataService } from '../../core/services/profile-data.service';
import { UserInfo } from '../../core/interfaces/user-info';
import { DatePipe } from '@angular/common';
import { PostService } from '../../shared/components/s-post/services/post.service';
import { Doc } from '../../core/interfaces/posts';
import { SPostComponent } from "../../shared/components/s-post/s-post.component";
import { SkeletonCardComponent } from "../../shared/components/skeleton-card/skeleton-card.component";
import { CreatePostComponent } from "../../shared/components/create-post/create-post.component";
import { initFlowbite } from 'flowbite';
import { NavbarComponent } from "../../core/layouts/main-layout/components/navbar/navbar.component";
import { environment } from '../../../environments/environment.development';


@Component({
  selector: 'app-profile',
  imports: [DatePipe, SPostComponent, SkeletonCardComponent, CreatePostComponent, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})


export class ProfileComponent implements OnInit {

  userData: WritableSignal<UserInfo | null> = signal(null)
  saveFile: WritableSignal<File | null> = signal(null)
  profileDataService = inject(ProfileDataService)
  url: WritableSignal<string | null> = signal(null);
  toastrService = inject(ToastrService)
  postService = inject(PostService)
  iamHere: WritableSignal<boolean> = signal(false)
  allUserPosts: WritableSignal<Doc[]> = signal([])
  backendUrlStatic: string = environment.baseUrl + '/uploads/'


  ngOnInit(): void {
    this.iamHere.set(true)
    this.getProfileInfos();
    initFlowbite();

  }


  getProfileInfos() {
    this.profileDataService.getProfileData().subscribe({
      next: (res) => {
        console.log("profile res", res);

        this.userData.set(res)

        this.postService.GetUserPosts(res.data._id).subscribe({
          next: (res) => {

            console.log("all user posts", res);
            this.allUserPosts.set(res.data)

          }
        })

      }
    })
  }

  changeImageProfile(e: Event) {
    let input = e.target as HTMLInputElement

    if (input.files && input.files.length > 0) {
      this.saveFile.set(input.files[0])


      // https://www.youtube.com/watch?v=Z5Yf0xJVXYI
      const reader = new FileReader()
      reader.readAsDataURL(input.files[0])
      reader.onload = (event: any) => {
        this.url.set(event.target.result)

      }
    }



    const formData = new FormData()
    let file = this.saveFile()

    if (file) {
      formData.append('attachment', file, file.name)
    }

    this.changeImgApi(formData);




  }

  changeImgApi(formData: FormData) {

    this.profileDataService.uploadProfilePhoto(formData).subscribe({
      next: (res) => {
        console.log(res);
        this.toastrService.success(res.message)


        this.saveFile.set(null);

      },
      error: (err) => {
        console.log("error", err);
        // this.toastrService.error(err.message)

      }
    })


  }

  submetEditPOst(postId: string | null) {
    if (!postId) {
      return;
    }

    this.postService.GetSinglePosts(postId).subscribe({
      next: (res) => {
        this.allUserPosts.update(posts =>
          posts.map(existing => existing._id === res.data._id ? { ...existing, ...res.data } : existing)
        );
      },
      error: (err) => console.log(err)
    });
  }

  submetDeletePOst(post: Doc) {

    this.allUserPosts.update(posts =>
      posts.filter(existing => existing.id !== post.id)
    );

  }

  submetPOst(e: boolean) {
    if (e) {

      this.profileDataService.getProfileData().subscribe({
        next: (res) => {


          this.postService.GetUserPosts(res.data._id).subscribe({
            next: (res) => {

              console.log(res);
              this.allUserPosts.set(res.data);
            }
          })


        }
      })


    }
    e = false;

  }

  ngOnDestroy(): void {

    this.iamHere.set(false)

  }

}
