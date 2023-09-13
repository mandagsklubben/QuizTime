
function Data() {
	this.video = null;
	this.hintelement = null;
}
Data.prototype.getAudio = function () {
	return this.audiofile || this.videofile;
}
Data.prototype.hasSeparateAudio = function () {
	return this.audiofile != undefined;
}
Data.prototype.isHintVideo = function() {
	return this.hintfile && this.hintfile.endsWith(".mp4");
}

Data.prototype.validate = function () {
	console.assert(isFinite(this.getRegularStart()));
	console.assert(isFinite(this.getRegularHint()));
	console.assert(isFinite(this.getRegularEnd()));
	console.assert(isFinite(this.getRepeat()));
	console.assert(isFinite(this.getRevealAudio()));
	console.assert(isFinite(this.getRevealVideo()));
	console.assert(isFinite(this.getRevealAudioStart()));
	console.assert(isFinite(this.getRevealAudioEnd()));

	console.assert(this.getRegularStart() >= 0);
	console.assert(this.getRegularHint() >= 0);
	console.assert(this.getRegularEnd() >= 0);
	console.assert(this.getRepeat() >= 0);
	console.assert(this.getRevealAudio() >= 0);
	console.assert(this.getRevealVideo() >= 0);
	console.assert(this.getRevealAudioStart() >= 0);
	console.assert(this.getRevealAudioEnd() >= 0);

	if(this.type !== undefined){
		return
	}

	console.assert(this.getRegularStart() < this.getRegularHint(), `${this.videofile}: start must be smaller than hint`);
	console.assert(this.getRegularStart() < this.getRegularEnd(), `${this.videofile}: start must be smaller than end`);
	console.assert(this.getRegularHint() < this.getRegularEnd(), `${this.videofile}: hint must be smaller than end`);

	console.assert(this.getRevealAudioStart() < this.getRevealAudio(), `${this.videofile}: revealstart must be smaller than reveal`);
	console.assert(this.getRevealAudio() < this.getRevealAudioEnd(), `${this.videofile}: reveal must be smaller than revealend`);
}

Data.prototype.getRegularStart = function () {
	return (this.regularstart || 0) * 1000;
}
Data.prototype.getRegularHint = function () {
	if (this.regularhint != undefined)
		return this.regularhint * 1000;
	return this.getRevealAudio();
}
Data.prototype.getRegularEnd = function () {
	if (this.regularend != undefined)
		return this.regularend * 1000;
	return this.getRegularStart() + (_settings.defaultquestionlength || 90) * 1000;
}
Data.prototype.getRepeat = function () {
	if (this.repeat != undefined)
		return this.repeat * 1000;
	return this.getRegularHint();
}
Data.prototype.getRevealVideo = function () {
	if (this.revealvideo != undefined)
		return this.revealvideo * 1000;
	return this.getRevealAudio();
}
Data.prototype.getRevealAudio = function () {
	if (this.revealaudio != undefined)
		return this.revealaudio * 1000;
	return 50 * 1000;
}
Data.prototype.getRevealAudioStart = function () {
	if (this.revealaudiostart != undefined)
		return this.revealaudiostart * 1000;
	return Math.max(this.getRevealAudio() - 20000, 0);
}

Data.prototype.getRevealAudioEnd = function () {
	if (this.revealaudioend != undefined)
		return this.revealaudioend * 1000;
	return this.getRevealAudio() + 20000;
}

function round(ms) {
	return Math.round(ms / 100) / 10;
}

Data.prototype.toString = function () {
	return `\n${this.videofile}-${this.answer}\nTimings:
	start:${round(this.getRegularStart())}s
	hint:${round(this.getRegularHint())}s
	end:${round(this.getRegularEnd())}s
	repeat:${round(this.getRepeat())}s
	revealstart:${round(this.getRevealAudioStart())}s
	reveal:${round(this.getRevealAudio())}s
	revealend:${round(this.getRevealAudioEnd())}s
Signature:
	Q: ${ round(this.getRegularHint() - this.getRegularStart())}-${round(this.getRegularEnd() - this.getRegularHint())}
	A: ${ round(this.getRevealAudio() - this.getRevealAudioStart())}-${round(this.getRevealAudioEnd() - this.getRevealAudio())}`
}


function Tracker(ts) {
	this.timestamp = ts | 0;
}

Tracker.prototype.push = function (n) {
	this.timestamp += n;
}

Tracker.prototype.fork = function () {
	return new Tracker(this.timestamp);
}

// trigger is relative segment start time
function Action(callback, triggerTime) {
	this._callback = callback;
	this.hasBeenCalled = false;
	this.triggerTime = triggerTime;
}
Action.prototype.do = function (time) {
	//time is relative segment, so translate to action time before callback
	var result = this._callback(time - this.triggerTime);
	// treat undefined as true, since most actions are just called the once
	// makes for cleaner code to only have the edge cases - currently audio volume fade
	// have to explicitly return values
	if (result === undefined || result) {
		this.hasBeenCalled = true;
	}
};

