import { SaFactory } from '../core/saber-ioc'
import { D } from './example/D'
import { A } from './example/A'
import { C } from './example/C'
import { B } from './example/B'

new SaFactory.Container(C, D, A, B)
export function test_saber_ioc() {}
