import { ToastrService } from 'ngx-toastr';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ProfileDataService } from '../../core/services/profile-data.service';
import { UserInfo } from '../../core/interfaces/user-info';
import { DatePipe } from '@angular/common';
import { PostService } from '../../shared/components/s-post/services/post.service';
import { Post } from '../../core/interfaces/posts';

@Component({
  selector: 'app-profile',
  imports: [DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})


export class ProfileComponent implements OnInit {

  userData: WritableSignal<UserInfo | null> = signal(null)
  saveFile: WritableSignal<File | null> = signal(null)
  profileDataService = inject(ProfileDataService)
  url: WritableSignal<string | null> = signal(null);
  toastrService=inject(ToastrService)
  postService=inject(PostService)

  allUserPosts:WritableSignal<Post[]>=signal([])
  numberOfPages:WritableSignal<number>=signal(0)
  
  ngOnInit(): void {

    this.getProfileInfos();

  }


  getProfileInfos() {
    this.profileDataService.getProfileData().subscribe({
      next: (res) => {
        this.userData.set(res)


          this.postService.GetUserPosts(res.user._id).subscribe({
            next:(res)=>{
             console.log("all user posts",res);
             this.allUserPosts.set(res.posts)
             this.numberOfPages.set(res.paginationInfo.numberOfPages)
            }
          })


      }
    })
  }



  changeImage(e: Event) {
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
        formData.append('photo', file, file.name)
      }

      this.changeImgApi(formData);


    

  }

changeImgApi(formData:FormData){

      this.profileDataService.uploadProfilePhoto(formData).subscribe({
      next: (res) => {
        console.log(res);
        this.toastrService.success(res.message)


      this.saveFile.set(null);

      },
          error:(err)=>{
          console.log(err);
          this.toastrService.error(err.message)

        }
    })


}
  



}
