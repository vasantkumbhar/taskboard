import ITask from './task.interface';

export default interface ITaskList{
  categories: string[];
  tasks: ITask[];
}
