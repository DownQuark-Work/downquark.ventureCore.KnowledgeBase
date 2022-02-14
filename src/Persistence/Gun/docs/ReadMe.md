https://grpc.io/docs/what-is-grpc/introduction/

The best way to think about GUN is synchronizing video game state: In 2 lines of code we can gun.get('thing').put({x: 0.01, y: 0.02, z: 0.03}) to send updates and gun.get('thing').on(data => object.moveTo(data.x, data.y, data.z)) to read it on another machine:

https://gun.eco/docs/Todo-Dapp