export default interface ITask {
  id: string;
  name: string;
  categoryId: number;
  dueDate?: string;
  priority?: number;
  boardId?: number;
}
