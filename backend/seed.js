const mongoose = require('mongoose');
const User = require('./models/User');
const Ticket = require('./models/Ticket');

// Use your explicitly defined database configuration target name
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/geda';

const seedData = async () => {
  try {
    console.log('🔄 Connecting to database configuration [geda]...');
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    
    console.log('🧹 Clearing legacy system fragments...');
    await User.deleteMany({});
    await Ticket.deleteMany({});

    console.log('👥 Creating operational role profiles (Admins, Agents, Customers)...');
    
    // Seed Agents with distinct skill matrix profiles
    const agentNet = await User.create({
      name: 'Shemsu Tech Support',
      email: 'shemsu.support@ticketmind.io',
      password: 'hashed_secure_password_123',
      role: 'Agent',
      specialties: ['Technical Issue', 'Security'],
      activeTicketCount: 2,
      maxCapacity: 5
    });

    const agentBilling = await User.create({
      name: 'Billing Specialist',
      email: 'billing.desk@ticketmind.io',
      password: 'hashed_secure_password_123',
      role: 'Agent',
      specialties: ['General Inquiry'],
      activeTicketCount: 1,
      maxCapacity: 5
    });

    const customer = await User.create({
      name: 'External Enterprise Client',
      email: 'client.alpha@external.com',
      password: 'hashed_secure_password_123',
      role: 'Customer'
    });

    console.log('🎫 Injecting multi-variant ticket records into live tracking...');

    const mockTickets = [
      {
        ticketId: 'TKT-A92B3C',
        title: 'Production Mongo cluster disconnected',
        description: 'Fatal Exception: The main database pool geda dropped connections under high thread strain. Core system down.',
        category: 'Technical Issue',
        priority: 'High',
        status: 'In Progress',
        createdBy: customer._id,
        assignedTo: agentNet._id,
        aiMetadata: {
          confidenceScore: 0.94,
          categoryProbabilities: [
            { category: 'Technical Issue', probability: 0.94 },
            { category: 'Security', probability: 0.04 },
            { category: 'General Inquiry', probability: 0.02 }
          ],
          autoPrioritized: true,
          keywords: ['database', 'system-fault'],
          suggestedReply: 'Our engineering infrastructure teams are investigating the active database cluster cluster fault immediately.',
          isDuplicate: false,
          sentimentScore: 0.20 // Highly frustrated user
        }
      },
      {
        ticketId: 'TKT-B81X9Y',
        title: 'Stripe webhook payment signature failure',
        description: 'Furious customer complains that their monthly checkout premium plan didn update upon card authorization.',
        category: 'General Inquiry',
        priority: 'Medium', // Upgraded out-of-band by sentiment trigger rule
        status: 'In Progress',
        createdBy: customer._id,
        assignedTo: agentBilling._id,
        aiMetadata: {
          confidenceScore: 0.82,
          categoryProbabilities: [
            { category: 'General Inquiry', probability: 0.82 },
            { category: 'Technical Issue', probability: 0.15 },
            { category: 'Security', probability: 0.03 }
          ],
          autoPrioritized: true,
          keywords: ['billing'],
          suggestedReply: 'Thank you for tracking your subscription status. Our accounts managers are checking Stripe hooks.',
          isDuplicate: false,
          sentimentScore: 0.35 // Frustrated / Escalated
        }
      },
      {
        ticketId: 'TKT-C72Z4M',
        title: 'Unauthorized leak configuration attempt warning',
        description: 'Security audit trail flags unexpected brute force login tries on JWT auth endpoints using root credentials.',
        category: 'Security',
        priority: 'High',
        status: 'Open',
        createdBy: customer._id,
        assignedTo: null,
        aiMetadata: {
          confidenceScore: 0.97,
          categoryProbabilities: [
            { category: 'Security', probability: 0.97 },
            { category: 'Technical Issue', probability: 0.02 },
            { category: 'General Inquiry', probability: 0.01 }
          ],
          autoPrioritized: true,
          keywords: ['authentication'],
          suggestedReply: 'SecOps automated incident response arrays have sequestered the originating IP out-of-band.',
          isDuplicate: false,
          sentimentScore: 0.85
        }
      },
      {
        ticketId: 'TKT-D11D11',
        title: 'Database connection dropping out',
        description: 'Mongo instance cluster timing out during queries.',
        category: 'Technical Issue',
        priority: 'High',
        status: 'Open',
        createdBy: customer._id,
        assignedTo: agentNet._id,
        aiMetadata: {
          confidenceScore: 0.88,
          categoryProbabilities: [{ category: 'Technical Issue', probability: 0.88 }],
          autoPrioritized: true,
          keywords: ['database'],
          isDuplicate: true,
          similarTicketId: 'TKT-A92B3C', // Semantic link pointer reference trigger
          sentimentScore: 0.50
        }
      },
      {
        ticketId: 'TKT-E55F55',
        title: 'Reset user password profile details',
        description: 'I need to update my security parameters for email changes.',
        category: 'General Inquiry', // Human-corrected alignment record
        priority: 'Low',
        status: 'Closed',
        createdBy: customer._id,
        aiMetadata: {
          confidenceScore: 0.75,
          categoryProbabilities: [{ category: 'Security', probability: 0.75 }],
          autoPrioritized: false,
          keywords: ['authentication'],
          wasCorrected: true, // pre-logs a drift correction vector for your metrics metrics page!
          originalAiCategory: 'Security'
        }
      }
    ];

    await Ticket.create(mockTickets);
    
    console.log('✅ Ingestion sequence optimized. System database populated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Data hydration cycle aborted:', error);
    process.exit(1);
  }
};

seedData();
