import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskItem from './TaskItem';

const KanbanBoard = ({ tasks, statuses, categories, onToggleComplete, onDelete, onTaskClick }) => {
  return (
    <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '16px' }}>
      {statuses.map(status => {
        const columnTasks = tasks.filter(t => t.status === status.id);
        
        return (
          <div key={status.id} style={{ display: 'flex', flexDirection: 'column', flex: '1', minWidth: '300px', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: status.color }} />
              <h3 style={{ fontWeight: 800 }}>{status.title}</h3>
              <span style={{ marginLeft: 'auto', background: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {columnTasks.length}
              </span>
            </div>

            <Droppable droppableId={status.id}>
              {(provided, snapshot) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    minHeight: '200px',
                    height: '100%',
                    transition: 'background-color 0.2s',
                    backgroundColor: snapshot.isDraggingOver ? 'rgba(255, 77, 133, 0.05)' : 'transparent',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px'
                  }}
                >
                  {columnTasks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--hk-text-light)', fontSize: '0.9rem' }}>
                      Drop tasks here
                    </div>
                  )}
                  {columnTasks.map((task, index) => (
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
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
