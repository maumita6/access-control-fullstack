import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestList } from './request-list';

describe('RequestList', () => {
  let component: RequestList;
  let fixture: ComponentFixture<RequestList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestList],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
