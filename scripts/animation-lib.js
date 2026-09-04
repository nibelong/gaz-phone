/**
 Animation library constructor
 */
var ANIMATION = function () {

  // Animation special params
  var NO_LOOP = 0;
  var NO_DELAY = 0;
  var LOOP = 1;
  var DEFAULT_DURATION = 300;

  // Player state flags
  var FREE = 1;
  var BUSY = 0;

  // Array of animation threads
  var threads = [];

  // Index of last busy thread
  var lastThread = 0;

  /**
   * Animation player constructor
   * @param in_animation {Array | iRidiumItem}
   * @param in_item {Array | iRidiumItem}
   * @param in_duration {Number}
   * @param in_delay {Number}
   * @param in_loop {Number}
   * @param in_tween {Number}
   * @param in_startCallBack {Function}
   * @param in_endCallBack {Function}
   * @param in_context {Object}
   * @returns {Player}
   */
  function Create(in_animation, in_item, in_duration, in_delay, in_loop, in_tween, in_startCallBack, in_endCallBack, in_context) {
    var result = null;
    // Find animation flow last is used
    if (lastThread >= threads.length)
      lastThread = 0;

    // find animation flow is free
    for (var i = lastThread; i < threads.length; i++) {
      if (threads[i].state == FREE) {
        // flow is found then start animate
        lastThread = i + 1;
        result = threads[i];
        break;
      }
    }

    // not found free flows, we need to create new flow
    if (!result) {
      // Create a new player
      result = new Player();
      threads.push(result);
    }

    if (result)
      result.go(in_animation, in_item, in_duration, in_delay, in_loop, in_tween, in_startCallBack, in_endCallBack, in_context);

    return result;
  }

  /**
   * Animation Player
   * @constructor
   */
  function Player() {
    // Player State
    this.state = FREE;
    this.work = false;
    IR.AddListener(IR.EVENT_WORK, 0, this.running, this);
  }

  /**
   * Prepare and start animation
   * @param in_animation {Array | iRidiumItem}
   * @param in_item {Array | iRidiumItem}
   * @param in_duration {Number}
   * @param in_delay {Number}
   * @param in_loop {Number}
   * @param in_tween {Number}
   * @param in_startCallBack {Function}
   * @param in_endCallBack {Function}
   * @param in_context {Object}
   */
  Player.prototype.go = function (in_animation, in_item, in_duration, in_delay, in_loop, in_tween, in_startCallBack, in_endCallBack, in_context) {

    // Fill default value if need
    this.release();

    // collection data
    switch (arguments.length) {

      // not required
      case 9:
        if (typeof in_context == "object")
          this.context = in_context;
      case 8:
        if (in_endCallBack instanceof Function)
          this.endCallBack = in_endCallBack;
      case 7:
        if (in_startCallBack instanceof Function)
          this.startCallBack = in_startCallBack;
      case 6:
        if (typeof in_tween == "number")
          this.tween = in_tween;
      case 5:
        if (typeof in_loop == "number")
          this.loop = in_loop;
      case 4:
        if (typeof in_delay == "number")
          this.delay = in_delay;
      case 3:
        if (typeof in_duration == "number")
          this.duration = in_duration;

      // required property
      case 2:
        // check array of items
        if (!(in_item instanceof Array))
          in_item = [in_item];

        // check array of effects
        if (!(in_animation instanceof Array))
          in_animation = [in_animation];

        // fill object
        this.animation = in_animation;
        this.item = in_item;

        // set state of the player to busy
        this.state = BUSY;

        // start to tun animation
        this.starting();
    }
  };

  /**
   * Clear data of the player
   */
  Player.prototype.release = function () {
    this.clearTimer();

    this.item = [];
    this.animation = [];
    this.extract = null;
    this.extracted = null;

    this.duration = DEFAULT_DURATION;
    this.loop = NO_LOOP;
    this.tween = IR.LINEAR;

    this.counter = 0;
    this.change = 0;
    this.first = 0;
    this.value = 0;
    this.step = 0;
    this.delay = NO_DELAY;
    this.isPause = false;
    this.state = FREE;
    this.work = false;
  };

  /**
   * Clear delay timer
   */
  Player.prototype.clearTimer = function () {
    if (this.timeout)
      IR.ClearInterval(this.timeout);
    this.timeout = null;
  };

  /**
   * Prepare to start
   */
  Player.prototype.starting = function () {
    if (this.delay != 0) {
      this.clearTimer();
      this.timeout = IR.SetTimeout(this.delay, this.run, this);
    }
    else
      this.run();
  };

  /**
   * Start
   */
  Player.prototype.run = function () {

    this.clearTimer();

    if (this.startCallBack)
      this.startCallBack.call(this.context);

    this.work = true;
  };

  /**
   * Value calculate
   */
  Player.prototype.calculate = function () {
    this.value = IR.Tween(this.tween, this.counter, this.first, this.change, this.duration);
  };

  /**
   * Prepare to stopping
   */
  Player.prototype.stopping = function () {

    if (this.counter >= this.duration - this.step) {
      this.value = this.change + this.first;
      this.counter = this.duration;
    }

    this.renderFrame();

    if (this.endCallBack)
      this.endCallBack.call(this.context);

    this.endStop();
  };

  /**
   * Stop
   */
  Player.prototype.endStop = function () {
    this.isPause = false;
    this.counter = 0;
    this.value = 0;
    this.step = 0;
    this.work = false;
  };

  /**
   * Finalize animation
   */
  Player.prototype.finalize = function () {
    this.stopping();

    if (this.loop)
      this.starting();
    else
      this.release();
  };

  /**
   * Render the one frame of animation
   */
  Player.prototype.renderFrame = function () {
    for (var j = 0; j < this.animation.length; j++) {

      this.extract = this.animation[j];
      this.extracted = this.extract();

      this.calculate();

      for (var i = 0; i < this.item.length; i++)
        this.extracted(i);
    }
  };

  /**
   * Force run process of animation
   * @param in_step {number}
   */
  Player.prototype.forceProcessing = function (in_step) {
    if (this.isPause && this.timeout == null && this.state == BUSY)
      this.processing(in_step)
  };

  /**
   * Run process of animation
   * @param in_step {number}
   */
  Player.prototype.processing = function (in_step) {
    this.step = in_step;

    this.renderFrame();

    this.counter += in_step;

    if (this.counter > this.duration)
      this.finalize();
  };

  /**
   * auto running
   * @param in_step {number}
   */
  Player.prototype.running = function (in_step) {
    if (!this.isPause && this.work)
      this.processing(in_step);
  };

  /**
   * Set player to pause
   */
  Player.prototype.pause = function () {
    this.isPause = true;
  };

  /**
   * Set player to play after pause
   */
  Player.prototype.play = function () {
    this.isPause = false;
  };

  /**
   * Stop the player
   */
  Player.prototype.stop = function () {
    this.clearTimer();
    this.counter = this.duration + this.step;
    this.stopping();
  };

  /**
   * Restart the player
   */
  Player.prototype.restart = function () {
    this.endStop();
    this.renderFrame();
    this.starting();
  };

  /**
   * When player on pause force draw a next frame of animation
   */
  Player.prototype.nextFrame = function () {
    this.forceProcessing(Math.abs(this.step));
  };

  /**
   * When player on pause force draw a prev frame of animation
   */
  Player.prototype.prevFrame = function () {
    this.forceProcessing(-Math.abs(this.step));
  };

  /**
   * Stop all animations threads
   */
  function stopAll() {
    for (var i = 0; i < threads.length; i++) {
      threads[i].stop();
    }
  }

  /**
   * pause all animations threads
   */
  function pauseAll() {
    for (var i = 0; i < threads.length; i++) {
      threads[i].pause();
    }
  }

  /**
   * restart all animations threads
   */
  function restartAll() {
    for (var i = 0; i < threads.length; i++) {
      threads[i].restart();
    }
  }

  /**
   * play all animations threads
   */
  function playAll() {
    for (var i = 0; i < threads.length; i++) {
      threads[i].play();
    }
  }

  /**
   * draw a next frame of all animations threads
   */
  function nextFrameAll() {
    for (var i = 0; i < threads.length; i++) {
      threads[i].nextFrame();
    }
  }

  /**
   * draw a prev frame of all animations threads
   */
  function prevFrameAll() {
    for (var i = 0; i < threads.length; i++) {
      threads[i].prevFrame();
    }
  }

  // public:
  Create.NO_LOOP = NO_LOOP;
  Create.NO_DELAY = NO_DELAY;
  Create.LOOP = LOOP;
  Create.DEFAULT_DURATION = DEFAULT_DURATION;

  Create.stopAll = stopAll;
  Create.pauseAll = pauseAll;
  Create.restartAll = restartAll;
  Create.playAll = playAll;
  Create.nextFrameAll = nextFrameAll;
  Create.prevFrameAll = prevFrameAll;
  return Create;
}();

