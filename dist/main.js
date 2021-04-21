/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/cooljs/engine.js":
/*!***************************************!*\
  !*** ./node_modules/cooljs/engine.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Engine)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./node_modules/cooljs/utils.js");
/* harmony import */ var _tween__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tween */ "./node_modules/cooljs/tween.js");



const { requestAnimationFrameTool, isFunction, isTouchDevice } = _utils__WEBPACK_IMPORTED_MODULE_0__

class Engine {
  constructor(option = {}) {
    if (!document.createElement('canvas').getContext) {
      window.alert('HTML5 Canvas is not supported in your browser.') // eslint-disable-line
      return
    }
    const {
      canvasId, debug, width, height, highResolution, loadLimit, soundOn
    } = option
    let canvasWidth = width || window.innerWidth
    let canvasHeight = height || window.innerHeight
    this.canvas = document.getElementById(canvasId)
    if (highResolution) {
      this.canvas.style.width = `${canvasWidth}px`
      this.canvas.style.height = `${canvasHeight}px`
      canvasWidth *= 2
      canvasHeight *= 2
    }
    this.highResolution = highResolution
    this.canvas.width = canvasWidth
    this.canvas.height = canvasHeight
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.calWidth = this.width * 0.5
    this.calHeight = this.height * 0.5
    // general
    this.debug = !!debug
    this.ctx = this.canvas.getContext('2d')
    this.defaultLayer = 'default'
    this.layerArr = [this.defaultLayer]
    this.instancesObj = {}
    this.instancesObj[this.defaultLayer] = []
    this.instancesReactionArr = []
    this.utils = _utils__WEBPACK_IMPORTED_MODULE_0__
    this.customVariable = {}
    const self = this
    this.isTouchDevice = isTouchDevice()
    this.debugArr = []
    // assets
    this.assetsObj = {
      image: {},
      audio: {}
    }
    this.assetsCount = {
      image: 0,
      audio: 0
    }
    this.assetsErrorQueue = []
    this.assetsErrorCount = 0
    this.loadLimit = loadLimit || 3
    // audio
    this.soundOn = !!soundOn
    // time
    this.fps = 0
    this.lastTime = 0
    this.lastPausedAt = 0
    this.pausedTime = 0
    this.paused = false
    this.timeMovement = {}
    this.timeMovementStartArr = []
    this.timeMovementFinishArr = []
    // keys
    this.keyUpListeners = {}
    this.keyDownListeners = {}
    this.keyPressListeners = {}
    // hooks
    this.startAnimate = () => {
    }
    this.paintUnderInstance = () => {
    }
    this.paintAboveInstance = () => {
    }
    this.endAnimate = () => {
    }
    this.touchStartListener = () => {
    }
    this.touchEndListener = () => {
    }
    this.touchMoveListener = () => {
    }
    // global event listener
    // key
    document.addEventListener('keyup', (e) => {
      self.keyListener(e, 'keyup')
    }, false)
    document.addEventListener('keydown', (e) => {
      self.keyListener(e, 'keydown')
    }, false)
    document.addEventListener('keypress', (e) => {
      self.keyListener(e, 'keypress')
    }, false)
    // touch
    if (this.isTouchDevice) {
      document.addEventListener('touchstart', (e) => {
        self.touchStartListener(e)
      }, false)
      document.addEventListener('touchend', (e) => {
        self.touchEndListener(e)
      }, false)
      document.addEventListener('touchmove', (e) => {
        self.touchMoveListener(e)
      }, false)
    } else {
      document.addEventListener('mousedown', (e) => {
        self.touchStartListener(e)
      }, false)
      document.addEventListener('mouseup', (e) => {
        self.touchEndListener(e)
      }, false)
      document.addEventListener('mousemove', (e) => {
        self.touchMoveListener(e)
      }, false)
    }
  }

  triggerReaction(x, y) {
    let calX = x
    let calY = y
    if (this.highResolution) {
      calX *= 2
      calY *= 2
    }
    this.instancesReactionArr.forEach((i) => {
      if (!i.visible) return
      if (calX >= i.x && calX<= i.x + i.width && calY >= i.y && calY<= i.y + i.height) {
        i.trigger(i, this)
      }
    })
  }

  addAudio(name, src, retry = 0) {
    if (!this.soundOn) return
    if (!retry) this.assetsCount.audio += 1
    const a = new window.Audio()
    a.src = src
    // a.addEventListener('canplaythrough', () => {
    //   this.assetsObj.audio[name] = a
    // }, false)
    // bug sometime not trigger canplaythrough
    this.assetsObj.audio[name] = a
    a.addEventListener('error', () => {
      this.assetsErrorQueue.push({
        name,
        src,
        retry: retry + 1,
        type: 'audio'
      })
    }, false)
    a.load()
  }

  getAudio(name) {
    return this.assetsObj.audio[name]
  }

  playAudio(name, loop = false) {
    if (!this.soundOn) return
    const audio = this.getAudio(name)
    // const audio = document.getElementById(name)
    if (audio) {
      audio.play()
      if (!loop) return
      audio.addEventListener('ended', () => {
        audio.currentTime = 0
        audio.play()
      }, false)
    }
  }

  pauseAudio(name) {
    const audio = this.getAudio(name)
    if (audio) {
      audio.pause()
    }
  }

  setVariable(key, value) {
    this.customVariable[key] = value
  }

  getVariable(key, defaultValue = null) {
    const customVariable = this.customVariable[key]
    if (customVariable) {
      return customVariable
    }
    if (defaultValue !== null) {
      this.setVariable(key, defaultValue)
      return defaultValue
    }
    return null
  }

  addImg(name, src, retry = 0) {
    if (!retry) this.assetsCount.image += 1
    const i = new window.Image()
    i.src = src
    i.onload = () => {
      this.assetsObj.image[name] = i
    }
    i.onerror = () => {
      this.assetsErrorQueue.push({
        name,
        src,
        retry: retry + 1,
        type: 'image'
      })
    }
  }

  getImg(name) {
    return this.assetsObj.image[name]
  }

  animate(time) {
    const gameTime = time - this.pausedTime
    const self = this
    if (this.paused) {
      setTimeout(() => {
        this.animate.call(self, gameTime)
      }, 100)
      return
    }
    this.tick(gameTime)
    this.clean()
    this.startAnimate(this, gameTime)
    this.paintUnderInstance(this)
    this.updateInstances(gameTime)
    this.paintInstances()
    this.paintAboveInstance()
    this.endAnimate(this, gameTime)
    this.tickTimeMovement()
    this.debug && this.showFps()
    this.debug && this.drawDebug()
    requestAnimationFrameTool((_time) => {
      this.animate.call(self, _time)
    })
  }

  showFps() {
    this.ctx.save()
    this.ctx.fillStyle = 'red'
    this.ctx.font = `${this.highResolution ? 32 : 16}px Arial`
    this.ctx.fillText(`FPS: ${this.fps.toFixed()}`, 5, this.highResolution ? 40 : 20)
    this.ctx.restore()
  }

  debugLineX(y) {
    this.debugArr.push({
      type: 'lineX',
      y
    })
  }

  debugLineY(x) {
    this.debugArr.push({
      type: 'lineY',
      x
    })
  }

  debugDot(x, y) {
    this.debugArr.push({
      type: 'dot',
      x,
      y
    })
  }

  drawDebug() {
    this.debugArr.forEach((i) => {
      const { type, x, y } = i
      switch (type) {
        case 'dot':
          this.drawDebugDot(x, y)
          break
        case 'lineX':
          this.drawDebugLine(null, y)
          break
        case 'lineY':
          this.drawDebugLine(x, null)
          break
        default:
          break
      }
    })
    this.instancesReactionArr.forEach((i) => {
      if (!i.visible) return
      this.ctx.strokeStyle = 'red'
      this.ctx.beginPath()
      this.ctx.rect(i.x, i.y, i.width, i.height)
      this.ctx.stroke()
    })
  }

  drawDebugLine(x, y) {
    let from = [0, y]
    let to = [this.width, y]
    if (x) {
      from = [x, 0]
      to = [x, this.height]
    }
    this.ctx.save()
    this.ctx.strokeStyle = 'red'
    this.ctx.beginPath()
    this.ctx.moveTo(...from)
    this.ctx.lineTo(...to)
    this.ctx.stroke()
    this.ctx.restore()
  }

