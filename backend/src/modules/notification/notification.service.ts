import {
    Injectable,
} from '@nestjs/common';
import { PrismaService }
    from '../prisma/prisma.service';
import { firebaseMessaging }
    from './firebase/firebase-admin';

@Injectable()
export class NotificationService {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async saveFcmToken(
        userId: string,
        token: string,
    ) {
        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                fcmToken: token,
            },
        });
    }

    async sendToToken(
        token: string,
        title: string,
        body: string,
    ) {
        if (!firebaseMessaging) {
            console.log(
                '[MOCK PUSH TOKEN]',
                {
                    token,
                    title,
                    body,
                },
            );

            return {
                success: true,
                mocked: true,
            };
        }

        return firebaseMessaging.send({
            token,
            notification: {
                title,
                body,
            },
        });
    }

    async sendToRole(
        role: string,
        title: string,
        body: string,
    ) {
        const users =
            await this.prisma.user.findMany({
                where: {
                    role: role as any,
                    fcmToken: {
                        not: null,
                    },
                },
            });

        const tokens =
            users
                .map((u) => u.fcmToken)
                .filter(Boolean);

        if (!tokens.length) {
            return {
                success: false,
                message:
                    'No users with FCM token',
            };
        }

        // MOCK MODE
        if (!firebaseMessaging) {
            console.log(
                '[MOCK PUSH]',
                {
                    role,
                    title,
                    body,
                    recipients: tokens.length,
                    sentAt: new Date(),
                },
            );

            return {
                success: true,
                mocked: true,
                recipients: tokens.length,
                title,
                body,
            };
        }

        return firebaseMessaging.sendEachForMulticast({
            tokens: tokens as string[],
            notification: {
                title,
                body,
            },
        });
    }

    async notifyReportResolved(
        reportId: string,
    ) {
        const report =
            await this.prisma.report.findUnique({
                where: {
                    id: reportId,
                },
                include: {
                    user: true,
                },
            });

        if (
            !report ||
            !report.user?.fcmToken
        ) {
            return;
        }

        return this.sendToToken(
            report.user.fcmToken,
            'Laporan Selesai, HIDUPP JOKOWIII!!!!',
            'Laporan Anda telah diselesaikan, Makasih ya tedy yang lucuu',
        );
    }
}