import { useState } from 'react';
import { Link } from 'react-router';
import { Check, Trophy, Sparkles, Upload, X } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/input';
import { useApp } from '../contexts/AppContext';

export default function Upgrade() {
  const { user } = useApp();
  const [showStudentVerification, setShowStudentVerification] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'student' | null>(null);

  const handleUpgrade = (plan: 'premium' | 'student') => {
    setSelectedPlan(plan);
    if (plan === 'student') {
      setShowStudentVerification(true);
    } else {
      setShowPayment(true);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4">Upgrade to Premium</h1>
          <p className="text-xl text-gray-600">Unlock unlimited learning potential</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {/* Free Plan */}
          <Card className="p-8">
            <h3 className="text-2xl mb-2">Free</h3>
            <p className="text-4xl mb-6">$0<span className="text-lg text-gray-500">/month</span></p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="text-[#0D9488] mt-0.5 flex-shrink-0" size={20} />
                <span className="text-sm">Up to 2 folders</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#0D9488] mt-0.5 flex-shrink-0" size={20} />
                <span className="text-sm">Unlimited notes</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#0D9488] mt-0.5 flex-shrink-0" size={20} />
                <span className="text-sm">Basic spaced repetition</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#0D9488] mt-0.5 flex-shrink-0" size={20} />
                <span className="text-sm">Manual flashcards</span>
              </li>
            </ul>
            <Button variant="ghost" className="w-full" disabled>
              Current Plan
            </Button>
          </Card>

          {/* Premium Plan */}
          <Card className="p-8 border-2 border-[#4F46E5] relative scale-105 shadow-xl">
            <div className="absolute top-0 right-6 -translate-y-1/2">
              <span className="bg-[#4F46E5] text-white px-4 py-1 rounded-full text-sm flex items-center gap-1">
                <Sparkles size={14} />
                Most Popular
              </span>
            </div>
            <h3 className="text-2xl mb-2">Premium</h3>
            <p className="text-4xl mb-6">$9.99<span className="text-lg text-gray-500">/month</span></p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="text-[#4F46E5] mt-0.5 flex-shrink-0" size={20} />
                <span className="text-sm">Unlimited folders</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#4F46E5] mt-0.5 flex-shrink-0" size={20} />
                <span className="text-sm">AI-generated flashcards & tests</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#4F46E5] mt-0.5 flex-shrink-0" size={20} />
                <span className="text-sm">Calendar integration</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#4F46E5] mt-0.5 flex-shrink-0" size={20} />
                <span className="text-sm">Advanced analytics</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#4F46E5] mt-0.5 flex-shrink-0" size={20} />
                <span className="text-sm">Email revision reminders</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#4F46E5] mt-0.5 flex-shrink-0" size={20} />
                <span className="text-sm">Priority support</span>
              </li>
            </ul>
            <Button onClick={() => handleUpgrade('premium')} className="w-full">
              Upgrade Now
            </Button>
          </Card>

          {/* Student Plan */}
          <Card className="p-8 bg-gradient-to-br from-[#F59E0B]/10 to-[#D97706]/10 border-[#F59E0B]">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="text-[#F59E0B]" size={24} />
              <h3 className="text-2xl">Student</h3>
            </div>
            <p className="text-4xl mb-6">$4.99<span className="text-lg text-gray-500">/month</span></p>
            <div className="bg-[#F59E0B]/20 rounded-xl p-3 mb-6">
              <p className="text-sm text-[#92400E]">
                <strong>50% off</strong> with verified student email or ID
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="text-[#F59E0B] mt-0.5 flex-shrink-0" size={20} />
                <span className="text-sm">All Premium features</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#F59E0B] mt-0.5 flex-shrink-0" size={20} />
                <span className="text-sm">Student-only resources</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#F59E0B] mt-0.5 flex-shrink-0" size={20} />
                <span className="text-sm">Study group features</span>
              </li>
            </ul>
            <Button
              onClick={() => handleUpgrade('student')}
              className="w-full bg-[#F59E0B] hover:bg-[#D97706]"
            >
              Verify Student Status
            </Button>
          </Card>
        </div>

        {/* Student Verification Modal */}
        {showStudentVerification && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <Card className="w-full max-w-md p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Student Verification</h2>
                <button
                  onClick={() => setShowStudentVerification(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm mb-3">Select Institution Type</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#4F46E5]">
                    <option>University/College</option>
                    <option>High School</option>
                    <option>Vocational School</option>
                  </select>
                </div>

                <Input
                  label="Institution Email"
                  type="email"
                  placeholder="you@university.edu"
                />

                <div>
                  <label className="block text-sm mb-3">Upload Student ID (Optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#4F46E5] transition-colors cursor-pointer">
                    <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setShowStudentVerification(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setShowStudentVerification(false);
                      setShowPayment(true);
                    }}
                    className="flex-1"
                  >
                    Verify & Continue
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <Card className="w-full max-w-md p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Payment Details</h2>
                <button
                  onClick={() => setShowPayment(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="bg-[#4F46E5]/10 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">
                    {selectedPlan === 'student' ? 'Student Premium' : 'Premium'} Plan
                  </span>
                  <span className="font-medium">
                    ${selectedPlan === 'student' ? '4.99' : '9.99'}/month
                  </span>
                </div>
                <p className="text-xs text-gray-600">Cancel anytime</p>
              </div>

              <div className="space-y-4">
                <Input label="Card Number" placeholder="1234 5678 9012 3456" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Expiry" placeholder="MM/YY" />
                  <Input label="CVV" placeholder="123" />
                </div>
                <Input label="Cardholder Name" placeholder="Alex Chen" />

                <div className="pt-4">
                  <Button className="w-full">
                    Subscribe Now
                  </Button>
                  <p className="text-xs text-center text-gray-500 mt-3">
                    Powered by Stripe. Your payment info is secure.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Features Comparison */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl text-center mb-8">Why Upgrade?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-[#4F46E5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-[#4F46E5]" size={28} />
              </div>
              <h3 className="text-lg mb-2">AI-Powered Learning</h3>
              <p className="text-sm text-gray-600">
                Automatically generate flashcards and tests from any note in seconds
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-[#0D9488]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="text-[#0D9488]" size={28} />
              </div>
              <h3 className="text-lg mb-2">Advanced Analytics</h3>
              <p className="text-sm text-gray-600">
                Track your progress with detailed insights and performance metrics
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-[#F59E0B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-[#F59E0B]" size={28} />
              </div>
              <h3 className="text-lg mb-2">Never Miss a Revision</h3>
              <p className="text-sm text-gray-600">
                Email reminders and calendar sync keep you on track
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
