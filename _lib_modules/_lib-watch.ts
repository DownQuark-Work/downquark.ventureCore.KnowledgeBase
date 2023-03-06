// this just allows the `watch` argument to work when developing with DENO
// DO NOT include it in the release

import { jWT } from './_utils/auth.ts'
import * as Gaming from './canvas/gaming/_lib.mjs'
import * as Grid from './canvas/grid.js'
import * as PRNG from './procgen/prng.ts'
import Seed from './procgen/seed.ts'