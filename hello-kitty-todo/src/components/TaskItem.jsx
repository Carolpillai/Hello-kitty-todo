import React from 'react';
import { CheckCircle2, Circle, Clock, Trash2, GripVertical, MessageSquare, Users } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';

const TaskItem = ({ task, index, onToggleComplete, onDelete, onTaskClick, categories }) => {
  const category = categories.find(c => c.id === task.categoryId) || categories[0];
  
  const priorityColors = {
    low: 'var(--priority-low)',
    medium: 'var(--priority-medium)',
    high: 'var(--priority-high)'
  };

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => {
        const child = (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              background: 'white',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: snapshot.isDragging ? '0 8px 32px var(--hk-shadow)' : '0 2px 4px rgba(0,0,0,0.05)',
              borderLeft: `4px solid ${priorityColors[task.priority]}`,
              opacity: task.completed ? 0.6 : 1,
              transition: 'opacity 0.2s, box-shadow 0.2s',
              // Hardware acceleration during drag
              willChange: snapshot.isDragging ? 'transform, box-shadow' : 'auto'
            }}
          >
            <div style={{ color: 'var(--hk-text-light)' }}>
              <GripVertical size={20} />
            </div>

            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(task.id);
              }}
              style={{ color: task.completed ? 'var(--hk-primary)' : 'var(--hk-text-light)', background: 'transparent', border: 'none', cursor: 'pointer' }}
              className={task.completed ? 'animate-pop-in' : ''}
            >
              {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
            </button>

            <div onClick={() => onTaskClick && onTaskClick(task)} style={{ flex: 1, cursor: 'pointer', overflow: 'hidden' }}>
              <h4 style={{ 
                textDecoration: task.completed ? 'line-through' : 'none',
                fontWeight: 700,
                color: 'var(--hk-text)',
                fontSize: '1.1rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {task.title}
              </h4>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'center' }}>
                <span className="badge" style={{ backgroundColor: category.color + '33', color: category.color, whiteSpace: 'nowrap' }}>
                  {category.name}
                </span>
                {(task.comments?.length > 0) && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--hk-text-light)' }}>
                    <MessageSquare size={12} /> {task.comments.length}
                  </span>
                )}
                {(task.collaborators?.length > 0) && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--hk-text-light)' }}>
                    <Users size={12} /> {task.collaborators.length}
                  </span>
                )}
              </div>
            </div>

            <button onClick={() => onDelete(task.id)} style={{ color: 'var(--hk-text-light)', cursor: 'pointer', border: 'none', background: 'transparent' }}>
              <Trash2 size={18} />
            </button>
          </div>
        );
        return child;
      }}
    </Draggable>
  );
};

export default React.memo(TaskItem);
