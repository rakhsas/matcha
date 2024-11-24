import { Module } from './core/module';
// import { UserModule } from './modules/user/user.module';
import { logger } from './core/logger/logger';
import { repository } from './repository/index';

export class AppModule extends Module {
  protected initialize(): void {
    logger.log('Initializing application modules...');
  }
}
