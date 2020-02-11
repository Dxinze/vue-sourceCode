class DVUE {
	constructor(options) {
		this._data = options.data
		this._el = options.el
		this._templateDom = document.querySelector(this._el)
		this._parent = this._templateDom.parentNode
		this.render()
	}

	render() {
		let pageDOM = this._templateDom.cloneNode(true)
		this.compiler(pageDOM, this._data)
		this.update(pageDOM)
		this.prting(this._templateDom, pageDOM)
	}

	compiler(template, data) {
		let _r = /\{\{(.+?)\}\}/g
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
				this.compiler(childNodes[i], data)
			}
		}
	}

	update(pageDOM) {
		this._parent.replaceChild(pageDOM, document.querySelector('#root'))
	}

	prting(tmpDOM, pageDOM) {
		console.log(tmpDOM)
		console.log(pageDOM)
	}
}



let app = new DVUE({
	el: '#root',
	data: {
		name: '我的名字',
		message: '一条消息'
	}
})