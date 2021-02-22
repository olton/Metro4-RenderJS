export const addData = (option, value = '', options = {}) => {
    const _ = {
        ...options
    }

    if (!_.data) {
        _.data = {}
    }

    _.data[option] = value

    return _
}

export const addRole = (role, options)=> addData('role', role, options)

export function addClasses(cls = [], source){
    if (typeof cls === "string") {
        cls = cls.split(" ")
    }

    if (!source) {
        return cls.join(" ")
    }

    return [...new Set([...cls, ...source.split(" ")])].join(" ")
}