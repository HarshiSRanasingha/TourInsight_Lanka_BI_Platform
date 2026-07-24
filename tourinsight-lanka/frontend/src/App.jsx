import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import DestinationExplorer from './components/DestinationExplorer';
import TripPlanner from './components/TripPlanner';
import FeedbackHub from './components/FeedbackHub';

import BIOverview from './components/BIOverview';
import TouristArrivals from './components/TouristArrivals';
import HotelOccupancy from './components/HotelOccupancy';
import FeedbackAnalytics from './components/FeedbackAnalytics';
import DemandForecast from './components/DemandForecast';
import TeamCredits from './components/TeamCredits';

import { api } from './services/api';
import { LayoutDashboard, Users, Building, Smile, TrendingUp, GraduationCap } from 'lucide-react';

const ADMIN_TABS = [
  { id: 'overview',   label: 'BI Summary',         icon: LayoutDashboard },
  { id: 'arrivals',   label: 'Arrivals Index',      icon: Users           },
  { id: 'occupancy',  label: 'Hotel Occupancy',     icon: Building        },
  { id: 'feedback',   label: 'Feedback Index',      icon: Smile           },
  { id: 'forecast',   label: 'Predictive Forecast', icon: TrendingUp      },
  { id: 'credits',    label: 'Academic Credits',    icon: GraduationCap   },
];

export default function App() {
  const [currentView, setView]       = useState('tourist');
  const [touristTab,  setTouristTab] = useState('explore');
  const [adminTab,    setAdminTab]   = useState('overview');

  const [destinations, setDestinations] = useState([]);
  const [feedback,     setFeedback]     = useState([]);
  const [arrivals,     setArrivals]     = useState([]);
  const [occupancy,    setOccupancy]    = useState([]);
  const [summaryData,  setSummaryData]  = useState({
    totalArrivals: 0, avgOccupancy: 0, totalRevenueUSD: 0,
    avgSatisfaction: 0, categoryCounts: []
  });

  const [loading,   setLoading]   = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  const loadData = async () => {
    try {
      const [dests, feeds, arrs, occs, sum] = await Promise.all([
        api.getDestinations(),
        api.getFeedback(),
        api.getArrivals(),
        api.getOccupancy(),
        api.getSummary(),
      ]);
      setDestinations(dests);
      setFeedback(feeds);
      setArrivals(arrs);
      setOccupancy(occs);
      setSummaryData(sum);
      setIsOffline(api.isOfflineMode());
    } catch (e) {
      console.error('Data fetching error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAddFeedback = async (newFeedbackData) => {
    const saved = await api.postFeedback(newFeedbackData);
    await loadData();
    return saved;
  };

  return (
    <div className="app-container">
      <Navbar currentView={currentView} setView={setView} isOffline={isOffline} />

      <main className="main-content">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* ── TOURIST PORTAL ── */}
            {currentView === 'tourist' && (
              <div className="animate-fade-in">
                <Hero
                  onExploreClick={() => setTouristTab('explore')}
                  onPlanClick={() => setTouristTab('plan')}
                  onFeedbackClick={() => setTouristTab('feedback')}
                />

                <nav className="sub-nav" aria-label="Tourist portal sections">
                  {[
                    { id: 'explore',  label: 'Hotspot Explorer'   },
                    { id: 'plan',     label: 'AI Itinerary Guide' },
                    { id: 'feedback', label: 'Visitor Review Board'},
                  ].map(t => (
                    <button
                      key={t.id}
                      className={`sub-nav-btn ${touristTab === t.id ? 'active' : ''}`}
                      onClick={() => setTouristTab(t.id)}
                    >
                      {t.label}
                    </button>
                  ))}
                </nav>

                {touristTab === 'explore'  && <DestinationExplorer destinations={destinations} />}
                {touristTab === 'plan'     && <TripPlanner />}
                {touristTab === 'feedback' && <FeedbackHub feedbackList={feedback} onAddFeedback={handleAddFeedback} />}
              </div>
            )}

            {/* ── BI DASHBOARD ── */}
            {currentView === 'admin' && (
              <div
                className="animate-fade-in admin-layout"
                style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '28px', alignItems: 'start' }}
              >
                {/* Sidebar */}
                <div className="glass admin-sidebar" style={{ padding: '14px', borderRadius: 'var(--radius-md)' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', paddingLeft: '10px', marginBottom: '14px', letterSpacing: '0.06em' }}>
                    Dashboard Panels
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {ADMIN_TABS.map(tab => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          className={`btn ${adminTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => setAdminTab(tab.id)}
                          style={{ justifyContent: 'flex-start', padding: '9px 12px', width: '100%', fontSize: '13px' }}
                        >
                          <Icon size={14} />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active panel */}
                <div style={{ minWidth: 0 }}>
                  {adminTab === 'overview'  && <BIOverview summaryData={summaryData} onTabChange={setAdminTab} />}
                  {adminTab === 'arrivals'  && <TouristArrivals arrivalsData={arrivals} />}
                  {adminTab === 'occupancy' && <HotelOccupancy occupancyData={occupancy} />}
                  {adminTab === 'feedback'  && <FeedbackAnalytics feedbackList={feedback} summaryData={summaryData} />}
                  {adminTab === 'forecast'  && <DemandForecast arrivalsData={arrivals} />}
                  {adminTab === 'credits'   && <TeamCredits />}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', flexDirection: 'column', gap: '16px' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
      <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Loading platform insights…</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
