import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

interface MulterFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
  size: number;
}
@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private readonly MAX_IMAGE_SIZE = 10 * 1024 * 1024;
  private readonly MAX_VIDEO_SIZE = 100 * 1024 * 1024;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      endpoint: this.configService.getOrThrow<string>('S3_ENDPOINT'),
      region: this.configService.getOrThrow<string>('S3_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow<string>('S3_SECRET_KEY'),
      },
      forcePathStyle: true,
    });
  }

  async uploadImage(file: MulterFile): Promise<string> {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File must be an image');
    }
    if (file.size > this.MAX_IMAGE_SIZE) {
      throw new BadRequestException(
        `Image size must be less than ${this.MAX_IMAGE_SIZE / 1024 / 1024}MB`,
      );
    }

    const fileName = `images/${Date.now()}-${file.originalname}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.get('S3_BUCKET_NAME'),
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const imageProxyUrl =
      this.configService.getOrThrow<string>('IMAGE_PROXY_URL');
    return `${imageProxyUrl}/${fileName}`;
  }

  async uploadVideo(file: Express.Multer.File): Promise<string> {
    if (!file.mimetype.startsWith('video/')) {
      throw new BadRequestException('File must be a video');
    }
    if (file.size > this.MAX_VIDEO_SIZE) {
      throw new BadRequestException(
        `Video size must be less than ${this.MAX_VIDEO_SIZE / 1024 / 1024}MB`,
      );
    }

    const fileName = `videos/${Date.now()}-${file.originalname}`;

    // Use multipart upload for videos
    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.configService.get('S3_BUCKET_NAME'),
        Key: fileName,
        Body: Readable.from(file.buffer),
        ContentType: file.mimetype,
      },
      queueSize: 4,
      partSize: 5 * 1024 * 1024,
    });

    await upload.done();

    const imageProxyUrl =
      this.configService.getOrThrow<string>('IMAGE_PROXY_URL');
    return `${imageProxyUrl}/${fileName}`;
  }

  // Generic method that detects file type
  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (file.mimetype.startsWith('image/')) {
      return this.uploadImage(file);
    } else if (file.mimetype.startsWith('video/')) {
      return this.uploadVideo(file);
    } else {
      throw new BadRequestException(
        'Unsupported file type. Only images and videos are allowed.',
      );
    }
  }
}
