https://docs.walletconnect.com/
https://github.com/nambrot/dapptools-template

`$ deno run --allow-read --allow-net server/app.server.ts`
_&&_
`$ deno run --allow-read --allow-net server/app.websocket.ts`
_&&_
`$ curl http://localhost:8080/api/v0/blocks`


T1: `% deno run --allow-read --allow-net server/app.server.ts`
T2: `% deno run --allow-read --allow-net server/app.websocket.ts`
T3: `% deno run --allow-read --allow-net server/app.websocket.ts`
T4: `% curl -X POST http://localhost:8080/api/v0/mineBlock/eyJhIjoiYiIsImIiOjF9`
T4: `% curl -i -X POST -H "Content-Type: application/json" -d "key1=value1" http://localhost:8080/api/v0/mineBlock`
T4: `% curl -X POST http://localhost:8080/api/v0/addPeer`


> To test websocket routes:
> ` $ deno run --allow-read --allow-net server/app.server.ts` [terminal 1]
> ` $ deno run --allow-read --allow-net server/app.websocket.ts` [terminal 2]

https://docs.w3cub.com/dom/subtlecrypto/digest

https://medium.com/@lhartikk/a-blockchain-in-200-lines-of-code-963cc1cc0e54
- https://github.com/lhartikk/naivechain

- https://lhartikk.github.io/jekyll/update/2017/07/13/chapter2.html : POW mining
- https://naivecoinstake.learn.uno/02-Proof-of-Stake/ : POS minting

https://lhartikk.github.io/jekyll/update/2017/07/15/chapter0.html

https://medium.com/learning-lab/proof-of-what-understand-the-distributed-consensuses-in-blockchain-1d9304ae4afe

~~https://hackernoon.com/how-to-launch-your-own-production-ready-cryptocurrency-ab97cb773371~~ pre-hardhat

// https://examples.deno.land/uuids
curl -d 'id=9&name=baeldung'
curl -X POST -H "Content-Type: application/json" -d "{ \"key1\": \"value1\" }" http://localhost:808/api/v0/mineBlock