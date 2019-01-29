import { IB, ISA } from './type';
export declare class B implements IB {
    A: ISA;
    private name;
    constructor(A: ISA, name?: number);
    getName(): string;
}
