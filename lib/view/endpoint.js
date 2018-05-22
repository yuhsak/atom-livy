'use babel'

import {SelectListView, $, $$} from 'atom-space-pen-views'

import store from '../store'

class EndpointView extends SelectListView {

	constructor(serializedState={}) {
		super()
		this.addClass('overlay from-top')
		this.modalPanel = atom.workspace.addModalPanel({
			item: this.getElement(),
			visible: false
		})
		this.current = serializedState.current
	}

	viewForItem(item) {
		return `<li>${item.protocol}://${item.host}:${item.port}</li>`
	}

	filterKeyForItem(item) {
		return `${item.protocol}://${item.host}:${item.port}`
	}

	confirmed(item) {
		store.endpoint = item
		this.current = item
		atom.notifications.addInfo(`Endpoint was set: ${item.protocol}://${item.host}:${item.port}`)
		this.modalPanel.hide()
		this.focusBack()
	}

	cancelled() {
		this.modalPanel.hide()
	}

	focusBack() {
		atom.workspace.getActiveTextEditor() ? atom.workspace.getActiveTextEditor().element.focus() : null
	}

	show(items) {
		this.setItems(items)
		this.modalPanel.show()
		this.storeFocusedElement()
		this.focusFilterEditor()
	}

	serialize() {
		return {deserializer: 'EndpointView', data: {current: this.current}}
	}

	static deserialize({data}) {
		return new EndpointView(data)
	}

	destroy() {
		this.element.remove()
	}

	getElement() {
		return this.element
	}

}

atom.deserializers.add(EndpointView)

export default EndpointView