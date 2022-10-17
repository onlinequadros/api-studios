import { Body, Controller, Post } from '@nestjs/common';
import { BucketS3Service } from './bucket-s3.service';

@Controller('bucket-s3')
export class BucketS3Controller {
    constructor(private readonly s3Service: BucketS3Service) {}

    @Post()
    async createS3Bucket(@Body() tenancyCompany: object) {
        return await this.s3Service.createCompanyFolder(tenancyCompany['tenancyCompany']);
    }
}
