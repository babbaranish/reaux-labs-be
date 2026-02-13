import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGO_URI = process.env.MONGO_URI;
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);

await mongoose.connect(MONGO_URI);
const db = mongoose.connection.db;
console.log('Connected to MongoDB\n');

// ─── Clear all collections ───
const collections = ['users', 'gyms', 'bmirecords', 'dietplans', 'posts', 'comments', 'reels', 'products', 'carts', 'orders', 'promocodes', 'challenges', 'notifications'];
for (const col of collections) {
  await db.collection(col).deleteMany({});
}
console.log('Cleared all collections');

// ─── Helper ───
const oid = () => new mongoose.Types.ObjectId();
const hash = await bcrypt.hash('Pass1234', BCRYPT_ROUNDS);
const now = new Date();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  USERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const superAdminId = oid();
const admin1Id = oid();
const admin2Id = oid();
const user1Id = oid();
const user2Id = oid();
const user3Id = oid();

// Gym IDs (declare early so users can reference)
const gym1Id = oid();
const gym2Id = oid();
const gym3Id = oid();

const users = [
  {
    _id: superAdminId,
    name: 'Anish Babbar',
    email: 'anish@reauxlabs.com',
    password: hash,
    phone: '9876543210',
    role: 'superadmin',
    gymId: null,
    avatar: 'https://images.unsplash.com/photo-1649433658557-54cf58577c68?w=400',
    height: 178,
    weight: 75,
    dateOfBirth: new Date('1998-05-15'),
    gender: 'male',
    status: 'active',
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: admin1Id,
    name: 'Rahul Sharma',
    email: 'rahul@reauxlabs.com',
    password: hash,
    phone: '9876543211',
    role: 'admin',
    gymId: gym1Id,
    avatar: 'https://images.unsplash.com/photo-1633292297613-40c0087f8b3b?w=400',
    height: 182,
    weight: 80,
    dateOfBirth: new Date('1995-08-20'),
    gender: 'male',
    status: 'active',
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: admin2Id,
    name: 'Priya Patel',
    email: 'priya@reauxlabs.com',
    password: hash,
    phone: '9876543212',
    role: 'admin',
    gymId: gym2Id,
    avatar: 'https://images.unsplash.com/photo-1618951871701-f542cd0d877e?w=400',
    height: 165,
    weight: 58,
    dateOfBirth: new Date('1997-03-12'),
    gender: 'female',
    status: 'active',
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: user1Id,
    name: 'Arjun Mehta',
    email: 'arjun@gmail.com',
    password: hash,
    phone: '9876543213',
    role: 'user',
    gymId: gym1Id,
    avatar: 'https://images.unsplash.com/photo-1675355152054-d601f3007258?w=400',
    height: 175,
    weight: 72,
    dateOfBirth: new Date('2000-01-25'),
    gender: 'male',
    status: 'active',
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: user2Id,
    name: 'Sneha Gupta',
    email: 'sneha@gmail.com',
    password: hash,
    phone: '9876543214',
    role: 'user',
    gymId: gym2Id,
    avatar: 'https://images.unsplash.com/photo-1551148518-e19171379838?w=400',
    height: 160,
    weight: 55,
    dateOfBirth: new Date('1999-11-08'),
    gender: 'female',
    status: 'active',
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: user3Id,
    name: 'Vikram Singh',
    email: 'vikram@gmail.com',
    password: hash,
    phone: '9876543215',
    role: 'user',
    gymId: gym1Id,
    avatar: 'https://images.unsplash.com/photo-1617336581611-0afe60655091?w=400',
    height: 185,
    weight: 90,
    dateOfBirth: new Date('1996-07-04'),
    gender: 'male',
    status: 'active',
    createdAt: now,
    updatedAt: now,
  },
];

