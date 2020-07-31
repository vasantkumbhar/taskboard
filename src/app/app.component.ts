import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import groupBy from 'lodash/groupBy';

import { ITask, IList, IDetailList } from 'src/model';
import { TaskboardService } from './service/taskboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, OnDestroy {
  public taskList: ITask[];
  public categories: IList[];
  public addListFlag = false;
  public connectedTo: string[] = [];
  public detailList: IDetailList[] = [];

  private destroySubject$: Subject<void> = new Subject<void>();

  constructor(private taskboardService: TaskboardService, private toastr: ToastrService){}

  ngOnInit() {
    forkJoin(
      this.taskboardService.get('categories'),
      this.taskboardService.get('tasks')
    ).pipe(takeUntil(this.destroySubject$))
    .subscribe((res: Array<any>) => {
      this.categories = res[0];
      this.taskList = groupBy(res[1], 'categoryId');

      this.categories.forEach((category: IList) => {
        this.detailList.push({category, taskList: this.taskList[category.id] || []});
        this.connectedTo.push(category.id);
      });
    });
  }

  public addList(listName: string) {
    if(!listName){
      this.addListFlag = false;
      return;
    }
    if(listName && this.isListNameValid(listName)){
      this.addListFlag = false;
      const newList = {
        id: String(Math.random()),
        name: listName,
      };
      this.taskboardService.add(newList, 'categories')
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((res: IList) => {
        this.categories.push(res);
        this.detailList.push({category: res, taskList: []});
        this.connectedTo.push(res.id);
        this.toastr.success(res.name + ' added succesfully.');
      })
    } else {
      this.toastr.error('Enter Valid Name');
    }
  }

  private isListNameValid(listName: string){
    for(const category of this.categories){
      if(category.name.toLowerCase() === listName.toLowerCase()){
        return false;
      }
    };
    return true;
  }

  public deleteList(listId: string){
    this.taskboardService.deleteTask(listId, 'categories/')
    .pipe(takeUntil(this.destroySubject$))
    .subscribe((res) => {
      const listIndex = this.detailList.findIndex(list => list.category.id === listId);
      this.detailList.splice(listIndex, 1);
      this.toastr.success('List deleted successfully.');
    });
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.detailList, event.previousIndex, event.currentIndex);
  }

  ngOnDestroy() {
    this.destroySubject$.next();
    this.destroySubject$.complete();
  }
}
