import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.less']
})
export class AddNewComponent implements OnInit {

  @Output() saveEmitter = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  public save(taskname?: string) {
    this.saveEmitter.emit(taskname);
  }


}
