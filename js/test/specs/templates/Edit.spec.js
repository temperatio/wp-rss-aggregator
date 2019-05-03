import { mount } from '@vue/test-utils'
import Edit from 'app/modules/templates/Edit'
import { makeRouterStub, http, makeStore, hooks, notification } from '../../utils'
import { setGlobal, revertGlobal } from './../../global'

/**
 * Create the component.
 *
 * @return {Wrapper<Vue>}
 */
const mountComponent = (routeParams = {}, state = {}) => {
  setGlobal('WpraTemplates', {
    base_url: 'templates',
    model_schema: {
      id: '',
      name: '',
      slug: '',
      type: 'list',
      options: {
        limit: 15,
      }
    },
    model_tooltips: {
      options: {}
    },
    options: {
      type: {}
    }
  })
  setGlobal('localStorage', {
    getItem: sinon.stub(),
    setItem: sinon.stub(),
  })
  setGlobal('WpraGlobal', {})
  return mount(Edit, {
    provide: {
      http,
      hooks,
      notification,
      router: makeRouterStub(routeParams),
    },
    mocks: {
      $store: makeStore({
        templates: Object.assign({}, {
          items: [{
            id: 12,
            name: 'Default',
            type: '__built_in'
          }],
          preset: {}
        }, state)
      })
    }
  })
}

describe('Edit.js', () => {
  afterEach(() => {
    sinon.restore()
    revertGlobal()
  })

  describe('mvp', () => {
    it('load record when mounted with :id', () => {
      let mock = sinon.mock(http)
      mock.expects('get')
        .once()
        .withArgs('templates/12')
        .resolves({
          data: {}
        })

      mountComponent({id: 12})

      mock.verify()
    })

    it('does not send request mounted without :id', () => {
      let mock = sinon.mock(http)
      mock.expects('get')
        .never()

      mountComponent()

      mock.verify()
    })

    it('updates existing item', done => {
      http.get = () => {
        return Promise.resolve({
          data: {
            id: 12
          }
        })
      }

      const httpMock = sinon.mock(http)
      httpMock.expects('put')
        .once()
        .withArgs('templates/12')
        .resolves({
          data: {}
        })

      const wrapper = mountComponent({id: 12})

      setTimeout(() => {
        wrapper.find('#publishing-action .button-primary').trigger('click')
        httpMock.verify()
        done()
      }, 2)
    })

    it('creates non existing item', done => {
      const httpMock = sinon.mock(http)
      httpMock.expects('post')
        .once()
        .withArgs('templates')
        .resolves({
          data: {}
        })

      const wrapper = mountComponent()

      setTimeout(() => {
        wrapper.find('#publishing-action .button-primary').trigger('click')
        httpMock.verify()
        done()
      }, 2)
    })
  })

  describe('features', () => {
    describe('shortcode', () => {
      it('renders for existing item', done => {
        http.get = () => {
          return Promise.resolve({
            data: {
              id: 12
            }
          })
        }

        const wrapper = mountComponent({id: 12})

        setTimeout(() => {
          expect(wrapper.contains('.wpra-shortcode-copy')).toBe(true)
          done()
        }, 2)
      })

      it('does not render for new item', done => {
        const wrapper = mountComponent()

        setTimeout(() => {
          expect(wrapper.contains('.wpra-shortcode-copy')).toBe(false)
          done()
        }, 2)
      })
    })
  })
})
