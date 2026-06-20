import { Link } from 'react-router-dom';
import {
  ChevronRight, CheckCircle, TrendingUp, Users, Briefcase,
  Star, Clock, HeartHandshake, BarChart3, MessageCircle,
  FileText, Mail, Phone, Home, User, Calendar, Shield,
} from 'lucide-react';
import './PartnerPage.scss';

const HERO_IMAGE = 'https://images.pexels.com/photos/2696064/pexels-photo-2696064.jpeg?auto=compress&cs=tinysrgb&w=1600';
const STORY_IMAGE = 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800';
const WHATSAPP_URL = 'https://wa.me/918926262674?text=Hello! I am interested in becoming a partner.';

const BENEFITS = [
  { icon: TrendingUp,    title: 'Establish Faster',         desc: 'Skip the long setup curve. Our network, brand and processes fast-track your business launch.' },
  { icon: Users,         title: 'Wide Customer Base',       desc: 'Tap into our existing clientele across Delhi NCR — weddings, corporate events and more.' },
  { icon: Briefcase,     title: 'Full Backend Support',     desc: 'Staffing, training, marketing and sales acquisition — we handle the hard parts for you.' },
  { icon: BarChart3,     title: 'More Leads & Revenue',     desc: 'Receive qualified leads directly from our platform and convert them into recurring income.' },
  { icon: Star,          title: 'Higher Success Rate',      desc: 'Partners backed by The Famous Halwai brand enjoy significantly higher event win rates.' },
  { icon: HeartHandshake,'title': 'Transparent Partnership','desc': 'Zero hidden charges. Clear revenue sharing and complete transparency at every step.' },
  { icon: Clock,         title: 'Flexible Working Hours',   desc: 'Choose the events and schedule that work for you. Complete freedom over your workload.' },
];

