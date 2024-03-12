import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AccountService } from './account/account.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NavComponent } from './nav/nav.component';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { FooterComponent } from './footer/footer.component';
import { MatIconModule } from '@angular/material/icon';

describe('AppComponent', () => {
  let accountServiceSpy = jasmine.createSpyObj('AccountService', [
    'loadCurrentUser',
  ]);
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgxSpinnerModule,
        BreadcrumbModule,
        MatIconModule,
      ],
      declarations: [AppComponent, NavComponent, FooterComponent],
      providers: [
        {
          provide: AccountService,
          useValue: accountServiceSpy,
        },
      ],
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'recipecooker'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('recipecooker');
  });
});
