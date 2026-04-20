import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { getEnvName } from './config/utils/get-env-name';
import { validate } from './config/utils/validate-config';
import { CommonEnvValidation } from './config/validation/common.env.validation';
import { DatabaseModule } from './database/database.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { S3Service } from './s3/s3.service';

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
    OnboardingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // Response Interceptor —> wraps successful responses in { success, data, meta }
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },

    S3Service,
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger('Database');

  constructor(private readonly dataSource: DataSource) {}

  onModuleInit() {
    try {
      if (this.dataSource.isInitialized) {
        const dbName = String(this.dataSource.options.database || 'unknown');
        this.logger.log(`Connected to database: ${dbName} successfully!`);
      }
    } catch (error) {
      this.logger.error('Database connection failed!');
      this.logger.error(error);
    }
  }
}
