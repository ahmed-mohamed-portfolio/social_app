import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SPostComponent } from './s-post.component';

describe('SPostComponent', () => {
  let component: SPostComponent;
  let fixture: ComponentFixture<SPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
