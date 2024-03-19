import { Injectable, HttpStatus, HttpException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { PublicFile } from './publicFile.entity'
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

  async deletePublic(fileId: number) {
    const file = await this.publicFileRepository.findOneBy({ id: fileId });
    if (!file) {
      throw new HttpException(
        'File not found',
        HttpStatus.BAD_REQUEST,
      );
    }
    const s3 = new S3()
    await s3.deleteObject({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: file.key,
    }).promise()

    await this.publicFileRepository.delete(fileId)

  }

}
