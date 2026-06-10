// ===========================================
// KPLabs Linux Lab - Database Seeder (Phase 2 - Corrected)
// ===========================================
// This script populates the database with initial sample data
// for development and testing purposes.
// ===========================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ===========================================
  // Clear existing data (for clean seeding)
  // ===========================================
  await prisma.validationResult.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.session.deleteMany();
  await prisma.challengeTask.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleared existing data');

  // ===========================================
  // Create Sample Challenges with Tasks
  // ===========================================

  // Challenge 1: Linux File System Basics
  await prisma.challenge.create({
    data: {
      title: 'Linux File System Basics',
      slug: 'linux-file-system-basics',
      description: 'Learn to navigate, create, and manage files and directories in Linux. This foundational challenge teaches essential file system commands used daily by developers and system administrators.',
      difficulty: 'Beginner',
      dockerImage: 'kplabs/linux-basics:latest',
      estimatedMinutes: 25,
      tasks: {
        create: [
          {
            title: 'Create Project Directory Structure',
            description: 'Create the following directory structure using mkdir -p:\n- src/components\n- src/utils\n- config',
            order: 1,
            hint: 'Use the -p flag with mkdir to create parent directories in a single command.',
          },
          {
            title: 'Create package.json File',
            description: 'Create a basic package.json file inside the project root with name, version, and description fields.',
            order: 2,
            hint: 'You can use echo \'{"name": "myapp"}\' > package.json',
          },
          {
            title: 'Create Environment File with Restricted Permissions',
            description: 'Create a .env file and set its permissions to 600 (readable and writable only by the owner).',
            order: 3,
            hint: 'Use chmod 600 .env after creating the file.',
          },
          {
            title: 'Verify Complete Structure',
            description: 'Use ls -laR to verify the entire directory structure including hidden files and permissions.',
            order: 4,
            hint: 'The -R flag enables recursive listing.',
          },
        ],
      },
    },
  });

  // Challenge 2: Linux Permissions
  await prisma.challenge.create({
    data: {
      title: 'Linux Permissions & Ownership',
      slug: 'linux-permissions-ownership',
      description: 'Master Linux file permissions, ownership, and access control. Learn chmod, chown, and understand the permission model deeply.',
      difficulty: 'Beginner',
      dockerImage: 'kplabs/linux-permissions:latest',
      estimatedMinutes: 30,
      tasks: {
        create: [
          {
            title: 'Understand Current Permissions',
            description: 'Inspect the permissions of existing files using ls -l and understand the permission string.',
            order: 1,
            hint: null,
          },
          {
            title: 'Modify File Permissions',
            description: 'Change permissions of a script file so it becomes executable by the owner only.',
            order: 2,
            hint: 'Use chmod u+x filename or chmod 700 filename.',
          },
          {
            title: 'Change File Ownership',
            description: 'Change the owner and group of a file using chown (requires sudo in real environments).',
            order: 3,
            hint: 'In this lab environment, you may need to use sudo.',
          },
          {
            title: 'Set Special Permissions',
            description: 'Set the setuid bit on a binary file and verify it using ls -l.',
            order: 4,
            hint: 'Use chmod u+s or chmod 4755.',
          },
        ],
      },
    },
  });

  // Challenge 3: Text Processing
  await prisma.challenge.create({
    data: {
      title: 'Text Processing with Linux Tools',
      slug: 'linux-text-processing',
      description: 'Learn powerful text processing using grep, awk, sed, cut, sort, uniq, and wc. Analyze server logs effectively.',
      difficulty: 'Intermediate',
      dockerImage: 'kplabs/linux-text-processing:latest',
      estimatedMinutes: 35,
      tasks: {
        create: [
          {
            title: 'Count Total Lines in Log File',
            description: 'Count how many lines exist in the provided access.log file using wc.',
            order: 1,
            hint: 'wc -l access.log',
          },
          {
            title: 'Extract 404 Errors',
            description: 'Find all lines containing 404 status codes and save them to a new file called errors.txt.',
            order: 2,
            hint: 'Use grep " 404 " access.log > errors.txt',
          },
          {
            title: 'Find Top 3 Requested Paths',
            description: 'Extract the most frequently requested paths from the log file.',
            order: 3,
            hint: 'Use a combination of cut, sort, uniq -c, and sort -nr | head -n 3',
          },
          {
            title: 'Create Summary Report',
            description: 'Generate a small summary report showing total requests and number of 404 errors.',
            order: 4,
            hint: 'You can use echo and command substitution.',
          },
        ],
      },
    },
  });

  console.log('✅ Created 3 sample challenges with tasks');

  // ===========================================
  // Create a Sample User (for testing)
  // ===========================================
  const sampleUser = await prisma.user.create({
    data: {
      name: 'Test Student',
      email: 'student@kplabs.in',
      passwordHash: '$2b$10$examplehashedpasswordforseeddataonly',
    },
  });

  console.log('✅ Created sample user');

  // ===========================================
  // Create Sample Analytics Events
  // ===========================================
  const challenges = await prisma.challenge.findMany();

  await prisma.analyticsEvent.createMany({
    data: [
      {
        userId: sampleUser.id,
        challengeId: challenges[0].id,
        eventType: 'CHALLENGE_STARTED',
        metadata: { source: 'web' },
      },
      {
        userId: sampleUser.id,
        challengeId: challenges[0].id,
        eventType: 'SESSION_CREATED',
        metadata: { estimatedTime: 25 },
      },
    ],
  });

  console.log('✅ Created sample analytics events');

  console.log('\n🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
