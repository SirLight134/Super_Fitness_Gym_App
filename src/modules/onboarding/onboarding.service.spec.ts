import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { S3Service } from 'src/s3/s3.service';
import { Onboarding } from './entities/onboarding.entity';
import { OnboardingService } from './onboarding.service';

describe('OnboardingService', () => {
  let service: OnboardingService;

  const mockRepo = {
    find: jest.fn().mockResolvedValue([{ id: 1, title: 'Test' }]),
  };

  const mockS3 = { uploadFile: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OnboardingService,
        { provide: getRepositoryToken(Onboarding), useValue: mockRepo },
        { provide: S3Service, useValue: mockS3 },
      ],
    }).compile();

    service = module.get<OnboardingService>(OnboardingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all screens', async () => {
    const result = await service.findAll();
    expect(result).toEqual([{ id: 1, title: 'Test' }]);
  });
});
