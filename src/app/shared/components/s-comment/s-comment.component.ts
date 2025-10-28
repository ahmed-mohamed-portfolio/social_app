import { Component, input, InputSignal, signal } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { initFlowbite } from 'flowbite';
import { Comment } from '../../../core/interfaces/posts';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-s-comment',
  imports: [Menu, ButtonModule,DatePipe],
  templateUrl: './s-comment.component.html',
  styleUrl: './s-comment.component.scss',
  standalone: true
})
export class SCommentComponent {

    comment:InputSignal<Comment>=input.required()

    itemsC: MenuItem[] | undefined;

    ngOnInit() {

          initFlowbite();
      
          
        this.itemsC = [
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


    
}
