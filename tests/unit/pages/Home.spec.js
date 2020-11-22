import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Home from '@/pages/Home.vue'

describe('Home.vue', () => {
  it('should renders default message', () => {
    const msg = 'Welcome!'
    const wrapper = shallowMount(Home, {
      propsData: {}
    })
    expect(wrapper.text()).to.include(msg)
  })
})
