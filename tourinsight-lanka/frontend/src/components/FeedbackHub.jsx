import React, { useState } from 'react';
import { Star, Send, ShieldCheck, Heart, User, Globe, MessageSquare } from 'lucide-react';

const RATING_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Great', 5: 'Excellent' };
const MAX_CHARS = 400;

const countries = [
  'India', 'United Kingdom', 'Germany', 'Russia', 'France',
  'USA', 'Australia', 'Japan', 'Italy', 'China', 'Others'
];
const categories = ['Destinations', 'Hotels', 'Transport', 'Safety', 'General'];

function getSentimentColor(sentiment) {
  switch (sentiment) {
    case 'Positive': return '#10b981';
    case 'Neutral':  return '#f59e0b';
    case 'Negative': return '#ef4444';
    default:         return 'var(--text-muted)';
  }
}

export default function FeedbackHub({ feedbackList, onAddFeedback }) {
  const [name,        setName]        = useState('');
  const [country,     setCountry]     = useState('India');
  const [rating,      setRating]      = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category,    setCategory]    = useState('Destinations');
  const [comments,    setComments]    = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [errors,      setErrors]      = useState({});

  const charsLeft = MAX_CHARS - comments.length;

  const validate = () => {
    const e = {};
    if (!name.trim())          e.name     = 'Name is required.';
    if (comments.trim().length < 10) e.comments = 'Please write at least 10 characters.';
    if (comments.length > MAX_CHARS) e.comments = `Maximum ${MAX_CHARS} characters.`;
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    setIsSubmitting(true);
    try {
      await onAddFeedback({ name, country, rating, category, comments });
      setSuccess(true);
      setName(''); setComments(''); setRating(5); setCategory('Destinations');
      setTimeout(() => setSuccess(false), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="animate-fade-in" style={{ marginBottom: '40px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '6px' }}>Visitor Feedback Hub</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Share your travel experience. Reviews are analysed in real-time to power national tourism satisfaction metrics.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>

        {/* ── Submit Form ── */}
        <div className="glass" style={{ padding: '28px', borderRadius: 'var(--radius-md)', height: 'fit-content' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={17} style={{ color: 'var(--secondary)' }} />
            Submit Your Review
          </h3>

          {success ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: '#34d399' }}>
              <ShieldCheck size={52} />
              <h4 style={{ fontWeight: '700', fontSize: '17px' }}>Review Submitted!</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5' }}>
                Your review has been parsed and injected into our BI analytical models.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>

              {/* Full Name */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={13} /> Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. John Watson"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}
                  style={{ borderColor: errors.name ? '#ef4444' : '' }}
                />
                {errors.name && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.name}</p>}
              </div>

              {/* Country + Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Globe size={13} /> Country
                  </label>
                  <select className="form-control" value={country} onChange={(e) => setCountry(e.target.value)}>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Star Rating */}
              <div className="form-group">
                <label className="form-label">Overall Rating</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setRating(val)}
                      onMouseEnter={() => setHoverRating(val)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                      aria-label={`Rate ${val} stars`}
                    >
                      <Star
                        size={30}
                        fill={val <= displayRating ? 'var(--accent)' : 'none'}
                        stroke={val <= displayRating ? 'var(--accent)' : 'var(--text-muted)'}
                        style={{ transition: 'fill 0.1s, transform 0.1s', transform: val <= displayRating ? 'scale(1.12)' : 'scale(1)' }}
                      />
                    </button>
                  ))}
                  <span className="rating-label">{RATING_LABELS[displayRating]}</span>
                </div>
              </div>

              {/* Comments */}
              <div className="form-group" style={{ marginBottom: '22px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageSquare size={13} /> Your Comments
                </label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Tell us about services, local guides, booking, or safety…"
                  value={comments}
                  onChange={(e) => { setComments(e.target.value); setErrors(prev => ({ ...prev, comments: '' })); }}
                  style={{ borderColor: errors.comments ? '#ef4444' : '', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  {errors.comments
                    ? <p style={{ color: '#ef4444', fontSize: '11px', margin: 0 }}>{errors.comments}</p>
                    : <span />}
                  <span className={`char-counter ${charsLeft < 50 ? (charsLeft < 0 ? 'over' : 'warn') : ''}`}>
                    {charsLeft} / {MAX_CHARS}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || comments.length > MAX_CHARS}
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              >
                <Send size={15} />
                {isSubmitting ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>

        {/* ── Recent Reviews ── */}
        <div className="glass" style={{ padding: '28px', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '18px' }}>
            Recent Reviews
            <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>
              ({feedbackList.length})
            </span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '500px', overflowY: 'auto', paddingRight: '4px' }}>
            {feedbackList.map(item => (
              <div
                key={item._id}
                style={{ padding: '14px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{item.name}</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>from {item.country}</span>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '50px', color: 'white', backgroundColor: getSentimentColor(item.sentiment), textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0 }}>
                    {item.sentiment}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1,2,3,4,5].map(v => (
                      <Star key={v} size={11} fill={v <= item.rating ? 'var(--accent)' : 'none'} stroke={v <= item.rating ? 'var(--accent)' : 'var(--text-muted)'} />
                    ))}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 7px', borderRadius: '4px' }}>
                    {item.category}
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.45', fontStyle: 'italic' }}>
                  "{item.comments}"
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
