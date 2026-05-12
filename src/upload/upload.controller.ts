import {
  Controller, Post, UseInterceptors, UploadedFile, UploadedFiles,
  UseGuards, BadRequestException, Delete, Param,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UploadService } from './upload.service';

const imageFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  if (!file.mimetype.match(/^image\//)) {
    return cb(new BadRequestException('Only image files are allowed'), false);
  }
  cb(null, true);
};

const storage = diskStorage({
  destination: './uploads',
  filename: (_req, file, cb) => {
    cb(null, `${uuid()}${extname(file.originalname)}`);
  },
});

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file', { storage, fileFilter: imageFilter, limits: { fileSize: 10 * 1024 * 1024 } }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.uploadService.processUpload(file);
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 20, { storage, fileFilter: imageFilter, limits: { fileSize: 10 * 1024 * 1024 } }))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files?.length) throw new BadRequestException('No files uploaded');
    return Promise.all(files.map(f => this.uploadService.processUpload(f)));
  }

  @Delete(':filename')
  async deleteImage(@Param('filename') filename: string) {
    return this.uploadService.deleteFile(filename);
  }
}