/**
 * Move Horizontal items
 * @param in_first {number}
 * @param in_change {number}
 * @returns {Function}
 */
ANIMATION.MoveHorrizontal = function (in_first, in_change) {

  return function () {
    this.change = in_change;
    this.first = in_first;

    return function (i) {
      this.item[i]["X"] = this.value;
    }
  }
};

/**
 * Move Vertical items
 * @param in_first {number}
 * @param in_change {number}
 * @returns {Function}
 */
ANIMATION.MoveVertical = function (in_first, in_change) {

  return function () {
    this.change = in_change;
    this.first = in_first;

    return function (i) {
      this.item[i]["Y"] = this.value;
    }
  }
};

/**
 * Move Diagonal items
 * @param in_first {number}
 * @param in_change {number}
 * @returns {Function}
 */
ANIMATION.MoveDiagonal = function (in_first, in_change) {

  return function () {
    this.change = in_change;
    this.first = in_first;

    return function (i) {
      this.item[i]["X"] = this.item[i]["Y"] = this.value;
    }
  }
};

/**
 * Rotate items
 * @param in_change {number}
 * @returns {Function}
 */
ANIMATION.Rotate = function (in_change) {

  return function () {
    this.change = in_change;
    this.first = 0;

    return function (i) {
      this.item[i]["Angle"] = this.value;
    }
  }
};

