// ===========================================
// KPLabs Linux Lab - Database Seeder (Phase 4 - Challenge Management)
// ===========================================
// Updated seed data with proper enums, isPublished, validationRule, expectedOutcome
// Creates 3 realistic challenges with multiple tasks each
// ===========================================

import { PrismaClient, Role, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Phase 4...');

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
  // Create Admin User (for testing admin APIs)
  // ===========================================
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@kplabs.in',
      passwordHash: '$2b$10$examplehashedpasswordforseeddataonly', // In real: use bcrypt
      role: Role.ADMIN,
    },
  });

  console.log('✅ Created admin user');

  // ===========================================
  // Create Sample Challenges with Tasks (Published)
  // ===========================================

  // Challenge 1: Linux File System Basics
  const challenge1 = await prisma.challenge.create({
    data: {
      title: 'Linux File System Basics',
      slug: 'linux-file-system-basics',
      description: 'Learn to navigate, create, and manage files and directories in Linux. This foundational challenge teaches essential file system commands used daily by developers and system administrators.',
      difficulty: Difficulty.BEGINNER,
      dockerImage: 'kplabs/linux-basics:latest',
      estimatedMinutes: 25,
      isPublished: true,
      tasks: {
        create: [
          {
            title: 'Create Project Directory Structure',
            description: 'Create the following directory structure using mkdir -p:\n- src/components\n- src/utils\n- config',
            order: 1,
            hint: 'Use the -p flag with mkdir to create parent directories in a single command.',
            validationRule: 'test -d src/components && test -d src/utils && test -d config',
            expectedOutcome: 'Directories src/components, src/utils, and config should exist',
          },
          {
            title: 'Create package.json File',
            description: 'Create a basic package.json file inside the project root with name, version, and description fields.',
            order: 2,
            hint: 'You can use echo \'{"name": "myapp", "version": "1.0.0", "description": "My project"}\' > package.json',
            validationRule: 'test -f package.json && grep -q "name" package.json',
            expectedOutcome: 'package.json file exists with name, version, and description fields',
          },
          {
            title: 'Create Environment File with Restricted Permissions',
            description: 'Create a .env file and set its permissions to 600 (readable and writable only by the owner).',
            order: 3,
            hint: 'Use chmod 600 .env after creating the file.',
            validationRule: 'test -f .env && stat -c "%a" .env | grep -q "600"',
            expectedOutcome: '.env file exists with permissions 600',
          },
          {
            title: 'Verify Complete Structure',
            description: 'Use ls -laR to verify the entire directory structure including hidden files and permissions.',
            order: 4,
            hint: 'The -R flag enables recursive listing and -a shows hidden files.',
            validationRule: 'ls -laR | grep -q "src" && ls -laR | grep -q ".env"',
            expectedOutcome: 'Full directory structure visible with ls -laR including hidden files',
          },
        ],
      },
    },
  });

  // Challenge 2: Linux Permissions & Ownership
  const challenge2 = await prisma.challenge.create({
    data: {
      title: 'Linux Permissions & Ownership',
      slug: 'linux-permissions-ownership',
      description: 'Master Linux file permissions, ownership, and access control. Learn chmod, chown, and understand the permission model deeply.',
      difficulty: Difficulty.BEGINNER,
      dockerImage: 'kplabs/linux-permissions:latest',
      estimatedMinutes: 30,
      isPublished: true,
      tasks: {
        create: [
          {
            title: 'Understand Current Permissions',
            description: 'Inspect the permissions of existing files using ls -l and understand the permission string (rwxr-xr-x etc.).',
            order: 1,
            hint: 'Run ls -l to see detailed permissions.',
            validationRule: 'ls -l | head -5',
            expectedOutcome: 'Output shows permission strings like -rw-r--r-- for files',
          },
          {
            title: 'Modify File Permissions',
            description: 'Change permissions of a script file so it becomes executable by the owner only.',
            order: 2,
            hint: 'Use chmod u+x filename or chmod 700 filename.',
            validationRule: 'test -f script.sh && stat -c "%a" script.sh | grep -q "700"',
            expectedOutcome: 'script.sh exists with permissions 700 (rwx------)',
          },
          {
            title: 'Change File Ownership',
            description: 'Change the owner and group of a file using chown (requires sudo in real environments).',
            order: 3,
            hint: 'In this lab environment, you may need to use sudo chown user:group file.',
            validationRule: 'stat -c "%U %G" testfile.txt',
            expectedOutcome: 'Ownership changed to specified user and group',
          },
          {
            title: 'Set Special Permissions',
            description: 'Set the setuid bit on a binary file and verify it using ls -l.',
            order: 4,
            hint: 'Use chmod u+s or chmod 4755 on the file.',
            validationRule: 'stat -c "%a" binary | grep -q "4755" || ls -l binary | grep -q "s"',
            expectedOutcome: 'File shows setuid bit (s in permissions) or 4755',
          },
        ],
      },
    },
  });

  // Challenge 3: Text Processing with Linux Tools
  const challenge3 = await prisma.challenge.create({
    data: {
      title: 'Text Processing with Linux Tools',
      slug: 'linux-text-processing',
      description: 'Learn powerful text processing using grep, awk, sed, cut, sort, uniq, and wc. Analyze server logs effectively.',
      difficulty: Difficulty.INTERMEDIATE,
      dockerImage: 'kplabs/linux-text-processing:latest',
      estimatedMinutes: 35,
      isPublished: true,
      tasks: {
        create: [
          {
            title: 'Count Total Lines in Log File',
            description: 'Count how many lines exist in the provided access.log file using wc.',
            order: 1,
            hint: 'wc -l access.log',
            validationRule: 'wc -l access.log | awk \'{print $1}\'',
            expectedOutcome: 'Correct total number of lines in access.log',
          },
          {
            title: 'Extract 404 Errors',
            description: 'Find all lines containing 404 status codes and save them to a new file called errors.txt.',
            order: 2,
            hint: 'Use grep " 404 " access.log > errors.txt',
            validationRule: 'test -f errors.txt && grep -c "404" errors.txt',
            expectedOutcome: 'errors.txt created with all 404 error lines from access.log',
          },
          {
            title: 'Find Top 3 Requested Paths',
            description: 'Extract the most frequently requested paths from the log file and display top 3.',
            order: 3,
            hint: 'Use cut, sort, uniq -c, sort -nr | head -n 3 on the log.',
            validationRule: 'cut -d" " -f7 access.log | sort | uniq -c | sort -nr | head -n 3',
            expectedOutcome: 'Top 3 most requested paths displayed with counts',
          },
          {
            title: 'Create Summary Report',
            description: 'Generate a small summary report showing total requests and number of 404 errors.',
            order: 4,
            hint: 'You can use echo and command substitution to create report.txt.',
            validationRule: 'test -f report.txt && grep -q "Total Requests" report.txt && grep -q "404 Errors" report.txt',
            expectedOutcome: 'report.txt created with summary of total requests and 404 errors',
          },
        ],
      },
    },
  });

  console.log('✅ Created 3 published challenges with realistic tasks');

  // ===========================================
  // Create Sample Analytics Events (optional)
  // ===========================================
  await prisma.analyticsEvent.createMany({
    data: [
      {
        userId: adminUser.id,
        challengeId: challenge1.id,
        eventType: 'CHALLENGE_STARTED',
        metadata: { source: 'web' },
      },
      {
        userId: adminUser.id,
        challengeId: challenge1.id,
        eventType: 'SESSION_CREATED',
        metadata: { estimatedTime: 25 },
      },
    ],
  });

  console.log('✅ Created sample analytics events');

  console.log('\n🎉 Phase 4 database seeding completed successfully!');
  console.log('Admin user: admin@kplabs.in (use for testing admin APIs)');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
 