import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as argon2 from 'argon2';

const pool = new Pool({
  connectionString:
    process.env['NODE_ENV'] === 'production'
      ? process.env['DATABASE_URL_NEON']
      : process.env['DATABASE_URL'],
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  // ------------------------------------------------------------------ //
  //  Clean up (order matters – children first)
  // ------------------------------------------------------------------ //
  await prisma.notification.deleteMany();
  await prisma.reportValidation.deleteMany();
  await prisma.reportStatusLog.deleteMany();
  await prisma.reportDistrict.deleteMany();
  await prisma.report.deleteMany();
  await prisma.district.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared existing data');

  // ------------------------------------------------------------------ //
  //  Users
  // ------------------------------------------------------------------ //
  const passwordHash = await argon2.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      fullName: 'Admin Surabaya',
      email: 'admin@surabaya.go.id',
      passwordHash,
      role: 'admin',
      totalPoints: 0,
    },
  });

  const volunteers = await Promise.all([
    prisma.user.create({
      data: {
        fullName: 'Budi Santoso',
        email: 'budi.santoso@gmail.com',
        passwordHash,
        role: 'volunteer',
        totalPoints: 150,
      },
    }),
    prisma.user.create({
      data: {
        fullName: 'Siti Rahayu',
        email: 'siti.rahayu@gmail.com',
        passwordHash,
        role: 'volunteer',
        totalPoints: 320,
      },
    }),
    prisma.user.create({
      data: {
        fullName: 'Agus Pramono',
        email: 'agus.pramono@yahoo.com',
        passwordHash,
        role: 'volunteer',
        totalPoints: 75,
      },
    }),
    prisma.user.create({
      data: {
        fullName: 'Dewi Kusuma',
        email: 'dewi.kusuma@gmail.com',
        passwordHash,
        role: 'volunteer',
        totalPoints: 210,
      },
    }),
  ]);

  console.log(`👤 Created ${1 + volunteers.length} users`);

  // ------------------------------------------------------------------ //
  //  Districts (kecamatan Surabaya)
  // ------------------------------------------------------------------ //
  const districtNames = [
    'Gubeng',
    'Genteng',
    'Tambaksari',
    'Wonokromo',
    'Rungkut',
    'Sukolilo',
    'Mulyorejo',
    'Kenjeran',
    'Semampir',
    'Krembangan',
  ];

  const districts = await Promise.all(
    districtNames.map((name) => prisma.district.create({ data: { name } })),
  );

  console.log(`🗺️  Created ${districts.length} districts`);

  // ------------------------------------------------------------------ //
  //  Reports
  // ------------------------------------------------------------------ //
  const reportsData = [
    {
      userId: volunteers[0].id,
      title: 'Jalan berlubang di Jl. Pemuda',
      description:
        'Terdapat lubang besar di tengah jalan yang berbahaya bagi pengendara motor. Sudah ada beberapa kejadian motor terperosok.',
      category: 'road_damage' as const,
      status: 'open' as const,
      severity: 'high' as const,
      priorityScore: 85,
      latitude: -7.2575,
      longitude: 112.7521,
      address: 'Jl. Pemuda No. 12, Genteng, Surabaya',
      upvoteCount: 24,
      downvoteCount: 1,
      validationStatus: 'validated' as const,
      aiSummary:
        'Kerusakan jalan parah berupa lubang besar di ruas Jl. Pemuda yang berpotensi menyebabkan kecelakaan lalu lintas.',
      districtId: districts[1].id, // Genteng
    },
    {
      userId: volunteers[1].id,
      title: 'Banjir di kawasan Rungkut Industri',
      description:
        'Air menggenang setinggi 30-40 cm akibat hujan deras semalam. Saluran drainase tersumbat sampah.',
      category: 'flood' as const,
      status: 'in_progress' as const,
      severity: 'critical' as const,
      priorityScore: 95,
      latitude: -7.3141,
      longitude: 112.7894,
      address: 'Jl. Rungkut Industri III, Rungkut, Surabaya',
      upvoteCount: 56,
      downvoteCount: 2,
      validationStatus: 'validated' as const,
      aiSummary:
        'Banjir kritis di kawasan industri Rungkut akibat penyumbatan drainase, memerlukan penanganan segera.',
      districtId: districts[4].id, // Rungkut
    },
    {
      userId: volunteers[2].id,
      title: 'Tumpukan sampah liar di Tambaksari',
      description:
        'Ada tumpukan sampah yang tidak diangkut selama lebih dari seminggu di pinggir jalan. Menimbulkan bau tidak sedap dan mengganggu warga sekitar.',
      category: 'garbage' as const,
      status: 'open' as const,
      severity: 'medium' as const,
      priorityScore: 60,
      latitude: -7.2491,
      longitude: 112.7615,
      address: 'Jl. Tambaksari Baru, Tambaksari, Surabaya',
      upvoteCount: 18,
      downvoteCount: 0,
      validationStatus: 'validated' as const,
      aiSummary:
        'Penumpukan sampah ilegal di area permukiman Tambaksari yang berpotensi menimbulkan masalah kesehatan.',
      districtId: districts[2].id, // Tambaksari
    },
    {
      userId: volunteers[3].id,
      title: 'Lampu jalan mati di sepanjang Jl. Kenjeran',
      description:
        'Sebanyak 5 titik lampu jalan tidak berfungsi sejak 3 hari lalu. Jalanan menjadi gelap dan rawan kejahatan pada malam hari.',
      category: 'street_light' as const,
      status: 'resolved' as const,
      severity: 'medium' as const,
      priorityScore: 55,
      latitude: -7.2343,
      longitude: 112.7789,
      address: 'Jl. Kenjeran, Kenjeran, Surabaya',
      upvoteCount: 31,
      downvoteCount: 0,
      validationStatus: 'validated' as const,
      aiSummary:
        'Lima titik lampu jalan padam di Jl. Kenjeran, meningkatkan risiko keamanan di malam hari.',
      districtId: districts[7].id, // Kenjeran
    },
    {
      userId: volunteers[0].id,
      title: 'Saluran drainase tersumbat di Gubeng',
      description:
        'Drainase di Jl. Gubeng Kertajaya tersumbat dan menyebabkan air meluap ke jalan saat hujan. Perlu segera dibersihkan.',
      category: 'drainage' as const,
      status: 'open' as const,
      severity: 'high' as const,
      priorityScore: 78,
      latitude: -7.2661,
      longitude: 112.7543,
      address: 'Jl. Gubeng Kertajaya No. 45, Gubeng, Surabaya',
      upvoteCount: 15,
      downvoteCount: 1,
      validationStatus: 'validated' as const,
      aiSummary:
        'Penyumbatan drainase di Gubeng Kertajaya menyebabkan genangan air yang mengganggu arus lalu lintas.',
      districtId: districts[0].id, // Gubeng
    },
    {
      userId: volunteers[1].id,
      title: 'Pencemaran sungai di Sukolilo',
      description:
        'Air sungai di wilayah Sukolilo berwarna hitam dan berbau busuk. Diduga ada pembuangan limbah industri secara ilegal.',
      category: 'environment' as const,
      status: 'in_progress' as const,
      severity: 'critical' as const,
      priorityScore: 92,
      latitude: -7.2914,
      longitude: 112.7998,
      address: 'Sungai Sukolilo, Sukolilo, Surabaya',
      upvoteCount: 47,
      downvoteCount: 3,
      validationStatus: 'validated' as const,
      aiSummary:
        'Pencemaran sungai berat di Sukolilo dengan indikasi pembuangan limbah industri ilegal yang memerlukan investigasi segera.',
      districtId: districts[5].id, // Sukolilo
    },
    {
      userId: volunteers[2].id,
      title: 'Warga kurang mampu butuh bantuan sosial',
      description:
        'Ada beberapa keluarga di RT 03 RW 07 Semampir yang membutuhkan bantuan sosial namun belum terdaftar dalam program pemerintah.',
      category: 'social_assistance' as const,
      status: 'open' as const,
      severity: 'medium' as const,
      priorityScore: 65,
      latitude: -7.2287,
      longitude: 112.7456,
      address: 'RT 03 RW 07, Semampir, Surabaya',
      upvoteCount: 22,
      downvoteCount: 0,
      validationStatus: 'pending' as const,
      aiSummary:
        'Permintaan bantuan sosial untuk keluarga tidak mampu di Semampir yang belum terdata dalam sistem bantuan pemerintah.',
      districtId: districts[8].id, // Semampir
    },
    {
      userId: volunteers[3].id,
      title: 'Kerusakan trotoar di Jl. Diponegoro',
      description:
        'Trotoar pecah dan berlubang di beberapa titik, membahayakan pejalan kaki terutama lansia dan anak-anak.',
      category: 'road_damage' as const,
      status: 'rejected' as const,
      severity: 'low' as const,
      priorityScore: 30,
      latitude: -7.2712,
      longitude: 112.7388,
      address: 'Jl. Diponegoro, Krembangan, Surabaya',
      upvoteCount: 8,
      downvoteCount: 5,
      validationStatus: 'disputed' as const,
      aiSummary:
        'Laporan kerusakan trotoar di Jl. Diponegoro — status ditolak karena area tersebut sudah masuk dalam rencana renovasi.',
      districtId: districts[9].id, // Krembangan
    },
  ];

  const reports = await Promise.all(
    reportsData.map(({ districtId, ...data }) =>
      prisma.report.create({ data }),
    ),
  );

  console.log(`📋 Created ${reports.length} reports`);

  // ------------------------------------------------------------------ //
  //  ReportDistrict (many-to-many)
  // ------------------------------------------------------------------ //
  await Promise.all(
    reportsData.map((r, i) =>
      prisma.reportDistrict.create({
        data: {
          reportId: reports[i].id,
          districtId: r.districtId,
        },
      }),
    ),
  );

  console.log('🔗 Linked reports to districts');

  // ------------------------------------------------------------------ //
  //  ReportStatusLogs
  // ------------------------------------------------------------------ //
  const statusLogs = [
    // Report 1 – open (no previous)
    {
      reportId: reports[0].id,
      updatedBy: admin.id,
      oldStatus: null,
      newStatus: 'open' as const,
      notes: 'Laporan diterima dan dicatat.',
    },
    // Report 2 – open → in_progress
    {
      reportId: reports[1].id,
      updatedBy: admin.id,
      oldStatus: null,
      newStatus: 'open' as const,
      notes: 'Laporan diterima.',
    },
    {
      reportId: reports[1].id,
      updatedBy: admin.id,
      oldStatus: 'open' as const,
      newStatus: 'in_progress' as const,
      notes: 'Tim lapangan sudah dikirim ke lokasi.',
    },
    // Report 4 – open → in_progress → resolved
    {
      reportId: reports[3].id,
      updatedBy: admin.id,
      oldStatus: null,
      newStatus: 'open' as const,
      notes: 'Laporan diterima.',
    },
    {
      reportId: reports[3].id,
      updatedBy: admin.id,
      oldStatus: 'open' as const,
      newStatus: 'in_progress' as const,
      notes: 'Teknisi dikirim ke lokasi.',
    },
    {
      reportId: reports[3].id,
      updatedBy: admin.id,
      oldStatus: 'in_progress' as const,
      newStatus: 'resolved' as const,
      notes: 'Lampu jalan sudah diperbaiki seluruhnya.',
    },
    // Report 8 – open → rejected
    {
      reportId: reports[7].id,
      updatedBy: admin.id,
      oldStatus: null,
      newStatus: 'open' as const,
      notes: 'Laporan diterima.',
    },
    {
      reportId: reports[7].id,
      updatedBy: admin.id,
      oldStatus: 'open' as const,
      newStatus: 'rejected' as const,
      notes:
        'Ditolak karena area sudah masuk dalam rencana perbaikan trotoar kota tahun ini.',
    },
  ];

  await Promise.all(
    statusLogs.map((log) => prisma.reportStatusLog.create({ data: log })),
  );

  console.log(`📝 Created ${statusLogs.length} status logs`);

  // ------------------------------------------------------------------ //
  //  ReportValidations (upvotes / downvotes)
  // ------------------------------------------------------------------ //
  const allVolunteerIds = volunteers.map((v) => v.id);

  // Helper: create validations for a report without duplicate user entries
  type VoteData = {
    reportId: string;
    userId: string;
    vote: 'upvote' | 'downvote';
  };

  const validationData: VoteData[] = [
    // Report 1 – road damage
    { reportId: reports[0].id, userId: allVolunteerIds[1], vote: 'upvote' },
    { reportId: reports[0].id, userId: allVolunteerIds[2], vote: 'upvote' },
    { reportId: reports[0].id, userId: allVolunteerIds[3], vote: 'upvote' },
    // Report 2 – flood
    { reportId: reports[1].id, userId: allVolunteerIds[0], vote: 'upvote' },
    { reportId: reports[1].id, userId: allVolunteerIds[2], vote: 'upvote' },
    { reportId: reports[1].id, userId: allVolunteerIds[3], vote: 'upvote' },
    // Report 3 – garbage
    { reportId: reports[2].id, userId: allVolunteerIds[0], vote: 'upvote' },
    { reportId: reports[2].id, userId: allVolunteerIds[1], vote: 'upvote' },
    { reportId: reports[2].id, userId: allVolunteerIds[3], vote: 'upvote' },
    // Report 5 – drainage
    { reportId: reports[4].id, userId: allVolunteerIds[1], vote: 'upvote' },
    { reportId: reports[4].id, userId: allVolunteerIds[2], vote: 'upvote' },
    { reportId: reports[4].id, userId: allVolunteerIds[3], vote: 'downvote' },
    // Report 6 – environment
    { reportId: reports[5].id, userId: allVolunteerIds[0], vote: 'upvote' },
    { reportId: reports[5].id, userId: allVolunteerIds[2], vote: 'upvote' },
    { reportId: reports[5].id, userId: allVolunteerIds[3], vote: 'upvote' },
    // Report 8 – road damage (disputed)
    { reportId: reports[7].id, userId: allVolunteerIds[0], vote: 'upvote' },
    { reportId: reports[7].id, userId: allVolunteerIds[1], vote: 'downvote' },
    { reportId: reports[7].id, userId: allVolunteerIds[2], vote: 'downvote' },
  ];

  await Promise.all(
    validationData.map((v) => prisma.reportValidation.create({ data: v })),
  );

  console.log(`✅ Created ${validationData.length} validations`);

  // ------------------------------------------------------------------ //
  //  Notifications
  // ------------------------------------------------------------------ //
  const notificationsData = [
    {
      userId: volunteers[0].id,
      title: 'Laporan Anda divalidasi',
      message:
        'Laporan "Jalan berlubang di Jl. Pemuda" telah divalidasi oleh komunitas.',
      isRead: false,
    },
    {
      userId: volunteers[1].id,
      title: 'Status laporan diperbarui',
      message:
        'Laporan "Banjir di kawasan Rungkut Industri" sedang dalam proses penanganan.',
      isRead: true,
    },
    {
      userId: volunteers[2].id,
      title: 'Laporan Anda divalidasi',
      message:
        'Laporan "Tumpukan sampah liar di Tambaksari" telah divalidasi oleh komunitas.',
      isRead: false,
    },
    {
      userId: volunteers[3].id,
      title: 'Laporan diselesaikan',
      message:
        'Laporan "Lampu jalan mati di sepanjang Jl. Kenjeran" telah berhasil diselesaikan. Terima kasih atas kontribusi Anda!',
      isRead: true,
    },
    {
      userId: volunteers[3].id,
      title: 'Laporan ditolak',
      message:
        'Laporan "Kerusakan trotoar di Jl. Diponegoro" ditolak karena area tersebut sudah masuk rencana perbaikan kota.',
      isRead: false,
    },
    {
      userId: volunteers[0].id,
      title: 'Poin bertambah',
      message:
        'Selamat! Anda mendapatkan 50 poin karena laporan Anda divalidasi oleh komunitas.',
      isRead: false,
    },
    {
      userId: volunteers[1].id,
      title: 'Poin bertambah',
      message:
        'Selamat! Anda mendapatkan 100 poin karena laporan kritis Anda berhasil ditindaklanjuti.',
      isRead: false,
    },
  ];

  await Promise.all(
    notificationsData.map((n) => prisma.notification.create({ data: n })),
  );

  console.log(`🔔 Created ${notificationsData.length} notifications`);

  // ------------------------------------------------------------------ //
  //  Summary
  // ------------------------------------------------------------------ //
  console.log('\n✨ Seed completed successfully!');
  console.log('─'.repeat(40));
  console.log(
    `   Users        : ${1 + volunteers.length} (1 admin, ${volunteers.length} volunteers)`,
  );
  console.log(`   Districts    : ${districts.length}`);
  console.log(`   Reports      : ${reports.length}`);
  console.log(`   Status logs  : ${statusLogs.length}`);
  console.log(`   Validations  : ${validationData.length}`);
  console.log(`   Notifications: ${notificationsData.length}`);
  console.log('─'.repeat(40));
  console.log('   Default password for all users: password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
