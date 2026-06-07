/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import {
  v2 as cloudinary,
  type UploadApiErrorResponse,
  type UploadApiResponse,
} from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Mengunggah file buffer (biasanya dari FileInterceptor/Multer) ke Cloudinary
   * @param fileBuffer Buffer gambar yang akan diunggah
   * @returns URL aman (HTTPS) dari gambar yang berhasil diunggah
   */
  async uploadImage(fileBuffer: Buffer): Promise<string> {
    if (!fileBuffer) {
      throw new HttpException('Buffer file kosong', HttpStatus.BAD_REQUEST);
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'urbansense_reports',
          resource_type: 'image',
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            this.logger.error(
              `Cloudinary upload error: ${error.message}`,
              error,
            );
            return reject(
              new HttpException(
                'Gagal mengunggah foto ke penyimpanan awan',
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
            );
          }
          if (!result) {
            return reject(
              new HttpException(
                'Respon Cloudinary kosong',
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
            );
          }
          resolve(result.secure_url);
        },
      );

      const readableStream = new Readable();
      readableStream.push(fileBuffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });
  }
}
