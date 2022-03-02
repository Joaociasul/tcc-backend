module.exports = {
    mongooseValidator: (err) => {
        return new Promise((resolve, reject) => {
            if (err) {                
                if (err.code === 11000) {
                    const error = {
                        message: {
                            validator:{
                                field: Object.keys(err.keyPattern).shift(),
                                type: 'unique'
                            }
                        } 
                    }
                    return reject(error)
                }
                const name = err?.errors?.name
                if (name) {
                    const error = {
                        message: {
                            validator: {
                                field: name.path, 
                                type:name.kind
                            }
                        }
                    }
                    return reject(error)
                }
                const field = Object.keys(err?.errors).shift()
                const props = err?.errors[field]?.properties
                if (props) {
                    const error = {
                        message: {
                            validator: {
                                field: props.path,
                                type: props.type
                            }
                        }
                    }
                    return reject(error)
                }
                return reject(err)
            }
            resolve(true)
        })
    }
}