  drawDebugDot(x, y) {
    this.ctx.save()
    this.ctx.fillStyle = 'red'
    this.ctx.beginPath()
    this.ctx.arc(x, y, 2, 0, 2 * Math.PI, true)
    this.ctx.fill()
    this.ctx.fillStyle = 'white'
    this.ctx.beginPath()
    this.ctx.arc(x, y, 1, 0, 2 * Math.PI, true)
    this.ctx.fill()
    this.ctx.restore()
  }

  tick(time) {
    this.updateFps(time)
    this.lastTime = time
  }

  updateFps(time) {
    if (this.lastTime === 0) {
      this.fps = 60
    } else {
      this.fps = 1000 / (time - this.lastTime)
    }
  }

  pixelsPerFrame(velocity) {
    return velocity / this.fps
  }

  tickTimeMovement() {
    this.timeMovementStartArr.forEach((name) => {
      this.timeMovement[name].processing = true
    })
    this.timeMovementStartArr = []
    this.timeMovementFinishArr.forEach((name) => {
      delete this.timeMovement[name]
    })
    this.timeMovementFinishArr = []
  }

  getTimeMovement(name, value, render, option = {}) {
    const { before, after } = option
    const timingFunc = _tween__WEBPACK_IMPORTED_MODULE_1__.default[option.easing || 'linear']
    const movementInstanceName = option.name || 'default'
    const movement = this.timeMovement[name]
    if (!movement) {
      return
    }
    if (!movement.processing) {
      this.timeMovementStartArr.push(name)
      movement.store[movementInstanceName] = []
      value.forEach((v) => {
        movement.store[movementInstanceName].push({
          start: parseFloat(v[0]),
          end: parseFloat(v[1])
        })
      })
      before && before()
    }
    const processRender = (lastRender = false) => {
      const { duration } = movement
      let t = duration
      if (!lastRender) {
        const currentTime = this.utils.getCurrentTime()
        const { startTime } = movement
        t = currentTime - startTime
      }
      const values = movement.store[movementInstanceName]
        .map(v => timingFunc(t, v.start, v.end - v.start, duration))
      render.apply(this, values)
    }
    if (this.checkTimeMovement(name)) {
      processRender()
    } else {
      this.timeMovementFinishArr.push(name)
      processRender(true)
      after && after()
    }
  }

  checkTimeMovement(name) {
    const movement = this.timeMovement[name] || {}
    return this.utils.getCurrentTime() <= movement.endTime
  }

  setTimeMovement(name, duration) {
    const currentTime = this.utils.getCurrentTime()
    this.timeMovement[name] = {
      startTime: currentTime,
      endTime: currentTime + duration,
      duration,
      store: {}
    }
  }

  clean() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.debugArr = []
  }

  addLayer(layer) {
    this.layerArr.push(layer)
    this.instancesObj[layer] = []
  }

  removeLayer(layer) {
    this.layerArr = this.layerArr.filter(i => i !== layer)
    delete this.instancesObj[layer]
  }

  swapLayer(index1, index2) {
    this.utils.arraySwap(this.layerArr, index1, index2)
  }

  addInstance(instance, layer = this.defaultLayer) {
    this.instancesObj[layer].push(instance)
    if (instance.trigger) this.instancesReactionArr.push(instance)
  }

  getInstance(name, layer = this.defaultLayer) {
    return this.instancesObj[layer].filter(i => i.name === name)[0]
  }

  removeInstance(name, layer = this.defaultLayer) {
    const instance = this.getInstance(name, layer)
    if (instance) {
      this.instancesObj[layer] = this.instancesObj[layer].filter(i => i.name !== name)
      if (instance.trigger) {
        this.instancesReactionArr = this.instancesReactionArr.filter(i => i.name !== name)
      }
    }
  }

  updateInstances(time) {
    this.layerArr.forEach((l) => {
      this.instancesObj[l].forEach((i) => {
        i.update && i.update(this, time)
      })
    })
  }

  paintInstances() {
    this.layerArr.forEach((l) => {
      this.instancesObj[l].forEach((i) => {
        i.paint && i.paint(this)
      })
    })
  }

  togglePaused() {
    const now = this.utils.getCurrentTime()
    this.paused = !this.paused
    if (this.paused) {
      this.lastPausedAt = now
    } else {
      this.pausedTime += (now - this.lastPausedAt)
    }
  }

  addKeyUpListener(key, listener) {
    this.keyUpListeners[key] = listener
  }

  addKeyDownListener(key, listener) {
    this.keyDownListeners[key] = listener
  }

  addKeyPressListener(key, listener) {
    this.keyPressListeners[key] = listener
  }

  findKeyListener(key, type) {
    if (type === 'keyup') {
      return this.keyUpListeners[key]
    } else if (type === 'keydown') {
      return this.keyDownListeners[key]
    }
    return this.keyPressListeners[key]
  }

  keyListener(e, type) {
    let key
    switch (e.keyCode) {
      case 13:
        key = 'enter'
        break
      case 32:
        key = 'space'
        break
      case 37:
        key = 'leftArrow'
        break
      case 39:
        key = 'rightArrow'
        break
      case 38:
        key = 'upArrow'
        break
      case 40:
        key = 'downArrow'
        break
      default:
        key = e.keyCode
        break
    }
    const listener = this.findKeyListener(key, type)
    if (listener) listener()
  }


  load(onload, loading) {
    const id = setInterval(() => {
      const assetsTotalCount = this.assetsCount.image + this.assetsCount.audio
      const assetsLoadedCount = Object.keys(this.assetsObj.image).length
        + Object.keys(this.assetsObj.audio).length
      if (loading && isFunction(loading)) {
        loading({
          success: assetsLoadedCount,
          failed: this.assetsErrorCount,
          total: assetsTotalCount
        })
      }
      if (this.assetsErrorQueue.length > 0) {
        this.assetsErrorQueue.forEach((i) => {
          const {
            retry, name, src, type
          } = i
          if (retry >= this.loadLimit) {
            this.assetsErrorCount += 1
          } else if (type === 'image') {
            this.addImg(name, src, retry)
          } else {
            this.addAudio(name, src, retry)
          }
        })
        this.assetsErrorQueue = []
      }
      if (assetsLoadedCount === assetsTotalCount) {
        if (onload && isFunction(onload)) {
          onload()
        } else {
          this.init()
        }
        clearInterval(id)
      }
    }, 200)
  }

  init() {
    const self = this
    requestAnimationFrameTool((time) => {
      this.animate.call(self, time)
    })
  }
}


/***/ }),

/***/ "./node_modules/cooljs/index.js":
/*!**************************************!*\
  !*** ./node_modules/cooljs/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Engine": () => (/* reexport safe */ _engine__WEBPACK_IMPORTED_MODULE_0__.default),
/* harmony export */   "Instance": () => (/* reexport safe */ _instance__WEBPACK_IMPORTED_MODULE_1__.default)
/* harmony export */ });
/* harmony import */ var _engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./engine */ "./node_modules/cooljs/engine.js");
/* harmony import */ var _instance__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instance */ "./node_modules/cooljs/instance.js");




/***/ }),

/***/ "./node_modules/cooljs/instance.js":
/*!*****************************************!*\
  !*** ./node_modules/cooljs/instance.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Instance)
/* harmony export */ });
class Instance {
  constructor(option = {}) {
    const { name, painter, action, trigger } = option
    this.name = name
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
    this.ax = 0
    this.ay = 0
    this.vx = 0
    this.vy = 0
    this.visible = true
    this.painter = painter || null
    this.action = action || null
    this.trigger = trigger || null
    this.ready = false
  }

  paint(engine) {
    if (this.painter !== null && this.visible) {
      this.painter(this, engine)
    }
  }

  update(engine, time) {
    if (this.action !== null) {
      this.action(this, engine, time)
    }
  }

  updateWidth(width) {
    this.width = width
    this.calWidth = width / 2
  }

  updateHeight(height) {
    this.height = height
    this.calHeight = height / 2
  }
}


/***/ }),

/***/ "./node_modules/cooljs/tween.js":
/*!**************************************!*\
  !*** ./node_modules/cooljs/tween.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* eslint-disable */
