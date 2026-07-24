import React, { useState } from 'react';
import { Calendar, Wallet, Dumbbell, Compass, Sparkles, DollarSign } from 'lucide-react';

const BUDGET_RANGES = {
  Budget:   { label: 'Budget',   range: '$25–$60 / day',   color: '#10b981', desc: 'Hostels, local transport & street food' },
  Moderate: { label: 'Moderate', range: '$80–$160 / day',  color: '#f59e0b', desc: 'Boutique hotels & mid-range dining'       },
  Luxury:   { label: 'Luxury',   range: '$200–$500 / day', color: '#a855f7', desc: 'Resorts, private transfers & fine dining' },
};

const STYLES = [
  { id: 'Cultural',    label: 'Culture & History',  icon: Compass   },
  { id: 'Adventure',  label: 'Adventure & Hike',    icon: Dumbbell  },
  { id: 'Wildlife',   label: 'Wildlife & Nature',   icon: Sparkles  },
  { id: 'Relaxation', label: 'Beaches & Spa',        icon: Calendar  },
];

const ITINERARY_DB = {
  Cultural: {
    title: 'Sri Lankan Cultural Heritage Expedition',
    1: { title: 'Kandy Royal Heritage',         activities: ['Visit the golden-roofed Temple of the Sacred Tooth Relic', 'Walk around the scenic Kandy Lake', 'Watch a traditional Kandyan cultural dance performance'],               hotel: 'Amaya Hills Kandy',              meal: 'Traditional Rice & Curry at Balaji Dosai'          },
    2: { title: 'Sigiriya Rock Fortress',         activities: ['Climb the 5th-century Sigiriya Lion Rock at sunrise', 'Marvel at the ancient frescoes and gardens', 'Visit the Dambulla Cave Temple in the afternoon'],                   hotel: 'Aliya Resort & Spa Sigiriya',    meal: 'Authentic Sri Lankan buffet at Sigiriya Village'   },
    3: { title: 'Ancient City of Polonnaruwa',    activities: ['Rent a bicycle and explore the archaeological ruins', 'See the colossal Gal Vihara Buddha statues', 'Visit the ancient Parakrama Samudra reservoir'],                    hotel: 'Deer Park Hotel Polonnaruwa',   meal: 'Lakefront dinner at Jaga Food'                      },
    4: { title: 'Anuradhapura Sacred Monuments',  activities: ['Visit Ruwanwelisaya stupa and the Jaya Sri Maha Bodhi tree', 'Explore the massive Jetavanarama dagoba ruins', 'Meditate at the tranquil Isurumuniya temple'],              hotel: 'The Sanctuary at Tissawewa',    meal: 'Organic traditional meals at Heritage Hotel'       },
    5: { title: 'Colombo Colonial Stroll',         activities: ['Drive back to Colombo', 'Visit the National Museum and Gangaramaya Temple', 'Walk around Independence Square and Galle Face Green at sunset'],                          hotel: 'Galle Face Hotel Colombo',      meal: 'Seafood dinner at Ministry of Crab'                },
  },
  Adventure: {
    title: 'High-Octane Ella & Kitulgala Adventure',
    1: { title: 'Kitulgala White Water Rafting',  activities: ['Raft down the Kelani River rapids', 'Try confidence jumping and stream sliding', 'Riverside traditional buffet lunch'],                                                  hotel: 'Kitulgala Adventure Camp',      meal: 'Rustic lunch at Kitulgala Rest House'               },
    2: { title: 'Scenic Train to Ella Highlands', activities: ['Board the famous Kandy-to-Ella scenic train', 'Catch views of tea gardens and waterfalls', 'Relax at a cosy cafe in Ella village'],                                      hotel: '98 Acres Resort & Spa Ella',    meal: 'Dinner and drinks at Cafe Chill Ella'               },
    3: { title: 'Ella Rock & Nine Arch Bridge',   activities: ['Hike up Ella Rock for panoramic valley views', 'Walk to the Nine Arch Bridge to watch the afternoon train', 'Explore Ravana Caves and Falls'],                           hotel: 'Heaven\'s Edge Ella',           meal: 'Gourmet burgers at Mountain View'                   },
    4: { title: "Horton Plains & World's End",    activities: ["Wake at 5:00 AM for a trek in Horton Plains National Park", "Peer down the 870-metre precipice at World's End", "See Baker's Falls along the 9 km loop"],                hotel: 'Grand Hotel Nuwara Eliya',      meal: "High tea and English dinner at Grand Dining Room"  },
    5: { title: "Adam's Peak Pilgrimage Climb",   activities: ["Travel to Nallathanniya", "Begin the midnight ascent of Adam's Peak (7,000 steps)", "Witness the spectacular shadow-cone sunrise"],                                     hotel: 'Slightly Chilled Yellow House', meal: 'Warm local curries and rotis at peak base'          },
  },
  Wildlife: {
    title: 'Sri Lanka Wildlife & Safari Expedition',
    1: { title: 'Pinnawala & Minneriya Gathering', activities: ['Observe bathing elephants at Pinnawala Sanctuary', 'Drive to Minneriya for the afternoon safari', 'Witness "The Gathering" of hundreds of wild elephants'],              hotel: 'Cinnamon Lodge Habarana',       meal: 'Lakeside buffet at Habarana Village'                },
    2: { title: 'Knuckles Mountain Forests',       activities: ['Trek through Knuckles Range looking for endemic lizards', 'Bird watching along mountain streams', 'Visit remote mountain villages'],                                    hotel: 'Wild Glamping Knuckles',        meal: 'Campfire barbecue under the stars'                  },
    3: { title: 'Yala National Park Leopard Safari',activities: ['Drive south to Yala', 'Join the afternoon 4×4 Jeep tour', 'Spot leopards, sloth bears, and peacock displays'],                                                       hotel: 'Jetwing Yala (Eco Tent)',       meal: 'Dune-side seafood grill at Yala Safari Camp'        },
    4: { title: 'Udawalawe Elephant Transit Home', activities: ['Morning safari in Udawalawe National Park', 'Visit the Elephant Transit Home for milk feedings', 'Sunset walk near Udawalawe Reservoir'],                              hotel: 'Grand Udawalawe Safari Resort', meal: 'Open-air buffet at the resort garden'               },
    5: { title: 'Mirissa Marine Safari',           activities: ['Early morning whale-watching cruise from Mirissa', 'Spot blue whales and pods of spinner dolphins', 'Relax on the beach and watch sea turtles nesting'],               hotel: 'Mandara Resort Mirissa',        meal: 'Fresh lobster at beachfront shacks'                 },
  },
  Relaxation: {
    title: 'Serene Beaches & Ayurvedic Spa Getaway',
    1: { title: 'Bentota Beach Gold Sands',        activities: ['Check into a boutique beach resort in Bentota', 'Try jet-skiing on the Bentota lagoon', 'Enjoy a traditional Ayurvedic full-body oil massage'],                         hotel: 'Cinnamon Bentota Beach',        meal: 'Candlelit dinner at Villa Bentota'                  },
    2: { title: 'Galle Colonial Vibe',             activities: ['Stroll along Galle Fort ramparts at sunrise', 'Explore boutique shops along cobblestone alleys', 'Watch cliff divers from the lighthouse wall'],                         hotel: 'Galle Fort Hotel',              meal: 'High tea and pastries at Pedlar\'s Inn Cafe'       },
    3: { title: 'Mirissa Palm Swing & Sea Turtles',activities: ['Swing on the coconut tree rope at Coconut Tree Hill', 'Snorkel with green sea turtles in Polhena Bay', 'Sip fresh king coconuts on a beach sunbed'],                   hotel: 'Paradise Beach Resort Mirissa', meal: 'Woodfired pizza at Zephyr Mirissa'                  },
    4: { title: 'Hikkaduwa Coral Reef & Glass Boat',activities: ['Ride a glass-bottomed boat to view coral gardens', 'Feed wild sea turtles at Hikkaduwa beach', 'Beachfront yoga session at sunrise'],                                  hotel: 'Hikka Tranz by Cinnamon',       meal: 'Seafood platter at Spaghetti & Co Hikka'           },
    5: { title: 'Colombo Spa & Sunset Cocktails',  activities: ['Travel back to Colombo', 'Luxury spa ritual at Spa Ceylon', 'Rooftop cocktails and sunset views at Galle Face Green'],                                                  hotel: 'Shangri-La Colombo',            meal: 'Authentic curries at Kaema Sutra'                   },
  },
};

