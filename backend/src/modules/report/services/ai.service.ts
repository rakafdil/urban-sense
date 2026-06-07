/**
 * @file src/modules/reports/services/ai.service.ts
 * @description Service untuk integrasi dengan LLaVA-OneVision-1.5 via Hugging Face Spaces.
 * Diperbarui untuk menyesuaikan struktur input ChatInterface (Multimodal) dari app.py
 */

import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Client } from '@gradio/client';

export interface AiAnalysisResult {
  category: string;
  severity: string;
  summary: string;
}

interface GradioPredictResult {
  data?: unknown[];
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor() {}

  async analyzeReportPhoto(
    photoUrl: string,
    description: string,
  ): Promise<AiAnalysisResult> {
    try {
      this.logger.log(
        'Mengirim request ke LLaVA-OneVision-1.5 via Hugging Face Space...',
      );

      const promptText = `Anda adalah asisten AI untuk "UrbanSense", platform pelaporan infrastruktur kota.
Berdasarkan gambar ini dan deskripsi warga: "${description}"
Berikan analisis Anda HANYA dalam format JSON murni tanpa markdown, tanpa penjelasan tambahan. Struktur HANYA seperti ini:
{
  "category": "salah satu dari: road_damage, flood, garbage, street_light, drainage, social_assistance, environment, other",
  "severity": "salah satu dari: low, medium, high, critical",
  "summary": "Ringkasan singkat 1-2 kalimat dalam Bahasa Indonesia"
}`;

      const app = await Client.connect('lmms-lab/LLaVA-OneVision-1.5');

      const result = (await app.predict('/chat', [
        {
          text: promptText,
          files: [photoUrl],
        },
        [],
        'LLaVA-OneVision-1.5-8B-Instruct',
      ])) as GradioPredictResult;

      const firstData = result.data?.[0];

      if (typeof firstData !== 'string') {
        throw new Error(
          'Response data dari LLaVA tidak valid atau bukan merupakan teks.',
        );
      }

      let responseContent = firstData;
      responseContent = responseContent
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const parsedData = JSON.parse(responseContent) as AiAnalysisResult;

      this.logger.log(
        `Hasil AI: Kategori [${parsedData.category}], Severity [${parsedData.severity}]`,
      );

      return parsedData;
    } catch (error: unknown) {
      let errorMessage = 'Terjadi kesalahan tidak dikenal';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      this.logger.error(
        `Gagal menganalisis foto dengan LLaVA: ${errorMessage}`,
        errorStack,
      );

      throw new HttpException(
        'Layanan analisis AI sedang tidak tersedia.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
