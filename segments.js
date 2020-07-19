

function init(id) {
	if (!id)
		return;
	var em = document.getElementById(id);
	//counterintuitively, this will mute and hide an element
	em.style.opacity = 0;
	em.style.display = "block";
	if (em.volume) em.volume = 0;
}

function show(id) {
	var em = document.getElementById(id);
	if (em.classList.contains("revealer"))
		em.style.width = "100vw";
	else
		em.style.opacity = 1;
}
function hide(id) {
	var em = document.getElementById(id);
	if (em.classList.contains("revealer"))
		em.style.width = "0";
	else
		em.style.opacity = 0;
}

function setText(id, text) {
	var em = document.getElementById(id);
	em.innerHTML = text || "";
}

// this will actually append the transition, which gives it higher priority
function setTransition(id, transition) {
	var em = document.getElementById(id);
	if (!em.style.transition)
		em.style.transition = transition;
	else
		em.style.transition += `,${transition}`;
}

// append a transform if you have already animated to a state, and want to continue from that new state
function appendTransform(id, transform) {
	var em = document.getElementById(id);
	if (!em.style.transform)
		em.style.transform = transform;
	else
		em.style.transform += transform;
}
// set a transform to overwrite all earlier transforms and apply only this transform to the original state
function setTransform(id, transform) {
	var em = document.getElementById(id);
	em.style.transform = transform;
}

function showSidebar() {
	var sb = document.getElementById("sidebar")
	sb.style.transition = "left 1s ease-out"
	sb.style.left = "0";
}
function hideSidebar() {
	var sb = document.getElementById("sidebar")
	sb.style.transition = "left 1s ease-out"
	sb.style.left = "-17vw";
}

function startPlay(id, start) {
	var media = document.getElementById(id);
	media.currentTime = (start || 0) / 1000;
	media.play();
}

function stopPlay(id) {
	var media = document.getElementById(id);
	media.pause();
}

function fadeInAudio(id, time, duration) {
	var media = document.getElementById(id);
	var d = duration || 1000;
	media.volume = linear(0, 1, time, d);
	return time >= d;
};
function fadeOutAudio(id, time, duration) {
	var media = document.getElementById(id);
	var d = duration || 1000;
	media.volume = linear(1, 0, time, d);
	return time >= d;
};

function linear(from, to, t, max) {
	if (t < 0) t = 0;
	if (t > max) t = max;
	var dy = to - from;
	var proc = t / max;
	return from + dy * proc;
}

function removeElement(id) {
	var em = document.getElementById(id);
	em.parentNode.removeChild(em);
}

