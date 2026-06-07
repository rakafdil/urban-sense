import {
    Body,
    Controller,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { NotificationService }
    from './notification.service';
import { SaveFcmTokenDto }
    from './dto/save-fcm-token.dto';
import { SendNotificationDto }
    from './dto/send-notification.dto';

@Controller('notifications')
export class NotificationController {

    constructor(
        private readonly notificationService:
            NotificationService,
    ) { }

    @Patch('users/:userId/token')
    saveToken(
        @Param('userId')
        userId: string,

        @Body()
        dto: SaveFcmTokenDto,
    ) {
        return this.notificationService
            .saveFcmToken(
                userId,
                dto.token,
            );
    }

    @Post('role')
    sendRoleNotification(
        @Body()
        dto: SendNotificationDto,
    ) {
        return this.notificationService
            .sendToRole(
                dto.role ?? 'volunteer',
                dto.title,
                dto.body,
            );
    }
}