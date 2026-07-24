// API Client with automatic high-fidelity MongoDB fallback database

const BACKEND_URL = 'http://localhost:5050/api';

// High-fidelity fallback database for offline / frontend-only demo
const FALLBACK_DB = {
  destinations: [
    {
      _id: 'd1',
      name: 'Sigiriya Ancient Rock Fortress',
      description: 'A majestic 5th-century palace fortress built on top of a massive 200-meter-high rock column. Known for its gorgeous frescoes and mirror wall.',
      location: 'Matale District, Central Province',
      category: 'Cultural',
      image: 'https://images.unsplash.com/photo-1588598130782-690a298573c2?auto=format&fit=crop&w=800&q=80',
      popularityScore: 98,
      avgRating: 4.8,
      visitorCount: 450000
    },
    {
      _id: 'd2',
      name: 'Galle Dutch Fort',
      description: 'A UNESCO World Heritage site, originally built by the Portuguese and extensively fortified by the Dutch in the 17th century, blending European architecture with South Asian traditions.',
      location: 'Galle District, Southern Province',
      category: 'Cultural',
      image: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80',
      popularityScore: 95,
      avgRating: 4.7,
      visitorCount: 380000
    },
    {
      _id: 'd3',
      name: 'Nine Arch Bridge, Ella',
      description: 'A spectacular stone bridge located amidst lush green tea plantations, representing the golden age of Sri Lankan colonial-era railway construction.',
      location: 'Badulla District, Uva Province',
      category: 'Adventure',
      image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
      popularityScore: 92,
      avgRating: 4.6,
      visitorCount: 310000
    },
    {
      _id: 'd4',
      name: 'Yala National Park',
      description: 'The most popular wildlife sanctuary in Sri Lanka, boasting one of the highest leopard densities in the world, alongside elephants, sloth bears, and crocodiles.',
      location: 'Hambantota District, Southern/Uva Province',
      category: 'Wildlife',
      image: 'https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=800&q=80',
      popularityScore: 96,
      avgRating: 4.7,
      visitorCount: 290000
    },
    {
      _id: 'd5',
      name: 'Mirissa Beach',
      description: 'A beautiful crescent beach famous for whale watching, surfing, and vibrant nightlife, framed by swaying coconut palms.',
      location: 'Matara District, Southern Province',
      category: 'Beach',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      popularityScore: 94,
      avgRating: 4.5,
      visitorCount: 260000
    },
    {
      _id: 'd6',
      name: 'Temple of the Sacred Tooth Relic',
      description: 'Located in the royal palace complex of the former Kingdom of Kandy, this golden-roofed temple houses Sri Lanka’s most sacred Buddhist relic—a tooth of the Buddha.',
      location: 'Kandy District, Central Province',
      category: 'Cultural',
      image: 'https://images.unsplash.com/photo-1578351543881-2292f7035541?auto=format&fit=crop&w=800&q=80',
      popularityScore: 97,
      avgRating: 4.8,
      visitorCount: 520000
    }
  ],
  feedback: [
    { _id: 'f1', name: 'John Doe', country: 'United Kingdom', rating: 5, category: 'Destinations', comments: 'Sigiriya was absolutely breathtaking. The climb was tough but completely worth the view!', sentiment: 'Positive', createdAt: new Date(Date.now() - 3600000 * 24).toISOString() },
    { _id: 'f2', name: 'Aarav Mehta', country: 'India', rating: 4, category: 'Hotels', comments: 'Lovely hospitality at Galle hotels. Very friendly staff and great food, although service was a bit slow.', sentiment: 'Positive', createdAt: new Date(Date.now() - 3600000 * 48).toISOString() },
    { _id: 'f3', name: 'Sarah Mueller', country: 'Germany', rating: 5, category: 'Safety', comments: 'Travelled solo across Sri Lanka for 2 weeks. Felt extremely safe and people were always helpful.', sentiment: 'Positive', createdAt: new Date(Date.now() - 3600000 * 72).toISOString() },
    { _id: 'f4', name: 'Dmitry Volkov', country: 'Russia', rating: 3, category: 'Transport', comments: 'Train ride from Kandy to Ella was beautiful, but booking tickets was extremely confusing and crowded.', sentiment: 'Neutral', createdAt: new Date(Date.now() - 3600000 * 96).toISOString() },
    { _id: 'f5', name: 'Emily Watson', country: 'USA', rating: 5, category: 'Wildlife', comments: 'Saw three leopards at Yala! The tour guide was very knowledgeable. Highlight of our trip.', sentiment: 'Positive', createdAt: new Date(Date.now() - 3600000 * 120).toISOString() },
    { _id: 'f6', name: 'David Smith', country: 'Australia', rating: 2, category: 'Transport', comments: 'Tuk-tuk drivers in Colombo keep overcharging tourists. Need better taxi regulations.', sentiment: 'Negative', createdAt: new Date(Date.now() - 3600000 * 144).toISOString() },
    { _id: 'f7', name: 'Yuki Tanaka', country: 'Japan', rating: 4, category: 'General', comments: 'Beautiful culture and temples. Very peaceful. Kandy was amazing!', sentiment: 'Positive', createdAt: new Date(Date.now() - 3600000 * 168).toISOString() },
    { _id: 'f8', name: 'Chloe Dubois', country: 'France', rating: 5, category: 'Destinations', comments: 'Nine Arch Bridge at sunrise was magical. Highly recommend hiking around Ella.', sentiment: 'Positive', createdAt: new Date(Date.now() - 3600000 * 192).toISOString() },
    { _id: 'f9', name: 'Mateo Rossi', country: 'Italy', rating: 3, category: 'Hotels', comments: 'Hotels are clean but overpriced during the peak winter season.', sentiment: 'Neutral', createdAt: new Date(Date.now() - 3600000 * 216).toISOString() }
  ],
  arrivals: [
    { month: 'Jan', count: 210000, India: 42000, UK: 28000, Germany: 21000, Russia: 25000, France: 15000, Others: 79000, Leisure: 165000, Business: 15000, Cultural: 20000, VFR: 10000 },
    { month: 'Feb', count: 218000, India: 44000, UK: 30000, Germany: 22000, Russia: 26000, France: 16000, Others: 80000, Leisure: 172000, Business: 14000, Cultural: 22000, VFR: 10000 },
    { month: 'Mar', count: 195000, India: 39000, UK: 26000, Germany: 18500, Russia: 20000, France: 14000, Others: 77500, Leisure: 151000, Business: 16000, Cultural: 18000, VFR: 10000 },
    { month: 'Apr', count: 135000, India: 32000, UK: 16000, Germany: 11000, Russia: 10000, France: 9000, Others: 57000, Leisure: 95000, Business: 15000, Cultural: 15000, VFR: 10000 },
    { month: 'May', count: 112000, India: 31000, UK: 12000, Germany: 8000, Russia: 7000, France: 6000, Others: 48000, Leisure: 78000, Business: 16000, Cultural: 10000, VFR: 8000 },
    { month: 'Jun', count: 115000, India: 33000, UK: 13000, Germany: 8500, Russia: 6500, France: 7000, Others: 47000, Leisure: 81000, Business: 15000, Cultural: 11000, VFR: 8000 },
    { month: 'Jul', count: 142000, India: 35000, UK: 19000, Germany: 12000, Russia: 10000, France: 9000, Others: 57000, Leisure: 108000, Business: 12000, Cultural: 14000, VFR: 8000 },
    { month: 'Aug', count: 165000, India: 38000, UK: 22000, Germany: 15000, Russia: 14000, France: 11000, Others: 65000, Leisure: 129000, Business: 11000, Cultural: 17000, VFR: 8000 },
    { month: 'Sep', count: 122000, India: 32000, UK: 14000, Germany: 9000, Russia: 8000, France: 7000, Others: 52000, Leisure: 89000, Business: 14000, Cultural: 11000, VFR: 8000 },
    { month: 'Oct', count: 145000, India: 34000, UK: 18000, Germany: 12000, Russia: 12000, France: 9000, Others: 60000, Leisure: 111000, Business: 15000, Cultural: 11000, VFR: 8000 },
    { month: 'Nov', count: 188000, India: 38000, UK: 24000, Germany: 18000, Russia: 21000, France: 12000, Others: 75000, Leisure: 147000, Business: 14000, Cultural: 17000, VFR: 10000 },
    { month: 'Dec', count: 242000, India: 48000, UK: 35000, Germany: 26000, Russia: 32000, France: 18000, Others: 83000, Leisure: 196000, Business: 13000, Cultural: 23000, VFR: 10000 }
  ],
  occupancy: [
    { month: 'Jan', Western: 65, Southern: 80, Central: 70, Northern: 40, Eastern: 30 },
    { month: 'Feb', Western: 68, Southern: 85, Central: 72, Northern: 42, Eastern: 35 },
    { month: 'Mar', Western: 70, Southern: 82, Central: 75, Northern: 45, Eastern: 40 },
    { month: 'Apr', Western: 50, Southern: 45, Central: 60, Northern: 38, Eastern: 60 },
    { month: 'May', Western: 45, Southern: 30, Central: 58, Northern: 35, Eastern: 75 },
    { month: 'Jun', Western: 40, Southern: 25, Central: 50, Northern: 30, Eastern: 80 },
    { month: 'Jul', Western: 52, Southern: 35, Central: 65, Northern: 32, Eastern: 85 },
    { month: 'Aug', Western: 55, Southern: 40, Central: 68, Northern: 35, Eastern: 78 },
    { month: 'Sep', Western: 48, Southern: 38, Central: 55, Northern: 30, Eastern: 55 },
    { month: 'Oct', Western: 60, Southern: 50, Central: 62, Northern: 38, Eastern: 45 },
    { month: 'Nov', Western: 72, Southern: 75, Central: 70, Northern: 42, Eastern: 35 },
    { month: 'Dec', Western: 78, Southern: 85, Central: 75, Northern: 45, Eastern: 30 }
  ]
};

