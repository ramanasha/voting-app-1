import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollDeleteComponent } from './poll-delete.component';

describe('PollDeleteComponent', () => {
  let component: PollDeleteComponent;
  let fixture: ComponentFixture<PollDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
