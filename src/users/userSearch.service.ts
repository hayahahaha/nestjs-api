import { Injectable } from '@nestjs/common'
import { User } from './entities/user.entity'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { UserSearchBody } from './types/userSearchBody.interface'
import { UserSearchResult } from './types/userSearchResult.interface'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserSearchService {
  index: 'users'

  constructor(
    private elasticsearchService: ElasticsearchService
  ) { }

  async indexUser(user: User) {
    this.elasticsearchService.index<UserSearchBody>({
      index: this.index,
      id: user.id?.toString(),
      body: {
        id: user.id,
        email: user.email
      }
    })
  }

  async searchUser(text: string) {
    const { body } = await this.elasticsearchService.search<UserSearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['email']
          }
        }
      }
    })

    const hits = body.hits.hits;
    return hits.map(item => item._source)
  }

  async remove(userId: number) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: userId
          }
        }
      }
    })
  }

  async update(user: User) {
    const newBody = {
      id: user.id,
      email: user.email,
    }

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');

    return this.elasticsearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: user.id,
          }
        },
        script: {
          inline: script
        }
      }
    })

  }

}
