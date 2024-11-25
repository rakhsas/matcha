import chokidar from 'chokidar';
import { logger } from './logger'; // Assuming logger is set up as in your code
// Initialize watcher with options if needed
const watcher = chokidar.watch('./src', {
    ignored: /(^|[\/\\])\../, // Ignore dotfiles
    persistent: true // Keep the process running
});
// Watch for file changes and log them
watcher.on('change', (path) => {
    logger.log(`File changed: ${path}`);
});
watcher.on('add', (path) => {
    logger.log(`File added: ${path}`);
});
watcher.on('unlink', (path) => {
    logger.log(`File removed: ${path}`);
});
watcher.on('error', (error) => {
    logger.error('Watcher error', error);
});
