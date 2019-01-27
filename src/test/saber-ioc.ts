import { SaFactory } from '../core/saber-ioc'
import { D } from './example/D'
import { C } from './example/C'
import { A } from './example/A'
import { B } from './example/B'

let result: D = new SaFactory.Container(C, A, D, B).pull()
result.test()
export function test_saber_ioc() {}