// ─── Hero
function HeroSection() {
  return (
    <section className="pp-hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
      <div className="pp-hero__overlay" />
      <div className="pp-hero__content">
        <nav className="pp-hero__breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <span>Partner Programme</span>
        </nav>
        <div className="pp-hero__badge">🤝 Partner Programme</div>
        <h1 className="pp-hero__title">
          Grow Your Business<br />
          With <span className="pp-hero__accent">The Famous Halwai</span>
        </h1>
        <p className="pp-hero__sub">
          Zero investment. Maximum support. Join 500+ verified chefs, halwais &amp; caterers already thriving on our platform.
        </p>
        <div className="pp-hero__actions">
          <a href="#download" className="pp-hero__cta pp-hero__cta--primary">
            Download App
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="pp-hero__cta pp-hero__cta--ghost">
            <MessageCircle size={16} /> Chat with Us
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Stats strip ──────────────────────────────────────────────────────────────
const STATS = [
  { value: '500+', label: 'Active Partners' },
  { value: '15+',  label: 'Cities Covered' },
  { value: '₹0',   label: 'Investment Required' },
  { value: '24hr', label: 'Onboarding Time' },
];

function StatsStrip() {
  return (
    <div className="pp-stats">
      {STATS.map((s) => (
        <div key={s.label} className="pp-stats__item">
          <p className="pp-stats__value">{s.value}</p>
          <p className="pp-stats__label">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Intro / pitch ────────────────────────────────────────────────────────────
function IntroSection() {
  return (
    <section className="pp-intro">
      <div className="pp-intro__inner">
        <div className="pp-intro__text">
          <div className="section-tag">📖 Why Partner With Us</div>
          <h2 className="pp-intro__heading">
            Realise Your Dream of<br />
            <span className="text-brand-red">Becoming an Entrepreneur</span>
          </h2>
          <p className="pp-intro__para">
            The Famous Halwai is inviting spirited and ambitious investors, professionals and aspirants to join our growing partner network.             Start your own business with the backing of Delhi NCR&apos;s most trusted catering brand.
          </p>
          <p className="pp-intro__para">
            This is an incredible franchising opportunity that enables you to boost your revenue and experience a variety of events. We provide complete backend support — from training and staffing to marketing and sales acquisition.
          </p>
          <ul className="pp-intro__checklist">
            {[
              'Zero investment required to get started',
              'Flexible working hours — you choose your schedule',
              'Complete backend support from day one',
              'Maximum benefits, profits and lead generation',
            ].map((item) => (
              <li key={item} className="pp-intro__check-item">
                <CheckCircle size={16} className="pp-intro__check-icon" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="pp-intro__image-wrap">
          <img src={STORY_IMAGE} alt="Partner team collaboration" className="pp-intro__image" />
          <div className="pp-intro__image-badge">
            <HeartHandshake size={20} className="text-brand-gold" />
            <div>
              <p className="font-heading font-black text-white text-sm">500+ Partners</p>
              <p className="font-body text-white/70 text-xs">Already thriving</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Verification & Fee ─────────────────────────────────────────────────────────
function VerificationFeeSection() {
  return (
    <section className="pp-verification-fee">
      <div className="pp-section-inner">
        <div className="text-center mb-12">
          <div className="section-tag mx-auto">📋 Verification &amp; Fee</div>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-dark mt-2">
            Verification &amp; Fee
            <span className="ml-2 text-xs font-body text-dark/60">
              वेरिफिकेशन और फीस
            </span>
          </h2>
          <p className="font-body text-gray-500 mt-3 max-w-lg mx-auto text-sm mb-6">
              Fill in your professional expertise, experience, and service locations. To complete your verification, you will need to upload the following documents:
            <br />
            
          </p>
          <div className="verification-grid">
            <div className="verification-item">
              <div className="verification-item__icon">
                <FileText size={20} className="text-brand-red" />
              </div>
              <div className="verification-item__content">
                <h3 className="font-heading font-semibold text-dark">Aadhaar Card (Front & Back)</h3>
                <p className="font-body text-gray-600 text-sm">आधार कार्ड (आगे और पीछे)</p>
              </div>
            </div>
            <div className="verification-item">
              <div className="verification-item__icon">
                <FileText size={20} className="text-brand-red" />
              </div>
              <div className="verification-item__content">
                <h3 className="font-heading font-semibold text-dark">PAN Card Details</h3>
                <p className="font-body text-gray-600 text-sm">पैन कार्ड की जानकारी</p>
              </div>
            </div>
            <div className="verification-item">
              <div className="verification-item__icon">
                <Home size={20} className="text-brand-red" />
              </div>
              <div className="verification-item__content">
                <h3 className="font-heading font-semibold text-dark">Bank Account &amp; IFSC</h3>
                <p className="font-body text-gray-600 text-sm">बैंक अकाउंट और IFSC कोड</p>
              </div>
            </div>
            <div className="verification-item">
              <div className="verification-item__icon">
                <Mail size={20} className="text-brand-red" />
              </div>
              <div className="verification-item__content">
                <h3 className="font-heading font-semibold text-dark">UPI ID for Payments</h3>
                <p className="font-body text-gray-600 text-sm">भुगतान के लिए UPI ID</p>
              </div>
            </div>
            <div className="verification-item">
              <div className="verification-item__icon">
                <Calendar size={20} className="text-brand-red" />
              </div>
              <div className="verification-item__content">
                <h3 className="font-heading font-semibold text-dark">Experience Certificate</h3>
                <p className="font-body text-gray-600 text-sm">अनुभव प्रमाण पत्र (यदि हो)</p>
              </div>
            </div>
            <div className="verification-item">
              <div className="verification-item__icon">
                <User size={20} className="text-brand-red" />
              </div>
              <div className="verification-item__content">
                <h3 className="font-heading font-semibold text-dark">Clear Profile Photo</h3>
                <p className="font-body text-gray-600 text-sm">साफ प्रोफाइल फोटो</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Benefits ─────────────────────────────────────────────────────────────────
// function BenefitsSection() {
//   return (
//     // <section className="pp-benefits">
//     //   <div className="pp-section-inner">
//     //     {/* <div className="text-center mb-12">
//     //       <div className="section-tag mx-auto">⭐ Benefits</div>
//     //       <h2 className="font-heading font-black text-3xl md:text-4xl text-dark mt-2">
//     //         Benefits of <span className="text-brand-red">Franchising With Us</span>
//     //       </h2>
//     //       <p className="font-body text-gray-500 mt-3 max-w-lg mx-auto text-sm">
//     //         Everything you need to run a successful catering business — we provide it all.
//     //       </p>
//     //     </div>
//     //     <div className="pp-benefits__grid">
//     //       {BENEFITS.map(({ icon: Icon, title, desc }) => (
//     //         <div key={title} className="pp-benefit-card">
//     //           <div className="pp-benefit-card__icon-wrap">
//     //             <Icon size={22} />
//     //           </div>
//     //           <h3 className="pp-benefit-card__title">{title}</h3>
//     //           <p className="pp-benefit-card__desc">{desc}</p>
//     //         </div>
//     //       ))}
//     //     </div> */}
//     //   </div>
//     // </section>
//   );
// }

// ─── CTA Strip ─────────────────────────────────────────────────────────────────
function CTAStrip() {
  return (
    <section className="pp-cta">
      <div className="pp-cta__inner">
        <a href="#download" className="pp-cta__btn" download>Download App</a>
      </div>
    </section>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PartnerPage() {
  return (
    <div className="partner-page">
      <HeroSection />
      <StatsStrip />
      <IntroSection />
      {/* <BenefitsSection /> */}
      <VerificationFeeSection />
      <CTAStrip />
    </div>
  );
}