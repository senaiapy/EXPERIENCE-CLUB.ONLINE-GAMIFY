import { PrismaClient, TaskType } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedGameData(prismaClient: PrismaClient) {
  console.log('🎮 Seeding game tasks...');
  const prismaToUse = prismaClient;

  const tasks = [
    {
      name: 'Registro Completo',
      description: 'Complete seu cadastro no Experience Club',
      coinReward: 50,
      taskType: TaskType.REGISTRATION,
      delayHours: 0,
      orderIndex: 1,
      isActive: true,
      verificationRequired: false,
      instructions: 'Seu cadastro já está completo! Moedas creditadas automaticamente.',
    },
    {
      name: 'Instalar o App',
      description: 'Baixe e instale nosso aplicativo mobile',
      coinReward: 50,
      taskType: TaskType.APP_INSTALL,
      delayHours: 24,
      orderIndex: 2,
      isActive: true,
      verificationRequired: false,
      instructions: 'Baixe o app Experience Club na App Store ou Google Play.',
    },
    {
      name: 'Publicar Selfie',
      description: 'Tire uma selfie com o app e poste nas redes sociais',
      coinReward: 50,
      taskType: TaskType.SELFIE,
      delayHours: 24,
      orderIndex: 3,
      isActive: true,
      verificationRequired: true,
      instructions: 'Tire uma selfie mostrando o app e poste em suas redes sociais com #ExperienceClub',
    },
    {
      name: 'Convidar 5 Amigos',
      description: 'Envie o link de convite para 5 amigos',
      coinReward: 100,
      taskType: TaskType.REFERRAL,
      delayHours: 48,
      orderIndex: 4,
      isActive: true,
      verificationRequired: false,
      instructions: 'Compartilhe seu código de convite e ganhe 20 moedas por cada amigo que se registrar!',
    },
    {
      name: 'Login Diário',
      description: 'Faça login no app todos os dias',
      coinReward: 10,
      taskType: TaskType.DAILY_LOGIN,
      delayHours: 24,
      orderIndex: 5,
      isActive: true,
      verificationRequired: false,
      instructions: 'Entre no app diariamente para ganhar moedas de bônus!',
    },
    {
      name: 'Compartilhar Link',
      description: 'Compartilhe o Experience Club no WhatsApp',
      coinReward: 30,
      taskType: TaskType.SHARE_LINK,
      delayHours: 24,
      orderIndex: 6,
      isActive: true,
      verificationRequired: false,
      instructions: 'Compartilhe nosso link nas suas redes sociais ou WhatsApp.',
    },
    {
      name: 'Assistir Vídeo',
      description: 'Assista ao vídeo de apresentação completo',
      coinReward: 20,
      taskType: TaskType.WATCH_VIDEO,
      delayHours: 24,
      orderIndex: 7,
      isActive: true,
      verificationRequired: false,
      instructions: 'Assista ao vídeo completo sobre como funciona o Experience Club.',
    },
    {
      name: 'Responder Pesquisa',
      description: 'Complete a pesquisa de satisfação',
      coinReward: 40,
      taskType: TaskType.SURVEY,
      delayHours: 72,
      orderIndex: 8,
      isActive: true,
      verificationRequired: false,
      instructions: 'Responda nossa breve pesquisa de 5 perguntas sobre sua experiência.',
    },
  ];

  for (const task of tasks) {
    const existing = await prismaToUse.gameTask.findFirst({
      where: { orderIndex: task.orderIndex },
    });

    if (existing) {
      await prismaToUse.gameTask.update({
        where: { id: existing.id },
        data: task,
      });
    } else {
      await prismaToUse.gameTask.create({
        data: task,
      });
    }
  }

  console.log(`✅ Created/Updated ${tasks.length} game tasks`);
}

// Keep standalone execution for direct script runs
async function main() {
  try {
    await seedGameData(prisma);
    console.log('✅ Game seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding game data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Only run main if this file is executed directly
if (require.main === module) {
  main();
}
