import { SaFactory } from '../core/saber-ioc'
import { A } from './example/A'
import { B } from './example/B'
import { C } from './example/C'
import { D } from './example/D'

new SaFactory.Container(C, D, A, B)
export function test_saber_ioc() {}
