/*
 * Anima Scroller
 * Based Zynga Scroller (http://github.com/zynga/scroller)
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 */
import Animate from './animate'

var getComputedStyle = function(el, key) {
    var computedStyle = window.getComputedStyle(el)
    return computedStyle[key] || ''
}
var easeOutCubic = function(pos) {return (Math.pow((pos - 1), 3) + 1);};
var easeInOutCubic = function(pos) {
    if ((pos /= 0.5) < 1) {
        return 0.5 * Math.pow(pos, 3);
    }
    return 0.5 * (Math.pow((pos - 2), 3) + 2);
};


var Scroller = function(container, options) {
    var self = this
    options = options || {}
    self.options = {
        itemClass: 'scroller-item',
        onSelect() {},
        defaultValue: 0,
        data: []
    }
    for (var key in options) {
        if (options[key] !== undefined) {
            self.options[key] = options[key]
        }
    }


    //容器
    self.container = (typeof container === 'string') ? document.querySelector(container) : container
    //临时容器
    var tempContainer = document.createElement('div')
        tempContainer.innerHTML = options.template

    var component = self.component = tempContainer.querySelector('[data-role=component]')
    var content = self.content = component.querySelector('[data-role=content]')
    var indicator = component.querySelector('[data-role=indicator]')
    var unit = component.querySelector('[data-role=unit]')

    //数据
    var data = self.options.data
    var html = ''
    if (data.length && data[0].constructor === Object) {
        data.forEach(function(row) {
            html += '<div class="' + self.options.itemClass + '" data-value="' + row.value + '">' + row.name + '</div>'
        })
    } else {
        data.forEach(function(val) {
            html += '<div class="' + self.options.itemClass + '" data-value="' + val + '">' + val + '</div>'
        })
    }
    content.innerHTML = html
    if(options.unit!==undefined) unit.innerHTML = options.unit
    self.container.appendChild(component)



    self.itemHeight = parseInt(getComputedStyle(indicator, 'height'), 10)

    self.callback = options.callback || function(top) {
        content.style.webkitTransform = 'translate3d(0, ' + (-top) + 'px, 0)'
    }

    var rect = component.getBoundingClientRect()

    self.clientTop = (rect.top + component.clientTop) || 0

    self.setDimensions(component.clientHeight, content.offsetHeight)

    if (component.clientHeight === 0) {
        self.setDimensions(parseInt(getComputedStyle(component, 'height'), 10), 204)
    }
    self.select(self.options.defaultValue, false)



    component.addEventListener('touchstart', function(e) {
        if (e.target.tagName.match(/input|textarea|select/i)) {
            return
        }
        e.preventDefault()
        self.doTouchStart(e.touches, e.timeStamp)
    }, false)

    component.addEventListener('touchmove', function(e) {
        self.doTouchMove(e.touches, e.timeStamp)
    }, false)

    component.addEventListener('touchend', function(e) {
        self.doTouchEnd(e.timeStamp)
    }, false)
}