function getCobraSegment(tracker) {
	var emphcolor = "orange";
	var backcover = addDiv("backcover", "", "background-color:black", "cover");
	var cobramusic = addVideo("cobramusic", "cobra.mp3", "display:none");
	var cobraimg = addImage("cobraimg", "cobra.jpg",
		"bottom: 0; left: 50%; transform: translate(-50%);top:unset;", "largehint absolute");
	var ruleactive = addDiv("rule",
		`<span id='r1' style="opacity:0;">COBRA RULE:</span> <span id='r2' style="color:${emphcolor};opacity:0;">ACTIVE</span>`,
		"font-size: 5.2vw;width: 78vw;text-align: center;top:30vh;opacity:1;font-weight:bold;color:white;", "fullscreencenter");
	var minuspoint = addDiv("minuspoint",
		`-1 point every time you <span style="color:${emphcolor}">incorrectly</span> answer &quot;Cobra&quot;`,
		"font-family:Roboto;font-size: 3.4vw;width: 78vw;text-align: center;letter-spacing: -0.1vw;top: 60vh;font-weight: 500;color:white;", "fullscreencenter");
	var r1 = document.getElementById("r1");
	var r2 = document.getElementById("r2");
	var delay = 2000;

	return new Segment([
		new Action(function () {
			init("cobramusic");
			show("backcover");
			cobraimg.style.transition = "opacity 1400ms";
			minuspoint.style.transition = "opacity 150ms, transform 28s linear";
			r1.style.transition = "opacity 150ms";
			r2.style.transition = "opacity 150ms";
			ruleactive.style.transition = "transform 28s linear";
			startPlay("cobramusic", 5000);
		}, delay),
		new Action(function (time) {
			return fadeInAudio("cobramusic", time, 200);
		}, delay),
		new Action(function () { show("r1") }, 1000 + delay),
		new Action(function () { show("r2") }, 1500 + delay),
		new Action(function () { ruleactive.style.transform = "translate(-50%,-50%) matrix(1.35,0,0,1.35,0,-50)" }, 1500 + delay),
		new Action(function () { show("minuspoint"); }, 1830 + delay),
		new Action(function () { minuspoint.style.transform = "translate(-50%, -50%) matrix(0.77,0,0,0.77,0,-40)" }, 1830 + delay),
		new Action(function () { show("cobraimg"); }, 2200 + delay),
		new Action(function () {
			cobraimg.style.transition = "opacity 8s ease-in-out";
			r2.style.transition = "opacity 1s linear";
			r1.style.transition = "opacity 1s linear";
			minuspoint.style.transition = "opacity 2s, transform 28s linear";
		}, 4000 + delay),
		new Action(function () { hide("cobraimg"); }, 18000 + delay),

		new Action(function () { hide("minuspoint"); }, 23000 + delay),
		new Action(function () { hide("r1"); }, 24000 + delay),
		new Action(function () { hide("r2"); }, 25000 + delay),
		new Action(function () { hide("backcover"); }, 26000 + delay),
		new Action(function (time) { return fadeOutAudio("cobramusic", time, 1500); }, 25200 + delay),
		new Action(function () { stopPlay("cobramusic") }, 28000 + delay),
		new Action(function () {
			cobraimg.parentNode.removeChild(cobraimg);
			ruleactive.parentNode.removeChild(ruleactive);
			cobramusic.parentNode.removeChild(cobramusic);
			minuspoint.parentNode.removeChild(minuspoint);
			backcover.parentNode.removeChild(backcover);
		}, 28000 + delay),
	], tracker);
}

function setupQuizArea(tracker, part) {
	var titleprefix = part == 3 ? "Quiz Key" : "Quiz";
	return new Segment([
		new Action(function () {
			if (part == 0) slideToNum(0, 100);
			if (part == 1) slideToNum(8, 100);
			if (part == 2) slideToNum(16, 100);
			if (part == 3) slideToNum(0, 100);
		}, 0),
		new Action(function () {
			document.getElementById("backgroundvideoloop").style.opacity = 0.5;
		}, 100),
		new Action(function () { showSidebar() }, 1000),
		new Action(function () { setText("quiztitlerevealer", `${titleprefix}: ${_settings.quizname}`); }, 1000),
		new Action(function () { show("sidebartext"); }, 2500),
		new Action(function () { show("quiztitlerevealer"); }, 3500),
		new Action(function () { show("mandagsklubbenlogo") }, 1000),
		new Action(function () {
			if (part == 0) slideToNum(1, 2000);
			if (part == 1) slideToNum(9);
			if (part == 2) slideToNum(17);
		}, 2000),

	], tracker);
}

function getExtraTextFromSettings(counter){
	counter--;
	if(counter > 15)counter--;
	if(counter > 7) counter--;

	if(_settings && _settings.extratext && _settings.extratext.length > counter ){
		let candidate = _settings.extratext[counter];
		if(candidate != undefined) return candidate;
	}
	return null;
}


