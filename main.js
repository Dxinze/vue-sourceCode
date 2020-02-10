let _r = /\{\{(.+?)\}\}/g

function compiler(template, data) {
	let childNodes = template.childNodes
	for (let i = 0; i < childNodes.length; i++) {
		let type = childNodes[i].nodeType
		if (type === 3) {
			let txt = childNodes[i].nodeValue
			txt = txt.replace(_r, (_, g) => {
				let key = g.trim()
				let value = data[key]
				return value
			})
			childNodes[i].nodeValue = txt
		} else if (type === 1) {
			compiler(childNodes[i], data)
		}
	}
}

function DVue(options) {
	this._data = options.data
	this._el = options.el
	this._templateDom = document.querySelector(this._el)
	this._parent = this._templateDom.parentNode
	this.render()
}

DVue.prototype.render = function() {
	this.compiler()
}

DVue.prototype.compiler = function() {
	let realDOM = this._templateDom.cloneNode(true)
	compiler(realDOM, this._data)
	this.update(realDOM)
}

DVue.prototype.update = function(realDOM) {
	this._parent.replaceChild(realDOM, document.querySelector('#root'))
}

let app = new DVue({
	el: '#root',
	data: {
		name: '我的名字',
		message: '一条消息'
	}
})