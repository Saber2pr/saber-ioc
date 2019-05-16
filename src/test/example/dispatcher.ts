import { Singleton, Injectable } from '../../index'
import { IDispatcher, Listener, DispatcherToken } from './type'

@Singleton
@Injectable(DispatcherToken)
export default class Dispatcher implements IDispatcher {
  private constructor() {
    this.listeners = new Map()
  }
  private static instance: Dispatcher = null
  public static getInstance(): Dispatcher {
    this.instance = this.instance || new Dispatcher()
    return this.instance
  }
  private listeners: Map<string, Listener>
  subscribe(id: string, listener: Listener) {
    this.listeners.set(id, listener)
    return this
  }
  unsubscribe(id: string) {
    this.listeners.delete(id)
    return this
  }
  emit(from: string, to: string, message: string) {
    if (this.listeners.has(from)) {
      if (this.listeners.has(to)) {
        this.listeners.get(to).resolveMessage(message)
      } else {
        console.log(`the id[${to}] called is not existed!`)
      }
    } else {
      console.log(`please subscribe our first!`)
    }
    return this
  }
}
