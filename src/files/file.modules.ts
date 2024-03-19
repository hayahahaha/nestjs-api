import { Module } from '@nestjs/common'
import { FilesService } from './files.services'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { PublicFile } from './publicFile.entity'

@Module({
  imports: [TypeOrmModule.forFeature([PublicFile]), ConfigModule],
  providers: [FilesService],
  exports: [FilesService]
})

export class FileModule { }