const Tween = {
  linear: function (t, b, c, d) {
    return c * t / d + b;
  },
  easeIn: function (t, b, c, d) {
    return c * (t /= d) * t + b;
  },
  easeOut: function (t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  },
  easeInOut: function (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
  }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Tween);


/***/ }),

/***/ "./node_modules/cooljs/utils.js":
/*!**************************************!*\
  !*** ./node_modules/cooljs/utils.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getCurrentTime": () => (/* binding */ getCurrentTime),
/* harmony export */   "random": () => (/* binding */ random),
/* harmony export */   "randomPositiveNegative": () => (/* binding */ randomPositiveNegative),
/* harmony export */   "isFunction": () => (/* binding */ isFunction),
/* harmony export */   "isTouchDevice": () => (/* binding */ isTouchDevice),
/* harmony export */   "requestAnimationFrameTool": () => (/* binding */ requestAnimationFrameTool),
/* harmony export */   "arraySwap": () => (/* binding */ arraySwap)
/* harmony export */ });
const getCurrentTime = () => (performance.now())

const random = (min, max) => (Math.random() * (max - min)) + min

const randomPositiveNegative = () => (Math.random() < 0.5 ? -1 : 1)

const isFunction = f => (typeof f === 'function')

const isTouchDevice = () => ('ontouchstart' in window || window.navigator.msMaxTouchPoints)

const requestAnimationFrameTool = ((() => {
  const FPS = 60
  let timeout = 1000 / FPS
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    ((callBack) => {
      window.setTimeout(() => {
        const start = getCurrentTime()
        callBack(start)
        const end = getCurrentTime()
        timeout = (1000 / FPS) - (end - start)
      }, timeout)
    })
}))()

const arraySwap = (array, index1, index2) => {
  const temp = array[index2]
  array[index2] = array[index1]
  array[index1] = temp
}


/***/ }),

/***/ "./src/animateFuncs.js":
/*!*****************************!*\
  !*** ./src/animateFuncs.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "endAnimate": () => (/* binding */ endAnimate),
/* harmony export */   "startAnimate": () => (/* binding */ startAnimate)
/* harmony export */ });
/* harmony import */ var cooljs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cooljs */ "./node_modules/cooljs/index.js");
/* harmony import */ var _block__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./block */ "./src/block.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
/* harmony import */ var _flight__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./flight */ "./src/flight.js");
/* harmony import */ var _constant__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constant */ "./src/constant.js");






const endAnimate = (engine) => {
  const gameStartNow = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_4__.gameStartNow)
  if (!gameStartNow) return
  const successCount = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_4__.successCount, 0)
  const failedCount = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_4__.failedCount)
  const gameScore = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_4__.gameScore, 0)
  const threeFiguresOffset = Number(successCount) > 99 ? engine.width * 0.1 : 0

  ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.drawYellowString)(engine, {
    string: '层',
    size: engine.width * 0.06,
    x: (engine.width * 0.24) + threeFiguresOffset,
    y: engine.width * 0.12,
    textAlign: 'left'
  })
  ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.drawYellowString)(engine, {
    string: successCount,
    size: engine.width * 0.17,
    x: (engine.width * 0.22) + threeFiguresOffset,
    y: engine.width * 0.2,
    textAlign: 'right'
  })
  const score = engine.getImg('score')
  const scoreWidth = score.width
  const scoreHeight = score.height
  const zoomedWidth = engine.width * 0.35
  const zoomedHeight = (scoreHeight * zoomedWidth) / scoreWidth
  engine.ctx.drawImage(
    score,
    engine.width * 0.61,
    engine.width * 0.038,
    zoomedWidth,
    zoomedHeight
  )
  ;(0,_utils__WEBPACK_IMPORTED_MODULE_2__.drawYellowString)(engine, {
    string: gameScore,
    size: engine.width * 0.06,
    x: engine.width * 0.9,
    y: engine.width * 0.11,
    textAlign: 'right'
  })
  const { ctx } = engine
  const heart = engine.getImg('heart')
  const heartWidth = heart.width
  const heartHeight = heart.height
  const zoomedHeartWidth = engine.width * 0.08
  const zoomedHeartHeight = (heartHeight * zoomedHeartWidth) / heartWidth
  for (let i = 1; i <= 3; i += 1) {
    ctx.save()
    if (i <= failedCount) {
      ctx.globalAlpha = 0.2
    }
    ctx.drawImage(
      heart,
      (engine.width * 0.66) + ((i - 1) * zoomedHeartWidth),
      engine.width * 0.16,
      zoomedHeartWidth,
      zoomedHeartHeight
    )
    ctx.restore()
  }
}

const startAnimate = (engine) => {
  const gameStartNow = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_4__.gameStartNow)
  if (!gameStartNow) return
  const lastBlock = engine.getInstance(`block_${engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_4__.blockCount)}`)
  if (!lastBlock || [_constant__WEBPACK_IMPORTED_MODULE_4__.land, _constant__WEBPACK_IMPORTED_MODULE_4__.out].indexOf(lastBlock.status) > -1) {
    if ((0,_utils__WEBPACK_IMPORTED_MODULE_2__.checkMoveDown)(engine) && (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getMoveDownValue)(engine)) return
    if (engine.checkTimeMovement(_constant__WEBPACK_IMPORTED_MODULE_4__.hookUpMovement)) return
    const angleBase = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getAngleBase)(engine)
    const initialAngle = (Math.PI
        * engine.utils.random(angleBase, angleBase + 5)
        * engine.utils.randomPositiveNegative()
    ) / 180
    engine.setVariable(_constant__WEBPACK_IMPORTED_MODULE_4__.blockCount, engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_4__.blockCount) + 1)
    engine.setVariable(_constant__WEBPACK_IMPORTED_MODULE_4__.initialAngle, initialAngle)
    engine.setTimeMovement(_constant__WEBPACK_IMPORTED_MODULE_4__.hookDownMovement, 500)
    const block = new cooljs__WEBPACK_IMPORTED_MODULE_0__.Instance({
      name: `block_${engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_4__.blockCount)}`,
      action: _block__WEBPACK_IMPORTED_MODULE_1__.blockAction,
      painter: _block__WEBPACK_IMPORTED_MODULE_1__.blockPainter
    })
    engine.addInstance(block)
  }
  const successCount = Number(engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_4__.successCount, 0))
  switch (successCount) {
    case 2:
      ;(0,_flight__WEBPACK_IMPORTED_MODULE_3__.addFlight)(engine, 1, 'leftToRight')
      break
    case 6:
      ;(0,_flight__WEBPACK_IMPORTED_MODULE_3__.addFlight)(engine, 2, 'rightToLeft')
      break
    case 8:
      ;(0,_flight__WEBPACK_IMPORTED_MODULE_3__.addFlight)(engine, 3, 'leftToRight')
      break
    case 14:
      ;(0,_flight__WEBPACK_IMPORTED_MODULE_3__.addFlight)(engine, 4, 'bottomToTop')
      break
    case 18:
      ;(0,_flight__WEBPACK_IMPORTED_MODULE_3__.addFlight)(engine, 5, 'bottomToTop')
      break
    case 22:
      ;(0,_flight__WEBPACK_IMPORTED_MODULE_3__.addFlight)(engine, 6, 'bottomToTop')
      break
    case 25:
      ;(0,_flight__WEBPACK_IMPORTED_MODULE_3__.addFlight)(engine, 7, 'rightTopToLeft')
      break
    default:
      break
  }
}



/***/ }),

/***/ "./src/background.js":
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "backgroundImg": () => (/* binding */ backgroundImg),
/* harmony export */   "backgroundLinearGradient": () => (/* binding */ backgroundLinearGradient),
/* harmony export */   "background": () => (/* binding */ background)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
/* harmony import */ var _constant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constant */ "./src/constant.js");



