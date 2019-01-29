import { IA } from './type';
export declare class A implements IA {
    private constructor();
    static instance: A;
    static getInstance(): A;
    private name;
    getName(): string;
    setName(v: string): void;
}
