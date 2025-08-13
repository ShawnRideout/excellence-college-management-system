const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testAuth() {
  try {
    console.log('🔍 Testing authentication...');
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: 'admin@college.com' }
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive
    });
    
    // Test password verification
    const testPassword = 'AdminPass123!';
    const isValid = await bcrypt.compare(testPassword, user.password);
    
    console.log('🔐 Password test:');
    console.log('  - Test password:', testPassword);
    console.log('  - Stored hash:', user.password.substring(0, 20) + '...');
    console.log('  - Password valid:', isValid);
    
    // Test with different case
    const userLowerCase = await prisma.user.findUnique({
      where: { email: 'admin@college.com'.toLowerCase() }
    });
    
    console.log('📧 Email case test:', userLowerCase ? 'Found' : 'Not found');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();
