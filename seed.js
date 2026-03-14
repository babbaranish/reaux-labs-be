import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGO_URI = process.env.MONGO_URI;
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);

await mongoose.connect(MONGO_URI);
const db = mongoose.connection.db;
console.log('Connected to MongoDB\n');

// ─── Clear all collections ───
const collections = [
  'users', 'gyms', 'bmirecords', 'dietplans', 'posts', 'comments',
  'reels', 'reelcomments', 'products', 'carts', 'orders', 'promocodes',
  'challenges', 'notifications', 'membershipplans', 'usermemberships',
  'workouts', 'contacts',
];
for (const col of collections) {
  await db.collection(col).deleteMany({});
}
console.log('Cleared all collections');

// ─── Helpers ───
const oid = () => new mongoose.Types.ObjectId();
const hash = await bcrypt.hash('Pass1234', BCRYPT_ROUNDS);
const now = new Date();
const d = (str) => new Date(str);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  IDs — declare all upfront
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const superAdminId = oid();

// Gym IDs
const gym1Id = oid(); // Delhi
const gym2Id = oid(); // Mumbai
const gym3Id = oid(); // Bangalore

// Admin IDs
const admin1Id = oid(); // Rahul — Delhi
const admin2Id = oid(); // Priya — Mumbai
const admin3Id = oid(); // Karan — Bangalore

// Delhi users
const user1Id = oid(); // Arjun Mehta
const user2Id = oid(); // Vikram Singh
const user3Id = oid(); // Riya Kapoor
const user4Id = oid(); // Manish Tiwari

// Mumbai users
const user5Id = oid(); // Sneha Gupta
const user6Id = oid(); // Rohan Desai
const user7Id = oid(); // Kavya Reddy

