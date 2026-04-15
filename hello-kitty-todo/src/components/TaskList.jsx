import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, categories, onToggleComplete, onDelete, onTaskClick }) => {
  if (tasks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--hk-text-light)' }}>
        <img src="https://upload.wikimedia.org/wikipedia/en/0/05/Hello_kitty_character_portrait.png" alt="Hello Kitty" style={{ width: '100px', opacity: 0.5, marginBottom: '16px' }} />
        <p>No tasks found. You have a free day!</p>
      </div>
    );
  }

  return (
    <Droppable droppableId="list-view">
      {(provided) => (
        <div 
          {...provided.droppableProps} 
          ref={provided.innerRef}
          style={{ minHeight: '100px' }}
        >
          {tasks.map((task, index) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              index={index} 
              categories={categories}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onTaskClick={onTaskClick}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default TaskList;
