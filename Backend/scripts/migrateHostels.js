const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hostel = require('../models/Hostel');
const Admin = require('../models/Admin');

// Load env vars
dotenv.config();

const migrateHostels = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find hostels without ownerId
    const hostelsWithoutOwner = await Hostel.find({ ownerId: { $exists: false } });
    console.log(`📊 Found ${hostelsWithoutOwner.length} hostels without ownerId`);

    if (hostelsWithoutOwner.length === 0) {
      console.log('✅ All hostels already have ownerId');
      process.exit(0);
    }

    // Get the first admin as default owner (you can modify this logic)
    const defaultAdmin = await Admin.findOne();
    
    if (!defaultAdmin) {
      console.log('❌ No admin found. Please create an admin first.');
      process.exit(1);
    }

    console.log(`👤 Using admin "${defaultAdmin.name}" as default owner`);

    // Update hostels without ownerId one by one
    let updatedCount = 0;
    
    for (const hostel of hostelsWithoutOwner) {
      const updateData = {
        ownerId: defaultAdmin._id
      };
      
      // Only update owner details if they don't exist
      if (!hostel.ownerName) {
        updateData.ownerName = defaultAdmin.name;
      }
      if (!hostel.ownerEmail) {
        updateData.ownerEmail = defaultAdmin.email;
      }
      if (!hostel.ownerPhone && defaultAdmin.phone) {
        updateData.ownerPhone = defaultAdmin.phone;
      }
      
      await Hostel.findByIdAndUpdate(hostel._id, { $set: updateData });
      updatedCount++;
    }

    console.log(`✅ Updated ${updatedCount} hostels`);
    console.log('🎉 Migration completed successfully');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📴 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run migration
migrateHostels();