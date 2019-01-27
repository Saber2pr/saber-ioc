import { SaFactory } from '../core/saber-ioc'
import { C } from './example/C'
import { A } from './example/A'
import { D } from './example/D'
import { B } from './example/B'

let container = new SaFactory.Container(C, A, D, B)
container.run()

let main: D = container.pull()

main.test()
export function test_saber_ioc() {}
