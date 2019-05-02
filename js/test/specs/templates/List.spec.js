import { mount } from '@vue/test-utils'
import List from 'app/modules/templates/List'
import { router, http, makeStore, hooks } from '../../utils'
import { setGlobal, revertGlobal } from './../../global'

/**
 * Create the component.
 *
 * @return {Wrapper<Vue>}
 */
const mountComponent = (state = {}) => {
  setGlobal('WpraTemplates', {
    base_url: 'templates',
    options: {
      type: {}
    }
  })
  setGlobal('WpraGlobal', {})
  return mount(List, {
    provide: {
      http,
      hooks,
      router
    },
    mocks: {
      $store: makeStore({
        templates: Object.assign({}, {
          items: [{
            id: 12,
            name: 'Default',
            type: '__built_in'
          }]
        }, state)
      })
    }
  })
}

describe('List.js', () => {
  afterEach(() => {
    sinon.restore()
    revertGlobal()
  })

  describe('mvp', () => {
    it('loads all records when mounted', () => {
      let mock = sinon.mock(http)
      mock.expects('get')
        .once()
        .withArgs('templates')
        .resolves({
          data: {items: []}
        })

      const wrapper = mountComponent()
      wrapper.vm.navigated() // always called on mount/route navigate.

      mock.verify()
    })
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

      wrapper.find('[value="14"]').setChecked()
      wrapper.find('[value="15"]').setChecked()
      wrapper.find('.wpra-bottom-panel a').trigger('click')

      mock.verify()
    })

    it('deletes item', () => {
      let mock = sinon.mock(http)
      mock.expects('delete')
        .once()
        .withArgs('templates/14')
        .resolves({})

      const wrapper = mountComponent({
        items: [
          {id: 14, type: 'list'},
          {id: 15, type: 'list'},
        ],
      })

      wrapper.find('[data-action="delete"]').trigger('click')

      mock.verify()
    })
  })

  describe('navigation', () => {
    it('navigates to create template form', () => {
      const wrapper = mountComponent()

      wrapper.find('a.page-title-action').trigger('click')

      router.assertNavigatedTo('templates')
      router.assertNavigatedWithParameters({
        action: 'new'
      })
    })

    it('duplicates template', () => {
      const wrapper = mountComponent()

      wrapper.find('[data-action="duplicate"]').trigger('click')

      wrapper.vm.$store.assertCommitted('templates/updatePreset')

      router.assertNavigatedTo('templates')
      router.assertNavigatedWithParameters({
        action: 'new'
      })
    })

    it('edits template', () => {
      const wrapper = mountComponent()

      wrapper.find('[data-action="edit"]').trigger('click')

      router.assertNavigatedTo('templates')
      router.assertNavigatedWithParameters({
        action: 'edit'
      })
    })
  })
})