function questionSegment(d, tracker) {
	console.log(`generated question segment Q-${d.videofile}: start ${d.getRegularStart()} hint ${d.getRegularHint()} end ${d.getRegularEnd()}`);
	let deltaHint = (d.getRegularHint() - d.getRegularStart());
	let deltaEnd = (d.getRegularEnd() - d.getRegularStart());

	let extratextFallback = d.extratext || _settings.defaultextratext || "";
	let extratext = getExtraTextFromSettings(d.counter);
	if(extratext == null) extratext = extratextFallback;

	if (d.hintvideo)
		d.hintelement.transition = "opacity 1s, left 4s";

	var actions = [
		new Action(function () {
			init(d.videofile);
			init(d.audiofile);
			if(d.hintfile && d.hintvideo){
				init(d.hintfile);
			}
			if (d.counter != 1 && d.counter != 9 && d.counter != 17)
				slideToNum(d.counter);
		}, 0),
		new Action(function () { startPlay(d.getAudio(), d.getRegularStart()) }, 0),
		new Action(function (time) { return fadeInAudio(d.getAudio(), time); }, 0),
		new Action(function () { setText("questiontext", d.question); }, 1000),
		new Action(function () { setText("extratext", extratext); }, 1000),
		new Action(function () { show("questionrevealer"); }, 4500),
		new Action(function () { if (d.isremix) { show("remix"); } }, 4500),
		new Action(function () { if (d.getRegularHint() > 20000) show("extratext") }, 8000),
		new Action(function () { show(d.hintfile) }, deltaHint),
		new Action(function () { hide("extratext") }, deltaHint),
		new Action(function () { hide("questionrevealer"); }, deltaEnd - 1000),
		new Action(function () { hide("remix") }, deltaEnd - 1000),
	];
	if (d.counter == 23 || d.counter == 15 || d.counter == 7) { // last question, before repeat or a break, gets special treatment
		if (d.hintvideo)
			actions.push(new Action(function () {
				d.hintelement.style.transition = "opacity 1s,left 0.4s,min-width 0.4s,min-height 0.4s,top 0.4s,transform 0.4s";
				d.hintelement.className = "cover";
			}, deltaEnd - 4000));
			else
			actions.push(new Action(function () { hide(d.hintfile) }, deltaEnd));
	}
	else {
		actions.push(new Action(function () { hide(d.hintfile) }, deltaEnd-500));
		actions.push(new Action(function (time) { return fadeOutAudio(d.getAudio(), time); }, deltaEnd));
		actions.push(new Action(function () { stopPlay(d.getAudio()) }, deltaEnd + 1000));
	}
	actions.push(new Action(function () { }, deltaEnd + 1000)); // empty action to sync with the tracker 1s adjust fix

	return new Segment(actions, tracker);
}


function quizBreak(d, tracker) {

	var breaknumber = d.counter == 15 ? 1 : 0;
	var logo = d.counter == 15
		? wineIcon(undefined, "1.5")
		: beerIcon(undefined, "1.5");
	var breakdata = {
		"breaklength": 60 * 8,
		"plays": []
	};

	if (_breaks && _breaks.length > breaknumber) {
		breakdata = _breaks[breaknumber];
	}
	var breaklength = breakdata.breaklength || 60 * 8;
	var breaklengthms = breaklength * 1000;
	// something d.breakaudiocutoff with video duration as fallback is needed here if we ever want to cut qustion audio&video early in a break.
	var end = d.breakaudioend || d.audio.duration;
	var caret = end * 1000 - d.getRegularEnd();
	var t = new ScreenTimer(breaklength);
	if (caret > breaklengthms)
		caret = breaklengthms; // no matter what, the break ending will make the audio fade
	var actions = [
		new Action(function () {
			slideToNum(d.counter + 1);
			setText("pausetext", logo);
			document.getElementById("minutesuntil").style.display = "block";
		}, 0),
		new Action(function (time) { return t.tick(time); }, 0),
		new Action(function () { hide("numberscroll"); }, 3000),
		new Action(function () { hide("quiztitlerevealer"); }, 3500),
		new Action(function () { hide("sidebartext") }, 4000),
		new Action(function () { hideSidebar() }, 4500),
		new Action(function () { show("pausetext") }, 6500),
		new Action(function () { show("timerblock") }, 7500),
		new Action(function (time) { return fadeOutAudio(d.getAudio(), time); }, caret),
		new Action(function () { stopPlay(d.getAudio()) }, caret + 1000),
		new Action(function () { hide(d.hintfile); }, caret + 1000),
		new Action(function () {
			if (d.hintvideo) {
				d.hintelement.className = "hintcover";
			}
		}, caret + 3000),
		new Action(function () { hide("pausetext") }, breaklengthms + 2000),
	];

	//caret must not be > breaklengthms at any point
	if (breakdata.plays)
		for (let play of breakdata.plays) {
			// safetybuffer must be at least size of fades
			if (caret < breaklengthms - 5000) {
				//at caret
				if (play.videofile) {
					actions.push(new Action(function () {
						init(play.videofile);
						startPlay(play.videofile, 0); // add audio/video start offset at some future point, when needed
					}, caret));
					actions.push(new Action(function () { hide("pausetext") }, caret)); // if we are showing video, hide the pause logo
				}
				if (play.audiofile && play.videofile != play.audiofile) {
					actions.push(new Action(function () {
						init(play.audiofile);
						startPlay(play.audiofile, 0); // add audio/video start offset at some future point, when needed
					}, caret));
				}
				// will we get function scopestyle bug here? changed to let, hope that fixes it
				let audiosource = play.audiofile || play.videofile;
				actions.push(new Action(function (time) { return fadeInAudio(audiosource, time); }, caret));
				if (play.videofile)
					actions.push(new Action(function () { show(play.videofile) }, caret));

				var mediaduration = document.getElementById(audiosource).duration;
				var lengthofplay = (play.duration || mediaduration) * 1000;
				if (caret + lengthofplay > breaklengthms)
					caret = breaklengthms;
				else
					caret = caret + lengthofplay;

				actions.push(new Action(function (time) { return fadeOutAudio(audiosource, time); }, caret));
				if (play.videofile) {
					actions.push(new Action(function () { hide(play.videofile) }, caret));
					actions.push(new Action(function () {
						stopPlay(play.videofile);
					}, caret + 1000));
				}
				if (play.audiofile && play.videofile != play.audiofile) {
					actions.push(new Action(function () {
						stopPlay(play.audiofile);
					}, caret + 1000));
				}
			}
		}

	actions.push(new Action(function () { hide("timerblock") }, breaklengthms + 4000));
	return new Segment(actions, tracker);
}

