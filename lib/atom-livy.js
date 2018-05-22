'use babel'

import { CompositeDisposable } from 'atom'
import LivyClient from 'livy-client'

import store from './store'

export default {

	endpointView: null,
	sessionView: null,
	modalPanel: null,
	subscriptions: null,

	config: {
		endpoints: {
			description: 'The endpoint urls for Apache Livy. (can be specified multiple values separated with commas)',
			type: 'array',
			default: ['http://localhost:8998'],
			items: {
				type: 'string'
			}
		}
	},

	activate(state) {

		const EndpointView = require('./view/endpoint')
		const SessionView = require('./view/session')

		this.endpointView = state.endpoint ? atom.deserializers.deserialize(state.endpoint) : new EndpointView()
		this.sessionView = new SessionView()

		// store.endpoint = this.endpoints()[0]
		store.endpoint = state.endpoint ? state.endpoint.data.current : this.endpoints().length > 0 ? this.endpoints()[0] : null
		this.subscriptions = new CompositeDisposable()

		this.subscriptions.add(atom.commands.add('atom-text-editor', {
			'atom-livy:select-endpoint': this.showEndpointView.bind(this),
			'atom-livy:select-session': this.showSessionView.bind(this),
			'atom-livy:execute-statement': async () => {
				if(!store.session){
					atom.notifications.addError('A session must be selected before executing statement.')
					// await this.showSessionView()
					return
				}
				const editor = atom.workspace.getActiveTextEditor()
				const text = editor.getText()
				const codes = editor
					.getCursorBufferPositions()
					.map(cursor => this.extractStatement(text, cursor))
				Promise
					.all(codes.map(code => this.executeStatement(store.livy, store.session, code)))
					.then(rs => {
						rs.some(r => r.toObject().code == 'connectionError')
							? atom.notifications.addError('Statement execution failed by connectionError.')
							: atom.notifications.addSuccess('Statement succsessfully executed.')
					})
			}
		}))
	},

	deactivate() {
		// this.modalPanel.destroy()
		this.subscriptions.dispose()
		this.endpointView.destroy()
		this.sessionView.destroy()
	},

	serialize() {
		return {
			endpoint: this.endpointView.serialize(),
			// sessionViewState: this.sessionView.serialize()
		}
	},

	// deserializeEndpoint({data}) {
	// 	console.log(data)
	// 	return new EndpointView(data)
	// },

	notify() {
		atom.notifications.addInfo('atom-livy')
	},

	endpoints() {
		return atom.config.get('atom-livy.endpoints')
			.map(url => {
				const a = url.split('://')
				const b = a.splice(-1)[0].split(':')
				return {protocol: a.length == 0 ? 'http' : a[0], host: b[0], port: b.length == 1 ? 8998 : b[1]}
			})
	},

	showEndpointView() {
		this.endpointView.show(this.endpoints())
	},

	async showSessionView() {
		if(!store.endpoint){
			atom.notifications.addError('An endpoint must be selected before selecting a session.')
			return
		}
		store.livy && store.livy.cleanup()
		store.livy = new LivyClient(store.endpoint)
		const sessions = await store.livy.sessions()
		// console.log(sessions)
		if(sessions.code && sessions.code == 'connectionError') {
			atom.notifications.addError('Getting list of sessions failed by connectionError.')
			return
		}
		const items = sessions.map(s => s.toObject()).map(o => ({id:o.id, kind: o.kind, proxyUser: o.proxyUser}))
		this.sessionView.show(items)
	},

	extractStatement(code, cursor) {
		const rows = code.split('\n')
		const {row, column} = cursor

		const p = rows.reverse().indexOf('#%%', rows.length - row - 1)
		const n = rows.reverse().indexOf('#%%', row)
		const n2 = rows.indexOf('#%%', row+1)

		const prev = p == -1 ? 0 : rows.length - p - 1
		const _next = n == -1 ? rows.length : n
		const _next2 = n2 == -1 ? rows.length : n2
		const next = prev==_next?_next2:_next

		const codeList = rows.slice(prev, next).filter(row => row.indexOf('#%%') != 0)
		const r = codeList.join('\n')

		return r
	},

	async executeStatement(livy, id, code) {
		return livy.session({id}).run(code)
	}

}
