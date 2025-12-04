import { randomUUID } from 'crypto';

export function UUIDv4(): string {
    return randomUUID();
}