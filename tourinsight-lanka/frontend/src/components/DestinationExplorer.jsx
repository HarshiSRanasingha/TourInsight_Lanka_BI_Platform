import React, { useState } from 'react';
import { Search, MapPin, Eye, Star, ArrowUpDown } from 'lucide-react';

const CATEGORY_COLORS = {
  Beach:     'cat-badge-Beach',
  Cultural:  'cat-badge-Cultural',
  Wildlife:  'cat-badge-Wildlife',
  Adventure: 'cat-badge-Adventure',
  Nature:    'cat-badge-Nature',
};

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating',     label: 'Top Rated'  },
  { value: 'visitors',   label: 'Most Visited'},
  { value: 'name',       label: 'A – Z'       },
];

export default function DestinationExplorer({ destinations }) {
  const [searchQuery,      setSearchQuery]      = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy,           setSortBy]           = useState('popularity');

  const categories = ['All', 'Beach', 'Cultural', 'Nature', 'Wildlife', 'Adventure'];

  const filtered = destinations
    .filter(dest => {
      const q = searchQuery.toLowerCase();
      const matchSearch = dest.name.toLowerCase().includes(q) ||
                          dest.location.toLowerCase().includes(q) ||
                          dest.description.toLowerCase().includes(q);
      const matchCat = selectedCategory === 'All' || dest.category === selectedCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':     return b.avgRating      - a.avgRating;
        case 'visitors':   return b.visitorCount   - a.visitorCount;
        case 'name':       return a.name.localeCompare(b.name);
        case 'popularity':
        default:           return b.popularityScore - a.popularityScore;
      }
    });

  return (
    <div className="animate-fade-in" style={{ marginBottom: '40px' }}>
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '24px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '6px' }}>
            Explore Sri Lankan Hotspots
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Discover historic landmarks, exotic wildlife sanctuaries, and scenic tropical beaches.
          </p>
        </div>

        {/* Search + Sort */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', width: '100%', maxWidth: '560px' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Search destinations or regions…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>

          <div style={{ position: 'relative', minWidth: '150px' }}>
            <ArrowUpDown
              size={14}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}
            />
            <select
              className="form-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ paddingLeft: '34px', appearance: 'none', cursor: 'pointer' }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '7px 16px', borderRadius: '50px', whiteSpace: 'nowrap', fontSize: '13px' }}
          >
            {cat}
          </button>
        ))}
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', alignSelf: 'center', marginLeft: '4px', whiteSpace: 'nowrap' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="glass" style={{ padding: '48px', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            No destinations match your criteria.
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            style={{ marginTop: '16px' }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}
        >
          {filtered.map(dest => (
            <DestinationCard key={dest._id} dest={dest} />
          ))}
        </div>
      )}
    </div>
  );
}

function DestinationCard({ dest }) {
  const badgeClass = CATEGORY_COLORS[dest.category] || 'cat-badge-Cultural';

  return (
    <div
      className="glass-interactive"
      style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img
          src={dest.image}
          alt={dest.name}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.07)')}
          onMouseOut={(e)  => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <span className={`cat-badge ${badgeClass}`}>{dest.category}</span>

        {/* Popularity bar overlay at bottom of image */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'rgba(0,0,0,0.4)'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${dest.popularityScore}%`,
              background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
              transition: 'width 0.6s ease'
            }}
          />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-primary)' }}>
          {dest.name}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
          <MapPin size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span>{dest.location}</span>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.55', marginBottom: '16px', flex: 1 }}>
          {dest.description}
        </p>

        {/* Footer row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-color)',
            fontSize: '13px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={14} fill="var(--accent)" stroke="var(--accent)" />
            <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{dest.avgRating}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({dest.popularityScore}%)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
            <Eye size={13} />
            <span style={{ fontSize: '12px' }}>
              {dest.visitorCount ? dest.visitorCount.toLocaleString() : 'N/A'} / yr
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
