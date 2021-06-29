export const q = x => document.getElementById(x)

export const e = (type, classes, children) => {
    const el = document.createElement(type)
    el.classList.add(classes)

    if (typeof children === 'string') {
        el.innerText = children
    } else if (children === undefined) {
        return el
    } else {
        children.forEach(child => {
            el.appendChild(child)
        })
    }
    return el
}
