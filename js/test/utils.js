// router stub.
function makeRouterStub () {
  let routerStub = {
    routes: [],
    options: {},
    baseParams: [],
    params: {},
    buildRoute: sinon.stub(),
    navigate: sinon.stub(),
  }
  return Object.assign({}, routerStub, {
    // check whether route navigated to the given path.
    assertNavigatedTo (routeName) {
      sinon.assert.calledWith(routerStub.navigate, sinon.match({ name: routeName }));
    },

    // check whether route navigated with parameters.
    assertNavigatedWithParameters (params) {
      sinon.assert.calledWith(routerStub.navigate, sinon.match({ params }));
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
export const hooks = {
  apply (arg1, arg2, arg3) {
    return arg3
  }
}
export const makeStore = (state = {}) => {
  return {
    state,
    commit: sinon.stub(),
    dispatch: sinon.stub(),
    assertCommitted (mutation) {
      sinon.assert.calledWith(this.commit, mutation);
    }
  }
}
