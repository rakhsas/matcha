import { Module } from './core/module';
// import { UserModule } from './modules/user/user.module';
import { logger } from './core/logger/logger';
export class AppModule extends Module {
    initialize() {
        logger.log('Initializing application modules...');
    }
}
