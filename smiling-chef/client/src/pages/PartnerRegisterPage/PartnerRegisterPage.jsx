import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, CheckCircle, ArrowRight, MessageCircle, Phone, ShieldCheck,
  Upload, X,
} from 'lucide-react';
import './PartnerRegisterPage.scss';

const WHATSAPP_URL = 'https://wa.me/918926262674?text=Hello! I am interested in becoming a partner.';

const PARTNER_TYPES = ['Halwai', 'Chef', 'Caterers', 'House Wife', 'Others'];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttarakhand', 'Uttar Pradesh', 'West Bengal',
];

const EXPERIENCE_YEARS = Array.from({ length: 30 }, (_, i) => i + 1);

const TERMS_TEXT = `This Terms of Use agreement was last updated on 1st Jan 2024. This Terms of Use agreement is effective as of 15th July 2015.
THE FAMOUS HALWAI Private Limited ("THE FAMOUS HALWAI"), primarily operates, controls and manages the Services provided by it from its Corporate Office at B-191 Kushak No-2 Kadhi Pur Delhi registered with GSTIN: 07AAHCK2813M1ZD and CIN:U55204DL2018PTC339550.

By registering as a partner, you agree to provide accurate and complete information. The Famous Halwai reserves the right to verify all submitted information and reject applications that do not meet our partner criteria. Partner benefits, leads and support are subject to availability and performance.

Your personal data will be used solely for partner onboarding and communication purposes and will not be shared with third parties without your consent.`;

