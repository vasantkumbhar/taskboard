import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { ITask, IList, IDetailList } from 'src/model';
import { TaskboardService } from '../service/taskboard.service';

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

  constructor(private taskboardService: TaskboardService, private toastr: ToastrService) { }

  ngOnInit() {}

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
        this.list.taskList.push(res);
        this.toastr.success(newTask.name + ' added successfully');
      })
    }
  }

  public save(item: ITask | IList, type: string){
    this.taskboardService.put(item.id, type, item).subscribe((res: ITask | IList) => {
      this.toastr.success(item.name + ' updated successfully');
    })
  }

  public delete(item: ITask){
    this.taskboardService.deleteTask(item.id, 'tasks/').subscribe((res) => {
      const taskIndex = this.list.taskList.findIndex(task => task.id === item.id);
      this.list.taskList.splice(taskIndex, 1);
      this.toastr.success(item.name + ' deleted successfully');
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
        this.toastr.success(res.name + ' moved successfully');
      });
    }
  }
}
