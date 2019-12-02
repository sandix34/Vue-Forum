const countObjectProperties = obj => {
  if (typeof obj === 'object') {
    return Object.keys(obj).length
  }
  return 0
}

const removeEmptyProperties = obj => {
  // don't want to update the original object
  const objCopy = {...obj}
  // iterate through all object's keys, and delete the properties that are not set, using the delete statement.
  Object.keys(objCopy).forEach(key => {
    if (!objCopy[key]) {
      delete objCopy[key]
    }
  })
  return objCopy
}

export {
  countObjectProperties,
  removeEmptyProperties
}
