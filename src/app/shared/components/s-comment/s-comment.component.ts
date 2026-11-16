import { Component, inject, input, InputSignal, output, signal, WritableSignal } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { initFlowbite } from 'flowbite';
import { Comments, Doc } from '../../../core/interfaces/posts';
import { DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommentService } from './services/comment.service';
import { environment } from '../../../../environments/environment.development';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-s-comment',
    imports: [Menu, ButtonModule, DatePipe, ReactiveFormsModule, RouterLink],
    templateUrl: './s-comment.component.html',
    styleUrl: './s-comment.component.scss',
    standalone: true
})

export class SCommentComponent {

    private commentService = inject(CommentService)

    comment: InputSignal<Comments> = input.required();
    post: InputSignal<Doc> = input.required();

    itemsC: MenuItem[] | undefined;

    commentControl: FormControl = new FormControl('');

    toggleCommentEdit: WritableSignal<boolean> = signal(false)

    newComment: WritableSignal<string> = signal('')

    deletedComment = output<Comments>()

    localStorageId: WritableSignal<string | null> = signal(null)

    showOnDelete: WritableSignal<boolean> = signal(false)

    backendUrlStatic: string = environment.baseUrl + '/uploads/'


    ngOnInit() {

        console.log("this.comment().createdBy._id", this.comment().createdBy._id);

        this.localStorageId.set(localStorage.getItem('id'))

        initFlowbite();


        this.itemsC = [
            {
                items: [
                    {
                        label: 'Edit',
                        icon: 'pi pi-file-edit',
                        command: () => this.onEdit()


                    },
                    {
                        label: 'Delete',
                        icon: PrimeIcons.TRASH,
                        command: () => this.trueShowOnDelete()

                    }
                ]
            }
        ];
    }

    onEdit() {

        this.toggleCommentEdit.set(true)
        if (this.newComment()) {
            this.commentControl.setValue(this.newComment())

        } else {

            this.commentControl.setValue(this.comment().content)
        }

    }

    onDelete() {
        this.commentService.deleteComment(this.comment()._id, this.post()._id).subscribe({
            next: (res) => {
                console.log("delete comment", res);
                this.deletedComment.emit(this.comment())
            }
        })
    }

    commentSubmit(e: Event) {

        e.preventDefault()

        this.commentService.updateComment(this.comment()._id, this.post()._id, { "content": this.commentControl.value }).subscribe({
            next: (res) => {
                console.log("comment edit resssss", res);

                if (res.message == 'success') {
                    this.toggleCommentEdit.set(false)
                    this.commentControl.setValue(res.data.content)
                    this.newComment.set(this.commentControl.value)

                }

            }, error: (err) => {
                console.log("err.error.error", err.error.error);
            }
        })

    }

    trueShowOnDelete() {
        this.showOnDelete.set(true)
    }

    falseShowOnDelete() {
        this.showOnDelete.set(false)
    }

}