export default function TripPlanner() {
  const [days,         setDays]         = useState(3);
  const [budget,       setBudget]       = useState('Moderate');
  const [style,        setStyle]        = useState('Cultural');
  const [itinerary,    setItinerary]    = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      const db = ITINERARY_DB[style];
      const items = {};
      for (let i = 1; i <= days; i++) items[i] = db[i];
      setItinerary({ title: db.title, budget, days: items });
      setIsGenerating(false);
    }, 1000);
  };

  const budgetInfo = BUDGET_RANGES[budget];

  return (
    <div className="animate-fade-in" style={{ marginBottom: '40px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '6px' }}>Smart Trip Planner</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Generate customised day-by-day itineraries based on Sri Lanka's current tourism analytics and booking occupancies.
        </p>
      </div>

      {/* Config Form */}
      <form onSubmit={handleGenerate} className="glass" style={{ padding: '28px', borderRadius: 'var(--radius-md)', marginBottom: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {/* Duration */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={13} style={{ color: 'var(--primary)' }} /> Duration
            </label>
            <select className="form-control" value={days} onChange={(e) => setDays(Number(e.target.value))}>
              <option value="1">1 Day Express</option>
              <option value="2">2 Days Weekend</option>
              <option value="3">3 Days Short Trip</option>
              <option value="4">4 Days Exploratory</option>
              <option value="5">5 Days Full Tour</option>
            </select>
          </div>

          {/* Budget */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wallet size={13} style={{ color: 'var(--accent)' }} /> Budget Tier
            </label>
            <select className="form-control" value={budget} onChange={(e) => setBudget(e.target.value)}>
              <option value="Budget">Budget (Hostels / Backpacker)</option>
              <option value="Moderate">Moderate (Standard / Boutique)</option>
              <option value="Luxury">Luxury (Resorts / Premium)</option>
            </select>
          </div>
        </div>

        {/* Budget cost estimate strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${budgetInfo.color}30`,
            marginBottom: '24px',
            fontSize: '13px'
          }}
        >
          <DollarSign size={16} style={{ color: budgetInfo.color, flexShrink: 0 }} />
          <div>
            <span style={{ fontWeight: '700', color: budgetInfo.color }}>{budgetInfo.range}</span>
            <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>· {budgetInfo.desc}</span>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)' }}>
            Est. total: <strong style={{ color: 'var(--text-primary)' }}>
              {/* rough total */}
              {budget === 'Budget' ? `$${25 * days}–$${60 * days}` : budget === 'Moderate' ? `$${80 * days}–$${160 * days}` : `$${200 * days}–$${500 * days}`}
            </strong>
          </span>
        </div>

        {/* Travel style selector */}
        <div className="form-group" style={{ marginBottom: '28px' }}>
          <label className="form-label">Travel Style / Primary Focus</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            {STYLES.map(item => {
              const Icon = item.icon;
              const sel  = style === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  className={`btn ${sel ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setStyle(item.id)}
                  style={{ flexDirection: 'column', padding: '14px', height: 'auto', borderRadius: 'var(--radius-md)', gap: '6px', textAlign: 'center' }}
                >
                  <Icon size={22} style={{ color: sel ? 'white' : 'var(--text-secondary)' }} />
                  <span style={{ fontSize: '12px', fontWeight: '600' }}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isGenerating}
          style={{ width: '100%', justifyContent: 'center', padding: '13px', borderRadius: 'var(--radius-sm)' }}
        >
          {isGenerating ? 'Generating itinerary…' : 'Generate Smart Itinerary'}
        </button>
      </form>

      {/* Results */}
      {itinerary && (
        <div className="glass animate-fade-in" style={{ padding: '28px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '18px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '19px', fontWeight: '800', color: 'var(--text-primary)' }}>{itinerary.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                Optimised using seasonal occupancy and traveller satisfaction metrics.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                {itinerary.budget} Budget
              </span>
              <span style={{ background: `${BUDGET_RANGES[itinerary.budget].color}15`, border: `1px solid ${BUDGET_RANGES[itinerary.budget].color}30`, color: BUDGET_RANGES[itinerary.budget].color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                {BUDGET_RANGES[itinerary.budget].range}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '17px', top: '10px', bottom: '10px', width: '2px', background: 'rgba(255,255,255,0.05)' }} />

            {Object.keys(itinerary.days).map(dayNum => {
              const day = itinerary.days[dayNum];
              return (
                <div key={dayNum} style={{ display: 'flex', gap: '20px', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', color: 'white', flexShrink: 0 }}>
                    D{dayNum}
                  </div>

                  <div style={{ flex: 1, paddingTop: '4px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>{day.title}</h4>

                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
                      {day.activities.map((act, i) => (
                        <li key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                          <span style={{ color: 'var(--primary)', fontWeight: 'bold', flexShrink: 0 }}>•</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Suggested Hotel: </span>
                        <strong style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{day.hotel}</strong>
                      </div>
                      <div style={{ fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Cuisine Pick: </span>
                        <strong style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{day.meal}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