function timeForRepeat(tracker) {
	var audio = data[20].getAudio();

	return new Segment([
		new Action(function () { slideToNum(24) }, 0),
		new Action(function () {
			setText("extratext", "Time for a quick repeat!")
		}, 0),
		new Action(function () { show("extratext") }, 1000),
		new Action(function () { slideToNum(1, 4000) }, 2500),
		new Action(function () { hide("extratext") }, 6500),
		new Action(function (time) {
			return fadeOutAudio(audio, time);
		}, 6500),
		new Action(function () { hide("repeaticon"); }, 6500),
		new Action(function () { stopPlay(audio) }, 7500)
	], tracker);
}
function repeatSegment(d, tracker) {
	console.log(`generated repeat segment R-${d.videofile}: start ${d.getRepeat()}`);

	return new Segment([
		new Action(function () {
			slideToNum(d.counter);
			init(d.videofile);
			init(d.audiofile);
		}, 0),
		new Action(function () { startPlay(d.getAudio(), d.getRepeat()) }, 0),
		new Action(function (time) { return fadeInAudio(d.getAudio(), time); }, 0),
		new Action(function () { setText("questiontext", d.question); }, 1000),
		new Action(function () { show("questionrevealer"); }, 2000),
		new Action(function () { show(d.hintfile); }, 3000),
		new Action(function () { if (d.isremix) { show("remix"); } }, 4500),
		new Action(function () { hide(d.hintfile); }, 13000),
		new Action(function () { hide("remix"); }, 13000),
		new Action(function () { hide("questionrevealer"); }, 12000),
		new Action(function (time) {
			return fadeOutAudio(d.getAudio(), time);
		}, 15000),
		new Action(function () { stopPlay(d.getAudio()) }, 16000),
	], tracker);
}


function finalRepeatAndHandin(d, tracker) {
	console.log(`generated handin segment RH-${d.videofile}: start ${d.getRepeat()}`);
	var t = new ScreenTimer(60);
	return new Segment([
		new Action(function () {
			slideToNum(d.counter);
			setText("pausetext", `<span style="font-size:4vw">Hand in your answers!</span>`);
			init(d.videofile);
			init(d.audiofile);
			document.getElementById("minutesuntil").style.display = "none";
		}, 0),
		new Action(function () { startPlay(d.getAudio(), d.getRepeat()) }, 0),
		new Action(function (time) {
			return fadeInAudio(d.getAudio(), time);
		}, 0),
		new Action(function () { setText("questiontext", d.question); }, 1000),
		new Action(function () { show("questionrevealer"); }, 2000),
		new Action(function () { show(d.hintfile); }, 3000),
		new Action(function () { if (d.isremix) { show("remix"); } }, 4500),
		new Action(function () { hide(d.hintfile); }, 14000),
		new Action(function () { hide("remix"); }, 14000),
		new Action(function () { hide("questionrevealer"); }, 13000),
		new Action(function () { hide("numberscroll"); }, 13500),
		new Action(function () { hide("quiztitlerevealer"); }, 14000),
		new Action(function () { hide("sidebartext"); }, 14000),
		new Action(function () { hideSidebar(); }, 15000),
		new Action(function () { show("pausetext"); }, 17000),
		new Action(function () { show("timerblock"); }, 18000),
		new Action(function (time) { return t.tick(time); }, 17000),
		new Action(function () { hide("timerblock") }, 78000),
		new Action(function () { hide("pausetext") }, 78000),
		new Action(function (time) {
			return fadeOutAudio(d.getAudio(), time);
		}, 90000),
		new Action(function () { stopPlay(d.getAudio()) }, 91000),
	], tracker);
}

