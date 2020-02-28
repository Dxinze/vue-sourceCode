// 第一步：字符串模板（真正的node） -> AST(抽象语法树)
// 第二步：AST -> 虚拟DOM
// 第三步：虚拟DOM -> 结合数据 -> 再生成一个vnode和html dom进行绑定


// 虚拟dom的构造函数
class VirtualDOM {
	constructor(tag, data, value, type) {
		this.tag = tag && tag.toLowerCase(),
		this.data = data,
		this.value = value,
		this.type = type
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
	while(prop = paths.shift()) {
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

class DVUE {
	constructor(options) {
		this._data = options.data
		this._el = options.el // vue这里是字符串，但这里简化使用html dom
		this._templateDom = document.querySelector(this._el)
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
		return function render() {
			let _tmp = combine(AST, this._data)
			console.log(AST)
			console.log(_tmp)
			return _tmp
		}
	}

	update() {

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






