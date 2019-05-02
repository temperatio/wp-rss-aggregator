import Router from 'app/libs/Router'

const makeRouter = (routes = null, options = {}) => {
  routes = routes || [{
    route: 'a',
    name: 'a',
    component: {render: h => h('div', ['a'])}
  }]

  // window.history fake
  const history = {
    pushState: () => {}
  }
  global.window = {
    history
  }

  // window.location fake
  const location = {
    pathname: 'pre-a'
  }
  global.location = location

  // router app fake
  const app = {
    params: {
      existing: 'param'
    },
    $set: (obj, key, value) => {
      obj[key] = value
    },
    navigated: () => {}
  }

  const router = new Router(routes, options)
  router.setApp(app)

  return {
    history,
    app,
    router,
  }
}

describe('Router.js', () => {
  afterEach(() => {
    sinon.restore();
  })

  describe('public api', () => {
    it('navigates', () => {
      const { router, history, app } = makeRouter()

      const historyMock = sinon.mock(history)
      const appMock = sinon.mock(app)

      historyMock.expects('pushState')
        .once()
        .withArgs(null, null, 'a?foo=bar')

      appMock.expects('navigated')
        .once()

      router.navigate({
        name: 'a',
        params: {
          foo: 'bar'
        }
      })

      historyMock.verify()
      appMock.verify()
    })

    it('navigates when parameters updated', () => {
      const { router, history, app } = makeRouter()

      const historyMock = sinon.mock(history)
      const appMock = sinon.mock(app)

      historyMock.expects('pushState')
        .once()
        .withArgs(null, null, 'pre-a?foo=bar')

      appMock.expects('navigated')
        .once()

      router.mergeParams({
        foo: 'bar'
      })

      historyMock.verify()
      appMock.verify()
    })

    it('ignores existing parameters on params update', () => {
      const { router, history, app } = makeRouter(null, {
        baseParams: ['existing']
      })

      const historyMock = sinon.mock(history)
      const appMock = sinon.mock(app)

      historyMock.expects('pushState')
        .once()
        .withArgs(null, null, 'pre-a?existing=param&foo=baz')

      appMock.expects('navigated')
        .once()

      router.mergeParams({
        foo: 'baz'
      })

      historyMock.verify()
      appMock.verify()
    })
  })
})