var members = {
    value: null,
    name: null,
    prevValue: null,
    isSingleTouch: false,
    isTracking: false,
    didDecelerationComplete: false,
    isGesturing: false,
    isDragging: false,
    isDecelerating: false,
    isAnimating: false,
    clientTop: 0,
    clientHeight: 0,
    contentHeight: 0,
    itemHeight: 0,
    scrollTop: 0,
    minScrollTop: 0,
    maxScrollTop: 0,
    scheduledTop: 0,
    lastTouchTop: null,
    lastTouchMove: null,
    positions: null,
    minDecelerationScrollTop: null,
    maxDecelerationScrollTop: null,
    decelerationVelocityY: null,

    setDimensions(clientHeight, contentHeight) {
        var self = this
        self.clientHeight = clientHeight
        self.contentHeight = contentHeight
        var totalItemCount = self.options.data.length
        var clientItemCount = Math.round(self.clientHeight / self.itemHeight)
        self.minScrollTop = -self.itemHeight * (clientItemCount / 2)
        self.maxScrollTop = self.minScrollTop + totalItemCount * self.itemHeight - 0.1
    },

    selectByIndex(index, animate) {
        var self = this
        if (index < 0 || index > self.content.childElementCount - 1) {
            return
        }
        self.scrollTop = self.minScrollTop + index * self.itemHeight
        self.scrollTo(self.scrollTop, animate)
        self.selectItem(self.content.children[index])
    },

    select(value, animate) {
        var self = this
        var children = self.content.children
        for (var i = 0, len = children.length; i < len; i++) {
            if (children[i].dataset.value == value) {
                self.selectByIndex(i, animate)
                return
            }
        }

        self.selectByIndex(0, animate)
    },

    getValue() {
        return this.value
    },

    scrollTo(top, animate) {
        var self = this
        animate = (animate === undefined) ? true : animate
        if (self.isDecelerating) {
            Animate.stop(self.isDecelerating)
            self.isDecelerating = false
        }
        top = Math.round(top / self.itemHeight) * self.itemHeight
        top = Math.max(Math.min(self.maxScrollTop, top), self.minScrollTop)

        if (top === self.scrollTop || !animate) {
            self.publish(top)
            self.scrollingComplete()
            return
        }
        self.publish(top, 250)
    },

    destroy() {
        this.component.parentNode && this.component.parentNode.removeChild(this.component)
    },

    selectItem(selectedItem) {
        var self = this

        var selectedItemClass = self.options.itemClass + '-selected'
        var lastSelectedElem = self.content.querySelector('.' + selectedItemClass)
        if (lastSelectedElem) {
            lastSelectedElem.classList.remove(selectedItemClass)
        }
        selectedItem.classList.add(selectedItemClass)

        if (self.value !== null) {
            self.prevValue = self.value
        }

        self.value = selectedItem.dataset.value
        self.name = selectedItem.innerText
    },

    scrollingComplete() {
        var self = this

        var index = Math.round((self.scrollTop - self.minScrollTop - self.itemHeight / 2) / self.itemHeight)

        self.selectItem(self.content.children[index])

        if (self.prevValue !== null && self.prevValue !== self.value) {
            self.options.onSelect(self.value, self.name)
        }
    },

    doTouchStart(touches, timeStamp) {
        var self = this

        if (touches.length == null) {
            throw new Error('Invalid touch list: ' + touches)
        }
        if (timeStamp instanceof Date) {
            timeStamp = timeStamp.valueOf()
        }
        if (typeof timeStamp !== 'number') {
            throw new Error('Invalid timestamp value: ' + timeStamp)
        }

        self.interruptedAnimation = true

        if (self.isDecelerating) {
            Animate.stop(self.isDecelerating)
            self.isDecelerating = false
            self.interruptedAnimation = true
        }

        if (self.isAnimating) {
            Animate.stop(self.isAnimating)
            self.isAnimating = false
            self.interruptedAnimation = true
        }

        // Use center point when dealing with two fingers
        var currentTouchTop
        var isSingleTouch = touches.length === 1
        if (isSingleTouch) {
            currentTouchTop = touches[0].pageY
        } else {
            currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2
        }

        self.initialTouchTop = currentTouchTop
        self.lastTouchTop = currentTouchTop
        self.lastTouchMove = timeStamp
        self.lastScale = 1
        self.enableScrollY = !isSingleTouch
        self.isTracking = true
        self.didDecelerationComplete = false
        self.isDragging = !isSingleTouch
        self.isSingleTouch = isSingleTouch
        self.positions = []
    },

    doTouchMove(touches, timeStamp, scale) {
        var self = this

        if (touches.length == null) {
            throw new Error('Invalid touch list: ' + touches)
        }
        if (timeStamp instanceof Date) {
            timeStamp = timeStamp.valueOf()
        }
        if (typeof timeStamp !== 'number') {
            throw new Error('Invalid timestamp value: ' + timeStamp)
        }

        // Ignore event when tracking is not enabled (event might be outside of element)
        if (!self.isTracking) {
            return
        }

        var currentTouchTop

        // Compute move based around of center of fingers
        if (touches.length === 2) {
            currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2
        } else {
            currentTouchTop = touches[0].pageY
        }

        var positions = self.positions

        // Are we already is dragging mode?
        if (self.isDragging) {
            var moveY = currentTouchTop - self.lastTouchTop
            var scrollTop = self.scrollTop

            if (self.enableScrollY) {
                scrollTop -= moveY

                var minScrollTop = self.minScrollTop
                var maxScrollTop = self.maxScrollTop

                if (scrollTop > maxScrollTop || scrollTop < minScrollTop) {
                    // Slow down on the edges
                    if (scrollTop > maxScrollTop) {
                        scrollTop = maxScrollTop
                    } else {
                        scrollTop = minScrollTop
                    }
                }
            }

            // Keep list from growing infinitely (holding min 10, max 20 measure points)
            if (positions.length > 40) {
                positions.splice(0, 20)
            }

            // Track scroll movement for decleration
            positions.push(scrollTop, timeStamp)

            // Sync scroll position
            self.publish(scrollTop)

            // Otherwise figure out whether we are switching into dragging mode now.
        } else {
            var minimumTrackingForScroll = 0
            var minimumTrackingForDrag = 5

            var distanceY = Math.abs(currentTouchTop - self.initialTouchTop)

            self.enableScrollY = distanceY >= minimumTrackingForScroll

            positions.push(self.scrollTop, timeStamp)

            self.isDragging = self.enableScrollY && (distanceY >= minimumTrackingForDrag)

            if (self.isDragging) {
                self.interruptedAnimation = false
            }
        }

        // Update last touch positions and time stamp for next event
        self.lastTouchTop = currentTouchTop
        self.lastTouchMove = timeStamp
        self.lastScale = scale
    },

    doTouchEnd(timeStamp) {
        var self = this

        if (timeStamp instanceof Date) {
            timeStamp = timeStamp.valueOf()
        }
        if (typeof timeStamp !== 'number') {
            throw new Error('Invalid timestamp value: ' + timeStamp)
        }

        // Ignore event when tracking is not enabled (no touchstart event on element)
        // This is required as this listener ('touchmove') sits on the document and not on the element itself.
        if (!self.isTracking) {
            return
        }

        // Not touching anymore (when two finger hit the screen there are two touch end events)
        self.isTracking = false

        // Be sure to reset the dragging flag now. Here we also detect whether
        // the finger has moved fast enough to switch into a deceleration animation.
        if (self.isDragging) {
            // Reset dragging flag
            self.isDragging = false

            // Start deceleration
            // Verify that the last move detected was in some relevant time frame
            if (self.isSingleTouch && (timeStamp - self.lastTouchMove) <= 100) {
                // Then figure out what the scroll position was about 100ms ago
                var positions = self.positions
                var endPos = positions.length - 1
                var startPos = endPos

                // Move pointer to position measured 100ms ago
                for (var i = endPos; i > 0 && positions[i] > (self.lastTouchMove - 100); i -= 2) {
                    startPos = i
                }

                // If start and stop position is identical in a 100ms timeframe,
                // we cannot compute any useful deceleration.
                if (startPos !== endPos) {
                    // Compute relative movement between these two points
                    var timeOffset = positions[endPos] - positions[startPos]
                    var movedTop = self.scrollTop - positions[startPos - 1]

                    // Based on 50ms compute the movement to apply for each render step
                    self.decelerationVelocityY = movedTop / timeOffset * (1000 / 60)

                    // How much velocity is required to start the deceleration
                    var minVelocityToStartDeceleration = 4

                    // Verify that we have enough velocity to start deceleration
                    if (Math.abs(self.decelerationVelocityY) > minVelocityToStartDeceleration) {
                        self.startDeceleration(timeStamp)
                    }
                }
            }
        }

        if (!self.isDecelerating) {
            self.scrollTo(self.scrollTop)
        }

        // Fully cleanup list
        self.positions.length = 0
    },

    // Applies the scroll position to the content element
    publish(top, animationDuration) {
        var self = this

        // Remember whether we had an animation, then we try to continue based on the current "drive" of the animation
        var wasAnimating = self.isAnimating
        if (wasAnimating) {
            Animate.stop(wasAnimating)
            self.isAnimating = false
        }

        if (animationDuration) {
            // Keep scheduled positions for scrollBy functionality
            self.scheduledTop = top

            var oldTop = self.scrollTop
            var diffTop = top - oldTop

            var step = function(percent, now, render) {
                self.scrollTop = oldTop + (diffTop * percent)
                    // Push values out
                if (self.callback) {
                    self.callback(self.scrollTop)
                }
            }

            var verify = function(id) {
                return self.isAnimating === id
            }

            var completed = function(renderedFramesPerSecond, animationId, wasFinished) {
                if (animationId === self.isAnimating) {
                    self.isAnimating = false
                }
                if (self.didDecelerationComplete || wasFinished) {
                    self.scrollingComplete()
                }
            }

            // When continuing based on previous animation we choose an ease-out animation instead of ease-in-out
            self.isAnimating = Animate.start(step, verify, completed, animationDuration, wasAnimating ? easeOutCubic : easeInOutCubic)
        } else {
            self.scheduledTop = self.scrollTop = top
                // Push values out
            if (self.callback) {
                self.callback(top)
            }
        }
    },

    // Called when a touch sequence end and the speed of the finger was high enough to switch into deceleration mode.
    startDeceleration(timeStamp) {
        var self = this

        self.minDecelerationScrollTop = self.minScrollTop
        self.maxDecelerationScrollTop = self.maxScrollTop

        // Wrap class method
        var step = function(percent, now, render) {
            self.stepThroughDeceleration(render)
        }

        // How much velocity is required to keep the deceleration running
        var minVelocityToKeepDecelerating = 0.5

        // Detect whether it's still worth to continue animating steps
        // If we are already slow enough to not being user perceivable anymore, we stop the whole process here.
        var verify = function() {
            var shouldContinue = Math.abs(self.decelerationVelocityY) >= minVelocityToKeepDecelerating
            if (!shouldContinue) {
                self.didDecelerationComplete = true
            }
            return shouldContinue
        }

        var completed = function(renderedFramesPerSecond, animationId, wasFinished) {
            self.isDecelerating = false
            if (self.scrollTop <= self.minScrollTop || self.scrollTop >= self.maxScrollTop) {
                self.scrollTo(self.scrollTop)
                return
            }
            if (self.didDecelerationComplete) {
                self.scrollingComplete()
            }
        }

        // Start animation and switch on flag
        self.isDecelerating = Animate.start(step, verify, completed)
    },

    // Called on every step of the animation
    stepThroughDeceleration(render) {
        var self = this

        var scrollTop = self.scrollTop + self.decelerationVelocityY

        var scrollTopFixed = Math.max(Math.min(self.maxDecelerationScrollTop, scrollTop), self.minDecelerationScrollTop)
        if (scrollTopFixed !== scrollTop) {
            scrollTop = scrollTopFixed
            self.decelerationVelocityY = 0
        }

        if (Math.abs(self.decelerationVelocityY) <= 1) {
            if (Math.abs(scrollTop % self.itemHeight) < 1) {
                self.decelerationVelocityY = 0
            }
        } else {
            self.decelerationVelocityY *= 0.95
        }

        self.publish(scrollTop)
    }
}

// Copy over members to prototype
for (var key in members) {
    Scroller.prototype[key] = members[key]
}

module.exports = Scroller