function keySegment(d, tracker) {
	console.log(`generated key segment K-${d.videofile}: start ${d.getRevealAudioStart()} reveal ${d.getRevealAudio()} end ${d.getRevealAudioEnd()}`);



	// usecases

	// hint is image, audio is separate, reveal is video
	// init audio
	// init video
	// startplay audio at audiostart (audiostart defaults to videostart)
	// startplay video at videostart
	// fadein audio
	// fadeout audio
	// stopplay audio
	// stopplay video

	// hint is video, audio is hintvideo, reveal is other video
	// init audio <-this points to hintvideo, so only one needed
	// init video <- this is actually othervideo
	// startplay audio at audiostart (audiostart defaults to videostart)
	// startplay video at videostart
	// fadein audio
	// fadeout audio
	// stopplay audio
	// stopplay video

	// hint is image, audio is reveal video, reveal is video
	// init audio
	// init video <- this is also audio, but wont hurt
	// startplay audio at audiostart (audiostart defaults to videostart)
	// startplay video at videostart <- this is also audio, but wont hurt?
	// fadein audio
	// fadeout audio
	// stopplay audio
	// stopplay video

	//revealaudiostart is where in the audio the music should begin playing, default is ~20 music only, then reveal
	//revealaudio: is the moment in the audio the drop appears, and thus when the video should fade in
	// revealvideo: is the timestamp in the video where video should start playing - it matches the drop,
	// and if audio and video are the same object, care has to be taken to avoid accidental skips, defaults to the same as revealaudio
	// i suspect if audio and video are same object, this just has no effect?
	// revealaudioend is the moment in the audio when the music fades out and key proceeds to the next item. video vill fade out wherever it happens to be at this moment, defaults to the drop moment + 20 s, so audience will se ~20 seconds of video

	var deltaReveal = (d.getRevealAudio() - d.getRevealAudioStart());
	var deltaKeyend = (d.getRevealAudioEnd() - d.getRevealAudioStart());

	var actions = [
		new Action(function () {
			hide("repeaticon");
			slideToNum(d.counter);
			init(d.videofile);
			init(d.audiofile);
		}, 0),

		// at t0, start play audio at audiostart offset
		new Action(function () { startPlay(d.getAudio(), d.getRevealAudioStart()) }, 0),
		new Action(function (t) { return fadeInAudio(d.getAudio(), t); }, 0),

		// hardcoded timestamps for text animations
		new Action(function () { setText("questiontext", d.question); }, 1000),
		new Action(function () { show("questionrevealer"); }, 3000),
		new Action(function () { show(d.hintfile); }, 4500),
		new Action(function () { if (d.isremix) { show("remix"); } }, 5000),
		new Action(function () { setText("answertext", d.answer); }, 5000),
		new Action(function () { setText("answerextra", d.answer2); }, 5000),


		new Action(function () { hide("questionrevealer"); }, deltaReveal - 2000),
		new Action(function () { hide(d.hintfile); }, deltaReveal - 3000),
		new Action(function () { hide("remix"); }, deltaReveal - 3000),
		new Action(function () {
			if (d.hasSeparateAudio())
				startPlay(d.videofile, Math.max(0, d.getRevealVideo() - 750));
		}, deltaReveal - 750),
		new Action(function () { show(d.videofile); }, deltaReveal),
		new Action(function () { show("answerrevealer") }, deltaReveal + 10000),
		new Action(function () { show("answerextra"); }, deltaReveal + 12000),

		new Action(function (t) { return fadeOutAudio(d.getAudio(), t); }, deltaKeyend),

		new Action(function () { hide(d.videofile); }, deltaKeyend),
		new Action(function () { hide("answerrevealer"); }, deltaKeyend),
		new Action(function () { hide("answerextra"); }, deltaKeyend),
		new Action(function () {
			if (d.audiofile) stopPlay(d.audiofile);
			stopPlay(d.videofile)
		}, deltaKeyend + 1300)
	];
	return new Segment(actions, tracker);
}


