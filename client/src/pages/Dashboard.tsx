import { FileText, Calendar, TrendingUp, Clock, CheckCircle, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const revisionData = [
  { day: 'Mon', revisions: 5 },
  { day: 'Tue', revisions: 8 },
  { day: 'Wed', revisions: 6 },
  { day: 'Thu', revisions: 10 },
  { day: 'Fri', revisions: 7 },
  { day: 'Sat', revisions: 12 },
  { day: 'Sun', revisions: 9 },
];

const todayRevisions = [
  { id: 1, title: 'Quantum Mechanics - Wave Functions', folder: 'Physics', dueIn: 'Due now' },
  { id: 2, title: 'Binary Search Trees', folder: 'Computer Science', dueIn: 'Due now' },
  { id: 3, title: 'Spanish Verb Conjugations', folder: 'Languages', dueIn: '2 hours' },
];

export default function Dashboard() {
  return (
    <div className="p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back! 👋</h1>
        <p className="text-muted-foreground">Here's your learning progress for today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold text-foreground">47</span>
          </div>
          <h3 className="text-sm text-muted-foreground">Total Notes</h3>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-accent" />
            </div>
            <span className="text-2xl font-bold text-foreground">23</span>
          </div>
          <h3 className="text-sm text-muted-foreground">Completed Today</h3>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-warning/10 w-12 h-12 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-warning" />
            </div>
            <span className="text-2xl font-bold text-foreground">12</span>
          </div>
          <h3 className="text-sm text-muted-foreground">Upcoming Revisions</h3>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
            <span className="text-2xl font-bold text-foreground">87%</span>
          </div>
          <h3 className="text-sm text-muted-foreground">Retention Rate</h3>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {/* Today's Revisions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Today's Revisions</h2>
              <span className="text-sm text-muted-foreground">{todayRevisions.length} pending</span>
            </div>
            <div className="space-y-3">
              {todayRevisions.map((revision) => (
                <div
                  key={revision.id}
                  className="border border-border rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{revision.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {revision.folder}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {revision.dueIn}
                        </span>
                      </div>
                    </div>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors whitespace-nowrap">
                      Start Revision
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {todayRevisions.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">All caught up!</h3>
                <p className="text-sm text-muted-foreground">No revisions due today</p>
              </div>
            )}
          </div>

          {/* Progress Chart */}
          <div className="bg-white rounded-xl border border-border p-6 mt-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Weekly Activity</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revisionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="revisions" fill="#4F46E5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Next Revision Reminder */}
          <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Next Revision</h3>
                <p className="text-sm text-white/80">Tomorrow, 9:00 AM</p>
              </div>
            </div>
            <p className="text-sm text-white/90 mb-4">
              You have 5 notes scheduled for revision tomorrow
            </p>
            <button className="w-full bg-white text-primary px-4 py-2 rounded-lg hover:bg-white/90 transition-colors text-sm">
              View Schedule
            </button>
          </div>

          {/* Recent Folders */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Recent Folders</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-muted transition-colors cursor-pointer">
                <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground text-sm">Physics</h4>
                  <p className="text-xs text-muted-foreground">12 notes</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-muted transition-colors cursor-pointer">
                <div className="bg-secondary/10 w-10 h-10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground text-sm">Computer Science</h4>
                  <p className="text-xs text-muted-foreground">18 notes</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-muted transition-colors cursor-pointer">
                <div className="bg-accent/10 w-10 h-10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground text-sm">Languages</h4>
                  <p className="text-xs text-muted-foreground">17 notes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Study Streak */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Study Streak 🔥</h3>
            <div className="text-center py-4">
              <div className="text-5xl font-bold text-primary mb-2">14</div>
              <p className="text-sm text-muted-foreground">Days in a row</p>
            </div>
            <div className="mt-4 flex justify-between text-xs text-muted-foreground">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>
            <div className="mt-2 flex justify-between gap-1">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex-1 h-2 bg-primary rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