await db.collection('users').insertMany(users);
console.log(`  Users: ${users.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GYMS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const gyms = [
  {
    _id: gym1Id,
    name: 'REAUX Fitness Delhi',
    slug: 'reaux-fitness-delhi',
    description: 'Premium fitness center in the heart of Delhi with state-of-the-art equipment and expert trainers.',
    address: { street: '45 MG Road, Connaught Place', city: 'Delhi', state: 'Delhi', pincode: '110001', coordinates: { lat: 28.6315, lng: 77.2167 } },
    phone: '011-23456789',
    email: 'delhi@reauxlabs.com',
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800'],
    logo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200',
    amenities: ['parking', 'ac', 'sauna', 'pool', 'locker', 'wifi', 'cafe'],
    openingHours: {
      monday: { open: '05:00', close: '23:00' }, tuesday: { open: '05:00', close: '23:00' },
      wednesday: { open: '05:00', close: '23:00' }, thursday: { open: '05:00', close: '23:00' },
      friday: { open: '05:00', close: '23:00' }, saturday: { open: '06:00', close: '22:00' },
      sunday: { open: '07:00', close: '20:00' },
    },
    isActive: true,
    createdBy: superAdminId,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: gym2Id,
    name: 'REAUX Fitness Mumbai',
    slug: 'reaux-fitness-mumbai',
    description: 'World-class gym facility in Bandra with ocean view, personal training, and group fitness classes.',
    address: { street: '12 Linking Road, Bandra West', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', coordinates: { lat: 19.0596, lng: 72.8295 } },
    phone: '022-34567890',
    email: 'mumbai@reauxlabs.com',
    images: ['https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800', 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800'],
    logo: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200',
    amenities: ['parking', 'ac', 'steam', 'locker', 'wifi', 'juice-bar', 'crossfit'],
    openingHours: {
      monday: { open: '05:30', close: '22:30' }, tuesday: { open: '05:30', close: '22:30' },
      wednesday: { open: '05:30', close: '22:30' }, thursday: { open: '05:30', close: '22:30' },
      friday: { open: '05:30', close: '22:30' }, saturday: { open: '06:00', close: '21:00' },
      sunday: { open: '07:00', close: '19:00' },
    },
    isActive: true,
    createdBy: superAdminId,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: gym3Id,
    name: 'REAUX Fitness Bangalore',
    slug: 'reaux-fitness-bangalore',
    description: 'Tech-enabled gym in Koramangala with smart equipment tracking and AI-powered workout recommendations.',
    address: { street: '78 100 Feet Road, Koramangala', city: 'Bangalore', state: 'Karnataka', pincode: '560034', coordinates: { lat: 12.9352, lng: 77.6245 } },
    phone: '080-45678901',
    email: 'bangalore@reauxlabs.com',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800'],
    logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200',
    amenities: ['parking', 'ac', 'sauna', 'locker', 'wifi', 'yoga-studio'],
    openingHours: {
      monday: { open: '05:00', close: '23:00' }, tuesday: { open: '05:00', close: '23:00' },
      wednesday: { open: '05:00', close: '23:00' }, thursday: { open: '05:00', close: '23:00' },
      friday: { open: '05:00', close: '23:00' }, saturday: { open: '06:00', close: '22:00' },
      sunday: { open: '06:00', close: '20:00' },
    },
    isActive: true,
    createdBy: superAdminId,
    createdAt: now,
    updatedAt: now,
  },
];

await db.collection('gyms').insertMany(gyms);
console.log(`  Gyms: ${gyms.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  BMI RECORDS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const bmiRecords = [
  // Arjun - tracking progress over 3 months
  { _id: oid(), userId: user1Id, height: 175, weight: 78, bmi: 25.47, category: 'overweight', createdAt: new Date('2025-12-01'), updatedAt: new Date('2025-12-01') },
  { _id: oid(), userId: user1Id, height: 175, weight: 76, bmi: 24.82, category: 'normal', createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01') },
  { _id: oid(), userId: user1Id, height: 175, weight: 72, bmi: 23.51, category: 'normal', createdAt: new Date('2026-02-01'), updatedAt: new Date('2026-02-01') },
  // Sneha
  { _id: oid(), userId: user2Id, height: 160, weight: 58, bmi: 22.66, category: 'normal', createdAt: new Date('2026-01-15'), updatedAt: new Date('2026-01-15') },
  { _id: oid(), userId: user2Id, height: 160, weight: 55, bmi: 21.48, category: 'normal', createdAt: new Date('2026-02-01'), updatedAt: new Date('2026-02-01') },
  // Vikram
  { _id: oid(), userId: user3Id, height: 185, weight: 95, bmi: 27.76, category: 'overweight', createdAt: new Date('2025-11-01'), updatedAt: new Date('2025-11-01') },
  { _id: oid(), userId: user3Id, height: 185, weight: 92, bmi: 26.88, category: 'overweight', createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01') },
  { _id: oid(), userId: user3Id, height: 185, weight: 88, bmi: 25.71, category: 'overweight', createdAt: new Date('2026-02-01'), updatedAt: new Date('2026-02-01') },
];

await db.collection('bmirecords').insertMany(bmiRecords);
console.log(`  BMI Records: ${bmiRecords.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DIET PLANS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const diet1Id = oid();
const diet2Id = oid();
const diet3Id = oid();

const dietPlans = [
  {
    _id: diet1Id,
    title: 'Lean Muscle Keto Plan',
    description: 'A high-fat, moderate-protein, low-carb plan designed for lean muscle gain while staying in ketosis.',
    slug: 'lean-muscle-keto-plan',
    category: 'keto',
    meals: [
      { name: 'Breakfast', time: '7:30 AM', items: [
        { name: 'Scrambled Eggs', quantity: '3 eggs', calories: 210, protein: 18, carbs: 2, fat: 15 },
        { name: 'Avocado', quantity: '1/2', calories: 120, protein: 1.5, carbs: 6, fat: 11 },
        { name: 'Bulletproof Coffee', quantity: '1 cup', calories: 230, protein: 1, carbs: 0, fat: 25 },
      ]},
      { name: 'Lunch', time: '1:00 PM', items: [
        { name: 'Grilled Chicken Thigh', quantity: '200g', calories: 330, protein: 40, carbs: 0, fat: 18 },
        { name: 'Caesar Salad (no croutons)', quantity: '1 bowl', calories: 180, protein: 5, carbs: 4, fat: 16 },
      ]},
      { name: 'Dinner', time: '7:30 PM', items: [
        { name: 'Salmon Fillet', quantity: '180g', calories: 350, protein: 38, carbs: 0, fat: 22 },
        { name: 'Sauteed Spinach', quantity: '200g', calories: 70, protein: 4, carbs: 3, fat: 5 },
      ]},
    ],
    image: 'https://images.unsplash.com/photo-1559058789-672da06263d8?w=800',
    totalCalories: 1490,
    createdBy: admin1Id,
    isPublished: true,
    followers: [user1Id, user3Id],
    likes: [user1Id, user2Id, user3Id],
    tags: ['keto', 'muscle-gain', 'high-fat', 'low-carb'],
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-10'),
  },
  {
    _id: diet2Id,
    title: 'Weight Loss Vegan Plan',
    description: 'Plant-based calorie-deficit plan rich in fiber and micronutrients for sustainable weight loss.',
    slug: 'weight-loss-vegan-plan',
    category: 'vegan',
    meals: [
      { name: 'Breakfast', time: '8:00 AM', items: [
        { name: 'Overnight Oats with Chia', quantity: '1 bowl', calories: 280, protein: 10, carbs: 42, fat: 8 },
        { name: 'Mixed Berries', quantity: '100g', calories: 50, protein: 1, carbs: 12, fat: 0 },
      ]},
      { name: 'Lunch', time: '12:30 PM', items: [
        { name: 'Quinoa Buddha Bowl', quantity: '1 bowl', calories: 380, protein: 15, carbs: 52, fat: 12 },
      ]},
      { name: 'Snack', time: '4:00 PM', items: [
        { name: 'Apple with Almond Butter', quantity: '1 tbsp', calories: 190, protein: 4, carbs: 25, fat: 9 },
      ]},
      { name: 'Dinner', time: '7:00 PM', items: [
        { name: 'Lentil Soup', quantity: '2 cups', calories: 280, protein: 18, carbs: 40, fat: 4 },
        { name: 'Whole Wheat Roti', quantity: '1', calories: 120, protein: 4, carbs: 22, fat: 3 },
      ]},
    ],
    image: 'https://images.unsplash.com/photo-1599020792689-9fde458e7e17?w=800',
    totalCalories: 1300,
    createdBy: admin2Id,
    isPublished: true,
    followers: [user2Id],
    likes: [user2Id, user1Id],
    tags: ['vegan', 'weight-loss', 'plant-based', 'fiber'],
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    _id: diet3Id,
    title: 'Muscle Gain High Protein Plan',
    description: 'Caloric surplus plan with 2g protein per kg bodyweight for maximum muscle growth.',
    slug: 'muscle-gain-high-protein-plan',
    category: 'muscle-gain',
    meals: [
      { name: 'Breakfast', time: '7:00 AM', items: [
        { name: 'Egg White Omelette', quantity: '6 whites + 2 whole', calories: 280, protein: 36, carbs: 2, fat: 12 },
        { name: 'Oatmeal with Banana', quantity: '1 bowl', calories: 350, protein: 10, carbs: 62, fat: 6 },
      ]},
      { name: 'Mid-Morning', time: '10:00 AM', items: [
        { name: 'Whey Protein Shake', quantity: '2 scoops', calories: 240, protein: 48, carbs: 6, fat: 2 },
        { name: 'Peanut Butter Toast', quantity: '2 slices', calories: 320, protein: 12, carbs: 30, fat: 18 },
      ]},
      { name: 'Lunch', time: '1:00 PM', items: [
        { name: 'Chicken Breast', quantity: '250g', calories: 412, protein: 62, carbs: 0, fat: 18 },
        { name: 'Brown Rice', quantity: '200g cooked', calories: 220, protein: 5, carbs: 46, fat: 2 },
        { name: 'Mixed Vegetables', quantity: '150g', calories: 60, protein: 3, carbs: 12, fat: 1 },
      ]},
      { name: 'Pre-Workout', time: '4:30 PM', items: [
        { name: 'Banana', quantity: '2', calories: 210, protein: 3, carbs: 54, fat: 1 },
        { name: 'BCAA Drink', quantity: '1 scoop', calories: 30, protein: 7, carbs: 0, fat: 0 },
      ]},
      { name: 'Dinner', time: '8:00 PM', items: [
        { name: 'Paneer Tikka', quantity: '200g', calories: 400, protein: 28, carbs: 8, fat: 30 },
        { name: 'Chapati', quantity: '3', calories: 360, protein: 12, carbs: 66, fat: 9 },
      ]},
    ],
    image: 'https://images.unsplash.com/photo-1668665771959-b217076ddde3?w=800',
    totalCalories: 2882,
    createdBy: admin1Id,
    isPublished: true,
    followers: [user1Id, user2Id, user3Id],
    likes: [user1Id, user3Id],
    tags: ['muscle-gain', 'high-protein', 'bulking', 'strength'],
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-20'),
  },
];

await db.collection('dietplans').insertMany(dietPlans);
console.log(`  Diet Plans: ${dietPlans.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  POSTS & COMMENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const post1Id = oid();
const post2Id = oid();
const post3Id = oid();
const post4Id = oid();
const post5Id = oid();

const posts = [
  {
    _id: post1Id,
    author: user1Id,
    content: 'Just hit a new PR on deadlifts! 180kg x 3 reps. Consistency pays off! 💪 #fitness #deadlift #PR #gym',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800',
    likes: [user2Id, user3Id, admin1Id],
    likesCount: 3,
    commentsCount: 2,
    hashtags: ['fitness', 'deadlift', 'PR', 'gym'],
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date('2026-02-01'),
  },
  {
    _id: post2Id,
    author: user2Id,
    content: 'Completed my first 5K run this morning in under 25 minutes! Started from not being able to run 1K three months ago. #running #cardio #transformation #nevergiveup',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1758520705390-ccfc66f2b18a?w=800',
    likes: [user1Id, user3Id, admin1Id, admin2Id],
    likesCount: 4,
    commentsCount: 1,
    hashtags: ['running', 'cardio', 'transformation', 'nevergiveup'],
    createdAt: new Date('2026-02-02'),
    updatedAt: new Date('2026-02-02'),
  },
  {
    _id: post3Id,
    author: admin1Id,
    content: 'New batch of premium whey protein just arrived at the store! Limited stock - grab yours now. Use code REAUX20 for 20% off! #supplements #protein #nutrition',
    mediaType: 'text',
    likes: [user1Id, user2Id],
    likesCount: 2,
    commentsCount: 1,
    hashtags: ['supplements', 'protein', 'nutrition'],
    createdAt: new Date('2026-02-03'),
    updatedAt: new Date('2026-02-03'),
  },
  {
    _id: post4Id,
    author: user3Id,
    content: 'Meal prep Sunday! Prepared chicken breast, brown rice and veggies for the whole week. Meal prep is the key to staying on track. #mealprep #nutrition #discipline #fitness',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1587996580981-bd03dde74843?w=800',
    likes: [user1Id, user2Id, admin2Id],
    likesCount: 3,
    commentsCount: 0,
    hashtags: ['mealprep', 'nutrition', 'discipline', 'fitness'],
    createdAt: new Date('2026-02-04'),
    updatedAt: new Date('2026-02-04'),
  },
  {
    _id: post5Id,
    author: admin2Id,
    content: 'Yoga session at REAUX Fitness Mumbai was amazing today! Join us every Saturday at 7 AM for a rejuvenating experience. #yoga #mindfulness #wellness #reauxfitness',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1552196603-d02485940b9f?w=800',
    likes: [user2Id],
    likesCount: 1,
    commentsCount: 0,
    hashtags: ['yoga', 'mindfulness', 'wellness', 'reauxfitness'],
    createdAt: new Date('2026-02-05'),
    updatedAt: new Date('2026-02-05'),
  },
];

const comments = [
  { _id: oid(), postId: post1Id, author: user2Id, content: 'That is insane! What program are you following?', createdAt: new Date('2026-02-01T10:00:00Z'), updatedAt: new Date('2026-02-01T10:00:00Z') },
  { _id: oid(), postId: post1Id, author: admin1Id, content: 'Great lift! Keep pushing those limits 🔥', createdAt: new Date('2026-02-01T11:00:00Z'), updatedAt: new Date('2026-02-01T11:00:00Z') },
  { _id: oid(), postId: post2Id, author: user1Id, content: 'Amazing progress Sneha! Inspiring stuff!', createdAt: new Date('2026-02-02T08:00:00Z'), updatedAt: new Date('2026-02-02T08:00:00Z') },
  { _id: oid(), postId: post3Id, author: user3Id, content: 'Just ordered 2 bags! Thanks for the discount code.', createdAt: new Date('2026-02-03T14:00:00Z'), updatedAt: new Date('2026-02-03T14:00:00Z') },
];

await db.collection('posts').insertMany(posts);
await db.collection('comments').insertMany(comments);
console.log(`  Posts: ${posts.length} inserted`);
console.log(`  Comments: ${comments.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  REELS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const reels = [
  { _id: oid(), author: user1Id, videoUrl: 'https://assets.mixkit.co/videos/52317/52317-1080.mp4', caption: '180kg deadlift PR! #deadlift #gym #strength', likes: [user2Id, user3Id], likesCount: 2, createdAt: new Date('2026-02-01'), updatedAt: new Date('2026-02-01') },
  { _id: oid(), author: user2Id, videoUrl: 'https://assets.mixkit.co/videos/23056/23056-720.mp4', caption: 'First 5K under 25 min! #running #cardio', likes: [user1Id, admin2Id], likesCount: 2, createdAt: new Date('2026-02-02'), updatedAt: new Date('2026-02-02') },
  { _id: oid(), author: user3Id, videoUrl: 'https://assets.mixkit.co/videos/45874/45874-720.mp4', caption: 'Bench press form check - 100kg x 5. Any tips? #benchpress #formcheck', likes: [user1Id], likesCount: 1, createdAt: new Date('2026-02-03'), updatedAt: new Date('2026-02-03') },
  { _id: oid(), author: admin1Id, videoUrl: 'https://assets.mixkit.co/videos/52112/52112-1080.mp4', caption: 'Quick tour of REAUX Fitness Delhi! Come check us out. #gymtour #reauxfitness', likes: [user1Id, user2Id, user3Id], likesCount: 3, createdAt: new Date('2026-02-04'), updatedAt: new Date('2026-02-04') },
];

await db.collection('reels').insertMany(reels);
console.log(`  Reels: ${reels.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PRODUCTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const prod1Id = oid();
const prod2Id = oid();
const prod3Id = oid();
const prod4Id = oid();
const prod5Id = oid();
const prod6Id = oid();

const products = [
  {
    _id: prod1Id,
    name: 'REAUX Whey Protein Isolate 1kg',
    description: 'Premium whey protein isolate with 28g protein per scoop. Zero added sugar. Available in chocolate, vanilla, and strawberry.',
    price: 2499,
    compareAtPrice: 2999,
    images: ['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800'],
    category: 'supplements',
    stock: 120,
    isActive: true,
    createdBy: admin1Id,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: prod2Id,
    name: 'BCAA Powder 300g - Berry Blast',
    description: 'Branch chain amino acids (2:1:1 ratio) for improved recovery and endurance during intense workouts.',
    price: 999,
    compareAtPrice: 1299,
    images: ['https://images.unsplash.com/photo-1704650311140-aba27da8623d?w=800'],
    category: 'supplements',
    stock: 80,
    isActive: true,
    createdBy: admin1Id,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: prod3Id,
    name: 'Premium Resistance Bands Set',
    description: 'Set of 5 latex resistance bands with different resistance levels. Includes carry bag and exercise guide.',
    price: 799,
    compareAtPrice: 1199,
    images: ['https://images.unsplash.com/photo-1518609571773-39b7d303a87b?w=800'],
    category: 'equipment',
    stock: 45,
    isActive: true,
    createdBy: admin2Id,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: prod4Id,
    name: 'REAUX Gym Stringer Tank Top',
    description: 'Breathable cotton-blend stringer tank top with REAUX branding. Perfect for intense workouts.',
    price: 599,
    compareAtPrice: null,
    images: ['https://images.unsplash.com/photo-1522844831948-ec9400db7659?w=800'],
    category: 'apparel',
    stock: 200,
    isActive: true,
    createdBy: admin1Id,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: prod5Id,
    name: 'Creatine Monohydrate 250g',
    description: 'Pure micronized creatine monohydrate. 5g per serving. Unflavored and easy to mix.',
    price: 649,
    compareAtPrice: 899,
    images: ['https://images.unsplash.com/photo-1704650311298-4d6915d34c64?w=800'],
    category: 'supplements',
    stock: 95,
    isActive: true,
    createdBy: admin1Id,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: prod6Id,
    name: 'REAUX Shaker Bottle 700ml',
    description: 'BPA-free shaker bottle with wire whisk ball. Leak-proof lid with measurement markings.',
    price: 349,
    compareAtPrice: 499,
    images: ['https://images.unsplash.com/photo-1553531580-8f1950e53700?w=800'],
    category: 'accessories',
    stock: 300,
    isActive: true,
    createdBy: admin2Id,
    createdAt: now,
    updatedAt: now,
  },
];

await db.collection('products').insertMany(products);
console.log(`  Products: ${products.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CARTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const carts = [
  {
    _id: oid(),
    userId: user1Id,
    items: [
      { product: prod1Id, quantity: 1 },
      { product: prod5Id, quantity: 2 },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: oid(),
    userId: user3Id,
    items: [
      { product: prod4Id, quantity: 3 },
      { product: prod6Id, quantity: 1 },
    ],
    createdAt: now,
    updatedAt: now,
  },
];

await db.collection('carts').insertMany(carts);
console.log(`  Carts: ${carts.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PROMO CODES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const promoCodes = [
  {
    _id: oid(),
    code: 'REAUX20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 999,
    maxDiscount: 500,
    usageLimit: 200,
    usedCount: 12,
    validFrom: new Date('2026-01-01'),
    validUntil: new Date('2026-06-30'),
    isActive: true,
    createdBy: superAdminId,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: oid(),
    code: 'FLAT200',
    discountType: 'fixed',
    discountValue: 200,
    minOrderAmount: 1500,
    maxDiscount: null,
    usageLimit: 100,
    usedCount: 5,
    validFrom: new Date('2026-02-01'),
    validUntil: new Date('2026-03-31'),
    isActive: true,
    createdBy: superAdminId,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: oid(),
    code: 'WELCOME50',
    discountType: 'percentage',
    discountValue: 50,
    minOrderAmount: 0,
    maxDiscount: 300,
    usageLimit: 500,
    usedCount: 45,
    validFrom: new Date('2026-01-01'),
    validUntil: new Date('2026-12-31'),
    isActive: true,
    createdBy: superAdminId,
    createdAt: now,
    updatedAt: now,
  },
];

await db.collection('promocodes').insertMany(promoCodes);
console.log(`  Promo Codes: ${promoCodes.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ORDERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const orders = [
  {
    _id: oid(),
    userId: user2Id,
    items: [
      { product: prod1Id, name: 'REAUX Whey Protein Isolate 1kg', price: 2499, quantity: 1 },
      { product: prod6Id, name: 'REAUX Shaker Bottle 700ml', price: 349, quantity: 1 },
    ],
    totalAmount: 2848,
    discount: 300,
    finalAmount: 2548,
    promoCode: 'WELCOME50',
    status: 'delivered',
    shippingAddress: { street: '22 Park Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', phone: '9876543214' },
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-25'),
  },
  {
    _id: oid(),
    userId: user1Id,
    items: [
      { product: prod2Id, name: 'BCAA Powder 300g - Berry Blast', price: 999, quantity: 2 },
      { product: prod5Id, name: 'Creatine Monohydrate 250g', price: 649, quantity: 1 },
    ],
    totalAmount: 2647,
    discount: 500,
    finalAmount: 2147,
    promoCode: 'REAUX20',
    status: 'shipped',
    shippingAddress: { street: '10 Sector 18', city: 'Delhi', state: 'Delhi', pincode: '110001', phone: '9876543213' },
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date('2026-02-03'),
  },
  {
    _id: oid(),
    userId: user3Id,
    items: [
      { product: prod3Id, name: 'Premium Resistance Bands Set', price: 799, quantity: 1 },
      { product: prod4Id, name: 'REAUX Gym Stringer Tank Top', price: 599, quantity: 2 },
    ],
    totalAmount: 1997,
    discount: 200,
    finalAmount: 1797,
    promoCode: 'FLAT200',
    status: 'confirmed',
    shippingAddress: { street: '55 Jubilee Hills', city: 'Delhi', state: 'Delhi', pincode: '110045', phone: '9876543215' },
    createdAt: new Date('2026-02-04'),
    updatedAt: new Date('2026-02-04'),
  },
  {
    _id: oid(),
    userId: user2Id,
    items: [
      { product: prod5Id, name: 'Creatine Monohydrate 250g', price: 649, quantity: 1 },
    ],
    totalAmount: 649,
    discount: 0,
    finalAmount: 649,
    promoCode: null,
    status: 'pending',
    shippingAddress: { street: '22 Park Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', phone: '9876543214' },
    createdAt: new Date('2026-02-05'),
    updatedAt: new Date('2026-02-05'),
  },
];

await db.collection('orders').insertMany(orders);
console.log(`  Orders: ${orders.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CHALLENGES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const chal1Id = oid();
const chal2Id = oid();

const challenges = [
  {
    _id: chal1Id,
    title: '30-Day 10K Steps Challenge',
    description: 'Walk at least 10,000 steps every day for 30 days. Track your progress and compete with other members!',
    type: 'steps',
    target: 300000,
    startDate: new Date('2026-02-01'),
    endDate: new Date('2026-03-02'),
    participants: [
      { userId: user1Id, progress: 120000, joinedAt: new Date('2026-02-01') },
      { userId: user2Id, progress: 95000, joinedAt: new Date('2026-02-01') },
      { userId: user3Id, progress: 140000, joinedAt: new Date('2026-02-02') },
    ],
    createdBy: admin1Id,
    isActive: true,
    createdAt: new Date('2026-01-28'),
    updatedAt: new Date('2026-02-06'),
  },
  {
    _id: chal2Id,
    title: 'February Push-Up Challenge',
    description: 'Complete 3000 push-ups throughout February. That is about 107 per day. Can you do it?',
    type: 'workout',
    target: 3000,
    startDate: new Date('2026-02-01'),
    endDate: new Date('2026-02-28'),
    participants: [
      { userId: user1Id, progress: 650, joinedAt: new Date('2026-02-01') },
      { userId: user3Id, progress: 820, joinedAt: new Date('2026-02-01') },
    ],
    createdBy: admin2Id,
    isActive: true,
    createdAt: new Date('2026-01-30'),
    updatedAt: new Date('2026-02-06'),
  },
];

await db.collection('challenges').insertMany(challenges);
console.log(`  Challenges: ${challenges.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  NOTIFICATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const notifications = [
  { _id: oid(), userId: user1Id, title: 'Order Shipped', message: 'Your order #ORD-002 has been shipped! Expected delivery in 3-5 days.', type: 'order', isRead: false, createdAt: new Date('2026-02-03'), updatedAt: new Date('2026-02-03') },
  { _id: oid(), userId: user1Id, title: 'Challenge Update', message: 'You have completed 40% of the 30-Day 10K Steps Challenge. Keep going!', type: 'challenge', isRead: true, createdAt: new Date('2026-02-04'), updatedAt: new Date('2026-02-04') },
  { _id: oid(), userId: user2Id, title: 'Order Delivered', message: 'Your order #ORD-001 has been delivered. Enjoy your purchase!', type: 'order', isRead: true, createdAt: new Date('2026-01-25'), updatedAt: new Date('2026-01-25') },
  { _id: oid(), userId: user2Id, title: 'New Diet Plan', message: 'A new vegan diet plan "Weight Loss Vegan Plan" has been published. Check it out!', type: 'diet', isRead: false, createdAt: new Date('2026-01-15'), updatedAt: new Date('2026-01-15') },
  { _id: oid(), userId: user3Id, title: 'New Comment', message: 'Sneha Gupta commented on your post about deadlift PR.', type: 'community', isRead: true, createdAt: new Date('2026-02-01'), updatedAt: new Date('2026-02-01') },
  { _id: oid(), userId: user3Id, title: 'Order Confirmed', message: 'Your order #ORD-003 has been confirmed and is being prepared.', type: 'order', isRead: false, createdAt: new Date('2026-02-04'), updatedAt: new Date('2026-02-04') },
  { _id: oid(), userId: user1Id, title: 'Welcome to REAUX_labs!', message: 'Welcome aboard, Arjun! Start by exploring our gym, diet plans, and community.', type: 'system', isRead: true, createdAt: new Date('2025-12-01'), updatedAt: new Date('2025-12-01') },
  { _id: oid(), userId: user2Id, title: 'Welcome to REAUX_labs!', message: 'Welcome aboard, Sneha! Start by exploring our gym, diet plans, and community.', type: 'system', isRead: true, createdAt: new Date('2025-12-15'), updatedAt: new Date('2025-12-15') },
];

await db.collection('notifications').insertMany(notifications);
console.log(`  Notifications: ${notifications.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SUMMARY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
console.log('\n=========================================');
console.log('  Seed Complete!');
console.log('=========================================');
console.log(`
  Users:          ${users.length} (1 superadmin, 2 admins, 3 users)
  Gyms:           ${gyms.length}
  BMI Records:    ${bmiRecords.length}
  Diet Plans:     ${dietPlans.length}
  Posts:          ${posts.length}
  Comments:       ${comments.length}
  Reels:          ${reels.length}
  Products:       ${products.length}
  Carts:          ${carts.length}
  Orders:         ${orders.length}
  Promo Codes:    ${promoCodes.length}
  Challenges:     ${challenges.length}
  Notifications:  ${notifications.length}

  All passwords: Pass1234

  Login as:
    SuperAdmin → anish@reauxlabs.com
    Admin 1    → rahul@reauxlabs.com
    Admin 2    → priya@reauxlabs.com
    User 1     → arjun@gmail.com
    User 2     → sneha@gmail.com
    User 3     → vikram@gmail.com
`);

await mongoose.disconnect();