/**
 * Show items
 * @returns {Function}
 */
ANIMATION.Show = function () {

  return function () {
    this.change = 255;
    this.first = 0;

    return function (i) {
      var item = this.item[i];
      for (var s = 0; s < item.StatesCount; s++)
        item.GetState(s)["Opacity"] = this.value;
    }
  }
};

/**
 * Hide items
 * @returns {Function}
 */
ANIMATION.Hide = function () {

  return function () {
    this.change = -255;
    this.first = 255;

    return function (i) {
      var item = this.item[i];
      for (var s = 0; s < item.StatesCount; s++)
        item.GetState(s)["Opacity"] = this.value;
    }
  }
};

/**
 * Scale items on X and Y axis
 * @param in_first {number}
 * @param in_change {number}
 * @returns {Function}
 */
ANIMATION.ScaleXY = function (in_first, in_change) {

  return function () {
    this.change = in_change;
    this.first = in_first;

    return function (i) {
      this.item[i]["ScaleX"] = this.item[i]["ScaleY"] = this.value;
    }
  }
};

/**
 * Scale items on X axis
 * @param in_first {number}
 * @param in_change {number}
 * @returns {Function}
 */
ANIMATION.ScaleX = function (in_first, in_change) {

  return function () {
    this.change = in_change;
    this.first = in_first;

    return function (i) {
      this.item[i]["ScaleX"] = this.value;
    }
  }
};

/**
 * Scale items on Y axis
 * @param in_first {number}
 * @param in_change {number}
 * @returns {Function}
 */
ANIMATION.ScaleY = function (in_first, in_change) {

  return function () {
    this.change = in_change;
    this.first = in_first;

    return function (i) {
      this.item[i]["ScaleY"] = this.value;
    }
  }
};

/**
 * Change item value
 * @param in_first {number}
 * @param in_change {number}
 * @returns {Function}
 */
ANIMATION.Value = function (in_first, in_change) {

  return function () {

    this.change = in_change;
    this.first = in_first;

    return function (i) {
      this.item[i]["Value"] = this.value;
    }
  }
};

/**
 * Change item text with numbers
 * @param in_first {number}
 * @param in_change {number}
 * @returns {Function}
 */
ANIMATION.ValueToText = function (in_first, in_change) {

  return function () {

    this.change = in_change;
    this.first = in_first;

    return function (i) {
      this.item[i]["Text"] = this.value.toFixed(0);
    }
  }
};

/**
 * Change item text and value with numbers
 * @param in_first {number}
 * @param in_change {number}
 * @returns {Function}
 */
ANIMATION.ValueAndText = function (in_first, in_change) {

  return function () {

    this.change = in_change;
    this.first = in_first;

    return function (i) {
      this.item[i]["Text"] = this.item[i]["Value"]= this.value.toFixed(0);
    }
  }
};

