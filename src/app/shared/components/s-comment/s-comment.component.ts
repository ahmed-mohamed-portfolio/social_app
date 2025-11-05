import { ToastrService } from 'ngx-toastr';
import { Component, inject, input, InputSignal, output, signal, WritableSignal } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { initFlowbite } from 'flowbite';
import { Comment } from '../../../core/interfaces/posts';
import { DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from './services/comment.service';

@Component({
    selector: 'app-s-comment',
    imports: [Menu, ButtonModule, DatePipe, ReactiveFormsModule],
    templateUrl: './s-comment.component.html',
    styleUrl: './s-comment.component.scss',
    standalone: true
})
export class SCommentComponent {

    
    comment: InputSignal<Comment> = input.required();

    itemsC: MenuItem[] | undefined;

    commentControl: FormControl = new FormControl('');

    private commentService = inject(CommentService)

    toggleCommentEdit: WritableSignal<boolean> = signal(false)

    newComment: WritableSignal<string> = signal('')
    
    deletedComment=output<Comment>()

    localStorageId: WritableSignal<string | null> = signal(null)

    showOnDelete:WritableSignal<boolean>=signal(false)

    private toastrService=inject(ToastrService)


    ngOnInit() {

        console.log(this.comment());
        
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
        if(this.newComment()){
            this.commentControl.setValue(this.newComment())

        }else{

            this.commentControl.setValue(this.comment().content)
        }

    }
    

    onDelete(){
        this.commentService.deleteComment(this.comment()._id).subscribe({
            next:(res)=>{
                  console.log(res);
                  this.deletedComment.emit(this.comment())
            }
        })
    }



    commentSubmit(e: Event) {

        e.preventDefault()

        this.commentService.updateComment(this.comment()._id, { "content": this.commentControl.value }).subscribe({
            next: (res) => {
                
                if (res.message == 'success') {
                    this.toggleCommentEdit.set(false)
                    this.commentControl.setValue(res.comment.content)
                    this.newComment.set(this.commentControl.value)

                }

            }, error: (err) => {
                this.toastrService.error(err.error.error)
            }
        })

    }



trueShowOnDelete(){
  this.showOnDelete.set(true)
}

falseShowOnDelete(){
  this.showOnDelete.set(false)
}


}
