export abstract class Module {
    constructor() {
      this.initialize();
    }
  
    protected abstract initialize(): void;
}
  