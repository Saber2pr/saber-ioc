export interface Listener {
  resolveMessage(message: string): void
}

export interface IDispatcher {
  subscribe(id: string, listener: Listener): this
  emit(from: string, to: string, message: string): this
}

export interface ISDispatcher {
  getInstance(): IDispatcher
}

export interface IServiceA {
  getInforA(): string
}

export interface IServiceB {
  getInforB(): string
}

export interface IControllerA extends Listener {
  register(): void
  callControllerB(): void
}

export interface IControllerB extends Listener {
  register(): void
  callControllerA(): void
}

export const DispatcherToken = Symbol()