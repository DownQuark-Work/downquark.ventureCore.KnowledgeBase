import { createHashForSeed, createNumericalHashForSeed, mb32, v3b } from './prng.ts'

// seed creation deletion etc related functions

export const SeedHash = {
  alphanumeric:  (seed?:string) => createHashForSeed(seed),
  numerical: (seed?:string) => createNumericalHashForSeed(seed)
}

export const PRNGenerator = {
  chaotic: (seed?:number, a?:number, b?:number, c?:number) => v3b(seed,a,b,c),
  efficient: (seed?:number) => mb32(seed),
}