import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProgressService } from './progress.service';
import { TasksService } from '../tasks/tasks.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { VerifyTaskDto } from '../dto';

@ApiTags('game/progress')
@Controller('game/progress')
export class ProgressController {
  constructor(
    private progressService: ProgressService,
    private tasksService: TasksService,
  ) {}

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user dashboard' })
  async getDashboard(@Request() req) {
    const dashboard = await this.progressService.getDashboard(req.user.userId);
    return dashboard;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user progress' })
  async getProgress(@Request() req) {
    const progress = await this.progressService.getProgress(req.user.userId);
    return progress;
  }

  @Post('start/:taskId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start a task' })
  async startTask(@Request() req, @Param('taskId') taskId: string) {
    const userTask = await this.tasksService.startTask(req.user.userId, taskId);
    return { userTask };
  }

  @Post('complete/:taskId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('proof', {
      storage: diskStorage({
        destination: './uploads/proofs',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Complete a task' })
  async completeTask(
    @Request() req,
    @Param('taskId') taskId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const proofUrl = file ? `/uploads/proofs/${file.filename}` : undefined;
    const userTask = await this.tasksService.completeTask(req.user.userId, taskId, proofUrl);
    return { userTask };
  }

  @Post('verify/:userTaskId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify task (Admin only)' })
  async verifyTask(
    @Param('userTaskId') userTaskId: string,
    @Body() body: VerifyTaskDto,
  ) {
    const userTask = await this.tasksService.verifyTask(userTaskId, body.approved, body.notes);
    return { userTask };
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users progress (Admin only)' })
  async getAllUsersProgress() {
    return this.progressService.getAllUsersProgress();
  }
}
