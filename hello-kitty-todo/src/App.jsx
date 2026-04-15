import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import KanbanBoard from './components/KanbanBoard';
import TaskModal from './components/TaskModal';
import LoginScreen from './components/LoginScreen';
import NotesWidget from './components/NotesWidget';
import { initialData } from './data/initialData';

// Using window.location.hostname ensures that if you access from your phone IP, it fetches from your computer's IP instead of the phone's localhost
const API_URL = `http://${window.location.hostname}:5000/api/tasks`;

function App() {
  const [data, setData] = useState({
    tasks: [],
    categories: initialData.categories,
    statuses: initialData.statuses
  });
  
  const [view, setView] = useState('list');
  const [activeCategory, setActiveCategory] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('hk_user') || null);

  useEffect(() => {
    // Pass currentUser securely so the backend routes correctly isolated tasks
    const targetUser = encodeURIComponent(currentUser || 'guest');
    fetch(`${API_URL}?user=${targetUser}`)
      .then(res => res.json())
      .then(tasks => {
        if(Array.isArray(tasks)) {
           setData(prev => ({ ...prev, tasks }));
           
           // Automatically open the task modal if taskId is in the URL
           const searchParams = new URLSearchParams(window.location.search);
           const taskId = searchParams.get('taskId');
           if (taskId) {
             const taskToOpen = tasks.find(t => t.id === taskId);
             if (taskToOpen) {
               setSelectedTask(taskToOpen);
             }
           }
        }
      })
      .catch(err => console.error('Failed to fetch tasks:', err));
  }, [currentUser]);

  const handleLogin = (user) => {
    localStorage.setItem('hk_user', user);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('hk_user');
    setCurrentUser(null);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const handleAddCategory = (name) => {
    const cuteColors = ['#ff8fb3', '#82ddf0', '#ffd166', '#c493ff', '#ffb3c6', '#a2d2ff', '#ffc8dd'];
    const newCat = {
      id: `cat_${Date.now()}`,
      name,
      color: cuteColors[data.categories.length % cuteColors.length]
    };
    setData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCat]
    }));
  };

  const handleAddTask = (task) => {
    // Inject the active user so the database natively tracks the owner securely!
    const taskWithOwner = { ...task, owner: currentUser || 'guest' };
    
    // Optimistic UI
    setData((prev) => ({ ...prev, tasks: [taskWithOwner, ...prev.tasks] }));
    
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskWithOwner)
    }).catch(err => console.error("Failed adding task:", err));
  };

  const handleToggleComplete = (id) => {
    const targetTask = data.tasks.find(t => t.id === id);
    if (!targetTask) return;

    const completed = !targetTask.completed;
    let newStatus = targetTask.status;
    if (completed) {
      newStatus = 'done';
    } else if (newStatus === 'done') {
      newStatus = 'todo';
    }

    const updatedTaskRecord = { ...targetTask, completed, status: newStatus };

    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? updatedTaskRecord : t)
    }));

    fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTaskRecord)
    }).catch(err => console.error("Failed toggling task:", err));
  };

  const handleDeleteTask = (id) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
    if (selectedTask?.id === id) {
      setSelectedTask(null);
    }

    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .catch(err => console.error("Failed deleting task:", err));
  };

  const handleUpdateTask = (updatedTask) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
    }));
    setSelectedTask(updatedTask);

    fetch(`${API_URL}/${updatedTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    }).catch(err => console.error("Failed syncing updated task:", err));
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newTasks = Array.from(data.tasks);

    if (view === 'list') {
      const filteredTasks = activeCategory 
        ? newTasks.filter(t => t.categoryId === activeCategory)
        : newTasks;
      
      const movedTask = filteredTasks[source.index];
      const srcIndex = newTasks.findIndex(t => t.id === movedTask.id);
      newTasks.splice(srcIndex, 1);
      
      const destTask = filteredTasks[destination.index];
      let destIndex = destTask ? newTasks.findIndex(t => t.id === destTask.id) : newTasks.length;
      
      newTasks.splice(destIndex, 0, movedTask);
      setData(prev => ({ ...prev, tasks: newTasks }));
      return;
    }

    if (view === 'kanban') {
      const visibleSourceList = visibleTasks.filter(t => t.status === source.droppableId);
      const draggedTask = visibleSourceList[source.index];
      if (!draggedTask) return;

      const srcIndex = newTasks.findIndex(t => t.id === draggedTask.id);
      if (srcIndex !== -1) {
        newTasks.splice(srcIndex, 1);
      }

      const updatedTask = { ...draggedTask };
      updatedTask.status = destination.droppableId;
      updatedTask.completed = (destination.droppableId === 'done');

      // Now determine the target relative to the mutated newTasks array
      const currentVisibleDestList = newTasks.filter(t => 
        t.status === destination.droppableId && 
        (!activeCategory || t.categoryId === activeCategory)
      );

      let destIndex = newTasks.length;
      if (destination.index < currentVisibleDestList.length) {
        const destTask = currentVisibleDestList[destination.index];
        destIndex = newTasks.findIndex(t => t.id === destTask.id);
      }

      newTasks.splice(destIndex, 0, updatedTask);
      setData(prev => ({ ...prev, tasks: newTasks }));

      // Sync backend
      fetch(`${API_URL}/${updatedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
      }).catch(err => console.error("Failed dragging sync.", err));
    }
  };

  const knownFriends = [...new Set(data.tasks.flatMap(t => t.collaborators || []))];

  const visibleTasks = activeCategory
    ? data.tasks.filter(t => t.categoryId === activeCategory)
    : data.tasks;

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="layout-container">
        <div style={{ display: isSidebarOpen ? 'block' : 'none' }}>
          <Sidebar 
            view={view} setView={setView} 
            categories={data.categories} 
            activeCategory={activeCategory} setActiveCategory={setActiveCategory}
            onAddCategory={handleAddCategory}
          />
        </div>
        
        <main>
          <Header toggleSidebar={toggleSidebar} currentUser={currentUser} onLogout={handleLogout} />
          
          <div className="glass-panel" style={{ padding: '24px', minHeight: 'calc(100vh - 150px)' }}>
            <h2 style={{ marginBottom: '24px', color: 'var(--hk-primary)', fontSize: '1.25rem' }}>
              {view === 'list' && (activeCategory ? `Tasks in ${data.categories.find(c => c.id === activeCategory)?.name}` : 'All Tasks')}
              {view === 'kanban' && 'Kanban Board'}
            </h2>
            
            <TaskInput 
              onAddTask={handleAddTask} 
              categories={data.categories} 
              knownFriends={knownFriends} 
            />
            
            <DragDropContext onDragEnd={handleDragEnd}>
              {view === 'list' ? (
                <TaskList 
                  tasks={visibleTasks} 
                  categories={data.categories}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTask}
                  onTaskClick={setSelectedTask}
                />
              ) : (
                <KanbanBoard 
                  tasks={visibleTasks} 
                  statuses={data.statuses}
                  categories={data.categories}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTask}
                  onTaskClick={setSelectedTask}
                />
              )}
            </DragDropContext>
          </div>
        </main>
      </div>

      {selectedTask && (
        <TaskModal 
          task={selectedTask} 
          categories={data.categories}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdateTask}
          currentUser={currentUser}
        />
      )}

      <NotesWidget />
    </div>
  );
}

export default App;
