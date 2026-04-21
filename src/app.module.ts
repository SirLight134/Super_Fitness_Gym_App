import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { getEnvName } from './config/utils/get-env-name';
import { validate } from './config/utils/validate-config';
import { CommonEnvValidation } from './config/validation/common.env.validation';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './config/database.config';
import { UserModule } from './modules/user/user.module';
import jwtConfig from './config/jwt.config';
import { AuthModule } from './modules/Auth/auth.module';
import { JwtAuthGuard } from './modules/Auth/guards/jwt-auth.guard';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
      envFilePath: getEnvName(),
      validate: validate(CommonEnvValidation),
      cache: true,
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // Response Interceptor —> wraps successful responses in { success, data, meta }
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    // Global auth guard - all routes require auth by default
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
