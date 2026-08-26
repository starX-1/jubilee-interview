const bcrypt = require('bcryptjs');
const db = require('./config/db');
const { OFFICER_USERNAME, OFFICER_PASSWORD } = require('./config/env');

const sampleClaims = [
  {
    claim_number: 'CLM-1001',
    policy_number: 'POL-2026-001',
    customer_name: 'Jane Doe',
    claim_type: 'Motor',
    claim_amount: 12500.00,
    incident_date: '2026-08-15',
    description: 'Vehicle damage following a road accident',
    status: 'SUBMITTED'
  },
  {
    claim_number: 'CLM-1002',
    policy_number: 'POL-2026-042',
    customer_name: 'John Smith',
    claim_type: 'Health',
    claim_amount: 84000.50,
    incident_date: '2026-08-10',
    description: 'Inpatient medical expenses for emergency appendectomy at Nairobi Hospital',
    status: 'UNDER_REVIEW'
  },
  {
    claim_number: 'CLM-1003',
    policy_number: 'POL-2026-109',
    customer_name: 'Grace Wanjiku',
    claim_type: 'Travel',
    claim_amount: 35000.00,
    incident_date: '2026-08-01',
    description: 'Baggage loss and flight cancellation expenses during transit',
    status: 'APPROVED'
  },
  {
    claim_number: 'CLM-1004',
    policy_number: 'POL-2026-215',
    customer_name: 'David Kamau',
    claim_type: 'Property',
    claim_amount: 150000.00,
    incident_date: '2026-07-28',
    description: 'Commercial store property damage due to roof collapse during heavy rain',
    status: 'REJECTED'
  },
  {
    claim_number: 'CLM-1005',
    policy_number: 'POL-2026-308',
    customer_name: 'Sarah Hassan',
    claim_type: 'Other',
    claim_amount: 45000.00,
    incident_date: '2026-08-05',
    description: 'Agricultural equipment breakdown and crop liability claim',
    status: 'PAID'
  }
];

async function seed() {
  try {
    console.log('Initializing database schema...');
    await db.initDb();

    console.log(`Seeding Claims Officer account from environment... (${OFFICER_USERNAME})`);
    const passwordHash = await bcrypt.hash(OFFICER_PASSWORD, 10);

    await db.query(
      `INSERT INTO officers (username, password_hash, full_name, role)
       VALUES ($1, $2, $3, 'CLAIMS_OFFICER')
       ON CONFLICT (username)
       DO UPDATE SET
         password_hash = EXCLUDED.password_hash,
         full_name = EXCLUDED.full_name,
         updated_at = CURRENT_TIMESTAMP`,
      [OFFICER_USERNAME, passwordHash, 'Senior Claims Officer']
    );

    console.log('Claims Officer account seeded successfully.');

    console.log('Seeding sample insurance claims...');
    for (const claim of sampleClaims) {
      await db.query(
        `INSERT INTO claims (claim_number, policy_number, customer_name, claim_type, claim_amount, incident_date, description, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (claim_number) 
         DO UPDATE SET 
           policy_number = EXCLUDED.policy_number,
           customer_name = EXCLUDED.customer_name,
           claim_type = EXCLUDED.claim_type,
           claim_amount = EXCLUDED.claim_amount,
           incident_date = EXCLUDED.incident_date,
           description = EXCLUDED.description,
           status = EXCLUDED.status,
           updated_at = CURRENT_TIMESTAMP`,
        [
          claim.claim_number,
          claim.policy_number,
          claim.customer_name,
          claim.claim_type,
          claim.claim_amount,
          claim.incident_date,
          claim.description,
          claim.status
        ]
      );
    }
    console.log('Database seeded successfully with officer account & claims sample data.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
