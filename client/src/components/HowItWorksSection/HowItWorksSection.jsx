import { Phone, ArrowRight } from 'lucide-react';
import { steps } from '../../data/homeData';
import './HowItWorksSection.scss';

export default function HowItWorksSection() {
  return (
    <section className="how-section">
      {/* Dot-grid bg pattern — moved from inline style to SCSS */}
      <div className="how-section__bg-pattern" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="section-tag mx-auto">⚡ Super Simple</div>
          <h2 className="section-heading">
            Just <span className="text-brand-red">3 Steps</span> Away
          </h2>
          <p className="font-body text-gray-500 mt-4 max-w-md mx-auto">
            Book our services in minutes, and let our team handle the rest.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Steps */}
          <div className="how-section__steps">
            {steps.map((step, i) => (
              <div
                key={step.id}
                className="how-section__step-card group"
              >
                {/* Icon */}
                <div
                  className="how-section__step-icon"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}22, ${step.color}11)`,
                    border: `1.5px solid ${step.color}33`,
                  }}
                >
                  {step.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-heading font-black text-gray-300 uppercase tracking-widest">
                      Step {i + 1}
                    </span>
                    <div className="how-section__step-divider" />
                  </div>
                  <h3 className="font-heading font-black text-gray-900 text-xl mb-1 group-hover:text-brand-red transition-colors">
                    {step.title}
                  </h3>
                  <p className="font-body text-gray-500 text-sm leading-relaxed">{step.description}</p>
                </div>

                <ArrowRight size={18} className="text-gray-200 group-hover:text-brand-red transition-colors flex-shrink-0 mt-1" />
              </div>
            ))}
          </div>

          {/* Phone CTA card */}
          <div className="relative">
            <div className="how-section__cta-card">
              {/* Glow — moved from inline style to SCSS */}
              <div className="how-section__cta-glow" />
              <div className="relative">
                <div className="w-20 h-20 bg-brand-red rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-red">
                  <Phone size={32} className="text-white" />
                </div>
                <h3 className="font-heading font-black text-white text-2xl mb-2">Or Just Call Us</h3>
                <p className="font-body text-gray-400 text-sm mb-6">Talk to our team directly and book in minutes</p>
                <a
                  href="tel:+918926262674"
                  className="inline-flex items-center gap-2 bg-brand-red text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-heading font-black text-lg sm:text-xl shadow-red hover:shadow-[0_8px_32px_rgba(193,39,45,0.5)] hover:scale-105 transition-all duration-200"
                >
                  +91-89262 62674
                </a>
                <p className="font-body text-gray-500 text-xs mt-4">Available 9 AM – 9 PM, 7 days a week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
