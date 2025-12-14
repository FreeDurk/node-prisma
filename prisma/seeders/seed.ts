import { prisma } from "../../src/lib/prisma"

// Helper functions to generate random data
const generateEmail = (index: number): string => {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com', 'test.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `user${index}_${Date.now()}_${Math.random().toString(36).substring(7)}@${domain}`;
};

const generateName = (): string => {
  const firstNames = [
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Chris', 'Jessica',
    'Daniel', 'Ashley', 'Matthew', 'Amanda', 'James', 'Melissa', 'Robert',
    'Jennifer', 'William', 'Linda', 'Richard', 'Patricia', 'Joseph', 'Maria',
    'Thomas', 'Nancy', 'Charles', 'Lisa', 'Christopher', 'Betty', 'Daniel',
    'Margaret', 'Paul', 'Sandra', 'Mark', 'Ashley', 'Donald', 'Dorothy'
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
    'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
    'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez'
  ];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
};

const generateTitle = (): string => {
  const titles = [
    'Getting Started with Node.js',
    'Advanced JavaScript Techniques',
    'Building Scalable APIs',
    'Understanding Async/Await',
    'Database Design Best Practices',
    'Introduction to TypeScript',
    'Mastering React Hooks',
    'GraphQL vs REST',
    'Docker for Beginners',
    'Microservices Architecture',
    'Testing Strategies in Node.js',
    'Performance Optimization Tips',
    'Security Best Practices',
    'Clean Code Principles',
    'Design Patterns Explained',
    'Working with Prisma ORM',
    'Building Real-time Applications',
    'Understanding JWT Authentication',
    'Modern CSS Techniques',
    'State Management in React',
    'API Documentation with Swagger',
    'Continuous Integration Setup',
    'Debugging Node.js Applications',
    'MongoDB vs PostgreSQL',
    'Building a REST API from Scratch'
  ];
  
  return `${titles[Math.floor(Math.random() * titles.length)]} - ${Math.floor(Math.random() * 1000)}`;
};

const generateContent = (): string => {
  const paragraphs = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.',
    'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
    'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.'
  ];
  
  const numParagraphs = Math.floor(Math.random() * 3) + 2;
  let content = '';
  
  for (let i = 0; i < numParagraphs; i++) {
    content += paragraphs[Math.floor(Math.random() * paragraphs.length)] + '\n\n';
  }
  
  return content.trim();
};

async function main() {
  console.log('🌱 Starting seed...\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✅ Existing data cleared\n');

  // First, create the original Alice and Bob
  console.log('👥 Creating Alice and Bob...');
  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Alice',
      posts: {
        create: {
          title: 'Check out Prisma with Next.js',
          content: 'https://www.prisma.io/nextjs',
          published: true,
        },
      },
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      name: 'Bob',
      posts: {
        create: [
          {
            title: 'Follow Prisma on Twitter',
            content: 'https://twitter.com/prisma',
            published: true,
          },
          {
            title: 'Follow Nexus on Twitter',
            content: 'https://twitter.com/nexusgql',
            published: true,
          },
        ],
      },
    },
  });
  
  console.log('✅ Created Alice and Bob\n', { alice, bob });

  // Configuration for mass data generation
  const NUM_USERS = 1000;
  const MIN_POSTS_PER_USER = 1;
  const MAX_POSTS_PER_USER = 10;
  const BATCH_SIZE = 100;

  console.log(`\n📊 Configuration for mass data:`);
  console.log(`   - Additional Users: ${NUM_USERS}`);
  console.log(`   - Posts per user: ${MIN_POSTS_PER_USER}-${MAX_POSTS_PER_USER}`);
  console.log(`   - Batch size: ${BATCH_SIZE}\n`);

  // Create users in batches
  console.log('👥 Creating additional users...');
  const userIds: number[] = [];
  
  for (let i = 0; i < NUM_USERS; i += BATCH_SIZE) {
    const batchSize = Math.min(BATCH_SIZE, NUM_USERS - i);
    const userBatch = [];
    
    for (let j = 0; j < batchSize; j++) {
      const index = i + j;
      userBatch.push({
        email: generateEmail(index),
        name: generateName() // All users have names
      });
    }
    
    // Create users and then fetch their IDs
    await prisma.user.createMany({
      data: userBatch
    });
    
    // Fetch the IDs of the users we just created
    const createdUsers = await prisma.user.findMany({
      where: {
        email: {
          in: userBatch.map(u => u.email)
        }
      },
      select: { id: true }
    });
    
    userIds.push(...createdUsers.map(u => u.id));
    
    console.log(`   ✓ Created users ${i + 1}-${i + batchSize} of ${NUM_USERS}`);
  }

  console.log(`✅ Created ${userIds.length} additional users\n`);

  // Create posts in batches
  console.log('📝 Creating posts...');
  let totalPosts = 0;
  
  for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
    const batchUserIds = userIds.slice(i, i + BATCH_SIZE);
    const postBatch = [];
    
    for (const userId of batchUserIds) {
      const numPosts = Math.floor(Math.random() * (MAX_POSTS_PER_USER - MIN_POSTS_PER_USER + 1)) + MIN_POSTS_PER_USER;
      
      for (let j = 0; j < numPosts; j++) {
        postBatch.push({
          title: generateTitle(),
          content: Math.random() > 0.2 ? generateContent() : null, // 80% have content
          published: Math.random() > 0.3, // 70% are published
          authorId: userId
        });
      }
    }
    
    await prisma.post.createMany({
      data: postBatch
    });
    
    totalPosts += postBatch.length;
    console.log(`   ✓ Created posts for users ${i + 1}-${Math.min(i + BATCH_SIZE, userIds.length)}`);
  }

  console.log(`✅ Created ${totalPosts} posts\n`);

  // Summary
  const userCount = await prisma.user.count();
  const postCount = await prisma.post.count();
  const publishedCount = await prisma.post.count({ where: { published: true } });
  const avgPostsPerUser = (postCount / userCount).toFixed(2);

  console.log('📊 Final Summary:');
  console.log(`   - Total Users: ${userCount} (including Alice & Bob)`);
  console.log(`   - Total Posts: ${postCount}`);
  console.log(`   - Published Posts: ${publishedCount}`);
  console.log(`   - Average Posts per User: ${avgPostsPerUser}`);
  console.log('\n✨ Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })