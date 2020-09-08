
function find(list, f) {
  return list.filter(f)[0]
}

function deepCopy(obj, cache) {
  if (cache === void 0) cache = []

  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  var hit = find(cache, function(c) { return c.original === obj })
  if (hit) {
    return hit.copy
  }

  var copy = Array.isArray(obj) ? [] : {}

  cache.push({
    original: obj,
    copy: copy
  })

  Object.keys(obj).forEach(function(key) {
    copy[key] = deepCopy(obj[key], cache)
  })

  return copy
}

export default function createLogger(ref) {
  if (ref === void 0) ref = {}
  var collapsed = ref.collapsed; if (collapsed === void 0) collapsed = true
  var filter = ref.filter; if (filter === void 0) filter = function(mutation, stateBefore, stateAfter) { return true }
  var transformer = ref.transformer; if (transformer === void 0) transformer = function(state) { return state }
  var mutationTransformer = ref.mutationTransformer; if (mutationTransformer === void 0) mutationTransformer = function(mut) { return mut }
  var logger = ref.logger; if (logger === void 0) logger = console

  return function(store) {
    var prevState = deepCopy(store.state)

    store.subscribe(function(mutation, state) {
      if (typeof logger === 'undefined') {
        return
      }
      var nextState = deepCopy(state)

      if (filter(mutation, prevState, nextState)) {
        var time = new Date()
        var formattedTime = ' @ ' + (pad(time.getHours(), 2)) + ':' + (pad(time.getMinutes(), 2)) + ':' + (pad(time.getSeconds(), 2)) + '.' + (pad(time.getMilliseconds(), 3))
        var formattedMutation = mutationTransformer(mutation)
        var message = 'mutation ' + (mutation.type) + formattedTime
        var startMessage = collapsed
          ? logger.groupCollapsed
          : logger.group

        // render
        try {
          startMessage.call(logger, message)
        } catch (e) {
          console.log(message)
        }

        logger.log('%c prev state', 'color: #9E9E9E; font-weight: bold', transformer(prevState))
        logger.log('%c mutation', 'color: #03A9F4; font-weight: bold', formattedMutation)
        logger.log('%c next state', 'color: #4CAF50; font-weight: bold', transformer(nextState))

        try {
          logger.groupEnd()
        } catch (e) {
          logger.log('—— log end ——')
        }
      }

      prevState = nextState
    })
  }
}

function repeat(str, times) {
  return (new Array(times + 1)).join(str)
}

function pad(num, maxLength) {
  return repeat('0', maxLength - num.toString().length) + num
}

