import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostNotificationComponent } from './post-notification.component';

describe('PostNotificationComponent', () => {
  let component: PostNotificationComponent;
  let fixture: ComponentFixture<PostNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
