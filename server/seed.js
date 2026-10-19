require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Donation = require('./models/Donation');
const FoodRequest = require('./models/FoodRequest');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await Donation.deleteMany({});
  await FoodRequest.deleteMany({});

  const hash = pwd => bcrypt.hash(pwd, 10);

  const donor = await User.create({
    name: 'Priya Sharma', email: 'donor@demo.com', password: await hash('demo1234'),
    role: 'donor', address: '12 MG Road, Pune', contact: '9876543210',
  });

  const ngo = await User.create({
    name: 'Rahul Mehta', email: 'ngo@demo.com', password: await hash('demo1234'),
    role: 'ngo', ngoName: 'Aahar Foundation', ngoType: 'Food Distribution',
    address: 'FC Road, Pune', contact: '9123456780',
  });

  const humanOrg = await User.create({
    name: 'Sister Maria', email: 'orphanage@demo.com', password: await hash('demo1234'),
    role: 'organization', orgName: 'Bal Ashram Orphanage', orgType: 'human',
    orgCategory: 'Orphanage', address: 'Kothrud, Pune', contact: '9988776655', peopleServed: 45,
  });

  const animalOrg = await User.create({
    name: 'Dr. Ankit Joshi', email: 'shelter@demo.com', password: await hash('demo1234'),
    role: 'organization', orgName: 'Paws & Care Animal Shelter', orgType: 'animal',
    orgCategory: 'Dog & Cat Shelter', address: 'Baner, Pune', contact: '9871234560', peopleServed: 80,
  });

  const d1 = await Donation.create({
    donorId: donor._id, foodName: 'Cooked Rice & Dal', quantity: '15 kg',
    description: 'Freshly cooked, packed hygienically. From a wedding event.',
    pickupLocation: '12 MG Road, Pune', pickupTime: 'Today 5–8 PM',
    foodType: 'human', status: 'available',
    photoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  });

  const d2 = await Donation.create({
    donorId: donor._id, foodName: 'Premium Dry Dog Food', quantity: '10 kg',
    description: 'Unopened bags of Royal Canin adult dog food.',
    pickupLocation: '12 MG Road, Pune', pickupTime: 'Tomorrow 10 AM–1 PM',
    foodType: 'animal', status: 'claimed', claimedBy: ngo._id,
    photoUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
  });

  const d3 = await Donation.create({
    donorId: donor._id, foodName: 'Bread & Biscuits', quantity: '8 kg',
    description: 'Day-old bread from bakery, still fresh.',
    pickupLocation: '12 MG Road, Pune', pickupTime: 'Today 6–9 PM',
    foodType: 'human', status: 'distributed',
    claimedBy: ngo._id, deliveredTo: humanOrg._id,
    distributionProof: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400',
    completedAt: new Date(),
  });

  await FoodRequest.create({
    orgId: humanOrg._id, foodType: 'human',
    foodDescription: 'Cooked meals or dry rations for 45 children',
    quantity: '30 kg', requiredDate: new Date(Date.now() + 3 * 86400000), status: 'open',
  });

  await FoodRequest.create({
    orgId: animalOrg._id, foodType: 'animal',
    foodDescription: 'Dry dog food and cat food for 80 animals',
    quantity: '20 kg', requiredDate: new Date(Date.now() + 2 * 86400000), status: 'open',
  });

  await FoodRequest.create({
    orgId: animalOrg._id, foodType: 'animal',
    foodDescription: 'Premium dry dog food (Royal Canin or similar)',
    quantity: '10 kg', requiredDate: new Date(Date.now() + 1 * 86400000),
    status: 'fulfilled', fulfilledBy: d2._id,
  });

  console.log('\n✅ Demo data seeded!\n');
  console.log('Demo Accounts (password: demo1234)');
  console.log('  Donor:        donor@demo.com');
  console.log('  NGO:          ngo@demo.com');
  console.log('  Orphanage:    orphanage@demo.com');
  console.log('  Animal Shelter: shelter@demo.com\n');

  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
