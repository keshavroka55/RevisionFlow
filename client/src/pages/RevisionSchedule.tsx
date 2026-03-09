import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface ScheduleItem {
  id: number;
  title: string;
  folder: string;
  date: string;
  status: 'completed' | 'pending' | 'upcoming';
  dayNumber: number;
}

const scheduleItems: ScheduleItem[] = [
  { id: 1, title: 'Quantum Mechanics - Wave Functions', folder: 'Physics', date: 'Today, 9:00 AM', status: 'pending', dayNumber: 3 },
  { id: 2, title: 'Binary Search Trees', folder: 'Computer Science', date: 'Today, 2:00 PM', status: 'pending', dayNumber: 7 },
  { id: 3, title: 'Spanish Verb Conjugations', folder: 'Languages', date: 'Yesterday', status: 'completed', dayNumber: 14 },
  { id: 4, title: 'Thermodynamics Laws', folder: 'Physics', date: 'Tomorrow, 10:00 AM', status: 'upcoming', dayNumber: 3 },
  { id: 5, title: 'Sorting Algorithms', folder: 'Computer Science', date: 'Mar 12', status: 'upcoming', dayNumber: 7 },
  { id: 6, title: 'French Grammar', folder: 'Languages', date: 'Mar 15', status: 'upcoming', dayNumber: 14 },
  { id: 7, title: 'Electromagnetism', folder: 'Physics', date: 'Mar 20', status: 'upcoming', dayNumber: 28 },
];

export default function RevisionSchedule() {
  const pending = scheduleItems.filter(item => item.status === 'pending');
  const upcoming = scheduleItems.filter(item => item.status === 'upcoming');
  const completed = scheduleItems.filter(item => item.status === 'completed');

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Revision Schedule</h1>
        <p className="text-muted-foreground">Your learning timeline based on spaced repetition</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Due Today</p>
              <p className="text-3xl font-bold text-warning">{pending.length}</p>
            </div>
            <div className="bg-warning/10 w-12 h-12 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Upcoming</p>
              <p className="text-3xl font-bold text-primary">{upcoming.length}</p>
            </div>
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-3xl font-bold text-accent">{completed.length}</p>
            </div>
            <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Spaced Repetition Info */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 mb-8 text-white">
        <h3 className="font-semibold mb-3">📅 Spaced Repetition Schedule</h3>
        <p className="text-sm text-white/90 mb-4">
          Our system uses scientifically-proven intervals to maximize retention
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold mb-1">Day 3</div>
            <div className="text-xs text-white/80">First Review</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold mb-1">Day 7</div>
            <div className="text-xs text-white/80">Second Review</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold mb-1">Day 14</div>
            <div className="text-xs text-white/80">Third Review</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold mb-1">Day 28</div>
            <div className="text-xs text-white/80">Final Review</div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Pending Revisions */}
        {pending.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              Due Today
            </h2>
            <div className="space-y-3">
              {pending.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border-2 border-warning/30 p-4 hover:border-warning transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="bg-warning/10 text-warning px-2 py-1 rounded">
                          Day {item.dayNumber} Review
                        </span>
                        <span>{item.folder}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {item.date}
                        </span>
                      </div>
                    </div>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap">
                      Start Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Revisions */}
        {upcoming.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming
            </h2>
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              {upcoming.map((item, index) => (
                <div
                  key={item.id}
                  className={`p-4 hover:bg-background transition-colors ${
                    index !== upcoming.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                          Day {item.dayNumber} Review
                        </span>
                        <span>{item.folder}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Revisions */}
        {completed.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              Recently Completed
            </h2>
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              {completed.map((item, index) => (
                <div
                  key={item.id}
                  className={`p-4 ${
                    index !== completed.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-accent" />
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="bg-accent/10 text-accent px-2 py-1 rounded">
                          Day {item.dayNumber} Review
                        </span>
                        <span>{item.folder}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
