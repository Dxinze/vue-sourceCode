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
					let path = g.trim()
					let value = this.getValuePath(this._data, path)
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

	getValuePath(obj, path) { 
		let paths = path.split('.') // person.name.firstname -> ['person', 'name', 'firstname']
		let res = obj
		let prop
		while(prop = paths.shift()) {
			res = res[prop]
		}
		return res
	}
}

class Vnode {
	constructor() {

	}
}



let app = new DVUE({
	el: '#root',
	data: {
		person: {
			name: {
				firstname: 'jack',
				lastname: 'ma'
			}
		}
	}
})