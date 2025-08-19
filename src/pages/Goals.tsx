import React, { useState } from 'react';
import { Plus, MessageCircle, CheckCircle, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

// Mock data for demo
const mockGoals = [
  {
    id: '1',
    title: 'Learn TypeScript',
    description: 'Master TypeScript fundamentals and advanced patterns to improve code quality',
    isActive: true,
    progress: 65,
    tasksCompleted: 8,
    totalTasks: 12
  },
  {
    id: '2', 
    title: 'Build Workout Habit',
    description: 'Exercise 30 minutes daily, 5 days per week',
    isActive: false,
    progress: 40,
    tasksCompleted: 6,
    totalTasks: 15
  },
  {
    id: '3',
    title: 'Read 2 Books per Month',
    description: 'Develop consistent reading habit for personal growth',
    isActive: false,
    progress: 80,
    tasksCompleted: 16,
    totalTasks: 20
  }
];

export default function Goals() {
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [goals, setGoals] = useState(mockGoals);
  const [newGoal, setNewGoal] = useState({ title: '', description: '' });

  const handleGoalSelect = (goalId: string) => {
    // Update active goal and navigate to chat
    setGoals(goals.map(goal => ({ ...goal, isActive: goal.id === goalId })));
    navigate('/chat');
  };

  const handleCreateGoal = () => {
    if (newGoal.title.trim()) {
      const goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        isActive: false,
        progress: 0,
        tasksCompleted: 0,
        totalTasks: 0
      };
      setGoals([goal, ...goals]);
      setNewGoal({ title: '', description: '' });
      setIsCreateOpen(false);
    }
  };

  if (goals.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-20">
        <div className="text-center max-w-sm">
          <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Goals Yet</h2>
          <p className="text-muted-foreground mb-6">
            Start your journey by creating your first goal. Your AI coach will help you break it down into actionable steps.
          </p>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus size={18} />
                Create First Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-4">
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="e.g., Learn a new language"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Describe what you want to achieve..."
                    className="mt-1 resize-none"
                    rows={3}
                  />
                </div>
                <Button onClick={handleCreateGoal} className="w-full">
                  Create Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your Goals</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-2">
              <Plus size={16} />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="mx-4">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="e.g., Learn a new language"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="Describe what you want to achieve..."
                  className="mt-1 resize-none"
                  rows={3}
                />
              </div>
              <Button onClick={handleCreateGoal} className="w-full">
                Create Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {goals.map((goal) => (
          <Card 
            key={goal.id} 
            className="p-4 cursor-pointer transition-all duration-quick hover:bg-surface-1 active:scale-[0.98]"
            onClick={() => handleGoalSelect(goal.id)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-foreground truncate">{goal.title}</h3>
                  {goal.isActive && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <MessageCircle size={12} />
                      Active Chat
                    </Badge>
                  )}
                </div>
                
                {goal.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {goal.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle size={14} />
                    <span>{goal.tasksCompleted}/{goal.totalTasks} tasks</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-standard" 
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground min-w-[30px]">
                      {goal.progress}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}