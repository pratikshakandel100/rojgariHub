import { BoostPlan } from '../models/index.js';
import sequelize from '../config/database.js';

const seedBoostPlans = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Sync the BoostPlan model
    await BoostPlan.sync();
    console.log('BoostPlan model synced.');

    // Check if boost plans already exist
    const existingPlans = await BoostPlan.count();
    if (existingPlans > 0) {
      console.log('Boost plans already exist. Skipping seed.');
      return;
    }

    // Create default boost plans
    const defaultPlans = [
      {
        name: 'Basic Boost',
        type: 'Basic',
        duration: 7,
        price: 35.00,
        features: [
          'Increased visibility for 7 days',
          'Priority placement in search results',
          'Basic analytics'
        ],
        visibilityMultiplier: 2.0,
        description: 'Perfect for getting your job noticed quickly',
        badge: 'Popular',
        badgeColor: 'bg-blue-100 text-blue-800',
        sortOrder: 1,
        isActive: true
      },
      {
        name: 'Standard Boost',
        type: 'Standard',
        duration: 14,
        price: 140.00,
        features: [
          'Enhanced visibility for 14 days',
          'Top placement in search results',
          'Detailed analytics',
          'Featured in job recommendations'
        ],
        visibilityMultiplier: 3.0,
        description: 'Great value for extended exposure',
        badge: 'Best Value',
        badgeColor: 'bg-green-100 text-green-800',
        sortOrder: 2,
        isActive: true
      },
      {
        name: 'Premium Boost',
        type: 'Premium',
        duration: 30,
        price: 600.00,
        features: [
          'Maximum visibility for 30 days',
          'Premium placement across all pages',
          'Advanced analytics & insights',
          'Featured in newsletters',
          'Social media promotion',
          'Dedicated account support'
        ],
        visibilityMultiplier: 5.0,
        description: 'Ultimate exposure for your most important positions',
        badge: 'Premium',
        badgeColor: 'bg-purple-100 text-purple-800',
        sortOrder: 3,
        isActive: true
      },
      {
        name: 'Enterprise Boost',
        type: 'Enterprise',
        duration: 60,
        price: 1200.00,
        features: [
          'Extended visibility for 60 days',
          'Exclusive premium placement',
          'Comprehensive analytics suite',
          'Multi-channel promotion',
          'Priority customer support',
          'Custom branding options',
          'Talent sourcing assistance'
        ],
        visibilityMultiplier: 7.0,
        description: 'Complete recruitment solution for enterprise needs',
        badge: 'Enterprise',
        badgeColor: 'bg-orange-100 text-orange-800',
        sortOrder: 4,
        isActive: true
      }
    ];

    // Insert the plans
    const createdPlans = await BoostPlan.bulkCreate(defaultPlans);
    console.log(`Successfully created ${createdPlans.length} boost plans:`);
    
    createdPlans.forEach(plan => {
      console.log(`- ${plan.name} (${plan.type}) - $${plan.price} for ${plan.duration} days`);
    });

    console.log('\nBoost plans seeded successfully!');
  } catch (error) {
    console.error('Error seeding boost plans:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the seed function
seedBoostPlans();