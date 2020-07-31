import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TaskboardService } from './service/taskboard.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { IList } from 'src/model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const taskboardService = jasmine.createSpyObj('TaskboardService', ['get', 'add', 'deleteTask']);

  const newList: IList = {
    id: '1',
    name: 'To Do'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ToastrModule.forRoot()
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        {provide: TaskboardService, useValue: taskboardService},
        ToastrService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    taskboardService.add.and.returnValue(of(newList));
    taskboardService.get.and.returnValue(of([{
      id: '0.2445680984928349',
      name: 'L1',
      categoryId: 1
    }]));
    taskboardService.deleteTask.and.returnValue(of({}));
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('addList function should add list in category if list name is valid', () => {
    component.categories = [];
    component.addList('To Do');
    expect(component.categories.length).toEqual(1);
  });

  it('addList function should not add list in category if list name is invalid', () => {
    component.categories = [{
      id: '1',
      name: 'To Do'
    }];
    component.addList('To Do');
    expect(component.categories.length).toEqual(1);
    expect(component.addListFlag).toBe(false);
  });

  it('addList function should not add list in category if we pass undefined value', () => {
    component.categories = [{
      id: '1',
      name: 'To Do'
    }];
    component.addList(undefined);
    expect(component.categories.length).toEqual(1);
    expect(component.addListFlag).toBe(false);
  });

  it('deleteList function should delete list from category and list', () => {
    component.detailList = [
      {
        category: {
          id: '0.2445680984928349',
          name: 'TO DO',
        },
        taskList: [
          {
            id: '0.4973547849112292',
            name: 'T1',
            categoryId: '0.2445680984928349',
          },
        ],
      },
    ];
    component.deleteList('0.2445680984928349');
    expect(component.detailList.length).toEqual(0);
  });
});
