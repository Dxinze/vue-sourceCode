// 第一步：字符串模板（这里是真正的node） -> AST(抽象语法树)
// 第二步：AST -> 虚拟DOM
// 第三步：虚拟DOM -> 结合数据 -> 再生成一个vnode和html dom进行绑定

// 虚拟dom的构造函数
class VirtualDOM {
	constructor(tag, data, value, type) {
		;(this.tag = tag && tag.toLowerCase()), (this.data = data), (this.value = value), (this.type = type)
		this.children = []
	}

	appendChild(vnode) {
		this.children.push(vnode)
	}
}

let _r = /\{\{(.+?)\}\}/g
function getValuePath(obj, path) {
	let paths = path.split('.') // person.name.firstname -> ['person', 'name', 'firstname']
	let res = obj
	let prop
	while ((prop = paths.shift())) {
		res = res[prop]
	}
	return res
}

// 生成模板虚拟dom的方法 -> 在真正的vue当中这个函数是生成AST的编译函数
function generateVirtualNode(node) {
	let _Vnode
	let nodeType = node.nodeType
	if (nodeType === 1) {
		let nodeName = node.nodeName
		let attrs = node.attributes
		let _attrsObj = {}
		for (let i = 0; i < attrs.length; i++) {
			// attrs[i].nodeName -> id; attrs[i].nodeValue -> root
			_attrsObj[attrs[i].nodeName] = attrs[i].nodeValue
		}
		_Vnode = new VirtualDOM(nodeName, _attrsObj, undefined, nodeType)

		let childNodes = node.childNodes
		for (let i = 0; i < childNodes.length; i++) {
			_Vnode.appendChild(generateVirtualNode(childNodes[i]))
		}
	} else if (nodeType === 3) {
		_Vnode = new VirtualDOM(undefined, undefined, node.nodeValue, nodeType)
	}

	return _Vnode
}

// 将数据和模板虚拟dom结合，生成一个带有数据的虚拟dom -> 在vue中是将数据和AST进行结合生成虚拟dom
function combine(vnode, data) {
	let _tag = vnode.tag
	let _data = vnode.data
	let _value = vnode.value
	let _type = vnode.type
	let _children = vnode.children
	let _vnode = null

	if (_type === 3) {
		_value = _value.replace(_r, (_, g) => {
			return getValuePath(data, g.trim())
		})
		_vnode = new VirtualDOM(_tag, _data, _value, _type)
	} else if (_type === 1) {
		_vnode = new VirtualDOM(_tag, _data, _value, _type)
		_children.forEach(_sub_vnode => _vnode.appendChild(combine(_sub_vnode, data)))
	}

	return _vnode
}

// 将虚拟dom生成真正的dom
function parseVnode(vnode) {
	let type = vnode.type
	let _node = null
	if (type === 3) {
		return document.createTextNode(vnode.value)
	} else if (type === 1) {
		_node = document.createElement(vnode.tag)
		let data = vnode.data
		Object.keys(data).forEach(key => {
			let attrName = key
			let attrValue = data[key]
			_node.setAttribute(attrName, attrValue)
		})

		let children = vnode.children
		children.forEach(subvnode => {
			_node.appendChild(parseVnode(subvnode))
		})

		return _node
	}
}

class DVUE {
	constructor(options) {
		this._options = options
		this._data = options.data
		let elm = document.querySelector(options.el) // vue这里是字符串，但这里简化使用html dom
		this._templateDom = elm
		this._parent = elm.parentNode
		this.mount()
	}

	mount() {
		this.render = this.createRenderFn()
		this.mountComponent()
	}

	mountComponent() {
		let mount = () => {
			this.update(this.render())
		}
		mount.call(this)
	}

	//生成render函数，用于缓存AST
	createRenderFn() {
		let AST = generateVirtualNode(this._templateDom)
		console.log(AST)
		return function render() {
			let _tmp = combine(AST, this._data)
			return _tmp
		}
	}

	// 这里的update函数只是简单的替换了html中的节点
	update(vnode) {
		let realDom = parseVnode(vnode)
		this._parent.replaceChild(realDom, document.querySelector('#root'))
		console.log(realDom)
	}
}

let app = new DVUE({
	el: '#root',
	data: {
		person: {
			name: {
				firstname: 'd',
				lastname: 'xz'
			},
			age: 25
		}
	}
})
