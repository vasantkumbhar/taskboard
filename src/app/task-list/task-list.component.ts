import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { ITask, IList, IDetailList } from 'src/model';
import data from 'src/constants/data';
import { TaskboardService } from '../service/taskboard.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.less']
})
export class TaskListComponent implements OnInit {

  public addTaskFalg = false;
  @Input() list: IDetailList;
  @Input() categories: IList[];
  @Input() connectedTo: string[];
  @Output() taskListEvent = new EventEmitter<string>();

  constructor(private taskboardService: TaskboardService) { }

  ngOnInit() {
    console.log(this.list.taskList);
  }

  public addCard(){
    this.addTaskFalg = true;
  }

  public addTask(taskName?: string){
    this.addTaskFalg = false;
    if(taskName){
      const newTask = {
        id: String(Math.random()),
        name: taskName,
        categoryId: this.list.category.id,
      };
      this.taskboardService.add(newTask, 'tasks').subscribe((res: ITask) => {
        console.log(res);
        this.list.taskList.push(res);
      })
    }
  }

  public save(item: ITask | IList, type: string){
    if(type === 'task'){
      this.taskboardService.put(item.id, 'tasks/', item).subscribe((res: ITask) => {

      })
    }
    if(type === 'category'){
      this.taskboardService.put(item.id, 'categories/', item).subscribe((res: IList) => {

      })
    }
  }

  public delete(item: ITask){
    this.taskboardService.deleteTask(item.id, 'tasks/').subscribe((res) => {
      const taskIndex = this.list.taskList.findIndex(task => task.id === item.id);
      this.list.taskList.splice(taskIndex, 1);
    });
  }

  public deleteList(item: IList){
    this.taskListEvent.emit(item.id);
  }

  public drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const obj = event.item.data;
      obj.categoryId = event.container.element.nativeElement.id;
      this.taskboardService.put(event.item.data.id, 'tasks/', obj).subscribe((res: ITask) => {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      });
    }
  }

}
