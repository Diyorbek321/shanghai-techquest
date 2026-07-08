import React, { useState } from 'react';
import { motion, Reorder, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, GripVertical, Plus, Trash2, LayoutList } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export function TaskSequencer() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Master Neural Networks in Arena', completed: false },
    { id: '2', text: 'Build a tech-district in MyWorld', completed: true },
    { id: '3', text: 'Solve 3 Algorithm problems', completed: false },
  ]);
  const [newTask, setNewTask] = useState('');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false }]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="glass-panel p-6 border-brand-cyan/20">
      <div className="flex items-center gap-2 mb-6">
        <LayoutList className="text-brand-cyan" size={20} />
        <h2 className="font-bold text-lg uppercase tracking-widest">Neural Task Sequencer</h2>
      </div>

      <form onSubmit={addTask} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New cognitive objective..."
          className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-cyan transition-colors"
        />
        <button
          type="submit"
          className="p-2 bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/50 rounded-lg hover:bg-brand-cyan/30 transition-colors"
        >
          <Plus size={20} />
        </button>
      </form>

      <Reorder.Group axis="y" values={tasks} onReorder={setTasks} className="space-y-2">
        <AnimatePresence>
          {tasks.map((task) => (
            <Reorder.Item
              key={task.id}
              value={task}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className={`flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl cursor-grab active:cursor-grabbing hover:border-white/10 transition-colors group ${task.completed ? 'opacity-50' : ''}`}
            >
              <GripVertical size={16} className="text-gray-600 group-hover:text-brand-cyan transition-colors" />
              <button
                onClick={() => toggleTask(task.id)}
                className={`transition-colors ${task.completed ? 'text-brand-green' : 'text-gray-500 hover:text-brand-cyan'}`}
              >
                {task.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
              </button>
              <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                {task.text}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-500 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {tasks.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm italic">
          All objectives synchronized. No active tasks.
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-white/5 flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest">
        <span>Completion: {Math.round((tasks.filter(t => t.completed).length / (tasks.length || 1)) * 100)}%</span>
        <span>Drag items to re-prioritize</span>
      </div>
    </div>
  );
}
