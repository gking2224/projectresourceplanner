import update from 'react-addons-update'


const addToSpec = (e, spec) => {
  spec[e._id] = {$set: e}
}
export const ReducerUtils = {

  addEntity: (state, e) => {

    if (!e) return state
    const updateSpec = {}
    if (e.constructor === Array) {
      e.forEach( i => addToSpec(i, updateSpec))
    }
    else {
      addToSpec(e, updateSpec)
    }
    return update(state, updateSpec)
  },

  removeEntityWithId: (state, id) => {

    if (!id) return state
    return update(state, {[id]: {$set: undefined}})
  },

}

export default ReducerUtils
