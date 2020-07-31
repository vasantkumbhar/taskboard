export default interface ITask {
  id: string;
  name: string;
  categoryId: string;
  dueDate?: string;
  priority?: number;
  boardId?: number;
}
