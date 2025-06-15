import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, BarChart3, Settings, Plus } from 'lucide-react';

interface Stats {
  focusSessions: number;
  listTodoDone: number;
  dayStreak: number;
}

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [session, setSession] = useState(1);
  const [totalSessions] = useState(4);
  const [activeTab, setActiveTab] = useState('timer');
  const [stats, setStats] = useState<Stats>({
    focusSessions: 0,
    listTodoDone: 0,
    dayStreak: 0
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Session completed
      if (session < totalSessions) {
        setSession(session + 1);
        setTimeLeft(25 * 60);
      }
      setStats(prev => ({ ...prev, focusSessions: prev.focusSessions + 1 }));
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, session, totalSessions]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (session < totalSessions) {
      setSession(session + 1);
      setTimeLeft(25 * 60);
    }
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    const completedTask = tasks.find(task => task.id === id);
    if (completedTask && !completedTask.completed) {
      setStats(prev => ({ ...prev, listTodoDone: prev.listTodoDone + 1 }));
    }
  };

  const TimerView = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-400 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="font-medium text-gray-700">Focus Flow</span>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-8">
          <div className="text-6xl font-light text-gray-800 mb-2">
            {formatTime(timeLeft)}
          </div>
          <div className="text-gray-500">
            Session {session} of {totalSessions}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <button 
            onClick={handleReset}
            className="p-3 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RotateCcw className="w-6 h-6 text-gray-600" />
          </button>
          
          <button 
            onClick={handlePlayPause}
            className="w-16 h-16 bg-red-400 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors shadow-lg"
          >
            {isRunning ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>
          
          <button 
            onClick={handleSkip}
            className="p-3 hover:bg-gray-100 rounded-full transition-colors"
          >
            <SkipForward className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-red-400">{stats.focusSessions}</div>
            <div className="text-sm text-gray-600">Focus Sessions</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-400">{stats.listTodoDone}</div>
            <div className="text-sm text-gray-600">ListTodo Done</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-green-400">{stats.dayStreak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
        </div>

        {/* Today's ListTodo */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-800">Today's ListTodo</h3>
            <button 
              onClick={() => setActiveTab('tasks')}
              className="w-8 h-8 bg-red-400 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
          
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 opacity-30">
                <svg viewBox="0 0 64 64" className="w-full h-full">
                  <rect x="16" y="20" width="32" height="2" fill="currentColor" />
                  <rect x="16" y="26" width="24" height="2" fill="currentColor" />
                  <rect x="16" y="32" width="28" height="2" fill="currentColor" />
                  <circle cx="12" cy="21" r="2" fill="currentColor" />
                  <circle cx="12" cy="27" r="2" fill="currentColor" />
                  <circle cx="12" cy="33" r="2" fill="currentColor" />
                </svg>
              </div>
              <div className="text-gray-500 mb-2">No tasks for today</div>
              <div className="text-gray-400 text-sm">Add your first task</div>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.slice(0, 3).map(task => (
                <div key={task.id} className="flex items-center gap-3 p-2">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      task.completed 
                        ? 'bg-green-400 border-green-400' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {task.completed && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <span className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around max-w-md mx-auto">
          <button 
            onClick={() => setActiveTab('timer')}
            className={`flex flex-col items-center py-2 px-4 ${activeTab === 'timer' ? 'text-red-400' : 'text-gray-400'}`}
          >
            <div className="w-6 h-6 mb-1">⏱️</div>
            <span className="text-xs">Timer</span>
          </button>
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`flex flex-col items-center py-2 px-4 ${activeTab === 'tasks' ? 'text-red-400' : 'text-gray-400'}`}
          >
            <div className="w-6 h-6 mb-1">📝</div>
            <span className="text-xs">Tasks</span>
          </button>
          <button 
            onClick={() => setActiveTab('wellness')}
            className={`flex flex-col items-center py-2 px-4 ${activeTab === 'wellness' ? 'text-red-400' : 'text-gray-400'}`}
          >
            <div className="w-6 h-6 mb-1">💚</div>
            <span className="text-xs">Wellness</span>
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center py-2 px-4 ${activeTab === 'stats' ? 'text-red-400' : 'text-gray-400'}`}
          >
            <div className="w-6 h-6 mb-1">📊</div>
            <span className="text-xs">Stats</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center py-2 px-4 ${activeTab === 'settings' ? 'text-red-400' : 'text-gray-400'}`}
          >
            <div className="w-6 h-6 mb-1">⚙️</div>
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );

  const TasksView = () => (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Tasks</h2>
          
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <button
              onClick={addTask}
              className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    task.completed 
                      ? 'bg-green-400 border-green-400' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {task.completed && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {task.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (activeTab === 'tasks') return <TasksView />;
  
  return <TimerView />;
}

export default App;