import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { PushInstallation } from './push-installation.entity.js'
import { PushInstallationRepository } from './push-installation.repository.js'

@Module({
  imports: [TypeOrmModule.forFeature([PushInstallation])],
  providers: [PushInstallationRepository],
  exports: [PushInstallationRepository]
})
export class PushInstallationModule {}
