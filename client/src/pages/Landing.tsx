import { Link } from 'react-router';
import { Brain, Calendar, FileText, Mail, Check, ArrowRight, BookOpen, Trophy, Clock } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-primary" />
              <span className="text-xl font-semibold text-foreground">Revision Flow</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-foreground hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">How it Works</a>
              <a href="#pricing" className="text-foreground hover:text-primary transition-colors">Pricing</a>
              <Link to="/login" className="text-foreground hover:text-primary transition-colors">Login</Link>
              <Link to="/signup" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                Get Started
              </Link>
            </div>
            <div className="md:hidden">
              <Link to="/signup" className="bg-primary text-white px-4 py-2 rounded-lg text-sm">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Learn Once. Remember Forever.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Create notes and automatically revise them using proven spaced repetition.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors text-center inline-flex items-center justify-center gap-2">
                  Start Free <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="#how-it-works" className="border-2 border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary/5 transition-colors text-center">
                  View Demo
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-border">
                <div className="space-y-4">
                  <div className="bg-primary/10 rounded-lg p-4 border-l-4 border-primary">
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Quantum Physics</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Next revision: Tomorrow</p>
                  </div>
                  <div className="bg-secondary/10 rounded-lg p-4 border-l-4 border-secondary">
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen className="w-5 h-5 text-secondary" />
                      <h3 className="font-semibold text-foreground">Data Structures</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Next revision: in 3 days</p>
                  </div>
                  <div className="bg-accent/10 rounded-lg p-4 border-l-4 border-accent">
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen className="w-5 h-5 text-accent" />
                      <h3 className="font-semibold text-foreground">Spanish Vocabulary</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Next revision: in 7 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to master your learning material
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-background rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Smart Revision System</h3>
              <p className="text-muted-foreground text-sm">
                Automatic reminders at 3, 7, 14, and 28 days.
              </p>
            </div>
            <div className="bg-background rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Revision Cards</h3>
              <p className="text-muted-foreground text-sm">
                Quick flashcards for fast revision.
              </p>
            </div>
            <div className="bg-background rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Mock Tests</h3>
              <p className="text-muted-foreground text-sm">
                AI generated quizzes from your notes.
              </p>
            </div>
            <div className="bg-background rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="bg-warning/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-warning" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Email Reminders</h3>
              <p className="text-muted-foreground text-sm">
                Never forget what you learned.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple and effective learning in 4 steps
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-foreground mb-2">Create a learning note</h3>
              <p className="text-muted-foreground text-sm">
                Write down what you want to remember
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-foreground mb-2">System schedules revisions</h3>
              <p className="text-muted-foreground text-sm">
                Automatic scheduling based on science
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-foreground mb-2">Practice with cards and quizzes</h3>
              <p className="text-muted-foreground text-sm">
                Engage with your material actively
              </p>
            </div>
            <div className="text-center">
              <div className="bg-warning text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-foreground mb-2">Remember forever</h3>
              <p className="text-muted-foreground text-sm">
                Long-term retention guaranteed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Simple Pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works for you
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-background rounded-xl p-8 border-2 border-border hover:border-primary transition-colors">
              <h3 className="text-xl font-bold text-foreground mb-2">Free</h3>
              <p className="text-3xl font-bold text-foreground mb-6">$0<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">Create 2 folders</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">Unlimited notes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">Email reminders</span>
                </li>
              </ul>
              <Link to="/signup" className="block w-full bg-muted text-foreground px-6 py-3 rounded-lg hover:bg-muted/80 transition-colors text-center">
                Get Started
              </Link>
            </div>
            <div className="bg-primary rounded-xl p-8 border-2 border-primary transform scale-105 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-2">Premium</h3>
              <p className="text-3xl font-bold text-white mb-6">$9<span className="text-sm font-normal text-white/80">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white text-sm">Unlimited folders</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white text-sm">AI mock tests</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white text-sm">Advanced analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white text-sm">Everything in Free</span>
                </li>
              </ul>
              <Link to="/signup" className="block w-full bg-white text-primary px-6 py-3 rounded-lg hover:bg-white/90 transition-colors text-center">
                Start Premium
              </Link>
            </div>
            <div className="bg-background rounded-xl p-8 border-2 border-accent hover:border-accent transition-colors">
              <h3 className="text-xl font-bold text-foreground mb-2">Student</h3>
              <p className="text-3xl font-bold text-foreground mb-6">Free<span className="text-sm font-normal text-muted-foreground"> for 3-6mo</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">Premium features free</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">Student verification required</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">All Premium features</span>
                </li>
              </ul>
              <Link to="/signup" className="block w-full bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors text-center">
                Verify Student Status
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-8 h-8 text-primary" />
                <span className="text-xl font-semibold">Revision Flow</span>
              </div>
              <p className="text-white/70 text-sm">
                Learn once. Remember forever.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/70">
            © 2026 Revision Flow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
