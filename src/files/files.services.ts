import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import PublicFile from './publicFile.entity'
import { ConfigService } from '@nestjs/config'
import { S3 } from 'aws-sdk'
import { v4 as uuid } from 'uuid'

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(PublicFile)
    private publicFileRepository: Repository<PublicFile>,
    private readonly configService: ConfigService
  ) { }

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3()
    const uploadResult = await s3.upload({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Body: dataBuffer,
      Key: `${uuid()}-${filename}`
    }).promise()

    const newFile = this.publicFileRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location
    })
    await this.publicFileRepository.save(newFile)
    return newFile
  }


}
