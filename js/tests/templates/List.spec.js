import { mount } from '@vue/test-utils'
import List from 'app/modules/templates/List'
import { router, http } from 'tests/utils'

/**
 * Create the component.
 *
 * @return {Wrapper<Vue>}
 */
const mountComponent = (state = {}) => {
  global.WpraTemplates = {
    base_url: 'templates',
    options: {
      type: {}
    }
  }
  global.WpraGlobal = {}
  return mount(List, {
    provide: {
      http,
      hooks: {
        apply (arg1, arg2, arg3) {
          return arg3
        }
      },
      router
    },
    mocks: {
      $store: {
        state: {
          templates: Object.assign({}, {
            items: [{
              id: 12,
              name: 'Default',
              type: '__built_in'
            }]
          }, state)
        },
        commit: sinon.stub()
      }
    }
  })
}

describe('List.js', () => {
  afterEach(() => {
    sinon.restore();
  })

  describe('features', () => {
    it('hides bulk checkboxes when only default template is available (using css class)', () => {
      const wrapper = mountComponent()
      expect(wrapper.contains('.wpra-no-cb')).toBe(true)
    })

    it('hides checkbox for default template (using css class)', () => {
      const wrapper = mountComponent()
      expect(wrapper.contains('.built-in')).toBe(true)
    })

    it('bulk delete items', () => {
      let mock = sinon.mock(http)
      mock.expects('delete')
        .once()
        .withArgs('templates', {params: {ids: [14,  15]}})
        .resolves({})

      const wrapper = mountComponent({
        items: [
          {id: 14, type: 'list'},
          {id: 15, type: 'list'},
        ],
      })

      wrapper.find('[value="14"]').trigger('click')
      wrapper.find('[value="15"]').trigger('click')
      wrapper.find('.wpra-bottom-panel a').trigger('click')

      mock.verify()
    })
  })

  describe('navigation', () => {

  })
})
