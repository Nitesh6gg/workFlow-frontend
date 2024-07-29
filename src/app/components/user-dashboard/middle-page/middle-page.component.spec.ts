import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiddlePageComponent } from './middle-page.component';

describe('MiddlePageComponent', () => {
  let component: MiddlePageComponent;
  let fixture: ComponentFixture<MiddlePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiddlePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MiddlePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
