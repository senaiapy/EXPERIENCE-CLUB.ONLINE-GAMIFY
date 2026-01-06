import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateTaskDto, UpdateTaskDto } from '../dto';

@ApiTags('game/tasks')
@Controller('game/tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active tasks' })
  async getAllTasks() {
    const tasks = await this.tasksService.getAllTasks();
    return { tasks };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  async getTask(@Param('id') id: string) {
    const task = await this.tasksService.getTaskById(id);
    return { task };
  }

  @Get('user/my-tasks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user tasks' })
  async getUserTasks(@Request() req) {
    const userTasks = await this.tasksService.getUserTasks(req.user.userId);
    return { userTasks };
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create task (Admin only)' })
  async createTask(@Body() data: CreateTaskDto) {
    const task = await this.tasksService.createTask(data);
    return { task };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update task (Admin only)' })
  async updateTask(@Param('id') id: string, @Body() data: UpdateTaskDto) {
    const task = await this.tasksService.updateTask(id, data);
    return { task };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete task (Admin only)' })
  async deleteTask(@Param('id') id: string) {
    await this.tasksService.deleteTask(id);
    return { success: true };
  }
}
