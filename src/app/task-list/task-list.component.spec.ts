import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { TaskListComponent } from './task-list.component';
import { TaskboardService } from '../service/taskboard.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { of } from 'rxjs';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  const taskboardService = jasmine.createSpyObj('TaskboardService', ['add', 'put', 'deleteTask']);
  const newTask = {
    id: '2',
    name: 'new Task',
    categoryId: '1',
  };

  const updatedTask = {
    id: '2',
    name: 'updated Task',
    categoryId: '1',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        DragDropModule,
        ToastrModule.forRoot()
      ],
      declarations: [ TaskListComponent ],
      providers: [
        {provide: TaskboardService, useValue: taskboardService},
        ToastrService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;

    component.list = {
        category: {
          id: '1',
          name: 'TO DO',
        },
        taskList: [
          {
            id: '1',
            name: 'Task 1',
            categoryId: '1',
          },
        ],
      };

    component.categories = [
      {
        id: '1',
        name: 'TO DO',
      }
    ];

    component.connectedTo = ['TO DO'];

    taskboardService.add.and.returnValue(of(newTask));
    taskboardService.put.and.returnValue(of(updatedTask));
    taskboardService.deleteTask.and.returnValue(of({}));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should turn on addTaskFalg from addCard function', () => {
    component.addCard();
    expect(component.addTaskFalg).toBe(true);
  });

  it('should add task on triggering addTask function', () => {
    component.addTask('new Task');
    expect(component.list.taskList.length).toEqual(2);
  });

  it('should update task name on triggering save function', () => {
    component.save(updatedTask, 'tasks/');
    expect('updated Task').toEqual(updatedTask.name);
  });

  it('should delete task on triggering delete function', () => {
    component.delete(component.list.taskList[0]);
    expect(component.list.taskList.length).toEqual(0);
  });
});