// Initialize localStorage DB if empty
const initializeLocalDB = () => {
  if (!localStorage.getItem('tourinsight_destinations')) {
    localStorage.setItem('tourinsight_destinations', JSON.stringify(FALLBACK_DB.destinations));
  }
  if (!localStorage.getItem('tourinsight_feedback')) {
    localStorage.setItem('tourinsight_feedback', JSON.stringify(FALLBACK_DB.feedback));
  }
  if (!localStorage.getItem('tourinsight_arrivals')) {
    localStorage.setItem('tourinsight_arrivals', JSON.stringify(FALLBACK_DB.arrivals));
  }
  if (!localStorage.getItem('tourinsight_occupancy')) {
    localStorage.setItem('tourinsight_occupancy', JSON.stringify(FALLBACK_DB.occupancy));
  }
};

initializeLocalDB();

// Detect backend availability
let isBackendOnline = false;

const checkBackend = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/destinations`, { signal: AbortSignal.timeout(1000) });
    isBackendOnline = res.ok;
  } catch (err) {
    isBackendOnline = false;
  }
  return isBackendOnline;
};

// Periodically probe backend
checkBackend();
setInterval(checkBackend, 15000);

export const api = {
  isOfflineMode: () => !isBackendOnline,

  // ── AUTH ──────────────────────────────────────────────────
  register: async ({ name, email, password, country }) => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, country })
      });
      return await res.json();
    } catch {
      return { error: 'Cannot connect to server. Please try again.' };
    }
  },

  login: async ({ email, password }) => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await res.json();
    } catch {
      return { error: 'Cannot connect to server. Please try again.' };
    }
  },

  getMe: async (token) => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },
  // ─────────────────────────────────────────────────────────

  getDestinations: async () => {
    try {
      if (await checkBackend()) {
        const res = await fetch(`${BACKEND_URL}/destinations`);
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend destinations fetch failed. Falling back to local storage.');
    }
    return JSON.parse(localStorage.getItem('tourinsight_destinations'));
  },

  getFeedback: async () => {
    try {
      if (await checkBackend()) {
        const res = await fetch(`${BACKEND_URL}/feedback`);
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend feedback fetch failed. Falling back to local storage.');
    }
    return JSON.parse(localStorage.getItem('tourinsight_feedback'));
  },

  postFeedback: async (feedbackData) => {
    try {
      if (await checkBackend()) {
        const res = await fetch(`${BACKEND_URL}/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feedbackData)
        });
        if (res.ok) return await res.json();
      }
    } catch (e) {
      console.warn('Backend post feedback failed. Saving to local storage.');
    }

    // Local Storage logic (replicating sentiment analysis)
    const { name, country, rating, category, comments } = feedbackData;
    const positiveWords = ['great', 'beautiful', 'clean', 'nice', 'friendly', 'helpful', 'amazing', 'love', 'best', 'excellent', 'spectacular', 'magical', 'wonderful'];
    const negativeWords = ['bad', 'slow', 'crowded', 'expensive', 'dirty', 'rude', 'unsafe', 'scam', 'overpriced', 'confusing', 'tough', 'difficult', 'poor'];

    const lowerComment = comments.toLowerCase();
    let sentimentScore = 0;
    positiveWords.forEach(word => { if (lowerComment.includes(word)) sentimentScore++; });
    negativeWords.forEach(word => { if (lowerComment.includes(word)) sentimentScore--; });

    let sentiment = 'Neutral';
    if (sentimentScore > 0 || rating >= 4) {
      sentiment = 'Positive';
    } else if (sentimentScore < 0 || rating <= 2) {
      sentiment = 'Negative';
    }

    const newFeedback = {
      _id: `f_${Date.now()}`,
      name,
      country,
      rating: Number(rating),
      category,
      comments,
      sentiment,
      createdAt: new Date().toISOString()
    };

    const localFeedbacks = JSON.parse(localStorage.getItem('tourinsight_feedback'));
    localFeedbacks.unshift(newFeedback);
    localStorage.setItem('tourinsight_feedback', JSON.stringify(localFeedbacks));

    return newFeedback;
  },

  getOccupancy: async () => {
    try {
      if (await checkBackend()) {
        const res = await fetch(`${BACKEND_URL}/analytics/occupancy`);
        // Format backend Schema array to frontend friendly structure if necessary
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0 && data[0].region) {
          // group by month
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const grouped = months.map((m, idx) => {
            const entry = { month: m };
            data.forEach(d => {
              const dDate = new Date(d.date);
              if (dDate.getMonth() === idx) {
                entry[d.region] = d.occupancyRate;
              }
            });
            return entry;
          });
          return grouped;
        }
      }
    } catch (e) {
      console.warn('Backend occupancy fetch failed. Falling back to local storage.');
    }
    return JSON.parse(localStorage.getItem('tourinsight_occupancy'));
  },

  getArrivals: async () => {
    try {
      if (await checkBackend()) {
        const res = await fetch(`${BACKEND_URL}/analytics/arrivals`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // map model to chart structure
          return data.map(d => ({
            month: d.month.substring(0, 3),
            count: d.count,
            ...d.countryOfOrigin,
            ...d.purposeOfVisit
          }));
        }
      }
    } catch (e) {
      console.warn('Backend arrivals fetch failed. Falling back to local storage.');
    }
    return JSON.parse(localStorage.getItem('tourinsight_arrivals'));
  },

  getSummary: async () => {
    try {
      if (await checkBackend()) {
        const res = await fetch(`${BACKEND_URL}/analytics/summary`);
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend summary fetch failed. Recomputing from local storage.');
    }

    // Local Storage calculation for summary metrics
    const arrivals = JSON.parse(localStorage.getItem('tourinsight_arrivals'));
    const occupancy = JSON.parse(localStorage.getItem('tourinsight_occupancy'));
    const feedbacks = JSON.parse(localStorage.getItem('tourinsight_feedback'));

    const totalArrivals = arrivals.reduce((sum, a) => sum + a.count, 0);

    let totalOccSum = 0;
    let occCount = 0;
    occupancy.forEach(o => {
      ['Western', 'Southern', 'Central', 'Northern', 'Eastern'].forEach(r => {
        if (o[r] !== undefined) {
          totalOccSum += o[r];
          occCount++;
        }
      });
    });
    const avgOccupancy = occCount > 0 ? Math.round((totalOccSum / occCount) * 10) / 10 : 0;

    // Simulated revenue calculation: rate * occupancy * total estimated rooms * days
    // Let's make a realistic total revenue calculation
    const totalRevenueUSD = 45200000 + (feedbacks.length * 15000); // base + increments for feedback demo

    const avgSatisfaction = feedbacks.length > 0
      ? Math.round((feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length) * 10) / 10
      : 0;

    // Category counts group by category
    const catMap = {};
    feedbacks.forEach(f => {
      if (!catMap[f.category]) {
        catMap[f.category] = { count: 0, ratingSum: 0 };
      }
      catMap[f.category].count++;
      catMap[f.category].ratingSum += f.rating;
    });

    const categoryCounts = Object.keys(catMap).map(cat => ({
      _id: cat,
      count: catMap[cat].count,
      avgRating: Math.round((catMap[cat].ratingSum / catMap[cat].count) * 10) / 10
    }));

    return {
      totalArrivals,
      avgOccupancy,
      totalRevenueUSD,
      avgSatisfaction,
      categoryCounts
    };
  }
};