// Bangalore users
const user8Id = oid();  // Aditya Kumar
const user9Id = oid();  // Pooja Sharma
const user10Id = oid(); // Nikhil Menon

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  USERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const users = [
  // ── SuperAdmin ──
  {
    _id: superAdminId, name: 'Anish Babbar', firstName: 'Anish', lastName: 'Babbar',
    email: 'anish@reauxlabs.com', password: hash, phone: '9876543210',
    role: 'superadmin', gymId: null,
    avatar: 'https://images.unsplash.com/photo-1649433658557-54cf58577c68?w=400',
    height: 178, weight: 75, dateOfBirth: d('1998-05-15'), dateOfJoining: d('2024-01-01'),
    gender: 'male', status: 'active',
    savedAddresses: [
      { label: 'Home', street: '12 Vasant Vihar', city: 'Delhi', state: 'Delhi', pincode: '110057', phone: '9876543210', isDefault: true },
      { label: 'Office', street: '45 MG Road, Connaught Place', city: 'Delhi', state: 'Delhi', pincode: '110001', phone: '9876543210', isDefault: false },
    ],
    createdAt: now, updatedAt: now,
  },
  // ── Admins ──
  {
    _id: admin1Id, name: 'Rahul Sharma', firstName: 'Rahul', lastName: 'Sharma',
    email: 'rahul@reauxlabs.com', password: hash, phone: '9876543211',
    role: 'admin', gymId: gym1Id,
    avatar: 'https://images.unsplash.com/photo-1633292297613-40c0087f8b3b?w=400',
    height: 182, weight: 80, dateOfBirth: d('1995-08-20'), dateOfJoining: d('2024-03-01'),
    gender: 'male', status: 'active',
    savedAddresses: [
      { label: 'Home', street: '7 Rajouri Garden', city: 'Delhi', state: 'Delhi', pincode: '110027', phone: '9876543211', isDefault: true },
    ],
    createdAt: now, updatedAt: now,
  },
  {
    _id: admin2Id, name: 'Priya Patel', firstName: 'Priya', lastName: 'Patel',
    email: 'priya@reauxlabs.com', password: hash, phone: '9876543212',
    role: 'admin', gymId: gym2Id,
    avatar: 'https://images.unsplash.com/photo-1618951871701-f542cd0d877e?w=400',
    height: 165, weight: 58, dateOfBirth: d('1997-03-12'), dateOfJoining: d('2024-04-01'),
    gender: 'female', status: 'active',
    savedAddresses: [
      { label: 'Home', street: '33 Juhu Scheme', city: 'Mumbai', state: 'Maharashtra', pincode: '400049', phone: '9876543212', isDefault: true },
      { label: 'Gym', street: '12 Linking Road, Bandra West', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', phone: '9876543212', isDefault: false },
    ],
    createdAt: now, updatedAt: now,
  },
  {
    _id: admin3Id, name: 'Karan Nair', firstName: 'Karan', lastName: 'Nair',
    email: 'karan@reauxlabs.com', password: hash, phone: '9876543219',
    role: 'admin', gymId: gym3Id,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    height: 176, weight: 73, dateOfBirth: d('1994-11-30'), dateOfJoining: d('2025-01-15'),
    gender: 'male', status: 'active',
    savedAddresses: [
      { label: 'Home', street: '15 Indiranagar 100 Feet Road', city: 'Bangalore', state: 'Karnataka', pincode: '560038', phone: '9876543219', isDefault: true },
    ],
    createdAt: now, updatedAt: now,
  },
  // ── Delhi users ──
  {
    _id: user1Id, name: 'Arjun Mehta', firstName: 'Arjun', lastName: 'Mehta',
    email: 'arjun@gmail.com', password: hash, phone: '9876543213',
    role: 'user', gymId: gym1Id,
    avatar: 'https://images.unsplash.com/photo-1675355152054-d601f3007258?w=400',
    height: 175, weight: 72, dateOfBirth: d('2000-01-25'), dateOfJoining: d('2026-01-15'),
    gender: 'male', status: 'active',
    savedAddresses: [
      { label: 'Home', street: '10 Sector 18, Dwarka', city: 'Delhi', state: 'Delhi', pincode: '110075', phone: '9876543213', isDefault: true },
      { label: 'Work', street: '22 Nehru Place', city: 'Delhi', state: 'Delhi', pincode: '110019', phone: '9876543213', isDefault: false },
    ],
    createdAt: now, updatedAt: now,
  },
  {
    _id: user2Id, name: 'Vikram Singh', firstName: 'Vikram', lastName: 'Singh',
    email: 'vikram@gmail.com', password: hash, phone: '9876543215',
    role: 'user', gymId: gym1Id,
    avatar: 'https://images.unsplash.com/photo-1617336581611-0afe60655091?w=400',
    height: 185, weight: 90, dateOfBirth: d('1996-07-04'), dateOfJoining: d('2025-12-01'),
    gender: 'male', status: 'active',
    savedAddresses: [
      { label: 'Home', street: '55 Pitampura', city: 'Delhi', state: 'Delhi', pincode: '110034', phone: '9876543215', isDefault: true },
    ],
    createdAt: now, updatedAt: now,
  },
  {
    _id: user3Id, name: 'Riya Kapoor', firstName: 'Riya', lastName: 'Kapoor',
    email: 'riya@gmail.com', password: hash, phone: '9876543216',
    role: 'user', gymId: gym1Id,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    height: 162, weight: 54, dateOfBirth: d('2001-04-18'), dateOfJoining: d('2026-02-01'),
    gender: 'female', status: 'active',
    savedAddresses: [
      { label: 'Home', street: '8 Lajpat Nagar II', city: 'Delhi', state: 'Delhi', pincode: '110024', phone: '9876543216', isDefault: true },
    ],
    createdAt: now, updatedAt: now,
  },
  {
    _id: user4Id, name: 'Manish Tiwari', firstName: 'Manish', lastName: 'Tiwari',
    email: 'manish@gmail.com', password: hash, phone: '9876543217',
    role: 'user', gymId: gym1Id,
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400',
    height: 170, weight: 68, dateOfBirth: d('1993-09-10'), dateOfJoining: d('2025-11-15'),
    gender: 'male', status: 'active',
    savedAddresses: [
      { label: 'Home', street: '3 Rohini Sector 7', city: 'Delhi', state: 'Delhi', pincode: '110085', phone: '9876543217', isDefault: true },
      { label: 'Parents', street: '16 Karol Bagh', city: 'Delhi', state: 'Delhi', pincode: '110005', phone: '9811223344', isDefault: false },
    ],
    createdAt: now, updatedAt: now,
  },
  // ── Mumbai users ──
  {
    _id: user5Id, name: 'Sneha Gupta', firstName: 'Sneha', lastName: 'Gupta',
    email: 'sneha@gmail.com', password: hash, phone: '9876543214',
    role: 'user', gymId: gym2Id,
    avatar: 'https://images.unsplash.com/photo-1551148518-e19171379838?w=400',
    height: 160, weight: 55, dateOfBirth: d('1999-11-08'), dateOfJoining: d('2026-01-20'),
    gender: 'female', status: 'active',
    savedAddresses: [
      { label: 'Home', street: '22 Park Street, Bandra West', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', phone: '9876543214', isDefault: true },
      { label: 'Work', street: '101 BKC, Bandra Kurla Complex', city: 'Mumbai', state: 'Maharashtra', pincode: '400051', phone: '9876543214', isDefault: false },
    ],
    createdAt: now, updatedAt: now,
  },
  {
    _id: user6Id, name: 'Rohan Desai', firstName: 'Rohan', lastName: 'Desai',
    email: 'rohan@gmail.com', password: hash, phone: '9876543220',
    role: 'user', gymId: gym2Id,
    avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400',
    height: 180, weight: 78, dateOfBirth: d('1998-02-14'), dateOfJoining: d('2025-10-01'),
    gender: 'male', status: 'active',
    savedAddresses: [
      { label: 'Home', street: '5 Andheri West', city: 'Mumbai', state: 'Maharashtra', pincode: '400053', phone: '9876543220', isDefault: true },
    ],
    createdAt: now, updatedAt: now,
  },
  {
    _id: user7Id, name: 'Kavya Reddy', firstName: 'Kavya', lastName: 'Reddy',
    email: 'kavya@gmail.com', password: hash, phone: '9876543221',
    role: 'user', gymId: gym2Id,
    avatar: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400',
    height: 158, weight: 52, dateOfBirth: d('2002-06-22'), dateOfJoining: d('2026-02-10'),
    gender: 'female', status: 'active',
    savedAddresses: [
      { label: 'Home', street: '18 Powai Lake Drive', city: 'Mumbai', state: 'Maharashtra', pincode: '400076', phone: '9876543221', isDefault: true },
      { label: 'College', street: '400 Vidyanagari Campus, Santacruz East', city: 'Mumbai', state: 'Maharashtra', pincode: '400098', phone: '9876543221', isDefault: false },
    ],
    createdAt: now, updatedAt: now,
  },
  // ── Bangalore users ──
  {
    _id: user8Id, name: 'Aditya Kumar', firstName: 'Aditya', lastName: 'Kumar',
    email: 'aditya@gmail.com', password: hash, phone: '9876543222',
    role: 'user', gymId: gym3Id,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    height: 173, weight: 76, dateOfBirth: d('1997-08-05'), dateOfJoining: d('2025-09-01'),
    gender: 'male', status: 'active',
    savedAddresses: [
      { label: 'Home', street: '78 Koramangala 4th Block', city: 'Bangalore', state: 'Karnataka', pincode: '560034', phone: '9876543222', isDefault: true },
      { label: 'Office', street: '24 Whitefield Main Road', city: 'Bangalore', state: 'Karnataka', pincode: '560066', phone: '9876543222', isDefault: false },
    ],
    createdAt: now, updatedAt: now,
  },
  {
    _id: user9Id, name: 'Pooja Sharma', firstName: 'Pooja', lastName: 'Sharma',
    email: 'pooja@gmail.com', password: hash, phone: '9876543223',
    role: 'user', gymId: gym3Id,
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400',
    height: 163, weight: 57, dateOfBirth: d('2000-12-03'), dateOfJoining: d('2025-11-01'),
    gender: 'female', status: 'active',
    savedAddresses: [
      { label: 'Home', street: '9 HSR Layout Sector 2', city: 'Bangalore', state: 'Karnataka', pincode: '560102', phone: '9876543223', isDefault: true },
    ],
    createdAt: now, updatedAt: now,
  },
  {
    _id: user10Id, name: 'Nikhil Menon', firstName: 'Nikhil', lastName: 'Menon',
    email: 'nikhil@gmail.com', password: hash, phone: '9876543224',
    role: 'user', gymId: gym3Id,
    avatar: 'https://images.unsplash.com/photo-1584999734482-0361aecad844?w=400',
    height: 177, weight: 82, dateOfBirth: d('1995-03-17'), dateOfJoining: d('2026-01-05'),
    gender: 'male', status: 'active',
    savedAddresses: [
      { label: 'Home', street: '31 JP Nagar 6th Phase', city: 'Bangalore', state: 'Karnataka', pincode: '560078', phone: '9876543224', isDefault: true },
      { label: 'Work', street: '52 Electronic City Phase 1', city: 'Bangalore', state: 'Karnataka', pincode: '560100', phone: '9876543224', isDefault: false },
      { label: 'Parents', street: '4 Thrissur Road', city: 'Palakkad', state: 'Kerala', pincode: '678001', phone: '9876543224', isDefault: false },
    ],
    createdAt: now, updatedAt: now,
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
    phone: '011-23456789', email: 'delhi@reauxlabs.com',
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800'],
    logo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200',
    amenities: ['parking', 'ac', 'sauna', 'pool', 'locker', 'wifi', 'cafe'],
    openingHours: {
      monday: { open: '05:00', close: '23:00' }, tuesday: { open: '05:00', close: '23:00' },
      wednesday: { open: '05:00', close: '23:00' }, thursday: { open: '05:00', close: '23:00' },
      friday: { open: '05:00', close: '23:00' }, saturday: { open: '06:00', close: '22:00' },
      sunday: { open: '07:00', close: '20:00' },
    },
    isActive: true, createdBy: superAdminId, createdAt: now, updatedAt: now,
  },
  {
    _id: gym2Id,
    name: 'REAUX Fitness Mumbai',
    slug: 'reaux-fitness-mumbai',
    description: 'World-class gym facility in Bandra with ocean view, personal training, and group fitness classes.',
    address: { street: '12 Linking Road, Bandra West', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', coordinates: { lat: 19.0596, lng: 72.8295 } },
    phone: '022-34567890', email: 'mumbai@reauxlabs.com',
    images: ['https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800', 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800'],
    logo: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200',
    amenities: ['parking', 'ac', 'steam', 'locker', 'wifi', 'juice-bar', 'crossfit'],
    openingHours: {
      monday: { open: '05:30', close: '22:30' }, tuesday: { open: '05:30', close: '22:30' },
      wednesday: { open: '05:30', close: '22:30' }, thursday: { open: '05:30', close: '22:30' },
      friday: { open: '05:30', close: '22:30' }, saturday: { open: '06:00', close: '21:00' },
      sunday: { open: '07:00', close: '19:00' },
    },
    isActive: true, createdBy: superAdminId, createdAt: now, updatedAt: now,
  },
  {
    _id: gym3Id,
    name: 'REAUX Fitness Bangalore',
    slug: 'reaux-fitness-bangalore',
    description: 'Tech-enabled gym in Koramangala with smart equipment tracking and AI-powered workout recommendations.',
    address: { street: '78 100 Feet Road, Koramangala', city: 'Bangalore', state: 'Karnataka', pincode: '560034', coordinates: { lat: 12.9352, lng: 77.6245 } },
    phone: '080-45678901', email: 'bangalore@reauxlabs.com',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800'],
    logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200',
    amenities: ['parking', 'ac', 'sauna', 'locker', 'wifi', 'yoga-studio'],
    openingHours: {
      monday: { open: '05:00', close: '23:00' }, tuesday: { open: '05:00', close: '23:00' },
      wednesday: { open: '05:00', close: '23:00' }, thursday: { open: '05:00', close: '23:00' },
      friday: { open: '05:00', close: '23:00' }, saturday: { open: '06:00', close: '22:00' },
      sunday: { open: '06:00', close: '20:00' },
    },
    isActive: true, createdBy: superAdminId, createdAt: now, updatedAt: now,
  },
];

await db.collection('gyms').insertMany(gyms);
console.log(`  Gyms: ${gyms.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  BMI RECORDS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const bmiRecords = [
  // Delhi — Arjun (improving: overweight → normal)
  { _id: oid(), userId: user1Id, height: 175, weight: 78, bmi: 25.47, category: 'overweight', createdAt: d('2025-12-01'), updatedAt: d('2025-12-01') },
  { _id: oid(), userId: user1Id, height: 175, weight: 76, bmi: 24.82, category: 'normal', createdAt: d('2026-01-01'), updatedAt: d('2026-01-01') },
  { _id: oid(), userId: user1Id, height: 175, weight: 72, bmi: 23.51, category: 'normal', createdAt: d('2026-02-01'), updatedAt: d('2026-02-01') },
  // Delhi — Vikram (overweight, improving)
  { _id: oid(), userId: user2Id, height: 185, weight: 95, bmi: 27.76, category: 'overweight', createdAt: d('2025-11-01'), updatedAt: d('2025-11-01') },
  { _id: oid(), userId: user2Id, height: 185, weight: 92, bmi: 26.88, category: 'overweight', createdAt: d('2026-01-01'), updatedAt: d('2026-01-01') },
  { _id: oid(), userId: user2Id, height: 185, weight: 88, bmi: 25.71, category: 'overweight', createdAt: d('2026-02-01'), updatedAt: d('2026-02-01') },
  // Delhi — Riya (normal, new member)
  { _id: oid(), userId: user3Id, height: 162, weight: 54, bmi: 20.58, category: 'normal', createdAt: d('2026-02-05'), updatedAt: d('2026-02-05') },
  // Delhi — Manish (normal, steady)
  { _id: oid(), userId: user4Id, height: 170, weight: 70, bmi: 24.22, category: 'normal', createdAt: d('2025-12-01'), updatedAt: d('2025-12-01') },
  { _id: oid(), userId: user4Id, height: 170, weight: 68, bmi: 23.53, category: 'normal', createdAt: d('2026-02-01'), updatedAt: d('2026-02-01') },
  // Mumbai — Sneha (normal, losing weight)
  { _id: oid(), userId: user5Id, height: 160, weight: 58, bmi: 22.66, category: 'normal', createdAt: d('2026-01-15'), updatedAt: d('2026-01-15') },
  { _id: oid(), userId: user5Id, height: 160, weight: 55, bmi: 21.48, category: 'normal', createdAt: d('2026-02-01'), updatedAt: d('2026-02-01') },
  // Mumbai — Rohan (overweight, working on it)
  { _id: oid(), userId: user6Id, height: 180, weight: 85, bmi: 26.23, category: 'overweight', createdAt: d('2025-10-15'), updatedAt: d('2025-10-15') },
  { _id: oid(), userId: user6Id, height: 180, weight: 82, bmi: 25.31, category: 'overweight', createdAt: d('2025-12-01'), updatedAt: d('2025-12-01') },
  { _id: oid(), userId: user6Id, height: 180, weight: 78, bmi: 24.07, category: 'normal', createdAt: d('2026-02-01'), updatedAt: d('2026-02-01') },
  // Mumbai — Kavya (underweight, building muscle)
  { _id: oid(), userId: user7Id, height: 158, weight: 50, bmi: 20.03, category: 'normal', createdAt: d('2026-02-12'), updatedAt: d('2026-02-12') },
  // Bangalore — Aditya (normal)
  { _id: oid(), userId: user8Id, height: 173, weight: 78, bmi: 26.07, category: 'overweight', createdAt: d('2025-09-15'), updatedAt: d('2025-09-15') },
  { _id: oid(), userId: user8Id, height: 173, weight: 76, bmi: 25.40, category: 'overweight', createdAt: d('2026-01-01'), updatedAt: d('2026-01-01') },
  // Bangalore — Pooja (normal, improving)
  { _id: oid(), userId: user9Id, height: 163, weight: 60, bmi: 22.58, category: 'normal', createdAt: d('2025-11-15'), updatedAt: d('2025-11-15') },
  { _id: oid(), userId: user9Id, height: 163, weight: 57, bmi: 21.45, category: 'normal', createdAt: d('2026-02-01'), updatedAt: d('2026-02-01') },
  // Bangalore — Nikhil (overweight)
  { _id: oid(), userId: user10Id, height: 177, weight: 85, bmi: 27.14, category: 'overweight', createdAt: d('2026-01-10'), updatedAt: d('2026-01-10') },
];

await db.collection('bmirecords').insertMany(bmiRecords);
console.log(`  BMI Records: ${bmiRecords.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DIET PLANS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const diet1Id = oid(); const diet2Id = oid();
const diet3Id = oid(); const diet4Id = oid();
const diet5Id = oid(); const diet6Id = oid();

const dietPlans = [
  // ── Delhi (Rahul) ──
  {
    _id: diet1Id,
    title: 'Lean Muscle Gain Plan',
    description: 'High-protein, moderate-carb plan for lean muscle gain with clean bulking.',
    slug: 'lean-muscle-gain-plan',
    category: 'muscle-gain', dietType: 'non-veg',
    meals: [
      { name: 'Breakfast', time: '7:30 AM', items: [
        { name: 'Scrambled Eggs', quantity: '3 eggs', calories: 210, protein: 18, carbs: 2, fat: 15 },
        { name: 'Avocado Toast', quantity: '2 slices', calories: 280, protein: 8, carbs: 24, fat: 16 },
        { name: 'Black Coffee', quantity: '1 cup', calories: 5, protein: 0, carbs: 1, fat: 0 },
      ]},
      { name: 'Mid-Morning', time: '10:30 AM', items: [
        { name: 'Whey Protein Shake', quantity: '1 scoop', calories: 120, protein: 24, carbs: 3, fat: 1 },
        { name: 'Banana', quantity: '1 large', calories: 105, protein: 1, carbs: 27, fat: 0 },
      ]},
      { name: 'Lunch', time: '1:00 PM', items: [
        { name: 'Grilled Chicken Breast', quantity: '200g', calories: 330, protein: 62, carbs: 0, fat: 7 },
        { name: 'Brown Rice', quantity: '150g cooked', calories: 165, protein: 4, carbs: 34, fat: 1 },
        { name: 'Steamed Broccoli', quantity: '200g', calories: 70, protein: 6, carbs: 14, fat: 1 },
      ]},
      { name: 'Pre-Workout', time: '4:30 PM', items: [
        { name: 'Peanut Butter', quantity: '2 tbsp', calories: 190, protein: 8, carbs: 6, fat: 16 },
        { name: 'Rice Cakes', quantity: '4 pieces', calories: 140, protein: 2, carbs: 30, fat: 1 },
      ]},
      { name: 'Dinner', time: '8:00 PM', items: [
        { name: 'Salmon Fillet', quantity: '180g', calories: 350, protein: 38, carbs: 0, fat: 22 },
        { name: 'Quinoa', quantity: '100g cooked', calories: 120, protein: 4, carbs: 21, fat: 2 },
        { name: 'Mixed Salad', quantity: '1 bowl', calories: 80, protein: 3, carbs: 10, fat: 4 },
      ]},
    ],
    image: 'https://images.unsplash.com/photo-1559058789-672da06263d8?w=800',
    totalCalories: 2165, createdBy: admin1Id, isPublished: true,
    followers: [user1Id, user2Id, user8Id], followersCount: 3,
    likes: [user1Id, user2Id, user5Id, user8Id], likesCount: 4,
    tags: ['muscle-gain', 'high-protein', 'lean-bulk', 'non-veg'],
    createdAt: d('2026-01-10'), updatedAt: d('2026-01-10'),
  },
  {
    _id: diet2Id,
    title: 'Muscle Gain High Protein Plan',
    description: 'Caloric surplus plan with 2g protein per kg bodyweight for maximum muscle growth.',
    slug: 'muscle-gain-high-protein-plan',
    category: 'muscle-gain', dietType: 'non-veg',
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
    totalCalories: 2882, createdBy: admin1Id, isPublished: true,
    followers: [user1Id, user2Id, user4Id, user8Id], followersCount: 4,
    likes: [user1Id, user2Id, user4Id], likesCount: 3,
    tags: ['muscle-gain', 'high-protein', 'bulking', 'strength'],
    createdAt: d('2026-01-20'), updatedAt: d('2026-01-20'),
  },
  // ── Mumbai (Priya) ──
  {
    _id: diet3Id,
    title: 'Weight Loss Veg Plan',
    description: 'Plant-based calorie-deficit plan rich in fiber for sustainable weight loss.',
    slug: 'weight-loss-veg-plan',
    category: 'weight-loss', dietType: 'veg',
    meals: [
      { name: 'Breakfast', time: '8:00 AM', items: [
        { name: 'Overnight Oats with Chia', quantity: '1 bowl', calories: 280, protein: 10, carbs: 42, fat: 8 },
        { name: 'Mixed Berries', quantity: '100g', calories: 50, protein: 1, carbs: 12, fat: 0 },
        { name: 'Green Tea', quantity: '1 cup', calories: 2, protein: 0, carbs: 0, fat: 0 },
      ]},
      { name: 'Lunch', time: '12:30 PM', items: [
        { name: 'Quinoa Buddha Bowl', quantity: '1 bowl', calories: 380, protein: 15, carbs: 52, fat: 12 },
        { name: 'Cucumber Raita', quantity: '1/2 cup', calories: 60, protein: 3, carbs: 7, fat: 2 },
      ]},
      { name: 'Snack', time: '4:00 PM', items: [
        { name: 'Apple', quantity: '1 medium', calories: 95, protein: 0, carbs: 25, fat: 0 },
        { name: 'Almonds', quantity: '15 pieces', calories: 104, protein: 4, carbs: 4, fat: 9 },
      ]},
      { name: 'Dinner', time: '7:00 PM', items: [
        { name: 'Masoor Dal', quantity: '1 cup cooked', calories: 230, protein: 18, carbs: 40, fat: 1 },
        { name: 'Whole Wheat Roti', quantity: '2', calories: 240, protein: 8, carbs: 44, fat: 6 },
        { name: 'Sabzi (seasonal)', quantity: '1 cup', calories: 80, protein: 3, carbs: 12, fat: 3 },
      ]},
    ],
    image: 'https://images.unsplash.com/photo-1599020792689-9fde458e7e17?w=800',
    totalCalories: 1521, createdBy: admin2Id, isPublished: true,
    followers: [user5Id, user7Id, user9Id], followersCount: 3,
    likes: [user5Id, user7Id, user1Id, user9Id], likesCount: 4,
    tags: ['weight-loss', 'veg', 'plant-based', 'calorie-deficit'],
    createdAt: d('2026-01-15'), updatedAt: d('2026-01-15'),
  },
  {
    _id: diet4Id,
    title: 'Cutting Plan — Shred Season',
    description: 'Low-calorie, high-protein cutting plan to preserve muscle while burning fat.',
    slug: 'cutting-plan-shred-season',
    category: 'cutting', dietType: 'both',
    meals: [
      { name: 'Breakfast', time: '7:30 AM', items: [
        { name: 'Egg Whites', quantity: '5', calories: 85, protein: 18, carbs: 1, fat: 0 },
        { name: 'Whole Wheat Toast', quantity: '1 slice', calories: 80, protein: 3, carbs: 15, fat: 1 },
        { name: 'Black Coffee', quantity: '1 cup', calories: 5, protein: 0, carbs: 1, fat: 0 },
      ]},
      { name: 'Lunch', time: '1:00 PM', items: [
        { name: 'Grilled Chicken / Tofu', quantity: '150g', calories: 248, protein: 46, carbs: 0, fat: 5 },
        { name: 'Mixed Green Salad', quantity: '2 cups', calories: 40, protein: 2, carbs: 8, fat: 0 },
        { name: 'Sweet Potato', quantity: '100g baked', calories: 86, protein: 2, carbs: 20, fat: 0 },
      ]},
      { name: 'Snack', time: '4:00 PM', items: [
        { name: 'Greek Yogurt', quantity: '150g', calories: 100, protein: 17, carbs: 6, fat: 0 },
      ]},
      { name: 'Dinner', time: '7:30 PM', items: [
        { name: 'Fish / Paneer', quantity: '150g', calories: 200, protein: 30, carbs: 2, fat: 8 },
        { name: 'Steamed Vegetables', quantity: '250g', calories: 80, protein: 5, carbs: 16, fat: 1 },
      ]},
    ],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    totalCalories: 924, createdBy: admin2Id, isPublished: true,
    followers: [user2Id, user6Id, user10Id], followersCount: 3,
    likes: [user2Id, user6Id, user1Id], likesCount: 3,
    tags: ['cutting', 'fat-loss', 'shredding', 'low-calorie'],
    createdAt: d('2026-02-01'), updatedAt: d('2026-02-01'),
  },
  // ── Bangalore (Karan) ──
  {
    _id: diet5Id,
    title: 'Yoga & Recovery Veg Plan',
    description: 'Anti-inflammatory, plant-based diet designed to complement yoga practice and promote recovery.',
    slug: 'yoga-recovery-veg-plan',
    category: 'weight-loss', dietType: 'veg',
    meals: [
      { name: 'Morning (Pre-Yoga)', time: '6:30 AM', items: [
        { name: 'Warm Lemon Water', quantity: '1 glass', calories: 5, protein: 0, carbs: 1, fat: 0 },
        { name: 'Soaked Almonds', quantity: '10 pieces', calories: 70, protein: 3, carbs: 2, fat: 6 },
      ]},
      { name: 'Breakfast', time: '8:30 AM', items: [
        { name: 'Moong Dal Chilla', quantity: '3 pieces', calories: 220, protein: 12, carbs: 32, fat: 5 },
        { name: 'Mint Chutney', quantity: '2 tbsp', calories: 20, protein: 1, carbs: 3, fat: 0 },
        { name: 'Herbal Tea', quantity: '1 cup', calories: 10, protein: 0, carbs: 2, fat: 0 },
      ]},
      { name: 'Lunch', time: '12:30 PM', items: [
        { name: 'Brown Rice Khichdi', quantity: '1 bowl', calories: 280, protein: 10, carbs: 50, fat: 4 },
        { name: 'Mixed Sabzi', quantity: '1 cup', calories: 90, protein: 3, carbs: 14, fat: 3 },
        { name: 'Curd', quantity: '1 cup', calories: 100, protein: 8, carbs: 8, fat: 4 },
      ]},
      { name: 'Evening', time: '5:00 PM', items: [
        { name: 'Fresh Fruit Bowl', quantity: '1 bowl', calories: 120, protein: 2, carbs: 28, fat: 0 },
        { name: 'Green Tea', quantity: '1 cup', calories: 2, protein: 0, carbs: 0, fat: 0 },
      ]},
      { name: 'Dinner', time: '7:30 PM', items: [
        { name: 'Tofu Stir Fry', quantity: '200g', calories: 220, protein: 18, carbs: 10, fat: 12 },
        { name: 'Whole Wheat Roti', quantity: '2', calories: 240, protein: 8, carbs: 44, fat: 6 },
      ]},
    ],
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    totalCalories: 1377, createdBy: admin3Id, isPublished: true,
    followers: [user9Id, user7Id, user5Id], followersCount: 3,
    likes: [user9Id, user7Id, user3Id], likesCount: 3,
    tags: ['yoga', 'recovery', 'veg', 'anti-inflammatory', 'weight-loss'],
    createdAt: d('2026-01-25'), updatedAt: d('2026-01-25'),
  },
  {
    _id: diet6Id,
    title: 'Vegan Muscle Builder',
    description: 'Complete plant-based bulking plan with sufficient protein from legumes, tempeh, and tofu.',
    slug: 'vegan-muscle-builder',
    category: 'muscle-gain', dietType: 'veg',
    meals: [
      { name: 'Breakfast', time: '7:30 AM', items: [
        { name: 'Soy Protein Shake', quantity: '2 scoops', calories: 200, protein: 40, carbs: 8, fat: 2 },
        { name: 'Oatmeal with Berries', quantity: '1 bowl', calories: 320, protein: 8, carbs: 55, fat: 6 },
        { name: 'Flaxseed', quantity: '1 tbsp', calories: 55, protein: 2, carbs: 3, fat: 4 },
      ]},
      { name: 'Lunch', time: '1:00 PM', items: [
        { name: 'Tempeh Stir Fry', quantity: '200g', calories: 380, protein: 34, carbs: 18, fat: 18 },
        { name: 'Brown Rice', quantity: '150g cooked', calories: 165, protein: 4, carbs: 34, fat: 1 },
        { name: 'Edamame', quantity: '100g', calories: 120, protein: 11, carbs: 10, fat: 5 },
      ]},
      { name: 'Snack', time: '4:00 PM', items: [
        { name: 'Peanut Butter', quantity: '2 tbsp', calories: 190, protein: 8, carbs: 6, fat: 16 },
        { name: 'Whole Wheat Bread', quantity: '2 slices', calories: 160, protein: 6, carbs: 28, fat: 2 },
      ]},
      { name: 'Dinner', time: '8:00 PM', items: [
        { name: 'Chana Dal + Tofu Curry', quantity: '1 bowl', calories: 350, protein: 26, carbs: 38, fat: 10 },
        { name: 'Roti', quantity: '3', calories: 360, protein: 12, carbs: 66, fat: 9 },
      ]},
    ],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    totalCalories: 2300, createdBy: admin3Id, isPublished: true,
    followers: [user8Id, user10Id, user4Id], followersCount: 3,
    likes: [user8Id, user10Id], likesCount: 2,
    tags: ['vegan', 'muscle-gain', 'plant-based', 'bulking'],
    createdAt: d('2026-02-05'), updatedAt: d('2026-02-05'),
  },
];

await db.collection('dietplans').insertMany(dietPlans);
console.log(`  Diet Plans: ${dietPlans.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  WORKOUTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const workouts = [
  // ── Delhi (Rahul) ──
  {
    _id: oid(),
    title: 'Full Body Strength — Beginner',
    description: 'A complete beginner-friendly strength workout covering all major muscle groups. Perfect for those new to the gym.',
    category: 'strength', difficulty: 'beginner', duration: 45, caloriesBurn: 280,
    exercises: [
      { name: 'Goblet Squat', sets: 3, reps: 12, weight: 10, restTime: 60, notes: 'Keep chest up' },
      { name: 'Dumbbell Chest Press', sets: 3, reps: 12, weight: 10, restTime: 60 },
      { name: 'Lat Pulldown', sets: 3, reps: 12, weight: 25, restTime: 60 },
      { name: 'Dumbbell Shoulder Press', sets: 3, reps: 10, weight: 8, restTime: 60 },
      { name: 'Plank', sets: 3, reps: null, duration: 30, restTime: 45, notes: 'Keep hips level' },
    ],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    createdBy: admin1Id, isPublished: true,
    tags: ['beginner', 'full-body', 'strength', 'dumbbell'],
    createdAt: d('2026-01-10'), updatedAt: d('2026-01-10'),
  },
  {
    _id: oid(),
    title: 'Push Day — Chest, Shoulders & Triceps',
    description: 'Classic push day targeting chest, anterior deltoids, and triceps with progressive overload.',
    category: 'strength', difficulty: 'intermediate', duration: 60, caloriesBurn: 380,
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: 8, weight: 80, restTime: 90, notes: 'Retract scapula' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: 24, restTime: 75 },
      { name: 'Cable Fly', sets: 3, reps: 15, weight: 10, restTime: 60 },
      { name: 'Overhead Press', sets: 4, reps: 8, weight: 50, restTime: 90 },
      { name: 'Lateral Raises', sets: 3, reps: 15, weight: 8, restTime: 60 },
      { name: 'Tricep Pushdown', sets: 3, reps: 12, weight: 20, restTime: 60 },
      { name: 'Skull Crushers', sets: 3, reps: 10, weight: 30, restTime: 60 },
    ],
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800',
    createdBy: admin1Id, isPublished: true,
    tags: ['push', 'chest', 'shoulders', 'triceps', 'intermediate'],
    createdAt: d('2026-01-15'), updatedAt: d('2026-01-15'),
  },
  {
    _id: oid(),
    title: 'Pull Day — Back & Biceps',
    description: 'Comprehensive back and bicep workout focusing on vertical and horizontal pulls.',
    category: 'strength', difficulty: 'intermediate', duration: 55, caloriesBurn: 360,
    exercises: [
      { name: 'Deadlift', sets: 4, reps: 5, weight: 120, restTime: 120, notes: 'Brace core, hip hinge' },
      { name: 'Pull-Ups', sets: 3, reps: 8, restTime: 90 },
      { name: 'Barbell Row', sets: 3, reps: 10, weight: 70, restTime: 90 },
      { name: 'Cable Row', sets: 3, reps: 12, weight: 55, restTime: 60 },
      { name: 'Face Pull', sets: 3, reps: 15, weight: 20, restTime: 60, notes: 'Good for rear delts' },
      { name: 'Barbell Curl', sets: 3, reps: 10, weight: 35, restTime: 60 },
      { name: 'Hammer Curl', sets: 3, reps: 12, weight: 14, restTime: 60 },
    ],
    image: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800',
    createdBy: admin1Id, isPublished: true,
    tags: ['pull', 'back', 'biceps', 'deadlift', 'intermediate'],
    createdAt: d('2026-01-20'), updatedAt: d('2026-01-20'),
  },
  // ── Mumbai (Priya) ──
  {
    _id: oid(),
    title: 'HIIT Cardio Blast — 20 Minutes',
    description: 'High-intensity interval training for maximum calorie burn in minimal time. No equipment needed.',
    category: 'hiit', difficulty: 'intermediate', duration: 20, caloriesBurn: 300,
    exercises: [
      { name: 'Jump Squats', sets: 4, reps: 15, restTime: 30, notes: '40s on / 20s off' },
      { name: 'Burpees', sets: 4, reps: 10, restTime: 30 },
      { name: 'Mountain Climbers', sets: 4, reps: null, duration: 40, restTime: 20 },
      { name: 'High Knees', sets: 4, reps: null, duration: 40, restTime: 20 },
      { name: 'Jump Lunges', sets: 4, reps: 12, restTime: 30 },
    ],
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800',
    createdBy: admin2Id, isPublished: true,
    tags: ['hiit', 'cardio', 'fat-burn', 'no-equipment', 'intermediate'],
    createdAt: d('2026-01-12'), updatedAt: d('2026-01-12'),
  },
  {
    _id: oid(),
    title: 'Morning Yoga Flow — 30 Minutes',
    description: 'Gentle morning yoga sequence to improve flexibility, reduce stress and energize your day.',
    category: 'yoga', difficulty: 'beginner', duration: 30, caloriesBurn: 120,
    exercises: [
      { name: 'Child\'s Pose', sets: 1, reps: null, duration: 60, notes: 'Focus on breath' },
      { name: 'Cat-Cow Stretch', sets: 3, reps: 10, notes: 'Sync with breath' },
      { name: 'Downward Dog', sets: 3, reps: null, duration: 45 },
      { name: 'Warrior I', sets: 2, reps: null, duration: 45, notes: 'Each side' },
      { name: 'Warrior II', sets: 2, reps: null, duration: 45, notes: 'Each side' },
      { name: 'Seated Forward Fold', sets: 3, reps: null, duration: 60 },
      { name: 'Savasana', sets: 1, reps: null, duration: 300, notes: 'Full relaxation' },
    ],
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    createdBy: admin2Id, isPublished: true,
    tags: ['yoga', 'flexibility', 'morning', 'beginner', 'mindfulness'],
    createdAt: d('2026-01-18'), updatedAt: d('2026-01-18'),
  },
  {
    _id: oid(),
    title: 'CrossFit WOD — Fran',
    description: 'Classic CrossFit benchmark workout. 21-15-9 reps of thrusters and pull-ups for time.',
    category: 'crossfit', difficulty: 'advanced', duration: 15, caloriesBurn: 250,
    exercises: [
      { name: 'Thruster (Barbell)', sets: 3, reps: null, weight: 43, notes: '21-15-9 scheme, for time' },
      { name: 'Pull-Ups (Kipping)', sets: 3, reps: null, notes: '21-15-9 scheme, for time' },
    ],
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800',
    createdBy: admin2Id, isPublished: true,
    tags: ['crossfit', 'wod', 'advanced', 'benchmark', 'fran'],
    createdAt: d('2026-01-25'), updatedAt: d('2026-01-25'),
  },
  // ── Bangalore (Karan) ──
  {
    _id: oid(),
    title: 'Functional Fitness — Full Body',
    description: 'Movement-based workout using compound exercises to build real-world strength and mobility.',
    category: 'strength', difficulty: 'intermediate', duration: 50, caloriesBurn: 340,
    exercises: [
      { name: 'Romanian Deadlift', sets: 4, reps: 8, weight: 60, restTime: 90 },
      { name: 'Dumbbell Step-Ups', sets: 3, reps: 12, weight: 16, restTime: 60, notes: 'Each leg' },
      { name: 'Single-Arm Dumbbell Row', sets: 3, reps: 12, weight: 22, restTime: 60, notes: 'Each arm' },
      { name: 'Push-Ups (Weighted)', sets: 3, reps: 12, weight: 10, restTime: 60 },
      { name: 'Farmer\'s Walk', sets: 3, reps: null, duration: 40, weight: 24, restTime: 60 },
      { name: 'Dead Bug', sets: 3, reps: 10, restTime: 45, notes: 'Core stability' },
    ],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    createdBy: admin3Id, isPublished: true,
    tags: ['functional', 'full-body', 'compound', 'intermediate'],
    createdAt: d('2026-01-22'), updatedAt: d('2026-01-22'),
  },
  {
    _id: oid(),
    title: '21-Day AMRAP Circuit',
    description: 'As Many Rounds As Possible in 21 minutes. High-intensity circuit for serious fat loss.',
    category: 'hiit', difficulty: 'advanced', duration: 30, caloriesBurn: 420,
    exercises: [
      { name: 'Box Jumps', sets: null, reps: 10, notes: 'AMRAP — complete as many rounds as possible' },
      { name: 'Kettlebell Swings', sets: null, reps: 15, weight: 24 },
      { name: 'Push-Ups', sets: null, reps: 10 },
      { name: 'Air Squats', sets: null, reps: 20 },
      { name: 'Toes-to-Bar', sets: null, reps: 8 },
    ],
    image: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=800',
    createdBy: admin3Id, isPublished: true,
    tags: ['amrap', 'circuit', 'hiit', 'advanced', 'fat-loss'],
    createdAt: d('2026-02-01'), updatedAt: d('2026-02-01'),
  },
  {
    _id: oid(),
    title: 'Flexibility & Mobility Flow',
    description: 'Dynamic mobility drills and deep stretching to improve range of motion and prevent injury.',
    category: 'flexibility', difficulty: 'beginner', duration: 40, caloriesBurn: 110,
    exercises: [
      { name: 'Hip Flexor Stretch', sets: 2, reps: null, duration: 60, notes: 'Each side' },
      { name: 'Thoracic Rotation', sets: 3, reps: 10, notes: 'Each side, on all fours' },
      { name: 'World\'s Greatest Stretch', sets: 3, reps: 8, notes: 'Each side' },
      { name: 'Pigeon Pose', sets: 2, reps: null, duration: 90, notes: 'Each side' },
      { name: 'Shoulder CARs', sets: 2, reps: 5, notes: 'Controlled articular rotations' },
      { name: 'Ankle Mobility Drill', sets: 3, reps: 10, notes: 'Knee-to-wall' },
      { name: 'Lying Hamstring Stretch', sets: 2, reps: null, duration: 60, notes: 'Each leg with band' },
    ],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    createdBy: admin3Id, isPublished: true,
    tags: ['flexibility', 'mobility', 'stretching', 'recovery', 'beginner'],
    createdAt: d('2026-02-08'), updatedAt: d('2026-02-08'),
  },
];

await db.collection('workouts').insertMany(workouts);
console.log(`  Workouts: ${workouts.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  POSTS & COMMENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const post1Id = oid(); const post2Id = oid(); const post3Id = oid();
const post4Id = oid(); const post5Id = oid(); const post6Id = oid();
const post7Id = oid(); const post8Id = oid();

const posts = [
  // Delhi posts
  { _id: post1Id, author: user1Id, content: 'Just hit a new PR on deadlifts! 180kg x 3 reps. Consistency pays off! #fitness #deadlift #PR', mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800', likes: [user2Id, user5Id, admin1Id, user8Id], likesCount: 4, commentsCount: 2, hashtags: ['fitness', 'deadlift', 'PR'], createdAt: d('2026-02-01'), updatedAt: d('2026-02-01') },
  { _id: post2Id, author: user2Id, content: 'Meal prep Sunday! Chicken, rice and veggies for the whole week. Meal prep is the key to staying on track. #mealprep #nutrition #discipline', mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1587996580981-bd03dde74843?w=800', likes: [user1Id, user3Id, admin1Id], likesCount: 3, commentsCount: 1, hashtags: ['mealprep', 'nutrition', 'discipline'], createdAt: d('2026-02-04'), updatedAt: d('2026-02-04') },
  { _id: post3Id, author: admin1Id, content: 'New batch of premium whey protein just arrived! Limited stock. Use code REAUX20 for 20% off! #supplements #protein', mediaType: 'text', likes: [user1Id, user4Id, user6Id], likesCount: 3, commentsCount: 1, hashtags: ['supplements', 'protein'], createdAt: d('2026-02-03'), updatedAt: d('2026-02-03') },
  { _id: post4Id, author: user3Id, content: 'First week at REAUX Fitness Delhi done! Everyone is so welcoming. Already loving the sauna after workouts 🔥 #newmember #gymlife #delhi', mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', likes: [user1Id, admin1Id, user2Id], likesCount: 3, commentsCount: 1, hashtags: ['newmember', 'gymlife', 'delhi'], createdAt: d('2026-02-08'), updatedAt: d('2026-02-08') },
  // Mumbai posts
  { _id: post5Id, author: user5Id, content: 'Completed my first 5K run in under 25 minutes! 3 months of hard work. #running #cardio #milestone #transformation', mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1758520705390-ccfc66f2b18a?w=800', likes: [user6Id, user7Id, admin2Id, user1Id], likesCount: 4, commentsCount: 2, hashtags: ['running', 'cardio', 'transformation'], createdAt: d('2026-02-02'), updatedAt: d('2026-02-02') },
  { _id: post6Id, author: admin2Id, content: 'Yoga session at REAUX Fitness Mumbai was incredible today! Join us every Saturday 7 AM. #yoga #wellness #reauxfitness #mumbai', mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1552196603-d02485940b9f?w=800', likes: [user5Id, user7Id, user9Id], likesCount: 3, commentsCount: 0, hashtags: ['yoga', 'wellness', 'mumbai'], createdAt: d('2026-02-05'), updatedAt: d('2026-02-05') },
  // Bangalore posts
  { _id: post7Id, author: user8Id, content: 'The AI tracking system at REAUX Bangalore is mind-blowing. It automatically logs my sets and reps! Welcome to the future of fitness 🤖 #tech #fitness #bangalore #smart', mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', likes: [user9Id, user10Id, admin3Id, user1Id, user5Id], likesCount: 5, commentsCount: 2, hashtags: ['tech', 'fitness', 'bangalore', 'smart'], createdAt: d('2026-02-06'), updatedAt: d('2026-02-06') },
  { _id: post8Id, author: admin3Id, content: 'Excited to announce our new Flexibility & Mobility classes starting next Monday at 7 PM! Perfect for all levels. #mobility #yoga #bangalore #reauxfitness', mediaType: 'text', likes: [user8Id, user9Id, user10Id], likesCount: 3, commentsCount: 1, hashtags: ['mobility', 'yoga', 'bangalore'], createdAt: d('2026-02-09'), updatedAt: d('2026-02-09') },
];

const comments = [
  { _id: oid(), postId: post1Id, author: user5Id, content: 'That is insane! What program are you following?', createdAt: d('2026-02-01T10:00:00Z'), updatedAt: d('2026-02-01T10:00:00Z') },
  { _id: oid(), postId: post1Id, author: admin1Id, content: 'Great lift Arjun! Keep pushing those limits 🔥', createdAt: d('2026-02-01T11:00:00Z'), updatedAt: d('2026-02-01T11:00:00Z') },
  { _id: oid(), postId: post2Id, author: user3Id, content: 'Can you share the macros? Looks delicious!', createdAt: d('2026-02-04T12:00:00Z'), updatedAt: d('2026-02-04T12:00:00Z') },
  { _id: oid(), postId: post3Id, author: user2Id, content: 'Just ordered 2 bags! Thanks for the discount code.', createdAt: d('2026-02-03T14:00:00Z'), updatedAt: d('2026-02-03T14:00:00Z') },
  { _id: oid(), postId: post4Id, author: user1Id, content: 'Welcome to the family Riya! Let us know if you need any tips 💪', createdAt: d('2026-02-08T09:00:00Z'), updatedAt: d('2026-02-08T09:00:00Z') },
  { _id: oid(), postId: post5Id, author: user6Id, content: 'Amazing progress Sneha! You inspire me every day!', createdAt: d('2026-02-02T08:00:00Z'), updatedAt: d('2026-02-02T08:00:00Z') },
  { _id: oid(), postId: post5Id, author: admin2Id, content: 'Incredible transformation! See you at the 10K next month 🏃‍♀️', createdAt: d('2026-02-02T09:00:00Z'), updatedAt: d('2026-02-02T09:00:00Z') },
  { _id: oid(), postId: post7Id, author: user10Id, content: 'The tracking is so accurate! It even counted my failed reps lol', createdAt: d('2026-02-06T14:00:00Z'), updatedAt: d('2026-02-06T14:00:00Z') },
  { _id: oid(), postId: post7Id, author: admin3Id, content: 'Glad you love it! We are adding calorie tracking next week 🚀', createdAt: d('2026-02-06T15:00:00Z'), updatedAt: d('2026-02-06T15:00:00Z') },
  { _id: oid(), postId: post8Id, author: user9Id, content: 'Already signed up! Cannot wait for Monday!', createdAt: d('2026-02-09T18:00:00Z'), updatedAt: d('2026-02-09T18:00:00Z') },
];

await db.collection('posts').insertMany(posts);
await db.collection('comments').insertMany(comments);
console.log(`  Posts: ${posts.length} inserted`);
console.log(`  Comments: ${comments.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  REELS & REEL COMMENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const reel1Id = oid(); const reel2Id = oid();
const reel3Id = oid(); const reel4Id = oid();
const reel5Id = oid(); const reel6Id = oid();

const reels = [
  { _id: reel1Id, author: user1Id, videoUrl: 'https://assets.mixkit.co/videos/52317/52317-1080.mp4', caption: '180kg deadlift PR! Hard work pays off. #deadlift #gym #strength', likes: [user2Id, user5Id, admin1Id, user8Id], likesCount: 4, commentsCount: 2, createdAt: d('2026-02-01'), updatedAt: d('2026-02-01') },
  { _id: reel2Id, author: user5Id, videoUrl: 'https://assets.mixkit.co/videos/23056/23056-720.mp4', caption: 'First 5K under 25 min! 3 months of hard work 🏃‍♀️ #running #cardio #milestone', likes: [user6Id, admin2Id, user1Id], likesCount: 3, commentsCount: 1, createdAt: d('2026-02-02'), updatedAt: d('2026-02-02') },
  { _id: reel3Id, author: user2Id, videoUrl: 'https://assets.mixkit.co/videos/45874/45874-720.mp4', caption: 'Bench press form check - 100kg x 5. Any tips? 🏋️‍♂️ #benchpress #formcheck', likes: [user1Id, user4Id], likesCount: 2, commentsCount: 2, createdAt: d('2026-02-03'), updatedAt: d('2026-02-03') },
  { _id: reel4Id, author: admin1Id, videoUrl: 'https://assets.mixkit.co/videos/52112/52112-1080.mp4', caption: 'Quick tour of REAUX Fitness Delhi! State-of-the-art equipment. Come check us out! #gymtour #delhi', likes: [user1Id, user2Id, user3Id, user4Id], likesCount: 4, commentsCount: 1, createdAt: d('2026-02-04'), updatedAt: d('2026-02-04') },
  { _id: reel5Id, author: user8Id, videoUrl: 'https://assets.mixkit.co/videos/52317/52317-1080.mp4', caption: 'Functional fitness is the real deal. Check this farmer\'s walk sequence 💪 #functional #bangalore #gym', likes: [user9Id, user10Id, admin3Id, user1Id], likesCount: 4, commentsCount: 2, createdAt: d('2026-02-06'), updatedAt: d('2026-02-06') },
  { _id: reel6Id, author: user9Id, videoUrl: 'https://assets.mixkit.co/videos/23056/23056-720.mp4', caption: 'Morning yoga at REAUX Bangalore 🧘‍♀️ Best way to start the day! #yoga #morning #bangalore #wellness', likes: [user7Id, user5Id, admin3Id, admin2Id], likesCount: 4, commentsCount: 2, createdAt: d('2026-02-07'), updatedAt: d('2026-02-07') },
];

const reelComments = [
  { _id: oid(), reelId: reel1Id, author: user2Id, content: 'Absolute beast! What is your training split?', createdAt: d('2026-02-01T12:00:00Z'), updatedAt: d('2026-02-01T12:00:00Z') },
  { _id: oid(), reelId: reel1Id, author: admin1Id, content: 'Great form on that pull! Classic Delhi power 💪', createdAt: d('2026-02-01T14:00:00Z'), updatedAt: d('2026-02-01T14:00:00Z') },
  { _id: oid(), reelId: reel2Id, author: user8Id, content: 'Sneha you are an inspiration! I started running after seeing this', createdAt: d('2026-02-02T09:00:00Z'), updatedAt: d('2026-02-02T09:00:00Z') },
  { _id: oid(), reelId: reel3Id, author: user1Id, content: 'Arch your lower back less. Solid lift though bro!', createdAt: d('2026-02-03T10:00:00Z'), updatedAt: d('2026-02-03T10:00:00Z') },
  { _id: oid(), reelId: reel3Id, author: admin1Id, content: 'Good control on the descent! Try pausing at the bottom for 1 second', createdAt: d('2026-02-03T11:00:00Z'), updatedAt: d('2026-02-03T11:00:00Z') },
  { _id: oid(), reelId: reel4Id, author: user5Id, content: 'The gym looks amazing! Wish we had a pool in Mumbai too 😅', createdAt: d('2026-02-04T15:00:00Z'), updatedAt: d('2026-02-04T15:00:00Z') },
  { _id: oid(), reelId: reel5Id, author: user9Id, content: 'Bro the AI tracking got every single rep correct for you!', createdAt: d('2026-02-06T16:00:00Z'), updatedAt: d('2026-02-06T16:00:00Z') },
  { _id: oid(), reelId: reel5Id, author: admin3Id, content: 'Great execution Aditya! Perfect grip width on the farmers walk', createdAt: d('2026-02-06T17:00:00Z'), updatedAt: d('2026-02-06T17:00:00Z') },
  { _id: oid(), reelId: reel6Id, author: user5Id, content: 'This is goals! The Bangalore studio looks so peaceful 🙏', createdAt: d('2026-02-07T08:00:00Z'), updatedAt: d('2026-02-07T08:00:00Z') },
  { _id: oid(), reelId: reel6Id, author: admin2Id, content: 'We need to add yoga classes to Mumbai too! Priya taking notes 😄', createdAt: d('2026-02-07T09:00:00Z'), updatedAt: d('2026-02-07T09:00:00Z') },
];

await db.collection('reels').insertMany(reels);
await db.collection('reelcomments').insertMany(reelComments);
console.log(`  Reels: ${reels.length} inserted`);
console.log(`  Reel Comments: ${reelComments.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PRODUCTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const prod1Id = oid(); const prod2Id = oid(); const prod3Id = oid();
const prod4Id = oid(); const prod5Id = oid(); const prod6Id = oid();

const products = [
  { _id: prod1Id, name: 'REAUX Whey Protein Isolate 1kg', description: 'Premium whey protein isolate with 28g protein per scoop. Zero added sugar.', price: 2499, compareAtPrice: 2999, images: ['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800'], category: 'supplements', stock: 120, isActive: true, createdBy: admin1Id, createdAt: now, updatedAt: now },
  { _id: prod2Id, name: 'BCAA Powder 300g - Berry Blast', description: 'Branch chain amino acids (2:1:1 ratio) for improved recovery and endurance.', price: 999, compareAtPrice: 1299, images: ['https://images.unsplash.com/photo-1704650311140-aba27da8623d?w=800'], category: 'supplements', stock: 80, isActive: true, createdBy: admin1Id, createdAt: now, updatedAt: now },
  { _id: prod3Id, name: 'Premium Resistance Bands Set', description: 'Set of 5 latex resistance bands with different resistance levels.', price: 799, compareAtPrice: 1199, images: ['https://images.unsplash.com/photo-1518609571773-39b7d303a87b?w=800'], category: 'equipment', stock: 45, isActive: true, createdBy: admin2Id, createdAt: now, updatedAt: now },
  { _id: prod4Id, name: 'REAUX Gym Stringer Tank Top', description: 'Breathable cotton-blend stringer with REAUX branding. Perfect for intense workouts.', price: 599, compareAtPrice: null, images: ['https://images.unsplash.com/photo-1522844831948-ec9400db7659?w=800'], category: 'apparel', stock: 200, isActive: true, createdBy: admin1Id, createdAt: now, updatedAt: now },
  { _id: prod5Id, name: 'Creatine Monohydrate 250g', description: 'Pure micronized creatine monohydrate. 5g per serving. Unflavored.', price: 649, compareAtPrice: 899, images: ['https://images.unsplash.com/photo-1704650311298-4d6915d34c64?w=800'], category: 'supplements', stock: 95, isActive: true, createdBy: admin1Id, createdAt: now, updatedAt: now },
  { _id: prod6Id, name: 'REAUX Shaker Bottle 700ml', description: 'BPA-free shaker bottle with wire whisk ball. Leak-proof lid.', price: 349, compareAtPrice: 499, images: ['https://images.unsplash.com/photo-1553531580-8f1950e53700?w=800'], category: 'accessories', stock: 300, isActive: true, createdBy: admin2Id, createdAt: now, updatedAt: now },
];

await db.collection('products').insertMany(products);
console.log(`  Products: ${products.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CARTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const carts = [
  { _id: oid(), userId: user1Id, items: [{ product: prod1Id, quantity: 1 }, { product: prod5Id, quantity: 2 }], createdAt: now, updatedAt: now },
  { _id: oid(), userId: user2Id, items: [{ product: prod4Id, quantity: 3 }, { product: prod6Id, quantity: 1 }], createdAt: now, updatedAt: now },
  { _id: oid(), userId: user6Id, items: [{ product: prod1Id, quantity: 1 }, { product: prod2Id, quantity: 1 }], createdAt: now, updatedAt: now },
  { _id: oid(), userId: user8Id, items: [{ product: prod3Id, quantity: 1 }], createdAt: now, updatedAt: now },
];

await db.collection('carts').insertMany(carts);
console.log(`  Carts: ${carts.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PROMO CODES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const promoCodes = [
  { _id: oid(), code: 'REAUX20', discountType: 'percentage', discountValue: 20, minOrderAmount: 999, maxDiscount: 500, usageLimit: 200, usedCount: 12, validFrom: d('2026-01-01'), validUntil: d('2026-06-30'), isActive: true, createdBy: superAdminId, createdAt: now, updatedAt: now },
  { _id: oid(), code: 'FLAT200', discountType: 'fixed', discountValue: 200, minOrderAmount: 1500, maxDiscount: null, usageLimit: 100, usedCount: 5, validFrom: d('2026-02-01'), validUntil: d('2026-03-31'), isActive: true, createdBy: superAdminId, createdAt: now, updatedAt: now },
  { _id: oid(), code: 'WELCOME50', discountType: 'percentage', discountValue: 50, minOrderAmount: 0, maxDiscount: 300, usageLimit: 500, usedCount: 45, validFrom: d('2026-01-01'), validUntil: d('2026-12-31'), isActive: true, createdBy: superAdminId, createdAt: now, updatedAt: now },
];

await db.collection('promocodes').insertMany(promoCodes);
console.log(`  Promo Codes: ${promoCodes.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ORDERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const orders = [
  { _id: oid(), userId: user5Id, items: [{ product: prod1Id, name: 'REAUX Whey Protein Isolate 1kg', price: 2499, quantity: 1 }, { product: prod6Id, name: 'REAUX Shaker Bottle 700ml', price: 349, quantity: 1 }], totalAmount: 2848, discount: 300, finalAmount: 2548, promoCode: 'WELCOME50', status: 'delivered', shippingAddress: { street: '22 Park Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', phone: '9876543214' }, createdAt: d('2026-01-20'), updatedAt: d('2026-01-25') },
  { _id: oid(), userId: user1Id, items: [{ product: prod2Id, name: 'BCAA Powder 300g', price: 999, quantity: 2 }, { product: prod5Id, name: 'Creatine Monohydrate 250g', price: 649, quantity: 1 }], totalAmount: 2647, discount: 500, finalAmount: 2147, promoCode: 'REAUX20', status: 'shipped', shippingAddress: { street: '10 Sector 18', city: 'Delhi', state: 'Delhi', pincode: '110001', phone: '9876543213' }, createdAt: d('2026-02-01'), updatedAt: d('2026-02-03') },
  { _id: oid(), userId: user2Id, items: [{ product: prod3Id, name: 'Premium Resistance Bands Set', price: 799, quantity: 1 }, { product: prod4Id, name: 'REAUX Gym Stringer Tank Top', price: 599, quantity: 2 }], totalAmount: 1997, discount: 200, finalAmount: 1797, promoCode: 'FLAT200', status: 'confirmed', shippingAddress: { street: '55 Sector 9', city: 'Delhi', state: 'Delhi', pincode: '110045', phone: '9876543215' }, createdAt: d('2026-02-04'), updatedAt: d('2026-02-04') },
  { _id: oid(), userId: user5Id, items: [{ product: prod5Id, name: 'Creatine Monohydrate 250g', price: 649, quantity: 1 }], totalAmount: 649, discount: 0, finalAmount: 649, promoCode: null, status: 'pending', shippingAddress: { street: '22 Park Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', phone: '9876543214' }, createdAt: d('2026-02-05'), updatedAt: d('2026-02-05') },
  { _id: oid(), userId: user6Id, items: [{ product: prod1Id, name: 'REAUX Whey Protein Isolate 1kg', price: 2499, quantity: 1 }], totalAmount: 2499, discount: 0, finalAmount: 2499, promoCode: null, status: 'delivered', shippingAddress: { street: '5 Bandra West', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', phone: '9876543220' }, createdAt: d('2025-12-15'), updatedAt: d('2025-12-20') },
  { _id: oid(), userId: user8Id, items: [{ product: prod3Id, name: 'Premium Resistance Bands Set', price: 799, quantity: 1 }, { product: prod6Id, name: 'REAUX Shaker Bottle 700ml', price: 349, quantity: 1 }], totalAmount: 1148, discount: 0, finalAmount: 1148, promoCode: null, status: 'delivered', shippingAddress: { street: '78 Koramangala', city: 'Bangalore', state: 'Karnataka', pincode: '560034', phone: '9876543222' }, createdAt: d('2025-11-01'), updatedAt: d('2025-11-06') },
];

await db.collection('orders').insertMany(orders);
console.log(`  Orders: ${orders.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CHALLENGES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const challenges = [
  {
    _id: oid(),
    title: '30-Day 10K Steps Challenge',
    description: 'Walk at least 10,000 steps every day for 30 days. All gyms welcome!',
    type: 'steps', target: 300000,
    startDate: d('2026-02-01'), endDate: d('2026-03-02'),
    participants: [
      { userId: user1Id, progress: 120000, joinedAt: d('2026-02-01') },
      { userId: user5Id, progress: 95000, joinedAt: d('2026-02-01') },
      { userId: user2Id, progress: 140000, joinedAt: d('2026-02-02') },
      { userId: user8Id, progress: 85000, joinedAt: d('2026-02-02') },
      { userId: user9Id, progress: 110000, joinedAt: d('2026-02-03') },
    ],
    createdBy: admin1Id, isActive: true, createdAt: d('2026-01-28'), updatedAt: d('2026-02-09'),
  },
  {
    _id: oid(),
    title: 'February Push-Up Challenge',
    description: 'Complete 3000 push-ups throughout February. About 107 per day. Can you do it?',
    type: 'workout', target: 3000,
    startDate: d('2026-02-01'), endDate: d('2026-02-28'),
    participants: [
      { userId: user1Id, progress: 650, joinedAt: d('2026-02-01') },
      { userId: user2Id, progress: 820, joinedAt: d('2026-02-01') },
      { userId: user6Id, progress: 480, joinedAt: d('2026-02-03') },
      { userId: user10Id, progress: 390, joinedAt: d('2026-02-04') },
    ],
    createdBy: admin2Id, isActive: true, createdAt: d('2026-01-30'), updatedAt: d('2026-02-09'),
  },
  {
    _id: oid(),
    title: '21-Day Yoga Consistency Challenge',
    description: 'Complete at least 20 minutes of yoga every day for 21 days. Mind + body transformation!',
    type: 'workout', target: 21,
    startDate: d('2026-02-10'), endDate: d('2026-03-02'),
    participants: [
      { userId: user9Id, progress: 8, joinedAt: d('2026-02-10') },
      { userId: user7Id, progress: 6, joinedAt: d('2026-02-10') },
      { userId: user5Id, progress: 5, joinedAt: d('2026-02-11') },
      { userId: user3Id, progress: 4, joinedAt: d('2026-02-12') },
    ],
    createdBy: admin3Id, isActive: true, createdAt: d('2026-02-08'), updatedAt: d('2026-02-09'),
  },
];

await db.collection('challenges').insertMany(challenges);
console.log(`  Challenges: ${challenges.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MEMBERSHIP PLANS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Delhi
const plan1Id = oid(); // Basic Monthly ₹1,500
const plan2Id = oid(); // Premium Quarterly ₹3,999
const plan3Id = oid(); // Elite Yearly ₹12,999
// Mumbai
const plan4Id = oid(); // Basic Monthly ₹1,800
const plan5Id = oid(); // Premium Quarterly ₹4,499
const plan6Id = oid(); // Elite Half-Yearly ₹8,999
// Bangalore
const plan7Id = oid(); // Basic Monthly ₹1,600
const plan8Id = oid(); // Premium Quarterly ₹4,299
const plan9Id = oid(); // Elite Half-Yearly ₹6,999

const membershipPlans = [
  // ── Delhi ──
  { _id: plan1Id, name: 'Basic Monthly', gymId: gym1Id, durationDays: 30, price: 1500, features: ['Gym Floor Access', 'Locker Room'], description: 'Basic gym access for 30 days. Ideal for beginners.', isActive: true, createdBy: superAdminId, createdAt: d('2026-01-01'), updatedAt: d('2026-01-01') },
  { _id: plan2Id, name: 'Premium Quarterly', gymId: gym1Id, durationDays: 90, price: 3999, features: ['Gym Floor Access', 'Locker Room', 'Sauna', 'Pool', 'Personal Trainer (2 sessions)'], description: 'Full access to all amenities including pool and sauna for 3 months.', isActive: true, createdBy: superAdminId, createdAt: d('2026-01-01'), updatedAt: d('2026-01-01') },
  { _id: plan3Id, name: 'Elite Yearly', gymId: gym1Id, durationDays: 365, price: 12999, features: ['Gym Floor Access', 'Locker Room', 'Sauna', 'Pool', 'Personal Trainer (unlimited)', 'Nutrition Plan', 'Priority Booking'], description: 'Unlimited yearly access with personal trainer and nutrition guidance.', isActive: true, createdBy: superAdminId, createdAt: d('2026-01-01'), updatedAt: d('2026-01-01') },
  // ── Mumbai ──
  { _id: plan4Id, name: 'Basic Monthly', gymId: gym2Id, durationDays: 30, price: 1800, features: ['Gym Floor Access', 'Locker Room'], description: 'Basic gym access for 30 days.', isActive: true, createdBy: superAdminId, createdAt: d('2026-01-05'), updatedAt: d('2026-01-05') },
  { _id: plan5Id, name: 'Premium Quarterly', gymId: gym2Id, durationDays: 90, price: 4499, features: ['Gym Floor Access', 'Locker Room', 'Steam Room', 'CrossFit', 'Personal Trainer (4 sessions)'], description: 'Full access including CrossFit and steam room for 3 months.', isActive: true, createdBy: superAdminId, createdAt: d('2026-01-05'), updatedAt: d('2026-01-05') },
  { _id: plan6Id, name: 'Elite Half-Yearly', gymId: gym2Id, durationDays: 180, price: 8999, features: ['Gym Floor Access', 'Locker Room', 'Steam Room', 'CrossFit', 'Personal Trainer (unlimited)', 'Nutrition Consultation'], description: '6-month unlimited access with personal trainer.', isActive: true, createdBy: superAdminId, createdAt: d('2026-01-05'), updatedAt: d('2026-01-05') },
  // ── Bangalore ──
  { _id: plan7Id, name: 'Basic Monthly', gymId: gym3Id, durationDays: 30, price: 1600, features: ['Gym Floor Access', 'Locker Room', 'AI Tracking'], description: 'Basic gym access with smart tracking for 30 days.', isActive: true, createdBy: superAdminId, createdAt: d('2026-01-10'), updatedAt: d('2026-01-10') },
  { _id: plan8Id, name: 'Premium Quarterly', gymId: gym3Id, durationDays: 90, price: 4299, features: ['Gym Floor Access', 'Locker Room', 'Sauna', 'Yoga Studio', 'AI Tracking', 'Personal Trainer (3 sessions)'], description: '3-month premium access with yoga studio and AI tracking.', isActive: true, createdBy: superAdminId, createdAt: d('2026-01-10'), updatedAt: d('2026-01-10') },
  { _id: plan9Id, name: 'Elite Half-Yearly', gymId: gym3Id, durationDays: 180, price: 6999, features: ['Gym Floor Access', 'Locker Room', 'Sauna', 'Yoga Studio', 'AI Tracking', 'Personal Trainer (unlimited)', 'Nutrition Plan'], description: '6-month elite access with full AI-powered fitness coaching.', isActive: true, createdBy: superAdminId, createdAt: d('2026-01-10'), updatedAt: d('2026-01-10') },
];

await db.collection('membershipplans').insertMany(membershipPlans);
console.log(`  Membership Plans: ${membershipPlans.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  USER MEMBERSHIPS — comprehensive fee scenarios
//
//  Scenarios covered:
//  1.  Fully paid — no balance
//  2.  Dues pending — partial payment
//  3.  Advance credit — overpaid
//  4.  Expiring soon — upcoming renewal (within 30 days)
//  5.  Expired (no dues)
//  6.  Expired (dues still owed)
//  7.  Cancelled (with outstanding dues)
//  8.  Multiple installments — cleared over time
//  9.  Credit applied to dues — credit reduced
//  10. Fees adjusted down by admin
//  11. Negative amount recorded (refund/deduction)
//  12. Zero-payment assignment — all fees still due
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const userMemberships = [
  // ── DELHI (gym1) ──────────────────────────────────────────────────

  {
    // 1. Arjun — Elite Yearly — FULLY PAID (single payment at joining)
    _id: oid(), userId: user1Id, planId: plan3Id, gymId: gym1Id,
    startDate: d('2026-01-15'), endDate: d('2027-01-15'),
    status: 'active', assignedBy: admin1Id,
    feesAmount: 12999, feesPaid: 12999, feesDue: 0, advanceCredit: 0,
    lastPaymentDate: d('2026-01-15'),
    paymentHistory: [
      { amount: 12999, date: d('2026-01-15'), note: 'Full payment at joining' },
    ],
    createdAt: d('2026-01-15'), updatedAt: d('2026-01-15'),
  },

  {
    // 2. Vikram — Basic Monthly — EXPIRED (old, fully paid)
    _id: oid(), userId: user2Id, planId: plan1Id, gymId: gym1Id,
    startDate: d('2025-12-01'), endDate: d('2025-12-31'),
    status: 'expired', assignedBy: admin1Id,
    feesAmount: 1500, feesPaid: 1500, feesDue: 0, advanceCredit: 0,
    lastPaymentDate: d('2025-12-01'),
    paymentHistory: [{ amount: 1500, date: d('2025-12-01'), note: 'Full payment' }],
    createdAt: d('2025-12-01'), updatedAt: d('2025-12-31'),
  },

  {
    // 3. Vikram — Premium Quarterly — ADVANCE CREDIT (overpaid by ₹1,001)
    _id: oid(), userId: user2Id, planId: plan2Id, gymId: gym1Id,
    startDate: d('2026-01-10'), endDate: d('2026-04-10'),
    status: 'active', assignedBy: admin1Id,
    feesAmount: 3999, feesPaid: 5000, feesDue: 0, advanceCredit: 1001,
    lastPaymentDate: d('2026-01-20'),
    paymentHistory: [
      { amount: 4000, date: d('2026-01-10'), note: 'Initial payment' },
      { amount: 1000, date: d('2026-01-20'), note: 'Additional top-up — ₹1001 advance credit banked' },
    ],
    createdAt: d('2026-01-10'), updatedAt: d('2026-01-20'),
  },

  {
    // 4. Riya — Basic Monthly — EXPIRING SOON (within 30 days) with ₹500 dues
    _id: oid(), userId: user3Id, planId: plan1Id, gymId: gym1Id,
    startDate: d('2026-02-20'), endDate: d('2026-03-22'),
    status: 'active', assignedBy: admin1Id,
    feesAmount: 1500, feesPaid: 1000, feesDue: 500, advanceCredit: 0,
    lastPaymentDate: d('2026-02-20'),
    paymentHistory: [{ amount: 1000, date: d('2026-02-20'), note: 'Partial payment at joining — ₹500 pending' }],
    createdAt: d('2026-02-20'), updatedAt: d('2026-02-20'),
  },

  {
    // 5. Manish — Premium Quarterly — MULTIPLE INSTALLMENTS fully cleared
    _id: oid(), userId: user4Id, planId: plan2Id, gymId: gym1Id,
    startDate: d('2026-02-15'), endDate: d('2026-05-16'),
    status: 'active', assignedBy: admin1Id,
    feesAmount: 3999, feesPaid: 3999, feesDue: 0, advanceCredit: 0,
    lastPaymentDate: d('2026-03-01'),
    paymentHistory: [
      { amount: 1500, date: d('2026-02-15'), note: 'First installment' },
      { amount: 1500, date: d('2026-02-22'), note: 'Second installment' },
      { amount: 999, date: d('2026-03-01'), note: 'Final installment — fully cleared' },
    ],
    createdAt: d('2026-02-15'), updatedAt: d('2026-03-01'),
  },

  {
    // 6. Manish — old Basic Monthly — CANCELLED WITH OUTSTANDING DUES (₹800 still owed)
    _id: oid(), userId: user4Id, planId: plan1Id, gymId: gym1Id,
    startDate: d('2025-10-01'), endDate: d('2025-10-31'),
    status: 'cancelled', assignedBy: admin1Id,
    feesAmount: 1500, feesPaid: 700, feesDue: 800, advanceCredit: 0,
    lastPaymentDate: d('2025-10-01'),
    paymentHistory: [
      { amount: 700, date: d('2025-10-01'), note: 'Partial payment' },
      { amount: 0, date: d('2025-10-25'), note: '[Adjustment] Membership cancelled — ₹800 dues waived pending review' },
    ],
    createdAt: d('2025-10-01'), updatedAt: d('2025-10-25'),
  },

  // ── MUMBAI (gym2) ──────────────────────────────────────────────────

  {
    // 7. Sneha — Premium Quarterly — DUES PENDING (₹2,499 due, multiple payments recorded)
    _id: oid(), userId: user5Id, planId: plan5Id, gymId: gym2Id,
    startDate: d('2026-01-20'), endDate: d('2026-04-20'),
    status: 'active', assignedBy: admin2Id,
    feesAmount: 4499, feesPaid: 2000, feesDue: 2499, advanceCredit: 0,
    lastPaymentDate: d('2026-02-15'),
    paymentHistory: [
      { amount: 1500, date: d('2026-01-20'), note: 'Joining payment' },
      { amount: 500, date: d('2026-02-15'), note: 'Second payment — ₹2499 still due' },
    ],
    createdAt: d('2026-01-20'), updatedAt: d('2026-02-15'),
  },

  {
    // 8. Rohan — Elite Half-Yearly — EXPIRING SOON (ends 2026-03-31) + FULLY PAID
    _id: oid(), userId: user6Id, planId: plan6Id, gymId: gym2Id,
    startDate: d('2025-10-01'), endDate: d('2026-03-31'),
    status: 'active', assignedBy: admin2Id,
    feesAmount: 8999, feesPaid: 8999, feesDue: 0, advanceCredit: 0,
    lastPaymentDate: d('2025-10-15'),
    paymentHistory: [
      { amount: 5000, date: d('2025-10-01'), note: 'First installment' },
      { amount: 3999, date: d('2025-10-15'), note: 'Final installment — cleared' },
    ],
    createdAt: d('2025-10-01'), updatedAt: d('2025-10-15'),
  },

  {
    // 9. Kavya — Basic Monthly — CREDIT APPLIED TO DUES scenario
    //    Had ₹500 advance credit from previous overpayment; ₹300 was applied to reduce dues
    _id: oid(), userId: user7Id, planId: plan4Id, gymId: gym2Id,
    startDate: d('2026-03-01'), endDate: d('2026-03-31'),
    status: 'active', assignedBy: admin2Id,
    feesAmount: 1800, feesPaid: 1500, feesDue: 300, advanceCredit: 0,
    lastPaymentDate: d('2026-03-05'),
    paymentHistory: [
      { amount: 1200, date: d('2026-03-01'), note: 'Initial payment at joining' },
      { amount: 300, date: d('2026-03-05'), note: 'Applied ₹300 from advance credit to dues' },
    ],
    createdAt: d('2026-03-01'), updatedAt: d('2026-03-05'),
  },

  {
    // 10. Kavya — old Basic Monthly — NEGATIVE AMOUNT RECORDED (refund scenario)
    //     Admin recorded -₹500 to reverse a duplicate payment
    _id: oid(), userId: user7Id, planId: plan4Id, gymId: gym2Id,
    startDate: d('2026-01-20'), endDate: d('2026-02-19'),
    status: 'expired', assignedBy: admin2Id,
    feesAmount: 1800, feesPaid: 1300, feesDue: 500, advanceCredit: 0,
    lastPaymentDate: d('2026-01-28'),
    paymentHistory: [
      { amount: 1800, date: d('2026-01-20'), note: 'Full payment at joining' },
      { amount: -500, date: d('2026-01-28'), note: 'Refund — duplicate charge reversed' },
    ],
    createdAt: d('2026-01-20'), updatedAt: d('2026-01-28'),
  },

  // ── BANGALORE (gym3) ──────────────────────────────────────────────────

  {
    // 11. Aditya — Premium Quarterly — DUES PENDING (₹1,299 due)
    _id: oid(), userId: user8Id, planId: plan8Id, gymId: gym3Id,
    startDate: d('2026-01-05'), endDate: d('2026-04-05'),
    status: 'active', assignedBy: admin3Id,
    feesAmount: 4299, feesPaid: 3000, feesDue: 1299, advanceCredit: 0,
    lastPaymentDate: d('2026-02-01'),
    paymentHistory: [
      { amount: 2000, date: d('2026-01-05'), note: 'First payment' },
      { amount: 1000, date: d('2026-02-01'), note: 'Second payment — ₹1299 still due' },
    ],
    createdAt: d('2026-01-05'), updatedAt: d('2026-02-01'),
  },

  {
    // 12. Pooja — Basic Monthly — EXPIRED, fully paid (old membership)
    _id: oid(), userId: user9Id, planId: plan7Id, gymId: gym3Id,
    startDate: d('2025-11-01'), endDate: d('2025-12-01'),
    status: 'expired', assignedBy: admin3Id,
    feesAmount: 1600, feesPaid: 1600, feesDue: 0, advanceCredit: 0,
    lastPaymentDate: d('2025-11-01'),
    paymentHistory: [{ amount: 1600, date: d('2025-11-01'), note: 'Full payment' }],
    createdAt: d('2025-11-01'), updatedAt: d('2025-12-01'),
  },

  {
    // 13. Pooja — Premium Quarterly — FEES ADJUSTED DOWN by admin + advance credit
    //     Originally ₹4,299 but admin adjusted down to ₹4,000; she paid ₹4,299 so ₹299 credit
    _id: oid(), userId: user9Id, planId: plan8Id, gymId: gym3Id,
    startDate: d('2026-02-01'), endDate: d('2026-05-02'),
    status: 'active', assignedBy: admin3Id,
    feesAmount: 4000, feesPaid: 4299, feesDue: 0, advanceCredit: 299,
    lastPaymentDate: d('2026-02-10'),
    paymentHistory: [
      { amount: 4299, date: d('2026-02-01'), note: 'Full plan payment' },
      { amount: 0, date: d('2026-02-10'), note: '[Adjustment] Plan fee corrected from ₹4299 to ₹4000 — ₹299 moved to advance credit' },
    ],
    createdAt: d('2026-02-01'), updatedAt: d('2026-02-10'),
  },

  {
    // 14. Nikhil — Elite Half-Yearly — DUES PENDING (₹2,999 due), expiring mid-year
    _id: oid(), userId: user10Id, planId: plan9Id, gymId: gym3Id,
    startDate: d('2026-01-05'), endDate: d('2026-07-05'),
    status: 'active', assignedBy: admin3Id,
    feesAmount: 6999, feesPaid: 4000, feesDue: 2999, advanceCredit: 0,
    lastPaymentDate: d('2026-02-05'),
    paymentHistory: [
      { amount: 3000, date: d('2026-01-05'), note: 'First installment' },
      { amount: 1000, date: d('2026-02-05'), note: 'Second installment — ₹2999 balance remaining' },
    ],
    createdAt: d('2026-01-05'), updatedAt: d('2026-02-05'),
  },

  {
    // 15. Nikhil — Zero-payment assignment — ALL FEES DUE (just assigned, no payment yet)
    _id: oid(), userId: user10Id, planId: plan7Id, gymId: gym3Id,
    startDate: d('2026-03-10'), endDate: d('2026-04-09'),
    status: 'active', assignedBy: admin3Id,
    feesAmount: 1600, feesPaid: 0, feesDue: 1600, advanceCredit: 0,
    lastPaymentDate: null,
    paymentHistory: [],
    createdAt: d('2026-03-10'), updatedAt: d('2026-03-10'),
  },
];

await db.collection('usermemberships').insertMany(userMemberships);
console.log(`  User Memberships: ${userMemberships.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CONTACTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const contacts = [
  { _id: oid(), name: 'Rohit Kapoor', email: 'rohit.kapoor@gmail.com', phone: '9811223344', subject: 'Membership inquiry — Delhi gym', message: 'Hi, I would like to know about the Elite Yearly plan at your Delhi branch. Is there a trial available?', status: 'resolved', createdAt: d('2026-01-25'), updatedAt: d('2026-01-26') },
  { _id: oid(), name: 'Meera Nair', email: 'meera.nair@gmail.com', phone: '9922334455', subject: 'Damaged protein product complaint', message: 'I received a damaged whey protein tub. The seal was broken and the product spilled inside the box.', status: 'open', createdAt: d('2026-02-01'), updatedAt: d('2026-02-01') },
  { _id: oid(), name: 'Sanjay Verma', email: 'sanjay.verma@gmail.com', phone: '9833445566', subject: 'App feedback and PDF export suggestion', message: 'Loving the app so far! Could you add a PDF export for diet plans and workout history? Would be great for coaches.', status: 'open', createdAt: d('2026-02-03'), updatedAt: d('2026-02-03') },
  { _id: oid(), name: 'Deepika Reddy', email: 'deepika.reddy@gmail.com', phone: '9744556677', subject: 'Yoga classes inquiry — Mumbai gym', message: 'Are you running dedicated yoga classes at the Mumbai branch? I saw the reel about it and I am interested in joining.', status: 'resolved', createdAt: d('2026-02-05'), updatedAt: d('2026-02-06') },
  { _id: oid(), name: 'Suresh Kumar', email: 'suresh.kumar@gmail.com', phone: '9655667788', subject: 'Bangalore gym — AI tracking query', message: 'How does the AI tracking system work? Does it require any wearable device or is it camera-based?', status: 'open', createdAt: d('2026-02-07'), updatedAt: d('2026-02-07') },
  { _id: oid(), name: 'Ananya Singh', email: 'ananya.singh@gmail.com', phone: '9566778899', subject: 'Personal trainer availability — Delhi', message: 'I am interested in 1-on-1 personal training sessions at Delhi. Can you connect me with a trainer for fat loss?', status: 'resolved', createdAt: d('2026-02-08'), updatedAt: d('2026-02-09') },
];

await db.collection('contacts').insertMany(contacts);
console.log(`  Contacts: ${contacts.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  NOTIFICATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const notifications = [
  // Delhi
  { _id: oid(), userId: user1Id, title: 'Order Shipped', message: 'Your order of BCAA + Creatine has been shipped! Expected delivery in 2-3 days.', type: 'order', isRead: false, createdAt: d('2026-02-03'), updatedAt: d('2026-02-03') },
  { _id: oid(), userId: user1Id, title: 'Challenge Update', message: 'You are at 40% progress on the 30-Day Steps Challenge. Keep going!', type: 'challenge', isRead: false, createdAt: d('2026-02-06'), updatedAt: d('2026-02-06') },
  { _id: oid(), userId: user1Id, title: 'Welcome to REAUX Labs!', message: 'Welcome Arjun! Your account is ready. Start exploring workouts, diet plans, and more.', type: 'system', isRead: true, createdAt: d('2026-01-15'), updatedAt: d('2026-01-15') },
  { _id: oid(), userId: user2Id, title: 'Membership Assigned', message: 'You\'ve been assigned the "Premium Quarterly" plan at REAUX Fitness Delhi', type: 'system', isRead: true, createdAt: d('2026-01-10'), updatedAt: d('2026-01-10') },
  { _id: oid(), userId: user3Id, title: 'Membership Assigned', message: 'You\'ve been assigned the "Basic Monthly" plan at REAUX Fitness Delhi', type: 'system', isRead: false, createdAt: d('2026-02-01'), updatedAt: d('2026-02-01') },
  // Mumbai
  { _id: oid(), userId: user5Id, title: 'Order Delivered', message: 'Your order of Whey Protein + Shaker has been delivered! Enjoy your gains 💪', type: 'order', isRead: true, createdAt: d('2026-01-25'), updatedAt: d('2026-01-25') },
  { _id: oid(), userId: user5Id, title: 'New Diet Plan Available', message: 'Check out the new "Cutting Plan — Shred Season" diet plan added by your gym!', type: 'system', isRead: false, createdAt: d('2026-02-01'), updatedAt: d('2026-02-01') },
  { _id: oid(), userId: user6Id, title: 'Membership Assigned', message: 'You\'ve been assigned the "Elite Half-Yearly" plan at REAUX Fitness Mumbai', type: 'system', isRead: true, createdAt: d('2025-10-01'), updatedAt: d('2025-10-01') },
  // Bangalore
  { _id: oid(), userId: user8Id, title: 'Order Confirmed', message: 'Your order of Resistance Bands + Shaker has been confirmed and is being processed.', type: 'order', isRead: true, createdAt: d('2025-11-01'), updatedAt: d('2025-11-01') },
  { _id: oid(), userId: user8Id, title: 'Membership Assigned', message: 'You\'ve been assigned the "Premium Quarterly" plan at REAUX Fitness Bangalore', type: 'system', isRead: true, createdAt: d('2026-01-05'), updatedAt: d('2026-01-05') },
  { _id: oid(), userId: user9Id, title: 'Welcome to REAUX Labs!', message: 'Welcome Pooja! Explore yoga plans, flexibility workouts, and our community!', type: 'system', isRead: true, createdAt: d('2025-11-01'), updatedAt: d('2025-11-01') },
  { _id: oid(), userId: user10Id, title: 'Fees Reminder', message: 'You have ₹2,999 pending for your Elite Half-Yearly membership. Please clear dues soon.', type: 'system', isRead: false, createdAt: d('2026-02-01'), updatedAt: d('2026-02-01') },
];

await db.collection('notifications').insertMany(notifications);
console.log(`  Notifications: ${notifications.length} inserted`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DONE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
console.log('\n=========================================');
console.log('  Seed Complete!');
console.log('=========================================\n');
console.log(`  Users:              ${users.length} (1 superadmin, 3 admins, 10 users)`);
console.log(`  Gyms:               ${gyms.length} (Delhi, Mumbai, Bangalore)`);
console.log(`  BMI Records:        ${bmiRecords.length}`);
console.log(`  Diet Plans:         ${dietPlans.length} (2 Delhi, 2 Mumbai, 2 Bangalore)`);
console.log(`  Workouts:           ${workouts.length} (3 Delhi, 3 Mumbai, 3 Bangalore)`);
console.log(`  Posts:              ${posts.length}`);
console.log(`  Comments:           ${comments.length}`);
console.log(`  Reels:              ${reels.length}`);
console.log(`  Reel Comments:      ${reelComments.length}`);
console.log(`  Products:           ${products.length}`);
console.log(`  Carts:              ${carts.length}`);
console.log(`  Orders:             ${orders.length}`);
console.log(`  Promo Codes:        ${promoCodes.length}`);
console.log(`  Challenges:         ${challenges.length}`);
console.log(`  Membership Plans:   ${membershipPlans.length} (3 Delhi, 3 Mumbai, 3 Bangalore)`);
console.log(`  User Memberships:   ${userMemberships.length} (15 — covering all fee scenarios)`);
console.log(`  Contacts:           ${contacts.length}`);
console.log(`  Notifications:      ${notifications.length}`);

console.log('\n  All passwords: Pass1234\n');
console.log('  Logins:');
console.log('    SuperAdmin  → anish@reauxlabs.com');
console.log('    Admin Delhi → rahul@reauxlabs.com     (gym1 — 4 users)');
console.log('    Admin Mumbai→ priya@reauxlabs.com     (gym2 — 3 users)');
console.log('    Admin Blr   → karan@reauxlabs.com     (gym3 — 3 users)');
console.log('');
console.log('  Delhi users:');
console.log('    arjun@gmail.com    Elite Yearly    — fully paid (₹12,999)');
console.log('    vikram@gmail.com   Quarterly       — ₹1,001 advance credit');
console.log('    riya@gmail.com     Basic Monthly   — ₹800 dues pending');
console.log('    manish@gmail.com   Quarterly       — fully paid (₹3,999)');
console.log('');
console.log('  Mumbai users:');
console.log('    sneha@gmail.com    Quarterly       — ₹2,499 dues pending');
console.log('    rohan@gmail.com    Elite Half-Yr   — fully paid (₹8,999)');
console.log('    kavya@gmail.com    Basic Monthly   — ₹200 advance credit');
console.log('');
console.log('  Bangalore users:');
console.log('    aditya@gmail.com   Premium Qrtly  — ₹1,299 dues pending');
console.log('    pooja@gmail.com    Basic Monthly   — expired, fully paid');
console.log('    nikhil@gmail.com   Elite Half-Yr  — ₹2,999 dues pending');

await mongoose.disconnect();