function finalRevealAndGoodbye(d, tracker) {
	console.log(`generated exit key segment EK-${d.videofile}: start ${d.getRevealAudioStart()} reveal ${d.getRevealAudio()} end ${d.getRevealAudioEnd()}`);

	var deltaReveal = (d.getRevealAudio() - d.getRevealAudioStart());
	var deltaKeyend = (d.getRevealAudioEnd() - d.getRevealAudioStart());
	if(deltaKeyend < deltaReveal+38000){
		console.warn("final reveal end marker too short, adjusting to higher value");
		deltaKeyend =deltaReveal + 48000;
	}

	var actions = [
		new Action(function () {
			slideToNum(d.counter);
			init(d.videofile);
			init(d.audiofile);

			var video = document.getElementById(d.videofile);
			video.style.transition = "opacity 2s ease-in-out";
			video.className = "cover";
		}, 0),


		new Action(function () { startPlay(d.getAudio(), d.getRevealAudioStart()) }, 0),
		new Action(function (t) { return fadeInAudio(d.getAudio(), t); }, 0),

		new Action(function () { setText("questiontext", d.question); }, 1000),
		new Action(function () { show("questionrevealer"); }, 3000),
		new Action(function () { show(d.hintfile); }, 4500),
		new Action(function () { if (d.isremix) { show("remix"); } }, 4500),
		new Action(function () { setText("answertext", d.answer); }, 5000),
		new Action(function () { setText("answerextra", d.answer2); }, 5000),
		new Action(function () { hide("questionrevealer"); }, deltaReveal - 2000),
		new Action(function () { hideSidebar(); }, deltaReveal - 2000),
		new Action(function () { hide(d.hintfile); }, deltaReveal - 3000),
		new Action(function () { hide("remix"); }, deltaReveal - 3000),
		new Action(function () {
			if (d.hasSeparateAudio())
				startPlay(d.videofile, d.getRevealVideo());
		}, deltaReveal - 1000),
		new Action(function () { show(d.videofile); }, deltaReveal),
		new Action(function () { hide("quiztitlerevealer"); }, deltaReveal + 3000),
		new Action(function () { show("answerrevealer") }, deltaReveal + 25000),
		new Action(function () { show("answerextra"); }, deltaReveal + 26500),
		new Action(function () { hide("answerextra") }, deltaReveal + 34000),
		new Action(function () { hide("answerrevealer"); }, deltaReveal + 36000),
		new Action(function () { show("goodbye"); }, deltaReveal + 38000),
		new Action(function (t) { return fadeOutAudio(d.getAudio(), t); }, deltaKeyend),
		new Action(function () {
			var video = document.getElementById(d.videofile);
			video.style.transition = "opacity 1s";
			hide(d.videofile);
		}, deltaKeyend - 1000),

		new Action(function () {
			if (d.audiofile) stopPlay(d.audiofile);
			stopPlay(d.videofile)
		}, deltaKeyend + 1000)
	];
	return new Segment(actions, tracker);
}



function cleanup(tracker) {
	var ids = [
		"sidebartext",
		"extratext",
		"answerextra",
		"goodbye",
		"pausetext",
		"timerblock",
		"mandagsklubbenlogo",
		"backgroundvideoloop"
	];
	return new Segment([
		new Action(function () {
			slideToNum(0);
			document.getElementById("ff").style.display = "none";
			hideSidebar();
			hide("questionrevealer");
			hide("answerrevealer");
			show("repeaticon");
			show("numberscroll");
			hide("quiztitlerevealer");
			hide("remix");
		}, 0),// go black
		new Action(function () {
			for (let id of ids) { hide(id) }
		}, 1000),
		new Action(function () { stopPlay("backgroundvideoloop") }, 2000),
		new Action(function () {
			document.getElementById("menu").style.display = "block";
			document.getElementById("minutesuntil").style.display = "block";
			document.body.style.cursor = "auto";
			Engine.debugmode = false;
		}, 5000),
		new Action(function () { Engine.animationActive = false; }, 6000)
	], tracker);
}
