require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const College = require('../models/College');
const fs = require('fs');
const path = require('path');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Read JSON data
    const dataPath = path.join(__dirname, '../data/colleges.json');
    const colleges = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Clear existing data
    await College.deleteMany({});
    console.log('Cleared existing college data.');

    // Insert new data
    await College.insertMany(colleges);
    console.log(`Successfully seeded ${colleges.length} colleges!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
