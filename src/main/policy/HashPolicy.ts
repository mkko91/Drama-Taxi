export abstract class HashPolicy {
  abstract hash(plain: string): Promise<string>;
}