const backgroundImg = (engine) => {
  const bg = engine.getImg('background')
  const bgWidth = bg.width
  const bgHeight = bg.height
  const zoomedHeight = (bgHeight * engine.width) / bgWidth
  let offsetHeight = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_1__.bgImgOffset, engine.height - zoomedHeight)
  if (offsetHeight > engine.height) {
    return
  }
  engine.getTimeMovement(
    _constant__WEBPACK_IMPORTED_MODULE_1__.moveDownMovement,
    [[offsetHeight, offsetHeight + ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.getMoveDownValue)(engine, { pixelsPerFrame: s => s / 2 }))]],
    (value) => {
      offsetHeight = value
    },
    {
      name: 'background'
    }
  )
  engine.getTimeMovement(
    _constant__WEBPACK_IMPORTED_MODULE_1__.bgInitMovement,
    [[offsetHeight, offsetHeight + (zoomedHeight / 4)]],
    (value) => {
      offsetHeight = value
    }
  )
  engine.setVariable(_constant__WEBPACK_IMPORTED_MODULE_1__.bgImgOffset, offsetHeight)
  engine.setVariable(_constant__WEBPACK_IMPORTED_MODULE_1__.lineInitialOffset, engine.height - (zoomedHeight * 0.394))
  engine.ctx.drawImage(
    bg,
    0, offsetHeight,
    engine.width, zoomedHeight
  )
}

const getLinearGradientColorRgb = (colorArr, colorIndex, proportion) => {
  const currentIndex = colorIndex + 1 >= colorArr.length ? colorArr.length - 1 : colorIndex
  const colorCurrent = colorArr[currentIndex]
  const nextIndex = currentIndex + 1 >= colorArr.length - 1 ? currentIndex : currentIndex + 1
  const colorNext = colorArr[nextIndex]
  const calRgbValue = (index) => {
    const current = colorCurrent[index]
    const next = colorNext[index]
    return Math.round(current + ((next - current) * proportion))
  }
  return `rgb(${calRgbValue(0)}, ${calRgbValue(1)}, ${calRgbValue(2)})`
}

const backgroundLinearGradient = (engine) => {
  const grad = engine.ctx.createLinearGradient(0, 0, 0, engine.height)
  const colorArr = [
    [200, 255, 150],
    [105, 230, 240],
    [90, 190, 240],
    [85, 100, 190],
    [55, 20, 35],
    [75, 25, 35],
    [25, 0, 10]
  ]
  const offsetHeight = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_1__.bgLinearGradientOffset, 0)
  if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.checkMoveDown)(engine)) {
    engine.setVariable(
      _constant__WEBPACK_IMPORTED_MODULE_1__.bgLinearGradientOffset
      , offsetHeight + ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.getMoveDownValue)(engine) * 1.5)
    )
  }
  const colorIndex = parseInt(offsetHeight / engine.height, 10)
  const calOffsetHeight = offsetHeight % engine.height
  const proportion = calOffsetHeight / engine.height
  const colorBase = getLinearGradientColorRgb(colorArr, colorIndex, proportion)
  const colorTop = getLinearGradientColorRgb(colorArr, colorIndex + 1, proportion)
  grad.addColorStop(0, colorTop)
  grad.addColorStop(1, colorBase)
  engine.ctx.fillStyle = grad
  engine.ctx.beginPath()
  engine.ctx.rect(0, 0, engine.width, engine.height)
  engine.ctx.fill()

  // lightning
  const lightning = () => {
    engine.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    engine.ctx.fillRect(0, 0, engine.width, engine.height)
  }
  engine.getTimeMovement(
    _constant__WEBPACK_IMPORTED_MODULE_1__.lightningMovement, [], () => {},
    {
      before: lightning,
      after: lightning
    }
  )
}

const background = (engine) => {
  backgroundLinearGradient(engine)
  backgroundImg(engine)
}



/***/ }),

/***/ "./src/block.js":
/*!**********************!*\
  !*** ./src/block.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "blockAction": () => (/* binding */ blockAction),
/* harmony export */   "blockPainter": () => (/* binding */ blockPainter)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
/* harmony import */ var _constant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constant */ "./src/constant.js");



const checkCollision = (block, line) => {
  // 0 goon 1 drop 2 rotate left 3 rotate right 4 ok 5 perfect
  if (block.y + block.height >= line.y) {
    if (block.x < line.x - block.calWidth || block.x > line.collisionX + block.calWidth) {
      return 1
    }
    if (block.x < line.x) {
      return 2
    }
    if (block.x > line.collisionX) {
      return 3
    }
    if (block.x > line.x + (block.calWidth * 0.8) && block.x < line.x + (block.calWidth * 1.2)) {
      // -10% +10%
      return 5
    }
    return 4
  }
  return 0
}
const swing = (instance, engine, time) => {
  const ropeHeight = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_1__.ropeHeight)
  if (instance.status !== _constant__WEBPACK_IMPORTED_MODULE_1__.swing) return
  const i = instance
  const initialAngle = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_1__.initialAngle)
  i.angle = initialAngle *
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getSwingBlockVelocity)(engine, time)
  i.weightX = i.x +
    (Math.sin(i.angle) * ropeHeight)
  i.weightY = i.y +
    (Math.cos(i.angle) * ropeHeight)
}

const checkBlockOut = (instance, engine) => {
  if (instance.status === _constant__WEBPACK_IMPORTED_MODULE_1__.rotateLeft) {
    // 左转 要等右上角消失才算消失
    if (instance.y - instance.width >= engine.height) {
      instance.visible = false
      instance.status = _constant__WEBPACK_IMPORTED_MODULE_1__.out
      ;(0,_utils__WEBPACK_IMPORTED_MODULE_0__.addFailedCount)(engine)
    }
  } else if (instance.y >= engine.height) {
    instance.visible = false
    instance.status = _constant__WEBPACK_IMPORTED_MODULE_1__.out
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_0__.addFailedCount)(engine)
  }
}

const blockAction = (instance, engine, time) => {
  const i = instance
  const ropeHeight = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_1__.ropeHeight)
  if (!i.visible) {
    return
  }
  if (!i.ready) {
    i.ready = true
    i.status = _constant__WEBPACK_IMPORTED_MODULE_1__.swing
    instance.updateWidth(engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_1__.blockWidth))
    instance.updateHeight(engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_1__.blockHeight))
    instance.x = engine.width / 2
    instance.y = ropeHeight * -1.5
  }
  const line = engine.getInstance('line')
  switch (i.status) {
    case _constant__WEBPACK_IMPORTED_MODULE_1__.swing:
      engine.getTimeMovement(
        _constant__WEBPACK_IMPORTED_MODULE_1__.hookDownMovement,
        [[instance.y, instance.y + ropeHeight]],
        (value) => {
          instance.y = value
        },
        {
          name: 'block'
        }
      )
      swing(instance, engine, time)
      break
    case _constant__WEBPACK_IMPORTED_MODULE_1__.beforeDrop:
      i.x = instance.weightX - instance.calWidth
      i.y = instance.weightY + (0.3 * instance.height) // add rope height
      i.rotate = 0
      i.ay = engine.pixelsPerFrame(0.0003 * engine.height) // acceleration of gravity
      i.startDropTime = time
      i.status = _constant__WEBPACK_IMPORTED_MODULE_1__.drop
      break
    case _constant__WEBPACK_IMPORTED_MODULE_1__.drop:
      const deltaTime = time - i.startDropTime
      i.startDropTime = time
      i.vy += i.ay * deltaTime
      i.y += (i.vy * deltaTime) + (0.5 * i.ay * (deltaTime ** 2))
      const collision = checkCollision(instance, line)
      const blockY = line.y - instance.height
      const calRotate = (ins) => {
        ins.originOutwardAngle = Math.atan(ins.height / ins.outwardOffset)
        ins.originHypotenuse = Math.sqrt((ins.height ** 2)
          + (ins.outwardOffset ** 2))
        engine.playAudio('rotate')
      }
      switch (collision) {
        case 1:
          checkBlockOut(instance, engine)
          break
        case 2:
          i.status = _constant__WEBPACK_IMPORTED_MODULE_1__.rotateLeft
          instance.y = blockY
          instance.outwardOffset = (line.x + instance.calWidth) - instance.x
          calRotate(instance)
          break
        case 3:
          i.status = _constant__WEBPACK_IMPORTED_MODULE_1__.rotateRight
          instance.y = blockY
          instance.outwardOffset = (line.collisionX + instance.calWidth) - instance.x
          calRotate(instance)
          break
        case 4:
        case 5:
          i.status = _constant__WEBPACK_IMPORTED_MODULE_1__.land
          const lastSuccessCount = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_1__.successCount)
          ;(0,_utils__WEBPACK_IMPORTED_MODULE_0__.addSuccessCount)(engine)
          engine.setTimeMovement(_constant__WEBPACK_IMPORTED_MODULE_1__.moveDownMovement, 500)
          if (lastSuccessCount === 10 || lastSuccessCount === 15) {
            engine.setTimeMovement(_constant__WEBPACK_IMPORTED_MODULE_1__.lightningMovement, 150)
          }
          instance.y = blockY
          line.y = blockY
          line.x = i.x - i.calWidth
          line.collisionX = line.x + i.width
          // 作弊检测 超出左边或右边1／3
          const cheatWidth = i.width * 0.3
          if (i.x > engine.width - (cheatWidth * 2)
            || i.x < -cheatWidth) {
            engine.setVariable(_constant__WEBPACK_IMPORTED_MODULE_1__.hardMode, true)
          }
          if (collision === 5) {
            instance.perfect = true
            ;(0,_utils__WEBPACK_IMPORTED_MODULE_0__.addScore)(engine, true)
            engine.playAudio('drop-perfect')
          } else {
            (0,_utils__WEBPACK_IMPORTED_MODULE_0__.addScore)(engine)
            engine.playAudio('drop')
          }
          break
        default:
          break
      }
      break
    case _constant__WEBPACK_IMPORTED_MODULE_1__.land:
      engine.getTimeMovement(
        _constant__WEBPACK_IMPORTED_MODULE_1__.moveDownMovement,
        [[instance.y, instance.y + ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.getMoveDownValue)(engine, { pixelsPerFrame: s => s / 2 }))]],
        (value) => {
          if (!instance.visible) return
          instance.y = value
          if (instance.y > engine.height) {
            instance.visible = false
          }
        },
        {
          name: instance.name
        }
      )
      instance.x += (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getLandBlockVelocity)(engine, time)
      break
    case _constant__WEBPACK_IMPORTED_MODULE_1__.rotateLeft:
    case _constant__WEBPACK_IMPORTED_MODULE_1__.rotateRight:
      const isRight = i.status === _constant__WEBPACK_IMPORTED_MODULE_1__.rotateRight
      const rotateSpeed = engine.pixelsPerFrame(Math.PI * 4)
      const isShouldFall = isRight ? instance.rotate > 1.3 : instance.rotate < -1.3// 75度
      const leftFix = isRight ? 1 : -1
      if (isShouldFall) {
        instance.rotate += (rotateSpeed / 8) * leftFix
        instance.y += engine.pixelsPerFrame(engine.height * 0.7)
        instance.x += engine.pixelsPerFrame(engine.width * 0.3) * leftFix
      } else {
        let rotateRatio = (instance.calWidth - instance.outwardOffset)
          / instance.calWidth
        rotateRatio = rotateRatio > 0.5 ? rotateRatio : 0.5
        instance.rotate += rotateSpeed * rotateRatio * leftFix
        const angle = instance.originOutwardAngle + instance.rotate
        const rotateAxisX = isRight ? line.collisionX + instance.calWidth
          : line.x + instance.calWidth
        const rotateAxisY = line.y
        instance.x = rotateAxisX -
          (Math.cos(angle) * instance.originHypotenuse)
        instance.y = rotateAxisY -
          (Math.sin(angle) * instance.originHypotenuse)
      }
      checkBlockOut(instance, engine)
      break
    default:
      break
  }
}

const drawSwingBlock = (instance, engine) => {
  const bl = engine.getImg('blockRope')
  engine.ctx.drawImage(
    bl, instance.weightX - instance.calWidth
    , instance.weightY
    , instance.width, instance.height * 1.3
  )
  const leftX = instance.weightX - instance.calWidth
  engine.debugLineY(leftX)
}

const drawBlock = (instance, engine) => {
  const { perfect } = instance
  const bl = engine.getImg(perfect ? 'block-perfect' : 'block')
  engine.ctx.drawImage(bl, instance.x, instance.y, instance.width, instance.height)
}

const drawRotatedBlock = (instance, engine) => {
  const { ctx } = engine
  ctx.save()
  ctx.translate(instance.x, instance.y)
  ctx.rotate(instance.rotate)
  ctx.translate(-instance.x, -instance.y)
  drawBlock(instance, engine)
  ctx.restore()
}

const blockPainter = (instance, engine) => {
  const { status } = instance
  switch (status) {
    case _constant__WEBPACK_IMPORTED_MODULE_1__.swing:
      drawSwingBlock(instance, engine)
      break
    case _constant__WEBPACK_IMPORTED_MODULE_1__.drop:
    case _constant__WEBPACK_IMPORTED_MODULE_1__.land:
      drawBlock(instance, engine)
      break
    case _constant__WEBPACK_IMPORTED_MODULE_1__.rotateLeft:
    case _constant__WEBPACK_IMPORTED_MODULE_1__.rotateRight:
      drawRotatedBlock(instance, engine)
      break
    default:
      break
  }
}


/***/ }),

/***/ "./src/cloud.js":
/*!**********************!*\
  !*** ./src/cloud.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "cloudAction": () => (/* binding */ cloudAction),
/* harmony export */   "cloudPainter": () => (/* binding */ cloudPainter)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
/* harmony import */ var _constant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constant */ "./src/constant.js");



const randomCloudImg = (instance) => {
  const { count } = instance
  const clouds = ['c1', 'c2', 'c3']
  const stones = ['c4', 'c5', 'c6', 'c7', 'c8']
  const randomImg = array => (array[Math.floor(Math.random() * array.length)])
  instance.imgName = count > 6 ? randomImg(stones) : randomImg(clouds)
}

const cloudAction = (instance, engine) => {
  if (!instance.ready) {
    instance.ready = true
    randomCloudImg(instance)
    instance.width = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_1__.cloudSize)
    instance.height = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_1__.cloudSize)
    const engineW = engine.width
    const engineH = engine.height
    const positionArr = [
      { x: engineW * 0.1, y: -engineH * 0.66 },
      { x: engineW * 0.65, y: -engineH * 0.33 },
      { x: engineW * 0.1, y: 0 },
      { x: engineW * 0.65, y: engineH * 0.33 }
    ]
    const position = positionArr[instance.index - 1]
    instance.x = engine.utils.random(position.x, (position.x * 1.2))
    instance.originX = instance.x
    instance.ax = engine.pixelsPerFrame(instance.width * engine.utils.random(0.05, 0.08)
      * engine.utils.randomPositiveNegative())
    instance.y = engine.utils.random(position.y, (position.y * 1.2))
  }
  instance.x += instance.ax
  if (instance.x >= instance.originX + instance.width
    || instance.x <= instance.originX - instance.width) {
    instance.ax *= -1
  }
  if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.checkMoveDown)(engine)) {
    instance.y += (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getMoveDownValue)(engine) * 1.2
  }
  if (instance.y >= engine.height) {
    instance.y = -engine.height * 0.66
    instance.count += 4
    randomCloudImg(instance)
  }
}

const cloudPainter = (instance, engine) => {
  const { ctx } = engine
  const cloud = engine.getImg(instance.imgName)
  ctx.drawImage(cloud, instance.x, instance.y, instance.width, instance.height)
}



/***/ }),

/***/ "./src/constant.js":
/*!*************************!*\
  !*** ./src/constant.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "gameStartNow": () => (/* binding */ gameStartNow),
/* harmony export */   "gameUserOption": () => (/* binding */ gameUserOption),
/* harmony export */   "hardMode": () => (/* binding */ hardMode),
/* harmony export */   "successCount": () => (/* binding */ successCount),
/* harmony export */   "failedCount": () => (/* binding */ failedCount),
/* harmony export */   "perfectCount": () => (/* binding */ perfectCount),
/* harmony export */   "gameScore": () => (/* binding */ gameScore),
/* harmony export */   "hookDown": () => (/* binding */ hookDown),
/* harmony export */   "hookUp": () => (/* binding */ hookUp),
/* harmony export */   "hookNormal": () => (/* binding */ hookNormal),
/* harmony export */   "bgImgOffset": () => (/* binding */ bgImgOffset),
/* harmony export */   "lineInitialOffset": () => (/* binding */ lineInitialOffset),
/* harmony export */   "bgLinearGradientOffset": () => (/* binding */ bgLinearGradientOffset),
/* harmony export */   "blockCount": () => (/* binding */ blockCount),
/* harmony export */   "blockWidth": () => (/* binding */ blockWidth),
/* harmony export */   "blockHeight": () => (/* binding */ blockHeight),
/* harmony export */   "cloudSize": () => (/* binding */ cloudSize),
/* harmony export */   "ropeHeight": () => (/* binding */ ropeHeight),
/* harmony export */   "flightCount": () => (/* binding */ flightCount),
/* harmony export */   "flightLayer": () => (/* binding */ flightLayer),
/* harmony export */   "rotateRight": () => (/* binding */ rotateRight),
/* harmony export */   "rotateLeft": () => (/* binding */ rotateLeft),
/* harmony export */   "swing": () => (/* binding */ swing),
/* harmony export */   "beforeDrop": () => (/* binding */ beforeDrop),
/* harmony export */   "drop": () => (/* binding */ drop),
/* harmony export */   "land": () => (/* binding */ land),
/* harmony export */   "out": () => (/* binding */ out),
/* harmony export */   "initialAngle": () => (/* binding */ initialAngle),
/* harmony export */   "bgInitMovement": () => (/* binding */ bgInitMovement),
/* harmony export */   "hookDownMovement": () => (/* binding */ hookDownMovement),
/* harmony export */   "hookUpMovement": () => (/* binding */ hookUpMovement),
/* harmony export */   "lightningMovement": () => (/* binding */ lightningMovement),
/* harmony export */   "tutorialMovement": () => (/* binding */ tutorialMovement),
/* harmony export */   "moveDownMovement": () => (/* binding */ moveDownMovement)
/* harmony export */ });
const gameStartNow = 'GAME_START_NOW'
const gameUserOption = 'GAME_USER_OPTION'
const hardMode = 'HARD_MODE'

const successCount = 'SUCCESS_COUNT'
const failedCount = 'FAILED_COUNT'
const perfectCount = 'PERFECT_COUNT'
const gameScore = 'GAME_SCORE'

const hookDown = 'HOOK_DOWN'
const hookUp = 'HOOK_UP'
const hookNormal = 'HOOK_NORMAL'

const bgImgOffset = 'BACKGROUND_IMG_OFFSET_HEIGHT'
const lineInitialOffset = 'LINE_INITIAL_OFFSET'
const bgLinearGradientOffset = 'BACKGROUND_LINEAR_GRADIENT_OFFSET_HEIGHT'


const blockCount = 'BLOCK_COUNT'
const blockWidth = 'BLOCK_WIDTH'
const blockHeight = 'BLOCK_HEIGHT'
const cloudSize = 'CLOUD_SIZE'
const ropeHeight = 'ROPE_HEIGHT'
const flightCount = 'FLIGHT_COUNT'
const flightLayer = 'FLIGHT_LAYER'

const rotateRight = 'ROTATE_RIGHT'
const rotateLeft = 'ROTATE_LEFT'
const swing = 'SWING'
const beforeDrop = 'BEFORE_DROP'
const drop = 'DROP'
const land = 'LAND'
const out = 'OUT'

const initialAngle = 'INITIAL_ANGLE'

const bgInitMovement = 'BG_INIT_MOVEMENT'
const hookDownMovement = 'HOOK_DOWN_MOVEMENT'
const hookUpMovement = 'HOOK_UP_MOVEMENT'
const lightningMovement = 'LIGHTNING_MOVEMENT'
const tutorialMovement = 'TUTORIAL_MOVEMENT'
const moveDownMovement = 'MOVE_DOWN_MOVEMENT'


/***/ }),

/***/ "./src/flight.js":
/*!***********************!*\
  !*** ./src/flight.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "flightAction": () => (/* binding */ flightAction),
/* harmony export */   "flightPainter": () => (/* binding */ flightPainter),
/* harmony export */   "addFlight": () => (/* binding */ addFlight)
/* harmony export */ });
/* harmony import */ var cooljs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cooljs */ "./node_modules/cooljs/index.js");
/* harmony import */ var _constant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constant */ "./src/constant.js");



const getActionConfig = (engine, type) => {
  const {
    width, height, utils
  } = engine
  const { random } = utils
  const size = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_1__.cloudSize)
  const actionTypes = {
    bottomToTop: {
      x: width * random(0.3, 0.7),
      y: height,
      vx: 0,
      vy: engine.pixelsPerFrame(height) * 0.7 * -1
    },
    leftToRight: {
      x: size * -1,
      y: height * random(0.3, 0.6),
      vx: engine.pixelsPerFrame(width) * 0.4,
      vy: engine.pixelsPerFrame(height) * 0.1 * -1
    },
    rightToLeft: {
      x: width,
      y: height * random(0.2, 0.5),
      vx: engine.pixelsPerFrame(width) * 0.4 * -1,
      vy: engine.pixelsPerFrame(height) * 0.1
    },
    rightTopToLeft: {
      x: width,
      y: 0,
      vx: engine.pixelsPerFrame(width) * 0.6 * -1,
      vy: engine.pixelsPerFrame(height) * 0.5
    }
  }
  return actionTypes[type]
}


const flightAction = (instance, engine) => {
  const { visible, ready, type } = instance
  if (!visible) return
  const size = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_1__.cloudSize)
  if (!ready) {
    const action = getActionConfig(engine, type)
    instance.ready = true
    instance.width = size
    instance.height = size
    instance.x = action.x
    instance.y = action.y
    instance.vx = action.vx
    instance.vy = action.vy
  }
  instance.x += instance.vx
  instance.y += instance.vy
  if (instance.y + size < 0
    || instance.y > engine.height
    || instance.x + size < 0
    || instance.x > engine.width) {
    instance.visible = false
  }
}

const flightPainter = (instance, engine) => {
  const { ctx } = engine
  const flight = engine.getImg(instance.imgName)
  ctx.drawImage(flight, instance.x, instance.y, instance.width, instance.height)
}

const addFlight = (engine, number, type) => {
  const flightCount = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_1__.flightCount)
  if (flightCount === number) return
  const flight = new cooljs__WEBPACK_IMPORTED_MODULE_0__.Instance({
    name: `flight_${number}`,
    action: flightAction,
    painter: flightPainter
  })
  flight.imgName = `f${number}`
  flight.type = type
  engine.addInstance(flight, _constant__WEBPACK_IMPORTED_MODULE_1__.flightLayer)
  engine.setVariable(_constant__WEBPACK_IMPORTED_MODULE_1__.flightCount, number)
}


/***/ }),

/***/ "./src/hook.js":
/*!*********************!*\
  !*** ./src/hook.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hookAction": () => (/* binding */ hookAction),
/* harmony export */   "hookPainter": () => (/* binding */ hookPainter)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
/* harmony import */ var _constant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constant */ "./src/constant.js");



const hookAction = (instance, engine, time) => {
  const ropeHeight = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_1__.ropeHeight)
  if (!instance.ready) {
    instance.x = engine.width / 2
    instance.y = ropeHeight * -1.5
    instance.ready = true
  }
  engine.getTimeMovement(
    _constant__WEBPACK_IMPORTED_MODULE_1__.hookUpMovement,
    [[instance.y, instance.y - ropeHeight]],
    (value) => {
      instance.y = value
    },
    {
      after: () => {
        instance.y = ropeHeight * -1.5
      }
    }
  )
  engine.getTimeMovement(
    _constant__WEBPACK_IMPORTED_MODULE_1__.hookDownMovement,
    [[instance.y, instance.y + ropeHeight]],
    (value) => {
      instance.y = value
    },
    {
      name: 'hook'
    }
  )
  const initialAngle = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_1__.initialAngle)
  instance.angle = initialAngle *
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getSwingBlockVelocity)(engine, time)
  instance.weightX = instance.x +
    (Math.sin(instance.angle) * ropeHeight)
  instance.weightY = instance.y +
    (Math.cos(instance.angle) * ropeHeight)
}

const hookPainter = (instance, engine) => {
  const { ctx } = engine
  const ropeHeight = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_1__.ropeHeight)
  const ropeWidth = ropeHeight * 0.1
  const hook = engine.getImg('hook')
  ctx.save()
  ctx.translate(instance.x, instance.y)
  ctx.rotate((Math.PI * 2) - instance.angle)
  ctx.translate(-instance.x, -instance.y)
  engine.ctx.drawImage(hook, instance.x - (ropeWidth / 2), instance.y, ropeWidth, ropeHeight + 5)
  ctx.restore()
}



/***/ }),

/***/ "./src/line.js":
/*!*********************!*\
  !*** ./src/line.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "lineAction": () => (/* binding */ lineAction),
/* harmony export */   "linePainter": () => (/* binding */ linePainter)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
/* harmony import */ var _constant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constant */ "./src/constant.js");



const lineAction = (instance, engine, time) => {
  const i = instance
  if (!i.ready) {
    i.y = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_1__.lineInitialOffset)
    i.ready = true
    i.collisionX = engine.width - engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_1__.blockWidth)
  }
  engine.getTimeMovement(
    _constant__WEBPACK_IMPORTED_MODULE_1__.moveDownMovement,
    [[instance.y, instance.y + ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.getMoveDownValue)(engine, { pixelsPerFrame: s => s / 2 }))]],
    (value) => {
      instance.y = value
    },
    {
      name: 'line'
    }
  )
  const landBlockVelocity = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getLandBlockVelocity)(engine, time)
  instance.x += landBlockVelocity
  instance.collisionX += landBlockVelocity
}

const linePainter = (instance, engine) => {
  const { ctx, debug } = engine
  if (!debug) {
    return
  }
  ctx.save()
  ctx.beginPath()
  ctx.strokeStyle = 'red'
  ctx.moveTo(instance.x, instance.y)
  ctx.lineTo(instance.collisionX, instance.y)
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.restore()
}



/***/ }),

/***/ "./src/tutorial.js":
/*!*************************!*\
  !*** ./src/tutorial.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tutorialAction": () => (/* binding */ tutorialAction),
/* harmony export */   "tutorialPainter": () => (/* binding */ tutorialPainter)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
/* harmony import */ var _constant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constant */ "./src/constant.js");



const tutorialAction = (instance, engine, time) => {
  const { width, height } = engine
  const { name } = instance
  if (!instance.ready) {
    instance.ready = true
    const tutorialWidth = width * 0.2
    instance.updateWidth(tutorialWidth)
    instance.height = tutorialWidth * 0.46
    instance.x = engine.calWidth - instance.calWidth
    instance.y = height * 0.45
    if (name !== 'tutorial') {
      instance.y += instance.height * 1.2
    }
  }
  if (name !== 'tutorial') {
    instance.y += Math.cos(time / 200) * instance.height * 0.01
  }
}

const tutorialPainter = (instance, engine) => {
  if (engine.checkTimeMovement(_constant__WEBPACK_IMPORTED_MODULE_1__.tutorialMovement)) {
    return
  }
  if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.getHookStatus)(engine) !== _constant__WEBPACK_IMPORTED_MODULE_1__.hookNormal) {
    return
  }
  const { ctx } = engine
  const { name } = instance
  const t = engine.getImg(name)
  ctx.drawImage(t, instance.x, instance.y, instance.width, instance.height)
}



/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "checkMoveDown": () => (/* binding */ checkMoveDown),
/* harmony export */   "getMoveDownValue": () => (/* binding */ getMoveDownValue),
/* harmony export */   "getAngleBase": () => (/* binding */ getAngleBase),
/* harmony export */   "getSwingBlockVelocity": () => (/* binding */ getSwingBlockVelocity),
/* harmony export */   "getLandBlockVelocity": () => (/* binding */ getLandBlockVelocity),
/* harmony export */   "getHookStatus": () => (/* binding */ getHookStatus),
/* harmony export */   "touchEventHandler": () => (/* binding */ touchEventHandler),
/* harmony export */   "addSuccessCount": () => (/* binding */ addSuccessCount),
/* harmony export */   "addFailedCount": () => (/* binding */ addFailedCount),
/* harmony export */   "addScore": () => (/* binding */ addScore),
/* harmony export */   "drawYellowString": () => (/* binding */ drawYellowString)
/* harmony export */ });
/* harmony import */ var _constant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constant */ "./src/constant.js");


const checkMoveDown = engine =>
  (engine.checkTimeMovement(_constant__WEBPACK_IMPORTED_MODULE_0__.moveDownMovement))

const getMoveDownValue = (engine, store) => {
  const pixelsPerFrame = store ? store.pixelsPerFrame : engine.pixelsPerFrame.bind(engine)
  const successCount = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.successCount)
  const calHeight = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.blockHeight) * 2
  if (successCount <= 4) {
    return pixelsPerFrame(calHeight * 1.25)
  }
  return pixelsPerFrame(calHeight)
}

const getAngleBase = (engine) => {
  const successCount = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.successCount)
  const gameScore = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.gameScore)
  const { hookAngle } = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.gameUserOption)
  if (hookAngle) {
    return hookAngle(successCount, gameScore)
  }
  if (engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.hardMode)) {
    return 90
  }
  switch (true) {
    case successCount < 10:
      return 30
    case successCount < 20:
      return 60
    default:
      return 80
  }
}

const getSwingBlockVelocity = (engine, time) => {
  const successCount = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.successCount)
  const gameScore = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.gameScore)
  const { hookSpeed } = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.gameUserOption)
  if (hookSpeed) {
    return hookSpeed(successCount, gameScore)
  }
  let hard
  switch (true) {
    case successCount < 1:
      hard = 0
      break
    case successCount < 10:
      hard = 1
      break
    case successCount < 20:
      hard = 0.8
      break
    case successCount < 30:
      hard = 0.7
      break
    default:
      hard = 0.74
      break
  }
  if (engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.hardMode)) {
    hard = 1.1
  }
  return Math.sin(time / (200 / hard))
}

const getLandBlockVelocity = (engine, time) => {
  const successCount = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.successCount)
  const gameScore = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.gameScore)
  const { landBlockSpeed } = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.gameUserOption)
  if (landBlockSpeed) {
    return landBlockSpeed(successCount, gameScore)
  }
  const { width } = engine
  let hard
  switch (true) {
    case successCount < 5:
      hard = 0
      break
    case successCount < 13:
      hard = 0.001
      break
    case successCount < 23:
      hard = 0.002
      break
    default:
      hard = 0.003
      break
  }
  return Math.cos(time / 200) * hard * width
}

const getHookStatus = (engine) => {
  if (engine.checkTimeMovement(_constant__WEBPACK_IMPORTED_MODULE_0__.hookDownMovement)) {
    return _constant__WEBPACK_IMPORTED_MODULE_0__.hookDown
  }
  if (engine.checkTimeMovement(_constant__WEBPACK_IMPORTED_MODULE_0__.hookUpMovement)) {
    return _constant__WEBPACK_IMPORTED_MODULE_0__.hookUp
  }
  return _constant__WEBPACK_IMPORTED_MODULE_0__.hookNormal
}

const touchEventHandler = (engine) => {
  if (!engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.gameStartNow)) return
  if (engine.debug && engine.paused) {
    return
  }
  if (getHookStatus(engine) !== _constant__WEBPACK_IMPORTED_MODULE_0__.hookNormal) {
    return
  }
  engine.removeInstance('tutorial')
  engine.removeInstance('tutorial-arrow')
  const b = engine.getInstance(`block_${engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.blockCount)}`)
  if (b && b.status === _constant__WEBPACK_IMPORTED_MODULE_0__.swing) {
    engine.setTimeMovement(_constant__WEBPACK_IMPORTED_MODULE_0__.hookUpMovement, 500)
    b.status = _constant__WEBPACK_IMPORTED_MODULE_0__.beforeDrop
  }
}

const addSuccessCount = (engine) => {
  const { setGameSuccess } = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.gameUserOption)
  const lastSuccessCount = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.successCount)
  const success = lastSuccessCount + 1
  engine.setVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.successCount, success)
  if (engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.hardMode)) {
    engine.setVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.ropeHeight, engine.height * engine.utils.random(0.35, 0.55))
  }
  if (setGameSuccess) setGameSuccess(success)
}

