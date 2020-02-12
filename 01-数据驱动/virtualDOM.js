/**
*	<div></div> -> {tag: div}
*	#text -> {tag: undefined, value: xxx}
*	<div title='xxx' class="xxx"> -> {tag: div, data: {title: 'xxx', class: 'xxx'}}
*	<div>
*		<span /> {tag: div, children: [{tag: span}]}
*	<div> 
*/ 


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

let root = document.querySelector('#root')
let vroot = generateVirtualNode(root)

console.log(vroot)