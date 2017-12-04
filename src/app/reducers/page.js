export default function pageReducer (state = 'HOME', action = {}) {
  return components[action.type] || state
}

const components = {
  HOME: 'Home',
  FOO: 'Foo',
  BAR: 'Bar'
}

// NOTES: this is the primary reducer demonstrating how
// RudyStore (redux-first-router) replaces the need  for
// React Router's <Route /> component.
//
// ALSO: Forget a switch, use a hash table for perf.
