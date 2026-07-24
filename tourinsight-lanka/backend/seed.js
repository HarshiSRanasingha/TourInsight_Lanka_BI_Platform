import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Destination, Feedback, Booking, Arrival } from './models/Schema.js';

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tourinsight_lanka';

const destinationsData = [
  {
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
    name: 'Temple of the Sacred Tooth Relic',
    description: 'Located in the royal palace complex of the former Kingdom of Kandy, this golden-roofed temple houses Sri Lanka’s most sacred Buddhist relic—a tooth of the Buddha.',
    location: 'Kandy District, Central Province',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1578351543881-2292f7035541?auto=format&fit=crop&w=800&q=80',
    popularityScore: 97,
    avgRating: 4.8,
    visitorCount: 520000
  }
];

const feedbacksData = [
  { name: 'John Doe', country: 'United Kingdom', rating: 5, category: 'Destinations', comments: 'Sigiriya was absolutely breathtaking. The climb was tough but completely worth the view!', sentiment: 'Positive' },
  { name: 'Aarav Mehta', country: 'India', rating: 4, category: 'Hotels', comments: 'Lovely hospitality at Galle hotels. Very friendly staff and great food, although service was a bit slow.', sentiment: 'Positive' },
  { name: 'Sarah Mueller', country: 'Germany', rating: 5, category: 'Safety', comments: 'Travelled solo across Sri Lanka for 2 weeks. Felt extremely safe and people were always helpful.', sentiment: 'Positive' },
  { name: 'Dmitry Volkov', country: 'Russia', rating: 3, category: 'Transport', comments: 'Train ride from Kandy to Ella was beautiful, but booking tickets was extremely confusing and crowded.', sentiment: 'Neutral' },
  { name: 'Emily Watson', country: 'USA', rating: 5, category: 'Wildlife', comments: 'Saw three leopards at Yala! The tour guide was very knowledgeable. Highlight of our trip.', sentiment: 'Positive' },
  { name: 'David Smith', country: 'Australia', rating: 2, category: 'Transport', comments: 'Tuk-tuk drivers in Colombo keep overcharging tourists. Need better taxi regulations.', sentiment: 'Negative' },
  { name: 'Yuki Tanaka', country: 'Japan', rating: 4, category: 'General', comments: 'Beautiful culture and temples. Very peaceful. Kandy was amazing!', sentiment: 'Positive' },
  { name: 'Chloe Dubois', country: 'France', rating: 5, category: 'Destinations', comments: 'Nine Arch Bridge at sunrise was magical. Highly recommend hiking around Ella.', sentiment: 'Positive' },
  { name: 'Mateo Rossi', country: 'Italy', rating: 3, category: 'Hotels', comments: 'Hotels are clean but overpriced during the peak winter season.', sentiment: 'Neutral' }
];

// Helper to generate monthly regional occupancy
const generateOccupancyData = () => {
  const regions = ['Western', 'Southern', 'Central', 'Northern', 'Eastern'];
  const occupancyBase = {
    Western: [65, 68, 70, 50, 45, 40, 52, 55, 48, 60, 72, 78],
    Southern: [80, 85, 82, 45, 30, 25, 35, 40, 38, 50, 75, 85],
    Central: [70, 72, 75, 60, 58, 50, 65, 68, 55, 62, 70, 75],
    Northern: [40, 42, 45, 38, 35, 30, 32, 35, 30, 38, 42, 45],
    Eastern: [30, 35, 40, 60, 75, 80, 85, 78, 55, 45, 35, 30] // East coast peak is May-Sep due to weather
  };
  const data = [];
  const startYear = 2025;

  for (let m = 0; m < 12; m++) {
    const date = new Date(startYear, m, 15);
    regions.forEach(region => {
      const base = occupancyBase[region][m];
      data.push({
        hotelName: `${region} Resort & Spa`,
        region,
        occupancyRate: base + Math.floor(Math.random() * 6 - 3), // Add small noise
        averageRoomRate: region === 'Western' || region === 'Southern' ? 150 + Math.floor(Math.random() * 40) : 100 + Math.floor(Math.random() * 30),
        date
      });
    });
  }
  return data;
};

