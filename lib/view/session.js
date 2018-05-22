'use babel'

import {SelectListView, $, $$} from 'atom-space-pen-views'

import store from '../store'

class SessionView extends SelectListView {

	constructor() {
		super()
		this.addClass('overlay from-top')
		this.modalPanel = atom.workspace.addModalPanel({
			item: this.getElement(),
			visible: false
		})
	}

	viewForItem(item) {
		return `<li>${item.id} / ${item.kind} ${item.proxyUser}</li>`
	}

	confirmed(item) {
		store.session = item.id
		atom.notifications.addInfo(`Session selected: ${item.id} / ${item.kind} ${item.proxyUser}`)
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
		return {deserializer: 'SessionView'}
	}

	static deserialize() {
		return new SessionView()
	}

	destroy() {
		this.element.remove()
	}

	getElement() {
		return this.element
	}

}

atom.deserializers.add(SessionView)

export default SessionView