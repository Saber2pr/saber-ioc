import { IA } from './type';
export declare class A implements IA {
    private constructor();
    static instance: A;
    private name;
    getName(): string;
    setName(v: string): void;
}
