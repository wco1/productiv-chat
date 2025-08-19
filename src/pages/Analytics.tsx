import React, { useState } from 'react';
import { TrendingUp, Calendar, Award, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

// Mock analytics data
const weeklyData = [
  { day: 'Mon', completed: 3, total: 5 },
  { day: 'Tue', completed: 4, total: 6 },
  { day: 'Wed', completed: 2, total: 4 },
  { day: 'Thu', completed: 5, total: 5 },
  { day: 'Fri', completed: 3, total: 7 },
  { day: 'Sat', completed: 1, total: 3 },
  { day: 'Sun', completed: 4, total: 4 }
];

const goalStats = [
  {
    id: '1',
    title: 'Learn TypeScript',
    progress: 65,
    completedTasks: 8,
    totalTasks: 12,
    streak: 5,
    trend: '+12%'
  },
  {
    id: '2',
    title: 'Build Workout Habit', 
    progress: 40,
    completedTasks: 6,
    totalTasks: 15,
    streak: 3,
    trend: '+8%'
  },
  {
    id: '3',
    title: 'Read 2 Books per Month',
    progress: 80,
    completedTasks: 16,
    totalTasks: 20,
    streak: 12,
    trend: '+25%'
  }
];

const weeklyInsights = {
  highlights: [
    "🎉 You completed 22 out of 34 tasks this week - that's 65% completion rate!",
    "🔥 Your longest streak this week was 5 days on TypeScript learning",
    "📚 Reading goal is performing exceptionally well with 80% progress"
  ],
  blockers: [
    "Workout habit needs attention - only 40% progress this week",
    "Tuesday and Friday had lower completion rates - consider lighter scheduling"
  ],
  recommendations: [
    "Schedule TypeScript practice in the morning when you're most focused",
    "Break down workout tasks into smaller 15-minute sessions",
    "Consider time-blocking specific slots for each goal"
  ],
  questions: [
    "What's the biggest obstacle preventing consistent workout sessions?",
    "Would you like to adjust your weekly task targets based on your current capacity?",
    "How can we better integrate your reading habit with your daily routine?"
  ]
};

export default function Analytics() {
  const [isWeeklySheetOpen, setIsWeeklySheetOpen] = useState(false);
  
  const totalCompleted = weeklyData.reduce((sum, day) => sum + day.completed, 0);
  const totalTasks = weeklyData.reduce((sum, day) => sum + day.total, 0);
  const weeklyCompletionRate = Math.round((totalCompleted / totalTasks) * 100);
  const bestStreak = Math.max(...goalStats.map(g => g.streak));

  return (
    <div className="flex-1 p-4 pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <Sheet open={isWeeklySheetOpen} onOpenChange={setIsWeeklySheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar size={16} />
              Weekly Report
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
            <SheetHeader className="pb-6">
              <SheetTitle className="flex items-center gap-2">
                <Award className="text-primary" size={20} />
                Weekly AI Insights
              </SheetTitle>
            </SheetHeader>
            
            <div className="space-y-6">
              {/* Highlights */}
              <div>
                <h3 className="font-semibold text-success mb-3 flex items-center gap-2">
                  <TrendingUp size={16} />
                  This Week's Highlights
                </h3>
                <div className="space-y-2">
                  {weeklyInsights.highlights.map((highlight, index) => (
                    <div key={index} className="p-3 bg-success/10 rounded-lg text-sm">
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>

              {/* Blockers */}
              <div>
                <h3 className="font-semibold text-warning mb-3">
                  Areas for Improvement
                </h3>
                <div className="space-y-2">
                  {weeklyInsights.blockers.map((blocker, index) => (
                    <div key={index} className="p-3 bg-warning/10 rounded-lg text-sm">
                      {blocker}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="font-semibold text-primary mb-3">
                  AI Recommendations
                </h3>
                <div className="space-y-2">
                  {weeklyInsights.recommendations.map((rec, index) => (
                    <div key={index} className="p-3 bg-primary/10 rounded-lg text-sm">
                      💡 {rec}
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions */}
              <div>
                <h3 className="font-semibold text-muted-foreground mb-3">
                  Reflection Questions
                </h3>
                <div className="space-y-2">
                  {weeklyInsights.questions.map((question, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg text-sm">
                      🤔 {question}
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => setIsWeeklySheetOpen(false)}
                className="w-full"
              >
                Got it, thanks! 
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Weekly Overview */}
      <Card className="p-4">
        <h2 className="font-semibold mb-4">This Week's Progress</h2>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{weeklyCompletionRate}%</div>
            <div className="text-xs text-muted-foreground">Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{totalCompleted}</div>
            <div className="text-xs text-muted-foreground">Tasks Done</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{bestStreak}</div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>
        </div>

        {/* Daily breakdown */}
        <div className="space-y-2">
          {weeklyData.map((day, index) => {
            const dailyRate = Math.round((day.completed / day.total) * 100);
            return (
              <div key={day.day} className="flex items-center gap-3">
                <div className="w-8 text-xs text-muted-foreground font-medium">
                  {day.day}
                </div>
                <div className="flex-1">
                  <Progress value={dailyRate} className="h-2" />
                </div>
                <div className="w-12 text-xs text-muted-foreground text-right">
                  {day.completed}/{day.total}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Goal Progress Cards */}
      <div className="space-y-3">
        <h2 className="font-semibold">Goal Progress</h2>
        
        {goalStats.map((goal) => (
          <Card key={goal.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium mb-1">{goal.title}</h3>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{goal.completedTasks}/{goal.totalTasks} tasks</span>
                  <span className="flex items-center gap-1">
                    🔥 {goal.streak} days
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{goal.progress}%</div>
                <div className="text-xs text-success">{goal.trend}</div>
              </div>
            </div>
            
            <Progress value={goal.progress} className="h-2" />
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 text-center">
          <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
          <div className="text-lg font-semibold">{goalStats.length}</div>
          <div className="text-xs text-muted-foreground">Active Goals</div>
        </Card>
        
        <Card className="p-4 text-center">
          <Award className="w-8 h-8 mx-auto mb-2 text-success" />
          <div className="text-lg font-semibold">{bestStreak}</div>
          <div className="text-xs text-muted-foreground">Day Streak</div>
        </Card>
      </div>
    </div>
  );
}