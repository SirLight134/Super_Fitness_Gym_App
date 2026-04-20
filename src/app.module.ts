import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { getEnvName } from './config/utils/get-env-name';
import { validate } from './config/utils/validate-config';
import { CommonEnvValidation } from './config/validation/common.env.validation';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './config/database.config';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: getEnvName(),
      validate: validate(CommonEnvValidation),
      cache: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // Response Interceptor —> wraps successful responses in { success, data, meta }
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
