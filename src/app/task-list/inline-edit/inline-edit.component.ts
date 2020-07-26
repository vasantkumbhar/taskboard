import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ITask, IList } from 'src/model';

@Component({
  selector: 'app-inline-edit',
  templateUrl: './inline-edit.component.html',
  styleUrls: ['./inline-edit.component.less']
})
export class InlineEditComponent implements OnInit {

  @Input() item: ITask | IList;
  @Input() categories: IList[];
  @Output() saveEmitter = new EventEmitter<ITask | IList>();
  @Output() deleteEmitter = new EventEmitter<ITask | IList>();
  public editable = false;
  // public name: string;

  constructor() { }

  ngOnInit() {
    // this.name = this.item.name;
  }

  public clickOnDiv(){
    this.editable = true;
  }

  public save(flag: boolean, item: ITask | IList){
    this.editable = false;
    if(flag){
      this.saveEmitter.emit(item);
    }
  }

  private isListNameValid(listName: string){
    console.log(this.categories);
    for(const category of this.categories){
      if(category.name === listName){
        return false;
      }
    };
    return true;
  }

  public delete(item: ITask | IList){
    this.deleteEmitter.emit(item);
  }
}
