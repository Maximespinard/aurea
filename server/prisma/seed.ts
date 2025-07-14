import { PrismaClient } from '../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper to generate dates going back from today
const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
};

// Symptom options
const SYMPTOMS = [
  'Cramps',
  'Bloating',
  'Headache',
  'Mood Swings',
  'Fatigue',
  'Breast Tenderness',
  'Back Pain',
  'Nausea',
  'Acne',
  'Insomnia',
];

// Mood options
const MOODS = ['happy', 'sad', 'anxious', 'calm', 'irritated', 'energetic'];

// Flow options
const FLOWS = ['light', 'medium', 'heavy'];

// Helper to get random items from array
const getRandomItems = <T>(arr: T[], min: number, max: number): T[] => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomItem = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.dayEntry.deleteMany();
  await prisma.cycle.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create test user
  const hashedPassword = await bcrypt.hash('Test123!', 10);

  const user = await prisma.user.create({
    data: {
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
    },
  });

  console.log('✅ Created user:', user.username);

  // Create profile
  const profile = await prisma.profile.create({
    data: {
      userId: user.id,
      cycleLength: 28,
      periodDuration: 5,
      symptoms: ['Cramps', 'Mood Swings', 'Fatigue'],
      contraception: 'None',
      notes: 'Regular cycles, moderate symptoms',
    },
  });

  console.log('✅ Created profile');

  // Generate cycle history for the last 6 months
  const cycles: any[] = [];
  let currentDate = daysAgo(180); // Start 6 months ago

  // Create 6-7 cycles with varying lengths
  const cycleLengths = [26, 28, 27, 29, 28, 30, 27]; // Realistic variation
  const periodDurations = [5, 6, 5, 5, 4, 6, 5];

  for (let i = 0; i < 6; i++) {
    const cycleLength = cycleLengths[i];
    const periodDuration = periodDurations[i];

    // Create cycle
    const cycle = await prisma.cycle.create({
      data: {
        profileId: profile.id,
        startDate: currentDate,
        endDate: new Date(
          currentDate.getTime() + periodDuration * 24 * 60 * 60 * 1000,
        ),
        isActive: false,
        symptoms: getRandomItems(SYMPTOMS, 2, 5),
        flow: getRandomItem(FLOWS),
        notes:
          i === 0
            ? 'First tracked cycle'
            : i === 3
              ? 'Stressful month, symptoms worse'
              : undefined,
      },
    });

    cycles.push(cycle);
    console.log(
      `✅ Created cycle ${i + 1} starting ${cycle.startDate.toLocaleDateString()}`,
    );

    // Create day entries for this cycle
    for (let day = 0; day < periodDuration; day++) {
      const entryDate = new Date(
        currentDate.getTime() + day * 24 * 60 * 60 * 1000,
      );

      // Vary flow intensity throughout period
      let flow: string;
      if (day === 0) flow = 'light';
      else if (day === 1 || day === 2) flow = 'heavy';
      else if (day === 3) flow = 'medium';
      else flow = 'light';

      // More symptoms on heavier days
      const symptomCount = flow === 'heavy' ? 4 : flow === 'medium' ? 3 : 2;

      await prisma.dayEntry.create({
        data: {
          cycleId: cycle.id,
          date: entryDate,
          symptoms: getRandomItems(
            SYMPTOMS,
            symptomCount - 1,
            symptomCount + 1,
          ),
          mood: getRandomItem(MOODS),
          flow,
          temperature:
            Math.random() > 0.7
              ? parseFloat((97.5 + Math.random() * 1.5).toFixed(1))
              : undefined,
          notes:
            day === 0
              ? 'Period started'
              : day === periodDuration - 1
                ? 'Light spotting'
                : undefined,
        },
      });
    }

    // Move to next cycle start date
    currentDate = new Date(
      currentDate.getTime() + cycleLength * 24 * 60 * 60 * 1000,
    );
  }

  // Create current active cycle (started 3 days ago)
  const activeCycleStart = daysAgo(3);
  const activeCycle = await prisma.cycle.create({
    data: {
      profileId: profile.id,
      startDate: activeCycleStart,
      isActive: true,
      symptoms: ['Cramps', 'Bloating', 'Fatigue'],
      flow: 'medium',
    },
  });

  console.log('✅ Created active cycle');

  // Add entries for active cycle
  for (let day = 0; day <= 3; day++) {
    const entryDate = new Date(
      activeCycleStart.getTime() + day * 24 * 60 * 60 * 1000,
    );

    let flow: string;
    if (day === 0) flow = 'light';
    else if (day === 1 || day === 2) flow = 'heavy';
    else flow = 'medium';

    await prisma.dayEntry.create({
      data: {
        cycleId: activeCycle.id,
        date: entryDate,
        symptoms: getRandomItems(SYMPTOMS, 2, 4),
        mood: getRandomItem(MOODS),
        flow,
        temperature: day === 2 ? 98.2 : undefined,
        notes: day === 0 ? 'Period started this morning' : undefined,
      },
    });
  }

  // Update profile with last period date
  await prisma.profile.update({
    where: { id: profile.id },
    data: { lastPeriodDate: activeCycleStart },
  });

  console.log('🎉 Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Username: testuser`);
  console.log(`- Password: Test123!`);
  console.log(`- Created ${cycles.length} historical cycles`);
  console.log(`- 1 active cycle (started 3 days ago)`);
  console.log(
    `- Total period days tracked: ${cycles.reduce((sum, c) => sum + periodDurations[cycles.indexOf(c)], 0) + 4}`,
  );
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
