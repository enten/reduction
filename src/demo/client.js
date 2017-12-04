import Demo from './webapp'

const client = Demo.client(window)

client.rehydrate()
  .then(() => console.log('Demo hydrated!'))
  .catch(console.error)

