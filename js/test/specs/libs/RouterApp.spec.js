import { mount } from '@vue/test-utils'
import makeRouterApp from 'app/components/RouterApp'
import Router from 'app/libs/Router'
import { setGlobal, revertGlobal } from './../../global'

const mountEnvironment = (routes = null, options = {}) => {
  routes = routes || [{
    route: 'a',
    name: 'a',
    component: {render: h => h('div', ['a'])}
  }, {
    route: 'b',
    name: 'b',
    component: {render: h => h('div', ['b'])}
  }]

  // window.history fake
  const history = {
    pushState: () => {}
  }
  const location = {
    pathname: 'a',
    href: 'url/a'
  }
  setGlobal('window', {
    history,
    location,
    addEventListener: () => {},
  })

  // window.location fake
  setGlobal('location', location)

  const router = new Router(routes, options)
  const app = makeRouterApp({store: {}, router})

  const wrapper = mount(app)

  return {
    history,
    app,
    router,
    wrapper,
  }
}

describe('RouterApp.js', () => {
  afterEach(() => {
    sinon.restore()
    revertGlobal()
  })

  describe('public api', () => {
    it('renders initial component', () => {
      const { wrapper } = mountEnvironment()
      expect(wrapper.find({ref: 'main'}).text()).toBe('a')
    })

    it('renders component after navigation', () => {
      const { router, wrapper } = mountEnvironment()
      router.navigate({
        name: 'b'
      })
      expect(wrapper.find({ref: 'main'}).text()).toBe('b')
    })
  })
})