// ── File Upload Input ─────────────────────────────────────────────────────────
function FileUpload({ label, hint, accept, required, onChange }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : '');
    if (onChange) onChange(file || null);
  };

  const clear = () => {
    setFileName('');
    if (inputRef.current) inputRef.current.value = '';
    if (onChange) onChange(null);
  };

  return (
    <div className="prp-upload">
      <label className="prp-form__label">
        {required && <span className="prp-req">*</span>} {label}
      </label>
      {hint && <p className="prp-upload__hint">{hint}</p>}
      <div className="prp-upload__box" onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept={accept} onChange={handleChange} hidden />
        {fileName ? (
          <div className="prp-upload__file">
            <span className="prp-upload__name">{fileName}</span>
            <button type="button" className="prp-upload__clear" onClick={(e) => { e.stopPropagation(); clear(); }}>
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="prp-upload__placeholder">
            <Upload size={16} />
            <span>Choose File</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Terms Modal ───────────────────────────────────────────────────────────────
function TermsModal({ onClose }) {
  return (
    <div className="prp-modal-backdrop" onClick={onClose}>
      <div className="prp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="prp-modal__head">
          <h3 className="prp-modal__title">Terms &amp; Conditions</h3>
          <button className="prp-modal__close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="prp-modal__body">
          {TERMS_TEXT.split('\n\n').map((para, i) => (
            <p key={i} className="prp-modal__para">{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Registration Form ─────────────────────────────────────────────────────────
function RegistrationForm() {
  const [form, setForm] = useState({
    partnerType: '',
    name: '',
    phone: '',
    email: '',
    state: '',
    city: '',
    address: '',
    experience: '',
    specialization: '',
    about: '',
    referralCode: '',
    agreeTerms: false,
  });
  const [photo, setPhoto] = useState(null);
  const [document, setDocument] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.partnerType) e.partnerType = 'Required';
    if (!form.name.trim()) e.name = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.state) e.state = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.experience) e.experience = 'Required';
    if (!form.specialization.trim()) e.specialization = 'Required';
    if (!form.about.trim()) e.about = 'Required';
    if (!form.agreeTerms) e.agreeTerms = 'You must agree to the Terms & Conditions';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="prp-success">
        <CheckCircle size={56} className="prp-success__icon" />
        <h3 className="prp-success__title">Registration Received!</h3>
        <p className="prp-success__msg">
          Thank you, <strong>{form.name}</strong>! Our team will reach out to you at{' '}
          <strong>{form.phone}</strong> within 24 hours.
        </p>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="prp-success__wa">
          <MessageCircle size={17} /> Speed things up on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <>
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}

      <form className="prp-form" onSubmit={handleSubmit} noValidate>

        {/* Row 1: Type of Partner + Name */}
        <div className="prp-form__row">
          <div className="prp-form__group">
            <label className="prp-form__label"><span className="prp-req">*</span> Type of Partner</label>
            <select className={`prp-form__select${errors.partnerType ? ' prp-form__select--err' : ''}`}
              value={form.partnerType} onChange={(e) => set('partnerType', e.target.value)}>
              <option value="">— Type of Partner —</option>
              {PARTNER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.partnerType && <span className="prp-form__err">{errors.partnerType}</span>}
          </div>
          <div className="prp-form__group">
            <label className="prp-form__label"><span className="prp-req">*</span> Your Name</label>
            <input type="text" className={`prp-form__input${errors.name ? ' prp-form__input--err' : ''}`}
              placeholder="Enter Your Name"
              value={form.name} onChange={(e) => set('name', e.target.value)} />
            {errors.name && <span className="prp-form__err">{errors.name}</span>}
          </div>
        </div>

        {/* Row 2: Mobile + Email */}
        <div className="prp-form__row">
          <div className="prp-form__group">
            <label className="prp-form__label"><span className="prp-req">*</span> Mobile Number</label>
            <input type="tel" className={`prp-form__input${errors.phone ? ' prp-form__input--err' : ''}`}
              placeholder="Enter Mobile Number"
              value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            {errors.phone && <span className="prp-form__err">{errors.phone}</span>}
          </div>
          <div className="prp-form__group">
            <label className="prp-form__label">Enter Email <span className="prp-optional">(optional)</span></label>
            <input type="email" className="prp-form__input" placeholder="Enter Email"
              value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
        </div>

        {/* Row 3: State + City */}
        <div className="prp-form__row">
          <div className="prp-form__group">
            <label className="prp-form__label"><span className="prp-req">*</span> Select State</label>
            <select className={`prp-form__select${errors.state ? ' prp-form__select--err' : ''}`}
              value={form.state} onChange={(e) => set('state', e.target.value)}>
              <option value="">— Select State —</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <span className="prp-form__err">{errors.state}</span>}
          </div>
          <div className="prp-form__group">
            <label className="prp-form__label"><span className="prp-req">*</span> Enter City</label>
            <input type="text" className={`prp-form__input${errors.city ? ' prp-form__input--err' : ''}`}
              placeholder="Enter City Name"
              value={form.city} onChange={(e) => set('city', e.target.value)} />
            {errors.city && <span className="prp-form__err">{errors.city}</span>}
          </div>
        </div>

        {/* Address */}
        <div className="prp-form__group">
          <label className="prp-form__label"><span className="prp-req">*</span> Address</label>
          <input type="text" className={`prp-form__input${errors.address ? ' prp-form__input--err' : ''}`}
            placeholder="Enter Address"
            value={form.address} onChange={(e) => set('address', e.target.value)} />
          {errors.address && <span className="prp-form__err">{errors.address}</span>}
        </div>

        {/* Row 4: Photo + Document uploads */}
        <div className="prp-form__row">
          <FileUpload
            label="Upload Your Photo"
            hint="Note: (W:150px & H:150px) and JPEG, JPG, PNG only"
            accept="image/jpeg,image/jpg,image/png"
            onChange={setPhoto}
          />
          <FileUpload
            label="Upload Your Document"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={setDocument}
          />
        </div>

        {/* Experience */}
        <div className="prp-form__group">
          <label className="prp-form__label"><span className="prp-req">*</span> Your Experience (in Years)</label>
          <select className={`prp-form__select${errors.experience ? ' prp-form__select--err' : ''}`}
            value={form.experience} onChange={(e) => set('experience', e.target.value)}>
            <option value="">— Select One —</option>
            {EXPERIENCE_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          {errors.experience && <span className="prp-form__err">{errors.experience}</span>}
        </div>

        {/* Specialization */}
        <div className="prp-form__group">
          <label className="prp-form__label"><span className="prp-req">*</span> Specialization in Your Profession</label>
          <textarea className={`prp-form__textarea${errors.specialization ? ' prp-form__textarea--err' : ''}`}
            rows={3} placeholder="Enter Specialization in Profession"
            value={form.specialization} onChange={(e) => set('specialization', e.target.value)} />
          {errors.specialization && <span className="prp-form__err">{errors.specialization}</span>}
        </div>

        {/* About Self */}
        <div className="prp-form__group">
          <label className="prp-form__label">
            <span className="prp-req">*</span> About Yourself{' '}
            <span className="prp-optional">(max. 300 chars)</span>
          </label>
          <textarea className={`prp-form__textarea${errors.about ? ' prp-form__textarea--err' : ''}`}
            rows={4} placeholder="Enter About Your Self" maxLength={300}
            value={form.about} onChange={(e) => set('about', e.target.value)} />
          <span className="prp-form__charcount">{form.about.length}/300</span>
          {errors.about && <span className="prp-form__err">{errors.about}</span>}
        </div>

        {/* Referral Code */}
        <div className="prp-form__group">
          <label className="prp-form__label">Referral Code <span className="prp-optional">(optional)</span></label>
          <input type="text" className="prp-form__input" placeholder="Enter Referral Code"
            value={form.referralCode} onChange={(e) => set('referralCode', e.target.value)} />
        </div>

        {/* Terms checkbox */}
        <div className="prp-form__group">
          <label className="prp-form__terms">
            <input type="checkbox" className="prp-form__checkbox"
              checked={form.agreeTerms} onChange={(e) => set('agreeTerms', e.target.checked)} />
            <span>
              I agree to the{' '}
              <button type="button" className="prp-form__terms-link" onClick={() => setShowTerms(true)}>
                Terms &amp; Conditions
              </button>
            </span>
          </label>
          {errors.agreeTerms && <span className="prp-form__err">{errors.agreeTerms}</span>}
        </div>

        <div className="prp-form__footer">
          <button type="submit" className="prp-form__submit">
            Submit Registration <ArrowRight size={16} />
          </button>
          <p className="prp-form__privacy">🔒 Your details are safe with us. We never share your data.</p>
        </div>
      </form>
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PartnerRegisterPage() {
  return (
    <div className="prp-page">
      {/* Page Header */}
      <div className="prp-header">
        <div className="prp-header__inner">
          <nav className="prp-header__breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} />
            <Link to="/partner">Register as Partner</Link>
            <ChevronRight size={13} />
            <span>Registration Form</span>
          </nav>
          <div className="prp-header__badge">
            <ShieldCheck size={14} /> Partner Registration
          </div>
          <h1 className="prp-header__title">Complete Your <span className="prp-header__accent">Registration</span></h1>
          <p className="prp-header__sub">
            Kindly share your information to become a partner of The Famous Halwai.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <section className="prp-section">
        <div className="prp-section__inner">
          <div className="prp-grid">
            {/* Form card */}
            <div className="prp-card">
              <div className="prp-card__head">
                <span className="prp-card__emoji">📋</span>
                <div>
                  <h2 className="prp-card__title">Partner Registration</h2>
                  <p className="prp-card__sub">Fill in your details and we'll get back to you within 24 hours.</p>
                </div>
              </div>
              <RegistrationForm />
            </div>

            {/* Aside */}
            <aside className="prp-aside">
              <div className="prp-aside-card">
                <span className="prp-aside-card__emoji">📞</span>
                <h4 className="prp-aside-card__title">Prefer to call?</h4>
                <p className="prp-aside-card__desc">Talk to our partnership team directly and get all your questions answered.</p>
                <a href="tel:+918926262674" className="prp-aside-card__btn prp-aside-card__btn--red">
                  <Phone size={15} /> +91-89262 62674
                </a>
                <a href="tel:+918926262675" className="prp-aside-card__btn prp-aside-card__btn--outline">
                  <Phone size={15} /> +91-89262 62675
                </a>
              </div>

              <div className="prp-aside-card prp-aside-card--wa">
                <span className="prp-aside-card__emoji">💬</span>
                <h4 className="prp-aside-card__title prp-aside-card__title--white">Chat on WhatsApp</h4>
                <p className="prp-aside-card__desc prp-aside-card__desc--white">Get instant response from our partnership team.</p>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                  className="prp-aside-card__btn prp-aside-card__btn--white">
                  <MessageCircle size={15} /> Chat Now
                </a>
              </div>

              <div className="prp-trust">
                <h4 className="prp-trust__title">For More Partner Benefits</h4>
                {[
                  'Establish your business faster than usual',
                  'Get qualified leads delivered to you',
                  'Support in staffing, training & marketing',
                  'Improve occupancy, hiring and profits',
                  'Part time & full time job opportunities',
                  '24×7 partner support & flexible timings',
                ].map((item) => (
                  <div key={item} className="prp-trust__item">
                    <CheckCircle size={14} className="prp-trust__icon" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
