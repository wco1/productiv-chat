import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, RotateCcw, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

// Mock data
const mockGoals = [
  { id: '1', title: 'Learn TypeScript' },
  { id: '2', title: 'Build Workout Habit' },
  { id: '3', title: 'Read 2 Books per Month' }
];

const mockTasks = [
  {
    id: '1',
    goalId: '1',
    text: 'Complete TypeScript handbook chapter 1',
    completed: true
  },
  {
    id: '2', 
    goalId: '1',
    text: 'Build a simple TypeScript project',
    completed: false
  },
  {
    id: '3',
    goalId: '1', 
    text: 'Practice generic types exercises',
    completed: false
  },
  {
    id: '4',
    goalId: '1',
    text: '',
    completed: false
  }
];

interface Task {
  id: string;
  goalId: string;
  text: string;
  completed: boolean;
}

export default function Tasks() {
  const [selectedGoalId, setSelectedGoalId] = useState('1');
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const selectedGoal = mockGoals.find(g => g.id === selectedGoalId);
  const goalTasks = tasks.filter(t => t.goalId === selectedGoalId);

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const addNewTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      goalId: selectedGoalId,
      text: '',
      completed: false
    };
    setTasks([...tasks, newTask]);
    
    // Focus the new input after render
    setTimeout(() => {
      const input = inputRefs.current[newTask.id];
      input?.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent, taskId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addNewTask();
    }
  };

  const handleBlur = (taskId: string, text: string) => {
    if (text.trim() === '') {
      // Delete empty task on blur
      deleteTask(taskId);
    }
  };

  const handleTextChange = (taskId: string, text: string) => {
    updateTask(taskId, { text });
  };

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    updateTask(taskId, { completed });
  };

  // Ensure there's always one empty task at the end
  useEffect(() => {
    const emptyTasks = goalTasks.filter(task => task.text.trim() === '');
    if (emptyTasks.length === 0) {
      addNewTask();
    }
  }, [goalTasks.length, selectedGoalId]);

  if (!selectedGoal) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-20">
        <div className="text-center max-w-sm">
          <Plus className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Goals Found</h2>
          <p className="text-muted-foreground mb-6">
            Create your first goal to start managing tasks.
          </p>
          <Button>Create Goal</Button>
        </div>
      </div>
    );
  }

  const completedTasks = goalTasks.filter(t => t.completed && t.text.trim());
  const incompleteTasks = goalTasks.filter(t => !t.completed);
  const completionRate = Math.round((completedTasks.length / Math.max(completedTasks.length + incompleteTasks.filter(t => t.text.trim()).length, 1)) * 100);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-semibold">Tasks</h1>
          <Button variant="ghost" size="sm">
            <RotateCcw size={16} />
          </Button>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="truncate">{selectedGoal.title}</span>
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            {mockGoals.map((goal) => (
              <DropdownMenuItem
                key={goal.id}
                onClick={() => setSelectedGoalId(goal.id)}
                className={cn(goal.id === selectedGoalId && "bg-accent")}
              >
                {goal.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-standard" 
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <span className="min-w-[40px]">{completionRate}%</span>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 p-4 pb-20 space-y-1">
        {incompleteTasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3 group">
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) => handleToggleComplete(task.id, !!checked)}
              className="mt-1 flex-shrink-0"
            />
            <input
              ref={(el) => inputRefs.current[task.id] = el}
              type="text"
              value={task.text}
              onChange={(e) => handleTextChange(task.id, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, task.id)}
              onBlur={(e) => handleBlur(task.id, e.target.value)}
              placeholder={task.text === '' ? "Type a task and press Enter..." : ""}
              className={cn(
                "flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground",
                "py-2 px-0 text-sm transition-colors duration-quick",
                "focus:bg-muted/30 rounded px-2"
              )}
            />
          </div>
        ))}

        {/* Completed tasks section */}
        {completedTasks.length > 0 && (
          <div className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px bg-border flex-1" />
              <span className="text-xs text-muted-foreground px-2">
                Completed ({completedTasks.length})
              </span>
              <div className="h-px bg-border flex-1" />
            </div>
            
            {completedTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 opacity-60">
                <Checkbox
                  checked={true}
                  onCheckedChange={(checked) => handleToggleComplete(task.id, !!checked)}
                  className="mt-1 flex-shrink-0"
                />
                <span className="flex-1 py-2 text-sm text-muted-foreground line-through">
                  {task.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <Button
        onClick={addNewTask}
        className="fixed bottom-20 right-4 rounded-full w-14 h-14 shadow-lg"
        size="icon"
      >
        <Plus size={24} />
      </Button>
    </div>
  );
}