let tmpNode = document.querySelector('#root')

let data = {
	name: '名字',
	message: '第一条消息'
}

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

let generateNode = tmpNode.cloneNode(true)
compiler(generateNode, data)
root.parentNode.replaceChild(generateNode, root)

console.log(tmpNode)
console.log(generateNode)