// Historical Arrivals data
const arrivalsData = [
  {
    month: 'January', year: 2025, count: 210000,
    countryOfOrigin: { India: 42000, UK: 28000, Germany: 21000, Russia: 25000, France: 15000, Others: 79000 },
    purposeOfVisit: { Leisure: 165000, Business: 15000, Cultural: 20000, VFR: 10000 }
  },
  {
    month: 'February', year: 2025, count: 218000,
    countryOfOrigin: { India: 44000, UK: 30000, Germany: 22000, Russia: 26000, France: 16000, Others: 80000 },
    purposeOfVisit: { Leisure: 172000, Business: 14000, Cultural: 22000, VFR: 10000 }
  },
  {
    month: 'March', year: 2025, count: 195000,
    countryOfOrigin: { India: 39000, UK: 26000, Germany: 18500, Russia: 20000, France: 14000, Others: 77500 },
    purposeOfVisit: { Leisure: 151000, Business: 16000, Cultural: 18000, VFR: 10000 }
  },
  {
    month: 'April', year: 2025, count: 135000,
    countryOfOrigin: { India: 32000, UK: 16000, Germany: 11000, Russia: 10000, France: 9000, Others: 57000 },
    purposeOfVisit: { Leisure: 95000, Business: 15000, Cultural: 15000, VFR: 10000 }
  },
  {
    month: 'May', year: 2025, count: 112000,
    countryOfOrigin: { India: 31000, UK: 12000, Germany: 8000, Russia: 7000, France: 6000, Others: 48000 },
    purposeOfVisit: { Leisure: 78000, Business: 16000, Cultural: 10000, VFR: 8000 }
  },
  {
    month: 'June', year: 2025, count: 115000,
    countryOfOrigin: { India: 33000, UK: 13000, Germany: 8500, Russia: 6500, France: 7000, Others: 47000 },
    purposeOfVisit: { Leisure: 81000, Business: 15000, Cultural: 11000, VFR: 8000 }
  },
  {
    month: 'July', year: 2025, count: 142000,
    countryOfOrigin: { India: 35000, UK: 19000, Germany: 12000, Russia: 10000, France: 9000, Others: 57000 },
    purposeOfVisit: { Leisure: 108000, Business: 12000, Cultural: 14000, VFR: 8000 }
  },
  {
    month: 'August', year: 2025, count: 165000,
    countryOfOrigin: { India: 38000, UK: 22000, Germany: 15000, Russia: 14000, France: 11000, Others: 65000 },
    purposeOfVisit: { Leisure: 129000, Business: 11000, Cultural: 17000, VFR: 8000 }
  },
  {
    month: 'September', year: 2025, count: 122000,
    countryOfOrigin: { India: 32000, UK: 14000, Germany: 9000, Russia: 8000, France: 7000, Others: 52000 },
    purposeOfVisit: { Leisure: 89000, Business: 14000, Cultural: 11000, VFR: 8000 }
  },
  {
    month: 'October', year: 2025, count: 145000,
    countryOfOrigin: { India: 34000, UK: 18000, Germany: 12000, Russia: 12000, France: 9000, Others: 60000 },
    purposeOfVisit: { Leisure: 111000, Business: 15000, Cultural: 11000, VFR: 8000 }
  },
  {
    month: 'November', year: 2025, count: 188000,
    countryOfOrigin: { India: 38000, UK: 24000, Germany: 18000, Russia: 21000, France: 12000, Others: 75000 },
    purposeOfVisit: { Leisure: 147000, Business: 14000, Cultural: 17000, VFR: 10000 }
  },
  {
    month: 'December', year: 2025, count: 242000,
    countryOfOrigin: { India: 48000, UK: 35000, Germany: 26000, Russia: 32000, France: 18000, Others: 83000 },
    purposeOfVisit: { Leisure: 196000, Business: 13000, Cultural: 23000, VFR: 10000 }
  }
];

const seedDB = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(mongoURI);
    console.log('Connected successfully!');

    // Clear existing data
    console.log('Clearing existing records...');
    await Destination.deleteMany({});
    await Feedback.deleteMany({});
    await Booking.deleteMany({});
    await Arrival.deleteMany({});

    // Insert seeds
    console.log('Seeding destinations...');
    await Destination.insertMany(destinationsData);

    console.log('Seeding feedback logs...');
    await Feedback.insertMany(feedbacksData);

    console.log('Seeding hotel occupancies...');
    const bookingsData = generateOccupancyData();
    await Booking.insertMany(bookingsData);

    console.log('Seeding arrivals...');
    await Arrival.insertMany(arrivalsData);

    console.log('Seeding completed successfully! Total records added:');
    console.log(`- Destinations: ${destinationsData.length}`);
    console.log(`- Feedback Logs: ${feedbacksData.length}`);
    console.log(`- Hotel Bookings: ${bookingsData.length}`);
    console.log(`- Monthly Arrivals: ${arrivalsData.length}`);

    await mongoose.disconnect();
    console.log('Disconnected from database.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