// need some way to place these, duration? or start time?
// is starttime global? or relative start button press?
function Segment(actions, tracker) {
	this.actions = actions;
	this.startTime = tracker.timestamp;
	this.isDone = false;
	this.id = Segment.counter++;
	// HAX! By convention the last action should always be the "video.stop()" action, and it should be after a default 1s fade,
	// so next segment can start 1s before last actions trigger time
	tracker.push(this.actions[this.actions.length - 1].triggerTime - 1000);
}
Segment.counter = 0;
Segment.prototype.runSegment = function (time) {
	// time is global?
	let segmentTime = time - this.startTime;
	if (Engine.debugmode && time > Engine.debugClock + 250)
		document.getElementById("dbgtext").innerText += `\ns${this.id}:\t${segmentTime}`;

	let activeActions = 0;
	for (let a of this.actions) {
		if (!a.hasBeenCalled) {
			activeActions++;
			if (segmentTime >= a.triggerTime) {
				a.do(segmentTime);
			}
		}
	}
	if (activeActions == 0) {
		this.isDone = true;
	}
};


function ScreenTimer(seconds) {
	this.seconds = seconds;
	this.state = null;
}

ScreenTimer.prototype.write = function () {
	var m = Math.floor(this.seconds / 60);
	var s = this.seconds % 60;
	document.getElementById("timer4").innerText = Math.max(Math.floor(s % 10), 0);
	document.getElementById("timer3").innerText = Math.max(Math.floor(s / 10), 0);
	document.getElementById("timer2").innerText = Math.max(Math.floor(m % 10), 0);
	document.getElementById("timer1").innerText = Math.max(Math.floor(m / 10), 0);
}

ScreenTimer.prototype.tick = function (time) {
	if (this.state == null) {
		this.state = time;
		this.write();
		return false;
	}
	while ((time - this.state) > 1000) {
		this.state += 1000;
		this.seconds--;
		this.write();
		if (this.seconds <= 0)
			return true;
	}
	return false;
}



function Engine(segments) {
	this.segments = segments;
};
Engine.prototype.run = function () {
	Engine.starttime = new Date().getTime();
	Engine.animationActive = true;
	Engine.debugClock = 0;
	Engine.isPaused = false;
	Engine.pauseStart = null;
	Engine.pausedMedia = [];
	var segments = this.segments;
	(function animate() {
		var timestamp = new Date().getTime();
		if (Engine.isPaused) {
			if (Engine.pauseStart == null) {
				Engine.pauseStart = timestamp;
				var ems = document.getElementsByTagName("video");
				for (var i = 0; i < ems.length; i++)
					if (!ems[i].ended && !ems[i].paused) {
						Engine.pausedMedia.push(ems[i]);
						ems[i].pause();
					}
			}
			if (Engine.animationActive)
				requestAnimationFrame(animate);
			return;
		}
		else {
			if (Engine.pauseStart != null) {
				var pauseduration = timestamp - Engine.pauseStart;
				Engine.pauseStart = null;
				Engine.starttime += pauseduration;
				for (var em of Engine.pausedMedia)
					em.play();
				Engine.pausedMedia = [];
			}
		}
		var localtime = timestamp - Engine.starttime;
		if (Engine.debugmode && localtime > Engine.debugClock + 250)
			document.getElementById("dbgtext").innerText = `\t${localtime}`;
		for (let s of segments) {
			if (!s.isDone) {
				if (localtime >= s.startTime) {
					s.runSegment(localtime);
				}
			}
		}
		if (Engine.debugmode && localtime > Engine.debugClock + 250)
			Engine.debugClock = localtime;
		if (Engine.animationActive)
			requestAnimationFrame(animate);
		else
			document.getElementById("dbgtext").innerText = "";
	})();
}

function saveConfig(){
	if( window.localStorage ) {
		let config = document.querySelector('meta[data-version]').dataset.version;
		let inputs = document.getElementsByTagName("input");

		for( let input of inputs ) {
			if( input.checked != undefined ) {
				config += `,${input.checked}`;
			}
		}
		localStorage.setItem("config",config);
	}
}

function loadConfig(){
	let version = document.querySelector('meta[data-version]').dataset.version;
	if( window.localStorage ) {
		let cstr = localStorage.getItem("config");
		if( cstr ){
			let config = cstr.split(",");
			if( config[0] != version ) {
				localStorage.removeItem("config");
			}
			else {
				let inputs = document.getElementsByTagName("input");
				let counter = 1;
				for( let input of inputs ) {
					if( input.checked != undefined ) {
						input.checked = config[counter] == "true";
						counter++;
					}
				}
			}
		}
	}
}