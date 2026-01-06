import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TaskStatus, TransactionType } from '@prisma/client';
import { CoinsService } from '../coins/coins.service';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private coinsService: CoinsService,
  ) {}

  async getAllTasks() {
    return this.prisma.gameTask.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async getTaskById(id: string) {
    const task = await this.prisma.gameTask.findUnique({
      where: { id },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async getUserTasks(userId: string) {
    return this.prisma.userTask.findMany({
      where: { userId },
      include: { task: true },
      orderBy: { task: { orderIndex: 'asc' } },
    });
  }

  async initializeUserTasks(userId: string) {
    const tasks = await this.getAllTasks();
    const userTasks: any[] = [];

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const status = i === 0 ? TaskStatus.AVAILABLE : TaskStatus.LOCKED;

      const userTask = await this.prisma.userTask.create({
        data: {
          userId,
          taskId: task.id,
          status,
          nextAvailableAt: i === 0 ? new Date() : null,
        },
      });
      userTasks.push(userTask);
    }

    return userTasks;
  }

  async startTask(userId: string, taskId: string) {
    const userTask = await this.prisma.userTask.findUnique({
      where: { userId_taskId: { userId, taskId } },
      include: { task: true },
    });

    if (!userTask) {
      throw new NotFoundException('User task not found');
    }

    if (userTask.status !== TaskStatus.AVAILABLE) {
      throw new BadRequestException('Task is not available');
    }

    return this.prisma.userTask.update({
      where: { id: userTask.id },
      data: {
        status: TaskStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
      include: { task: true },
    });
  }

  async completeTask(userId: string, taskId: string, proofUrl?: string) {
    const userTask = await this.prisma.userTask.findUnique({
      where: { userId_taskId: { userId, taskId } },
      include: { task: true },
    });

    if (!userTask) {
      throw new NotFoundException('User task not found');
    }

    if (userTask.status !== TaskStatus.IN_PROGRESS && userTask.status !== TaskStatus.AVAILABLE) {
      throw new BadRequestException('Task cannot be completed in current status');
    }

    const newStatus = userTask.task.verificationRequired
      ? TaskStatus.PENDING_VERIFY
      : TaskStatus.COMPLETED;

    const updated = await this.prisma.userTask.update({
      where: { id: userTask.id },
      data: {
        status: newStatus,
        completedAt: new Date(),
        proofUrl,
      },
      include: { task: true },
    });

    // Award coins immediately if no verification required
    if (!userTask.task.verificationRequired) {
      await this.coinsService.awardCoins(
        userId,
        userTask.task.coinReward,
        TransactionType.TASK_REWARD,
        `Task completed: ${userTask.task.name}`,
        userTask.id,
        'task',
      );

      // Unlock next task
      await this.unlockNextTask(userId, userTask.task.orderIndex);
    }

    return updated;
  }

  async verifyTask(userTaskId: string, approved: boolean, notes?: string) {
    const userTask = await this.prisma.userTask.findUnique({
      where: { id: userTaskId },
      include: { task: true, user: true },
    });

    if (!userTask) {
      throw new NotFoundException('User task not found');
    }

    if (userTask.status !== TaskStatus.PENDING_VERIFY) {
      throw new BadRequestException('Task is not pending verification');
    }

    const updated = await this.prisma.userTask.update({
      where: { id: userTaskId },
      data: {
        status: approved ? TaskStatus.COMPLETED : TaskStatus.AVAILABLE,
        verifiedAt: approved ? new Date() : null,
        verificationNotes: notes,
      },
      include: { task: true },
    });

    if (approved) {
      // Award coins
      await this.coinsService.awardCoins(
        userTask.userId,
        userTask.task.coinReward,
        TransactionType.TASK_REWARD,
        `Task verified: ${userTask.task.name}`,
        userTask.id,
        'task',
      );

      // Unlock next task
      await this.unlockNextTask(userTask.userId, userTask.task.orderIndex);
    }

    return updated;
  }

  private async unlockNextTask(userId: string, currentOrderIndex: number) {
    const nextTask = await this.prisma.gameTask.findFirst({
      where: {
        orderIndex: currentOrderIndex + 1,
        isActive: true,
      },
    });

    if (nextTask) {
      const nextUserTask = await this.prisma.userTask.findUnique({
        where: { userId_taskId: { userId, taskId: nextTask.id } },
      });

      if (nextUserTask && nextUserTask.status === TaskStatus.LOCKED) {
        const unlockTime = new Date();
        unlockTime.setHours(unlockTime.getHours() + nextTask.delayHours);

        await this.prisma.userTask.update({
          where: { id: nextUserTask.id },
          data: {
            status: TaskStatus.AVAILABLE,
            nextAvailableAt: unlockTime,
          },
        });
      }
    }
  }

  async createTask(data: any) {
    return this.prisma.gameTask.create({ data });
  }

  async updateTask(id: string, data: any) {
    return this.prisma.gameTask.update({
      where: { id },
      data,
    });
  }

  async deleteTask(id: string) {
    return this.prisma.gameTask.delete({
      where: { id },
    });
  }
}
