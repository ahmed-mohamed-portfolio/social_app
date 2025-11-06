import { Component, inject, input, OnInit, output, signal, WritableSignal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { initFlowbite } from 'flowbite';
import { PostService } from '../s-post/services/post.service';



@Component({
  selector: 'app-create-post',
  imports: [FormsModule, InputTextModule, Dialog, ButtonModule, TextareaModule, ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})



export class CreatePostComponent implements OnInit {

  private readonly postService = inject(PostService)

  saveFile: WritableSignal<File | null> = signal(null)

  contents: FormControl = new FormControl(null, [Validators.required])

  visible: WritableSignal<boolean> = signal(false);

  value: string = "";

  value2!: string;

  url: WritableSignal<string | null> = signal(null);

  newPost = output<boolean>();

  inProfile = input<boolean>(false);


  ngOnInit(): void {
    initFlowbite();
  }


  showDialog() {
    this.visible.set(true)
  }


  changeImage(e: Event): void {

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

  }


  removeImg() {

    this.url.set(null)
    this.saveFile.set(null)

  }

  submitForm(e: Event): void {

    if (this.contents.valid) {

      const formData = new FormData()

      formData.append('body', this.contents.value)

      let file = this.saveFile()

      if (file) {
        formData.append('image', file, file.name)
      }


      this.addNewPost(formData);


    }

  }




  addNewPost(formData: FormData) {



        this.postService.createPost(formData).subscribe({
          next: (res) => {
            console.log(res);
            this.visible.set(false)
            this.newPost.emit(true);

            this.contents.reset();
            this.saveFile.set(null);
            this.url.set(null);

          },
          error: (err) => {
            console.log(err);
          }
        })





  }
}
