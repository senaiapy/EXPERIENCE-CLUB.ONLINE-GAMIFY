import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

async function seedAdmin() {
  const prisma = new PrismaService();
  
  try {
    console.log('🌱 Seeding default admin user...');
    
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@experienceclub.com' }
    });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      return;
    }
    
    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123456', 10);

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@experienceclub.com',
        name: 'Administrator',
        password: hashedPassword,
        role: 'ADMIN',
      }
    });

    console.log('✅ Default admin user created successfully!');
    console.log('📧 Email: admin@experienceclub.com');
    console.log('🔐 Password: admin123456');
    console.log(`👤 User ID: ${adminUser.id}`);
    
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  seedAdmin()
    .then(() => {
      console.log('🎉 Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export default seedAdmin;