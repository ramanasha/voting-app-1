import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollEditComponent } from './poll-edit.component';

describe('PollEditComponent', () => {
  let component: PollEditComponent;
  let fixture: ComponentFixture<PollEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
