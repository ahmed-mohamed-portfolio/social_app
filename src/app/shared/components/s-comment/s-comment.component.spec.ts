import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SCommentComponent } from './s-comment.component';

describe('SCommentComponent', () => {
  let component: SCommentComponent;
  let fixture: ComponentFixture<SCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SCommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
