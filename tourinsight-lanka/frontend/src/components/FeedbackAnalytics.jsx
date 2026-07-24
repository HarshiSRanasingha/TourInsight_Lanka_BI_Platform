import React, { useState } from 'react';
import { Smile, Frown, HelpCircle, Star, Filter } from 'lucide-react';

export default function FeedbackAnalytics({ feedbackList, summaryData }) {
  const [selectedSentimentFilter, setSelectedSentimentFilter] = useState('All');

  // Calculate Sentiment Share
  const total = feedbackList.length;
  const sentimentCounts = feedbackList.reduce((acc, curr) => {
    acc[curr.sentiment] = (acc[curr.sentiment] || 0) + 1;
    return acc;
  }, { Positive: 0, Neutral: 0, Negative: 0 });

  const sentimentShares = {
    Positive: total > 0 ? Math.round((sentimentCounts.Positive / total) * 100) : 0,
    Neutral: total > 0 ? Math.round((sentimentCounts.Neutral / total) * 100) : 0,
    Negative: total > 0 ? Math.round((sentimentCounts.Negative / total) * 100) : 0
  };

  // Filter feed back logs
  const filteredLogs = feedbackList.filter(f => {
    return selectedSentimentFilter === 'All' || f.sentiment === selectedSentimentFilter;
  });

  // Calculate category averages
  const categories = ['Destinations', 'Hotels', 'Transport', 'Safety', 'General'];
  const categoryRatings = categories.reduce((acc, cat) => {
    // Check if category is represented in summaryData.categoryCounts
    const match = summaryData.categoryCounts?.find(c => c._id === cat);
    acc[cat] = match ? match.avgRating : 4.0; // fallback to 4.0
    return acc;
  }, {});

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px' }}>Customer Feedback & Sentiment Analytics</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          Evaluate traveler feedback sentiment. Natural language processing parses text commentaries into polarity metrics.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        
        {/* Sentiment breakdown */}
        <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Sentiment Distribution Index</h3>
          
          <div style={{ display: 'flex', gap: '8px', height: '36px', borderRadius: '6px', overflow: 'hidden', marginBottom: '24px' }}>
            {sentimentShares.Positive > 0 && (
              <div 
                style={{ width: `${sentimentShares.Positive}%`, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', color: 'white' }}
                title={`Positive: ${sentimentShares.Positive}%`}
              >
                {sentimentShares.Positive}%
              </div>
            )}
            {sentimentShares.Neutral > 0 && (
              <div 
                style={{ width: `${sentimentShares.Neutral}%`, background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', color: 'white' }}
                title={`Neutral: ${sentimentShares.Neutral}%`}
              >
                {sentimentShares.Neutral}%
              </div>
            )}
            {sentimentShares.Negative > 0 && (
              <div 
                style={{ width: `${sentimentShares.Negative}%`, background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', color: 'white' }}
                title={`Negative: ${sentimentShares.Negative}%`}
              >
                {sentimentShares.Negative}%
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
            <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
              <Smile size={20} style={{ color: '#10b981', marginBottom: '6px' }} />
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Positive</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>{sentimentCounts.Positive}</div>
            </div>

            <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
              <HelpCircle size={20} style={{ color: '#f59e0b', marginBottom: '6px' }} />
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Neutral</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>{sentimentCounts.Neutral}</div>
            </div>

            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
              <Frown size={20} style={{ color: '#ef4444', marginBottom: '6px' }} />
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Negative</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }}>{sentimentCounts.Negative}</div>
            </div>
          </div>
        </div>

        {/* Category Ratings */}
        <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Index Ratings by Travel Sector</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {categories.map(cat => {
              const rating = categoryRatings[cat];
              const percent = (rating / 5) * 100;
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{cat}</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      {rating.toFixed(1)} <Star size={12} fill="var(--accent)" stroke="var(--accent)" />
                    </span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${percent}%`, 
                        background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                        borderRadius: '10px'
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Review Database Log */}
      <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Visitor Review Audit Trail</h3>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Filter size={14} style={{ color: 'var(--text-muted)' }} />
            {['All', 'Positive', 'Neutral', 'Negative'].map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedSentimentFilter(filter)}
                className={`btn ${selectedSentimentFilter === filter ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '4px' }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 8px' }}>Visitor</th>
                <th style={{ padding: '12px 8px' }}>Country</th>
                <th style={{ padding: '12px 8px' }}>Sector</th>
                <th style={{ padding: '12px 8px' }}>Rating</th>
                <th style={{ padding: '12px 8px' }}>Sentiment</th>
                <th style={{ padding: '12px 8px' }}>Comment</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }}>
                  <td style={{ padding: '12px 8px', fontWeight: '600', color: 'var(--text-primary)' }}>{log.name}</td>
                  <td style={{ padding: '12px 8px' }}>{log.country}</td>
                  <td style={{ padding: '12px 8px' }}>{log.category}</td>
                  <td style={{ padding: '12px 8px', color: 'var(--accent)' }}>{log.rating} ★</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span 
                      style={{ 
                        color: log.sentiment === 'Positive' ? '#10b981' : log.sentiment === 'Neutral' ? '#f59e0b' : '#ef4444',
                        fontWeight: '700',
                        fontSize: '11px'
                      }}
                    >
                      {log.sentiment}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.comments}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
