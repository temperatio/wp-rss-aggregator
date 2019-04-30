// router stub.
function makeRouterStub () {
  let routerStub = {
    routes: [],
    options: {},
    baseParams: [],
    params: {},
    buildRoute: sinon.stub(),
  }
  return Object.assign({}, routerStub, {
    isNavigatedTo (route) {
      // check whether route navigated to the given path.
    }
  })
}

export const router = makeRouterStub()
export const http = {
  delete () {
    return Promise.resolve({
      data: {}
    })
  },
  get () {
    return Promise.resolve({
      data: {}
    })
  },
}
