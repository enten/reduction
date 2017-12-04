export default function titleReducer (state = 'App', action = {}) {
  switch (action.type) {
    case 'HOME':
      return 'Home - App'
    case 'FOO':
      return 'Foo - App'
    case 'BAR':
      return 'Bar - App'
    default:
      return state
  }
}

// RudyStore (redux-first-router) automatically changes the 
// document.title for you :)
