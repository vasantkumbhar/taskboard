import { Component, OnInit, OnDestroy } from '@angular/core';
import groupBy from 'lodash/groupBy';
import { ITask, IList, IDetailList } from 'src/model';
import { TaskboardService } from './service/taskboard.service';
import { Subscription, forkJoin } from 'rxjs';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

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
  private taskListSubscription: Subscription;
  public detailList: IDetailList[] = [];
  constructor(private taskboardService: TaskboardService){}

  ngOnInit() {
    let combinedTaskCategory = forkJoin(
      this.taskboardService.get('categories'),
      this.taskboardService.get('tasks')
    ).subscribe((res: Array<any>) => {
      this.categories = res[0];
      this.taskList = groupBy(res[1], 'categoryId');

      this.categories.forEach((category: IList) => {
        this.detailList.push({category, taskList: this.taskList[category.id] || []});
        this.connectedTo.push(category.id);
      });
    });
  }

  public addList(listName: string) {
    this.addListFlag = true;
    if(listName && this.isListNameValid(listName)){
      const newList = {
        id: String(Math.random()),
        name: listName,
      };
      this.taskboardService.add(newList, 'categories').subscribe((res: IList) => {
        this.categories.push(res);
        this.detailList.push({category: res, taskList: []});
        this.connectedTo.push(res.id);
        this.addListFlag = false;
      })
    }
  }

  private isListNameValid(listName: string){
    for(const category of this.categories){
      if(category.name === listName){
        return false;
      }
    };
    return true;
  }

  public deleteList(listId: string){
    this.taskboardService.deleteTask(listId, 'categories/').subscribe((res) => {
      const listIndex = this.detailList.findIndex(list => list.category.id === listId);
      this.detailList.splice(listIndex, 1);
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.detailList, event.previousIndex, event.currentIndex);
  }

  ngOnDestroy() {
    this.taskListSubscription.unsubscribe();
  }
}
