// router stub.
export function makeRouterStub (params = {}) {
  let routerStub = {
    routes: [],
    options: {},
    baseParams: [],
    params,
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
  post () {
    return Promise.resolve({
      data: {}
    })
  },
  put () {
    return Promise.resolve({
      data: {}
    })
  },
}
export const notification = {
  show () {},
  error () {},
}
export const hooks = {
  apply (arg1, arg2, arg3) {
    return arg3
  }
}
export const makeStore = (state = {}) => {
  let getters = {}
  const gettersProxy = new Proxy(getters, {
    get (target, prop) {
      if (!target.hasOwnProperty(prop)) {
        target[prop] = sinon.stub()
      }
      return target[prop]
    }
  })
  return {
    state,
    getters: gettersProxy,
    commit: sinon.stub(),
    dispatch: sinon.stub(),
    assertCommitted (mutation) {
      sinon.assert.calledWith(this.commit, mutation);
    }
  }
}
