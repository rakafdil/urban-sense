/**
 * @file src/modules/gamification/gamification.service.ts
 * @description Service layer untuk menangani logika poin dan badge (Gamification Engine).
 * Service ini dipanggil oleh Controller lain (seperti VolunteerController) saat ada aksi positif.
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../modules/prisma/prisma.service';

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Menambahkan poin ke akun pengguna berdasarkan aksi tertentu.
   * @param userId ID pengguna (warga/relawan) yang akan menerima poin
   * @param points Jumlah poin yang diberikan
   * @param reason Alasan pemberian poin (misal: 'REPORT_VALIDATED' atau 'REPORT_SUBMITTED')
   */
  async addPoints(userId: string, points: number, reason: string) {
    this.logger.log(
      `Memicu penambahan ${points} poin untuk user ${userId}. Alasan: ${reason}`,
    );

    try {
      // =====================================================================
      // PENTING UNTUK HACKATHON:
      // Untuk menjalankan kode interaksi database di bawah ini, pastikan kamu
      // sudah menambahkan field `totalPoints Int @default(0)` ke model `User`
      // pada file schema.prisma kamu.
      // =====================================================================

      // ---------------------------------------------------------------------
      // Hapus komentar blok di bawah ini setelah schema.prisma diperbarui
      // ---------------------------------------------------------------------

      const result = await this.prisma.$transaction(async (tx) => {
        // 1. Tambahkan total poin pengguna menggunakan fungsi increment Prisma
        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: {
            totalPoints: { increment: points },
          },
        });

        // 2. (Opsional) Simpan riwayat penambahan ke tabel PointHistory
        // await tx.pointHistory.create({
        //   data: { userId, pointsAdded: points, reason }
        // });

        // 3. Logic Pemberian Badge (Contoh Sederhana)
        // if (updatedUser.totalPoints >= 100 && updatedUser.totalPoints < 120) {
        //    this.logger.log(`User ${userId} mendapatkan badge baru: "Pahlawan Kota"!`);
        //    // tx.userBadge.create(...)
        // }

        return updatedUser;
      });

      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Gagal menambahkan poin gamifikasi: ${errorMessage}`);

      // Catatan: Kita TIDAK melempar HttpException di sini.
      // Mengapa? Karena gagal menambah poin seharusnya tidak menggagalkan
      // proses bisnis utama (misal: laporan tetap valid meskipun sistem poin sedang down).
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Mengambil data profil gamifikasi pengguna (total poin, rank, badge)
   * Berguna untuk ditampilkan di halaman Profile Warga / Relawan
   */
  async getUserGamificationProfile(userId: string) {
    // Implementasi real:
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { totalPoints: true, badges: true },
    });
  }
}
