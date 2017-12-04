export default {
  HOME: '/',
  FOO: {
    path: '/foo',
    thunk: async (dispatch, getState) => {
      console.log('FOO thunk')
    }
  },
  BAR: {
    path: '/bar',
    thunk: async (dispatch, getState) => {
      console.log('BAR thunk')
    }
  }
}