const addFailedCount = (engine) => {
  const { setGameFailed } = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.gameUserOption)
  const lastFailedCount = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.failedCount)
  const failed = lastFailedCount + 1
  engine.setVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.failedCount, failed)
  engine.setVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.perfectCount, 0)
  if (setGameFailed) setGameFailed(failed)
  if (failed >= 3) {
    engine.pauseAudio('bgm')
    engine.playAudio('game-over')
    engine.setVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.gameStartNow, false)
  }
}

const addScore = (engine, isPerfect) => {
  const { setGameScore, successScore, perfectScore } = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.gameUserOption)
  const lastPerfectCount = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.perfectCount, 0)
  const lastGameScore = engine.getVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.gameScore)
  const perfect = isPerfect ? lastPerfectCount + 1 : 0
  const score = lastGameScore + (successScore || 25) + ((perfectScore || 25) * perfect)
  engine.setVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.gameScore, score)
  engine.setVariable(_constant__WEBPACK_IMPORTED_MODULE_0__.perfectCount, perfect)
  if (setGameScore) setGameScore(score)
}

const drawYellowString = (engine, option) => {
  const {
    string, size, x, y, textAlign
  } = option
  const { ctx } = engine
  const fontName = 'wenxue'
  const fontSize = size
  const lineSize = fontSize * 0.1
  ctx.save()
  ctx.beginPath()
  const gradient = ctx.createLinearGradient(0, 0, 0, y)
  gradient.addColorStop(0, '#FAD961')
  gradient.addColorStop(1, '#F76B1C')
  ctx.fillStyle = gradient
  ctx.lineWidth = lineSize
  ctx.strokeStyle = '#FFF'
  ctx.textAlign = textAlign || 'center'
  ctx.font = `${fontSize}px ${fontName}`
  ctx.strokeText(string, x, y)
  ctx.fillText(string, x, y)
  ctx.restore()
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var cooljs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cooljs */ "./node_modules/cooljs/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
/* harmony import */ var _background__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./background */ "./src/background.js");
/* harmony import */ var _line__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./line */ "./src/line.js");
/* harmony import */ var _cloud__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./cloud */ "./src/cloud.js");
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hook */ "./src/hook.js");
/* harmony import */ var _tutorial__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./tutorial */ "./src/tutorial.js");
/* harmony import */ var _constant__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./constant */ "./src/constant.js");
/* harmony import */ var _animateFuncs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./animateFuncs */ "./src/animateFuncs.js");










window.TowerGame = (option = {}) => {
  const { width, height, canvasId, soundOn } = option;
  const game = new cooljs__WEBPACK_IMPORTED_MODULE_0__.Engine({
    canvasId,
    highResolution: true,
    width,
    height,
    soundOn,
    debug: true,
  });
  const pathGenerator = path => `./assets/${path}`;

  game.addImg('background', pathGenerator('background.png'));
  game.addImg('hook', pathGenerator('hook.png'));
  game.addImg('blockRope', pathGenerator('block-rope.png'));
  game.addImg('block', pathGenerator('block.png'));
  game.addImg('block-perfect', pathGenerator('block-perfect.png'));
  for (let i = 1; i <= 8; i += 1) {
    game.addImg(`c${i}`, pathGenerator(`c${i}.png`));
  }
  game.addLayer(_constant__WEBPACK_IMPORTED_MODULE_7__.flightLayer);
  for (let i = 1; i <= 7; i += 1) {
    game.addImg(`f${i}`, pathGenerator(`f${i}.png`));
  }
  game.swapLayer(0, 1);
  game.addImg('tutorial', pathGenerator('tutorial.png'));
  game.addImg('tutorial-arrow', pathGenerator('tutorial-arrow.png'));
  game.addImg('heart', pathGenerator('heart.png'));
  game.addImg('score', pathGenerator('score.png'));
  game.addAudio('drop-perfect', pathGenerator('drop-perfect.mp3'));
  game.addAudio('drop', pathGenerator('drop.mp3'));
  game.addAudio('game-over', pathGenerator('game-over.mp3'));
  game.addAudio('rotate', pathGenerator('rotate.mp3'));
  game.addAudio('bgm', pathGenerator('bgm.mp3'));
  game.setVariable(_constant__WEBPACK_IMPORTED_MODULE_7__.blockWidth, game.width * 0.25);
  game.setVariable(_constant__WEBPACK_IMPORTED_MODULE_7__.blockHeight, game.getVariable(_constant__WEBPACK_IMPORTED_MODULE_7__.blockWidth) * 0.71);
  game.setVariable(_constant__WEBPACK_IMPORTED_MODULE_7__.cloudSize, game.width * 0.3);
  game.setVariable(_constant__WEBPACK_IMPORTED_MODULE_7__.ropeHeight, game.height * 0.4);
  game.setVariable(_constant__WEBPACK_IMPORTED_MODULE_7__.blockCount, 0);
  game.setVariable(_constant__WEBPACK_IMPORTED_MODULE_7__.successCount, 0);
  game.setVariable(_constant__WEBPACK_IMPORTED_MODULE_7__.failedCount, 0);
  game.setVariable(_constant__WEBPACK_IMPORTED_MODULE_7__.gameScore, 0);
  game.setVariable(_constant__WEBPACK_IMPORTED_MODULE_7__.hardMode, false);
  game.setVariable(_constant__WEBPACK_IMPORTED_MODULE_7__.gameUserOption, option);
  for (let i = 1; i <= 4; i += 1) {
    const cloud = new cooljs__WEBPACK_IMPORTED_MODULE_0__.Instance({
      name: `cloud_${i}`,
      action: _cloud__WEBPACK_IMPORTED_MODULE_4__.cloudAction,
      painter: _cloud__WEBPACK_IMPORTED_MODULE_4__.cloudPainter,
    });
    cloud.index = i;
    cloud.count = 5 - i;
    game.addInstance(cloud);
  }
  const line = new cooljs__WEBPACK_IMPORTED_MODULE_0__.Instance({
    name: 'line',
    action: _line__WEBPACK_IMPORTED_MODULE_3__.lineAction,
    painter: _line__WEBPACK_IMPORTED_MODULE_3__.linePainter,
  });
  game.addInstance(line);
  const hook = new cooljs__WEBPACK_IMPORTED_MODULE_0__.Instance({
    name: 'hook',
    action: _hook__WEBPACK_IMPORTED_MODULE_5__.hookAction,
    painter: _hook__WEBPACK_IMPORTED_MODULE_5__.hookPainter,
  });
  game.addInstance(hook);

  game.startAnimate = _animateFuncs__WEBPACK_IMPORTED_MODULE_8__.startAnimate;
  game.endAnimate = _animateFuncs__WEBPACK_IMPORTED_MODULE_8__.endAnimate;
  game.paintUnderInstance = _background__WEBPACK_IMPORTED_MODULE_2__.background;
  game.addKeyDownListener('enter', () => {
    if (game.debug) game.togglePaused();
  });
  game.touchStartListener = () => {
    (0,_utils__WEBPACK_IMPORTED_MODULE_1__.touchEventHandler)(game);
  };

  game.playBgm = () => {
    game.playAudio('bgm', true);
  };

  game.pauseBgm = () => {
    game.pauseAudio('bgm');
  };

  game.start = () => {
    const tutorial = new cooljs__WEBPACK_IMPORTED_MODULE_0__.Instance({
      name: 'tutorial',
      action: _tutorial__WEBPACK_IMPORTED_MODULE_6__.tutorialAction,
      painter: _tutorial__WEBPACK_IMPORTED_MODULE_6__.tutorialPainter,
    });
    game.addInstance(tutorial);
    const tutorialArrow = new cooljs__WEBPACK_IMPORTED_MODULE_0__.Instance({
      name: 'tutorial-arrow',
      action: _tutorial__WEBPACK_IMPORTED_MODULE_6__.tutorialAction,
      painter: _tutorial__WEBPACK_IMPORTED_MODULE_6__.tutorialPainter,
    });
    game.addInstance(tutorialArrow);
    game.setTimeMovement(_constant__WEBPACK_IMPORTED_MODULE_7__.bgInitMovement, 500);
    game.setTimeMovement(_constant__WEBPACK_IMPORTED_MODULE_7__.tutorialMovement, 500);
    game.setVariable(_constant__WEBPACK_IMPORTED_MODULE_7__.gameStartNow, true);
  };

  return game;
};

})();

/******/ })()
;
//# sourceMappingURL=main.js.map