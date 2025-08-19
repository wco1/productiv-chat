import React, { useState, useRef, useEffect } from 'react';
import { Send, Menu, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// Mock data
const mockGoals = [
  { id: '1', title: 'Learn TypeScript', isActive: true },
  { id: '2', title: 'Build Workout Habit', isActive: false },
  { id: '3', title: 'Read 2 Books per Month', isActive: false }
];

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: {
    type: 'add_tasks' | 'set_goal';
    items: string[];
  };
}

const mockMessages: Message[] = [
  {
    id: '1',
    type: 'assistant',
    content: "Hi! I'm your AI coach for TypeScript learning. I see you want to master TypeScript fundamentals. Let's break this down into manageable steps! 🎯",
    timestamp: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: '2', 
    type: 'user',
    content: "I want to focus on understanding generics better. Can you help?",
    timestamp: new Date(Date.now() - 1000 * 60 * 25)
  },
  {
    id: '3',
    type: 'assistant', 
    content: "Absolutely! Generics are powerful for creating reusable, type-safe code. Here are some focused steps to master them:",
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    actions: {
      type: 'add_tasks',
      items: [
        "Read TypeScript generics documentation (30 min)",
        "Practice basic generic functions with examples",
        "Build a simple generic utility type",
        "Create a generic class with constraints"
      ]
    }
  }
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(mockGoals.find(g => g.isActive));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "Great question! Let me help you with that. Here are some specific steps you can take:",
        timestamp: new Date(),
        actions: {
          type: 'add_tasks',
          items: [
            "Research the topic for 20 minutes",
            "Try a hands-on example",
            "Write a summary of key learnings"
          ]
        }
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (action: string, items?: string[]) => {
    if (action === 'add_all_tasks' && items) {
      // Simulate adding tasks
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: `Perfect! I've added ${items.length} tasks to your "${selectedGoal?.title}" goal. You can view and manage them in the Tasks tab. Keep up the great work! 🎉`,
        timestamp: new Date()
      }]);
    } else if (action === 'okay') {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'user',
        content: 'Okay',
        timestamp: new Date()
      }]);
      
      // Trigger AI response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'assistant',
          content: "Excellent! Is there anything specific about this topic you'd like me to explain further?",
          timestamp: new Date()
        }]);
      }, 500);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">Chat</h1>
          {selectedGoal && (
            <Badge variant="secondary" className="text-xs">
              {selectedGoal.title}
            </Badge>
          )}
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>Switch Chat</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-2">
              <button
                onClick={() => setSelectedGoal(undefined)}
                className={cn(
                  "w-full p-3 text-left rounded-lg border transition-colors duration-quick",
                  !selectedGoal 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-card hover:bg-muted border-border"
                )}
              >
                <div className="flex items-center gap-2">
                  <Bot size={18} />
                  <span className="font-medium">Master Coach</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  General guidance for all goals
                </p>
              </button>
              
              {mockGoals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal)}
                  className={cn(
                    "w-full p-3 text-left rounded-lg border transition-colors duration-quick",
                    selectedGoal?.id === goal.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card hover:bg-muted border-border"
                  )}
                >
                  <div className="font-medium truncate">{goal.title}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Goal-specific coaching
                  </p>
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {messages.map((message) => (
          <div key={message.id} className="animate-fade-in">
            <div className={cn(
              "flex gap-3 mb-2",
              message.type === 'user' ? "justify-end" : "justify-start"
            )}>
              {message.type === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={16} className="text-primary" />
                </div>
              )}
              
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3",
                message.type === 'user' 
                  ? "bg-chat-user text-chat-user-foreground" 
                  : "bg-chat-assistant text-chat-assistant-foreground"
              )}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                
                {/* Action Buttons */}
                {message.actions && (
                  <div className="mt-3 space-y-2">
                    {message.actions.items.map((item, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="mr-2 mb-2 h-8 px-3 text-xs bg-background/10 hover:bg-background/20"
                        onClick={() => handleQuickAction('add_task', [item])}
                      >
                        + {item}
                      </Button>
                    ))}
                    
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 px-3 text-xs"
                        onClick={() => handleQuickAction('add_all_tasks', message.actions?.items)}
                      >
                        Add all to tasks
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm" 
                        className="h-8 px-3 text-xs"
                        onClick={() => handleQuickAction('okay')}
                      >
                        Okay ✨
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                  <User size={16} className="text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div className={cn(
              "text-xs text-muted-foreground px-3",
              message.type === 'user' ? "text-right" : "text-left"
            )}>
              {formatTime(message.timestamp)}
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <Bot size={16} className="text-primary" />
            </div>
            <div className="bg-chat-assistant text-chat-assistant-foreground rounded-2xl px-4 py-3 max-w-[80%]">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedGoal ? `Ask about ${selectedGoal.title}...` : "Chat with your master coach..."}
            className="flex-1 min-h-[44px] max-h-24 resize-none"
            rows={1}
          />
          <Button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="h-11 w-11 flex-shrink-0"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}