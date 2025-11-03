
import { Component, inject, input, InputSignal, OnInit, output, signal, WritableSignal } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { Post } from '../../../core/interfaces/posts';
import { DatePipe } from '@angular/common';
import { SCommentComponent } from "../s-comment/s-comment.component";
import { initFlowbite } from 'flowbite';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../s-comment/services/comment.service';
import { Comment } from '../../../../app/core/interfaces/posts';
import { RouterLink } from "@angular/router";


import { InputTextModule } from 'primeng/inputtext';
import {  FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { PostService } from '../s-post/services/post.service';



@Component({
    selector: 'app-s-post',
    imports: [Menu, ButtonModule, DatePipe, SCommentComponent, ReactiveFormsModule, RouterLink,    FormsModule, InputTextModule, Dialog, ButtonModule, TextareaModule, ReactiveFormsModule],
    templateUrl: './s-post.component.html',
    styleUrl: './s-post.component.scss'
})


export class SPostComponent implements OnInit {


    private commentService = inject(CommentService)

    commentControl: FormControl = new FormControl(null, [Validators.required])

    post: InputSignal<Post> = input({} as Post)
    // post:InputSignal<Post>=input.required()

    items: MenuItem[] | undefined;

    commentsPost: WritableSignal<Comment[]> = signal([])

    showComments: WritableSignal<boolean> = signal(false)

    visible: WritableSignal<boolean> = signal(false);

    localStorageId: WritableSignal<string | null> = signal(null)

    ngOnInit() {

        this.localStorageId.set(localStorage.getItem('id'))
        this.commentsPost.set(this.post().comments)


        initFlowbite();


        this.items = [
            {
                items: [
                    {
                        label: 'Edit',
                        icon: 'pi pi-file-edit',
                        command: () => this.onEdit()

                    },
                    {
                        label: 'Delete',
                        icon: PrimeIcons.TRASH
                    }
                ]
            }
        ];
    }



    editPost: WritableSignal<boolean> = signal(false)

    onEdit() {
        this.showDialog() 
    }


    toggleComments() {

        this.showComments.update((v) => {
            return !v
        });

    }


    commentSubmit(e: Event) {

        e.preventDefault();

        if (this.commentControl.valid) {

            let commentData = {
                content: this.commentControl.value,
                post: this.post()._id
            }


            this.commentService.createComment(commentData).subscribe({
                next: (res) => {
                    this.commentsPost.set(res.comments)
                    this.commentControl.reset()
                },
                error: (err) => {
                    console.log(err);

                }
            })

        }
    }





















// <!-- i need to make it in single compunent -->



  private readonly postService = inject(PostService)
  
  saveFile: WritableSignal<File | null> = signal(null)

  contents: FormControl = new FormControl(null, [Validators.required])

  value: string = "";

  value2!: string;

  url: WritableSignal<string | null> = signal(null);

  newEditPost = output<boolean>();





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


  submitForm(e: Event): void {

    if (this.contents.valid) {

      const formData = new FormData()

      formData.append('body', this.contents.value)

      let file = this.saveFile()

      if (file) {
        formData.append('image', file, file.name)
      }


      this.editUserPost(formData);


    }

  }




  editUserPost(formData:FormData) {
    this.postService.editPost(formData,this.post().id).subscribe({
      next: (req) => {
        console.log(req);
        this.visible.set(false)
        this.newEditPost.emit(true);

      this.contents.reset();
      this.saveFile.set(null);
      this.url.set(null);

      },
          error:(err)=>{
          console.log(err);
        }
    })
  }




}
