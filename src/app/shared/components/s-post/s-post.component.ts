
import { Component, inject, input, InputSignal, OnInit, signal, WritableSignal } from '@angular/core';
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


@Component({
    selector: 'app-s-post',
    imports: [Menu, ButtonModule, DatePipe, SCommentComponent, ReactiveFormsModule],
    templateUrl: './s-post.component.html',
    styleUrl: './s-post.component.scss'
})


export class SPostComponent implements OnInit {

    private commentService = inject(CommentService)
    commentControl: FormControl = new FormControl(null, [Validators.required])

    post: InputSignal<Post> = input({} as Post)
    // post:InputSignal<Post>=input.required()


    items: MenuItem[] | undefined;

    commentsPost:WritableSignal<Comment[]>=signal([])

    ngOnInit() {


        this.commentsPost.set(this.post().comments)

        initFlowbite();


        this.items = [
            {
                items: [
                    {
                        label: 'Edit',
                        icon: 'pi pi-file-edit'
                    },
                    {
                        label: 'Delete',
                        icon: PrimeIcons.TRASH
                    }
                ]
            }
        ];
    }



    showComments: WritableSignal<boolean> = signal(false)

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
                error:(err)=>{
                     console.log(err);
                     
                }
            })

        }
    }



}
