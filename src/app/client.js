import App from './webapp'

const client = App.client(window)

client.rehydrate()
  .then(() => console.log('App hydrated!'))
  .catch(console.error)

