import { TestBed } from '@angular/core/testing';
import { TaskboardService } from './taskboard.service';
import { of } from 'rxjs';
import { ITask } from 'src/model';

describe('TaskboardService', () => {
  let service: TaskboardService;
  let httpClientSpy: {
    post: jasmine.Spy;
    put: jasmine.Spy;
    get: jasmine.Spy;
    delete: jasmine.Spy;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    httpClientSpy = jasmine.createSpyObj('HttpClient', [
      'get',
      'post',
      'put',
      'delete',
    ]);
    service = new TaskboardService(httpClientSpy as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return taskList with get method', () => {
    const taskList = [
      {
        id: '1',
        name: 'Task 1',
        categoryId: '1',
      },
    ];
    httpClientSpy.get.and.returnValue(of(taskList));
    service.get('http://localhost:3000/tasks').subscribe(res => {
      expect(res).toEqual(taskList);
    });
  });

  it('should add task in taskList with add method', () => {
    const taskList: ITask = {
      id: '1',
      name: 'Task 1',
      categoryId: '1',
    };

    httpClientSpy.post.and.returnValue(of(taskList));
    service.add(taskList, 'http://localhost:3000/tasks').subscribe(res => {
      expect(res).toEqual(taskList);
    });
  });

  it('should delete task from taskList with deleteTask method', () => {
    httpClientSpy.delete.and.returnValue(of({}));
    service.deleteTask('1', 'http://localhost:3000/tasks').subscribe(res => {
      expect(res).toEqual({});
    });
  });

  it('should update task of taskList with put method', () => {
    const taskList: ITask = {
      id: '1',
      name: 'Task 1',
      categoryId: '1',
    };
    httpClientSpy.put.and.returnValue(of(taskList));
    service.put('1', 'http://localhost:3000/tasks', taskList).subscribe(res => {
      expect(res).toEqual(taskList);
    });
  });
});
