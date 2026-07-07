// ===========================================
// ChallengeLabs Database Seeder
// Structured Task Validation Framework
// ===========================================

import {
  PrismaClient,
  Role,
  Difficulty,
  ValidationType,
} from '@prisma/client';

const prisma = new PrismaClient();

function commandValidation(
  command: string,
  expectedOutput?: string
) {
  return {
    create: {
      type: ValidationType.COMMAND,
      config: {
        command,
        ...(expectedOutput && {
          expectedOutput,
        }),
      },
      order: 1,
      isRequired: true,
    },
  };
}

async function main() {
  console.log('🌱 Starting database seed...');

  // ===========================================
  // Clear existing data
  // ===========================================

  await prisma.validationResult.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.session.deleteMany();
  await prisma.challengeTask.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleared existing data');

  // ===========================================
  // Create Admin User
  // ===========================================

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@kplabs.in',
      passwordHash:
        '$2b$10$examplehashedpasswordforseeddataonly',
      role: Role.ADMIN,
    },
  });

  console.log('✅ Created admin user');

  // ===========================================
  // Challenge 1: Linux File System Basics
  // ===========================================

  const challenge1 =
    await prisma.challenge.create({
      data: {
        title: 'Linux File System Basics',
        slug: 'linux-file-system-basics',
        description:
          'Learn to navigate, create, and manage files and directories in Linux. This foundational challenge teaches essential file system commands used daily by developers and system administrators.',
        difficulty: Difficulty.BEGINNER,
        dockerImage:
          'kplabs/linux-basics:latest',
        estimatedMinutes: 25,
        isPublished: true,

        tasks: {
          create: [
            {
              title:
                'Create Project Directory Structure',
              description:
                'Create the following directory structure using mkdir -p:\n- src/components\n- src/utils\n- config',
              order: 1,
              hint:
                'Use the -p flag with mkdir to create parent directories in a single command.',

              validations: commandValidation(
                'test -d src/components && test -d src/utils && test -d config',
                'Directories src/components, src/utils, and config should exist'
              ),
            },

            {
              title:
                'Create package.json File',
              description:
                'Create a basic package.json file inside the project root with name, version, and description fields.',
              order: 2,
              hint:
                'You can use echo \'{"name": "myapp", "version": "1.0.0", "description": "My project"}\' > package.json',

              validations: commandValidation(
                'test -f package.json && grep -q "name" package.json',
                'package.json file exists with name, version, and description fields'
              ),
            },

            {
              title:
                'Create Environment File with Restricted Permissions',
              description:
                'Create a .env file and set its permissions to 600 (readable and writable only by the owner).',
              order: 3,
              hint:
                'Use chmod 600 .env after creating the file.',

              validations: commandValidation(
                'test -f .env && stat -c "%a" .env | grep -q "600"',
                '.env file exists with permissions 600'
              ),
            },

            {
              title:
                'Verify Complete Structure',
              description:
                'Use ls -laR to verify the entire directory structure including hidden files and permissions.',
              order: 4,
              hint:
                'The -R flag enables recursive listing and -a shows hidden files.',

              validations: commandValidation(
                'ls -laR | grep -q "src" && ls -laR | grep -q ".env"',
                'Full directory structure visible with ls -laR including hidden files'
              ),
            },
          ],
        },
      },
    });

  // ===========================================
  // Challenge 2: Linux Permissions & Ownership
  // ===========================================

  await prisma.challenge.create({
    data: {
      title:
        'Linux Permissions & Ownership',
      slug:
        'linux-permissions-ownership',
      description:
        'Master Linux file permissions, ownership, and access control. Learn chmod, chown, and understand the permission model deeply.',
      difficulty: Difficulty.BEGINNER,
      dockerImage:
        'kplabs/linux-permissions:latest',
      estimatedMinutes: 30,
      isPublished: true,

      tasks: {
        create: [
          {
            title:
              'Understand Current Permissions',
            description:
              'Inspect the permissions of existing files using ls -l and understand the permission string (rwxr-xr-x etc.).',
            order: 1,
            hint:
              'Run ls -l to see detailed permissions.',

            validations: commandValidation(
              'ls -l | head -5',
              'Output shows permission strings like -rw-r--r-- for files'
            ),
          },

          {
            title:
              'Modify File Permissions',
            description:
              'Change permissions of a script file so it becomes executable by the owner only.',
            order: 2,
            hint:
              'Use chmod u+x filename or chmod 700 filename.',

            validations: commandValidation(
              'test -f script.sh && stat -c "%a" script.sh | grep -q "700"',
              'script.sh exists with permissions 700 (rwx------)'
            ),
          },

          {
            title:
              'Change File Ownership',
            description:
              'Change the owner and group of a file using chown (requires sudo in real environments).',
            order: 3,
            hint:
              'In this lab environment, you may need to use sudo chown user:group file.',

            validations: commandValidation(
              'stat -c "%U %G" testfile.txt',
              'Ownership changed to specified user and group'
            ),
          },

          {
            title:
              'Set Special Permissions',
            description:
              'Set the setuid bit on a binary file and verify it using ls -l.',
            order: 4,
            hint:
              'Use chmod u+s or chmod 4755 on the file.',

            validations: commandValidation(
              'stat -c "%a" binary | grep -q "4755" || ls -l binary | grep -q "s"',
              'File shows setuid bit (s in permissions) or 4755'
            ),
          },
        ],
      },
    },
  });

  // ===========================================
  // Challenge 3: Text Processing
  // ===========================================

  await prisma.challenge.create({
    data: {
      title:
        'Text Processing with Linux Tools',
      slug:
        'linux-text-processing',
      description:
        'Learn powerful text processing using grep, awk, sed, cut, sort, uniq, and wc. Analyze server logs effectively.',
      difficulty:
        Difficulty.INTERMEDIATE,
      dockerImage:
        'kplabs/linux-text-processing:latest',
      estimatedMinutes: 35,
      isPublished: true,

      tasks: {
        create: [
          {
            title:
              'Count Total Lines in Log File',
            description:
              'Count how many lines exist in the provided access.log file using wc.',
            order: 1,
            hint:
              'wc -l access.log',

            validations: commandValidation(
              'wc -l access.log | awk \'{print $1}\'',
              'Correct total number of lines in access.log'
            ),
          },

          {
            title:
              'Extract 404 Errors',
            description:
              'Find all lines containing 404 status codes and save them to a new file called errors.txt.',
            order: 2,
            hint:
              'Use grep " 404 " access.log > errors.txt',

            validations: commandValidation(
              'test -f errors.txt && grep -c "404" errors.txt',
              'errors.txt created with all 404 error lines from access.log'
            ),
          },

          {
            title:
              'Find Top 3 Requested Paths',
            description:
              'Extract the most frequently requested paths from the log file and display top 3.',
            order: 3,
            hint:
              'Use cut, sort, uniq -c, sort -nr | head -n 3 on the log.',

            validations: commandValidation(
              'cut -d" " -f7 access.log | sort | uniq -c | sort -nr | head -n 3',
              'Top 3 most requested paths displayed with counts'
            ),
          },

          {
            title:
              'Create Summary Report',
            description:
              'Generate a small summary report showing total requests and number of 404 errors.',
            order: 4,
            hint:
              'You can use echo and command substitution to create report.txt.',

            validations: commandValidation(
              'test -f report.txt && grep -q "Total Requests" report.txt && grep -q "404 Errors" report.txt',
              'report.txt created with summary of total requests and 404 errors'
            ),
          },
        ],
      },
    },
  });

  console.log(
    '✅ Created 3 published challenges with structured task validations'
  );

  // ===========================================
  // Sample Analytics Events
  // ===========================================

  await prisma.analyticsEvent.createMany({
    data: [
      {
        userId: adminUser.id,
        challengeId: challenge1.id,
        eventType:
          'CHALLENGE_STARTED',
        metadata: {
          source: 'web',
        },
      },
      {
        userId: adminUser.id,
        challengeId: challenge1.id,
        eventType:
          'SESSION_CREATED',
        metadata: {
          estimatedTime: 25,
        },
      },
    ],
  });

  console.log(
    '✅ Created sample analytics events'
  );

  console.log(
    '\n🎉 Database seeding completed successfully!'
  );
  console.log(
    'Admin user: admin@kplabs.in'
  );
}

main()
  .catch((error) => {
    console.error(
      '❌ Seeding failed:',
      error
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });