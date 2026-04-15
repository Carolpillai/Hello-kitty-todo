import { v4 as uuidv4 } from 'uuid';

export const initialStatuses = [
  { id: 'todo', title: 'To Do', color: '#ffb6c1' },
  { id: 'in-progress', title: 'In Progress', color: '#ffd166' },
  { id: 'done', title: 'Done', color: '#68d391' }
];

export const initialCategories = [
  { id: 'cat_personal', name: 'Personal', color: '#ff8fb3' },
  { id: 'cat_work', name: 'Work', color: '#82ddf0' },
  { id: 'cat_shopping', name: 'Shopping', color: '#ffd166' }
];

export const initialData = {
  tasks: [],
  categories: initialCategories,
  statuses: initialStatuses
};
