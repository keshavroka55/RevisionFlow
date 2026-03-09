import { Check, Crown, Sparkles } from 'lucide-react';

export default function Payment() {
  return (
    <div className="p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">Upgrade to Premium</h1>
          <p className="text-lg text-muted-foreground">
            Unlock unlimited learning potential
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Current Plan - Free */}
          <div className="bg-white rounded-2xl border-2 border-border p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">Free</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground">Create 2 folders</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground">Unlimited notes</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground">Email reminders</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground">Revision cards</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground">Spaced repetition scheduling</span>
              </div>
            </div>

            <div className="bg-muted text-foreground px-6 py-3 rounded-lg text-center">
              Current Plan
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-primary via-secondary to-primary rounded-2xl border-2 border-primary p-8 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                POPULAR
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">$9</span>
                <span className="text-white/80">/month</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Everything in Free</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">Unlimited folders</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">AI-generated mock tests</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">Advanced analytics</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">Priority support</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">Export notes to PDF</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">Custom revision intervals</span>
              </div>
            </div>

            <button className="w-full bg-white text-primary px-6 py-3 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
              <Crown className="w-5 h-5" />
              Upgrade to Premium
            </button>
          </div>
        </div>

        {/* Student Plan */}
        <div className="bg-gradient-to-r from-accent to-accent/80 rounded-2xl p-8 text-white mb-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Student Plan</h3>
                <p className="text-white/90 mb-4">
                  Are you a student? Get Premium features completely free for 3-6 months! Just verify
                  your student status with a valid student email or ID.
                </p>
                <button className="bg-white text-accent px-6 py-3 rounded-lg hover:bg-white/90 transition-colors">
                  Verify Student Status
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Integration */}
        <div className="bg-white rounded-xl border border-border p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Secure Payment with Stripe
          </h2>

          <div className="max-w-md mx-auto space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-sm mb-2 text-foreground">
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-sm mb-2 text-foreground">
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expiry"
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm mb-2 text-foreground">
                  CVC
                </label>
                <input
                  type="text"
                  id="cvc"
                  placeholder="123"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm mb-2 text-foreground">
                Cardholder Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-sm text-foreground">
              <p className="mb-2">
                <strong>Note:</strong> This is a demo payment form. In a real application, payment
                processing would be handled securely through Stripe's API.
              </p>
              <p className="text-xs text-muted-foreground">
                Replace with actual Stripe Elements integration in production.
              </p>
            </div>

            <button className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              Subscribe to Premium - $9/month
            </button>

            <p className="text-center text-xs text-muted-foreground">
              Cancel anytime. No hidden fees.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-2">Can I cancel anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can cancel your subscription at any time. You'll continue to have access
                until the end of your billing period.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-2">Is there a refund policy?</h3>
              <p className="text-sm text-muted-foreground">
                We offer a 14-day money-back guarantee. If you're not satisfied, contact us for a
                full refund.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-2">What payment methods do you accept?</h3>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards, debit cards, and digital wallets through Stripe.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-2">How does student verification work?</h3>
              <p className="text-sm text-muted-foreground">
                Upload a valid student ID or use your .edu email address. Verification typically
                takes 24-48 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
