

function init(id) {
	if (!id)
		return;
	var em = document.getElementById(id);
	if(!em)
		return;
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
	sb.style.left = "-18vw";
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

function qValidate(d){
	if(!data){
		console.log( "bad data")
	}
	if(d==null){
		if(qs){
			let loadedqstr = data.map(function(d){return d.videofile});

			for( let q of qs ){
				let m = loadedqstr.filter(function(l){ return (typeof l === "string") && l.startsWith(`questions/${q}/`) });

				if( m.length == 0 ){
					console.error(`${q} is missing`);
				}
			}
		}
		throw "data array contains null, most likely culprit is missing files or failed config";
	}
}

function getCobraSegment(tracker) {
	var emphcolor = "orange";
	var backcover = addDiv("backcover", "", "background-color:black", "cover");
	var cobramusic = addVideo("cobramusic", "img/cobra.mp3", "display:none");
	var cobraimg = addImage("cobraimg", "img/cobra.jpg",
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
		new Action(() => {
			init("cobramusic");
			show("backcover");
			cobraimg.style.transition = "opacity 1400ms, transform 30s";
			cobraimg.style.transform = "translate(-55%)";
			minuspoint.style.transition = "opacity 150ms, transform 28s linear";
			r1.style.transition = "opacity 150ms";
			r2.style.transition = "opacity 150ms";
			ruleactive.style.transition = "transform 28s linear";
			startPlay("cobramusic", 5000);
		}, delay),
		new Action((time) => {
			return fadeInAudio("cobramusic", time, 200);
		}, delay),
		new Action(() => { show("r1") }, 1000 + delay),
		new Action(() => { show("r2") }, 1500 + delay),
		new Action(() => { ruleactive.style.transform = "translate(-50%,-50%) matrix(1.35,0,0,1.35,0,-50)" }, 1500 + delay),
		new Action(() => { show("minuspoint"); }, 1830 + delay),
		new Action(() => { minuspoint.style.transform = "translate(-50%, -50%) matrix(0.77,0,0,0.77,0,-40)" }, 1830 + delay),
		new Action(() => { show("cobraimg"); }, 2200 + delay),
		new Action(() => {
			cobraimg.style.transition = "opacity 8s ease-in-out, transform 30s";
			r2.style.transition = "opacity 1s linear";
			r1.style.transition = "opacity 1s linear";
			minuspoint.style.transition = "opacity 2s, transform 28s linear";
		}, 4000 + delay),
		new Action(() => { hide("cobraimg"); }, 18000 + delay),

		new Action(() => { hide("minuspoint"); }, 23000 + delay),
		new Action(() => { hide("r1"); }, 24000 + delay),
		new Action(() => { hide("r2"); }, 25000 + delay),
		new Action(() => { hide("backcover"); }, 26000 + delay),
		new Action((time) => { return fadeOutAudio("cobramusic", time, 1500); }, 25200 + delay),
		new Action(() => { stopPlay("cobramusic") }, 28000 + delay),
		new Action(() => {
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
		new Action(() => {
			if (part == 0) slideToNum(0, 100);
			if (part == 1) slideToNum(8, 100);
			if (part == 2) slideToNum(16, 100);
			if (part == 3) slideToNum(0, 100);
		}, 0),
		new Action(() => {
			let opacity = _settings.backgroundopacity || 1;
			document.getElementById("backgroundvideoloop").style.opacity = opacity;
		}, 100),
		new Action(() => { showSidebar() }, 1000),
		new Action(() => { setText("quiztitlerevealer", `${titleprefix}: ${_settings.quizname}`); }, 1000),
		new Action(() => { show("sidebartext"); }, 2500),
		new Action(() => { show("quiztitlerevealer"); }, 3500),
		new Action(() => { show("cornerlogo") }, 1000),
		new Action(() => {
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
	var bsum = 0
	for( var play of breakdata.plays ){
		let audiosource = play.audiofile || play.videofile;

		var mediaduration = document.getElementById(audiosource).duration;
		bsum += (play.duration || mediaduration);
	}

	var activeAudio = d.audio || d.video;

	var end = d.breakaudioend || activeAudio.duration;
	var caret = end * 1000 - d.getRegularEnd();
	var breaklength = breakdata.breaklength || 60 * 8;

	if(bsum){
		breaklength = bsum + ( end - d.getRegularEnd()/1000)
	}

	var breaklengthms = breaklength * 1000;
	// something d.breakaudiocutoff with video duration as fallback is needed here if we ever want to cut qustion audio&video early in a break.
	console.assert(activeAudio.readyState > activeAudio.HAVE_NOTHING, "video have not loaded yet");
	var t = new ScreenTimer(breaklength);
	if (caret > breaklengthms)
		caret = breaklengthms; // no matter what, the break ending will make the audio fade
	console.log(`generated break segment B-${d.counter}`);
	var actions = [
		new Action(() => {
			slideToNum(d.counter + 1);
			setText("pausetext", logo);
			document.getElementById("minutesuntil").style.display = "block";
		}, 0),
		new Action((time) => { return t.tick(time); }, 0),
		new Action(() => { hide("numberscroll"); }, 3000),
		new Action(() => { hide("quiztitlerevealer"); }, 3500),
		new Action(() => { hide("sidebartext") }, 4000),
		new Action(() => { hideSidebar() }, 4500),
		new Action(() => { show("pausetext") }, 6500),
		new Action(() => { show("timerblock") }, 7500),
		new Action((time) => { return fadeOutAudio(d.getAudio(), time); }, caret),
		new Action(() => { stopPlay(d.getAudio()) }, caret + 2000),
		new Action(() => { hide(d.hintfile); }, caret + 1000),
		new Action(() => {
			if(d.isHintVideo()) {
				d.hintelement.className = "hintcover";
			}
		}, caret + 3000),
		new Action(() => { hide("pausetext") }, breaklengthms + 2000),
	];

	//caret must not be > breaklengthms at any point
	if (breakdata.plays)
		for (let play of breakdata.plays) {
			// safetybuffer must be at least size of fades
			if (caret < breaklengthms - 5000) {
				//at caret
				if (play.videofile) {
					actions.push(new Action(() => {
						init(play.videofile);
						startPlay(play.videofile, 0); // add audio/video start offset at some future point, when needed
					}, caret));
					actions.push(new Action(() => { hide("pausetext") }, caret)); // if we are showing video, hide the pause logo
				}
				if (play.audiofile && play.videofile != play.audiofile) {
					actions.push(new Action(() => {
						init(play.audiofile);
						startPlay(play.audiofile, 0); // add audio/video start offset at some future point, when needed
					}, caret));
				}
				// will we get function scopestyle bug here? changed to let, hope that fixes it
				let audiosource = play.audiofile || play.videofile;
				actions.push(new Action((time) => { return fadeInAudio(audiosource, time); }, caret));
				if (play.videofile)
					actions.push(new Action(() => { show(play.videofile) }, caret));

				var mediaduration = document.getElementById(audiosource).duration;
				var lengthofplay = (play.duration || mediaduration) * 1000;
				console.log(`including play in break segment BP-${caret}.${lengthofplay} v:${play.videofile||''} a:${play.audiofile||''}`);
				if (caret + lengthofplay > breaklengthms)
					caret = breaklengthms;
				else
					caret = caret + lengthofplay;

				actions.push(new Action((time) => { return fadeOutAudio(audiosource, time); }, caret));
				if (play.videofile) {
					actions.push(new Action(() => { hide(play.videofile) }, caret));
					actions.push(new Action(() => {
						stopPlay(play.videofile);
					}, caret + 1000));
				}
				if (play.audiofile && play.videofile != play.audiofile) {
					actions.push(new Action(() => {
						stopPlay(play.audiofile);
					}, caret + 1000));
				}
			}
		}

	actions.push(new Action(() => { hide("timerblock") }, breaklengthms + 4000));
	return new Segment(actions, tracker);
}

function timeForRepeat(tracker) {
	if(data.length !== 21){
		console.log("bad data in timeForRepeat")
	}
	var audio = data[20].getAudio();

	return new Segment([
		new Action(() => { slideToNum(24) }, 0),
		new Action(() => {
			setText("extratext", "Time for a quick repeat!")
		}, 0),
		new Action(() => { show("extratext") }, 1000),
		new Action(() => { slideToNum(1, 4000) }, 2500),
		new Action(() => { hide("extratext") }, 6500),
		new Action((time) => {
			return fadeOutAudio(audio, time);
		}, 6500),
		new Action(() => { hide("repeaticon"); }, 6500),
		new Action(() => { stopPlay(audio) }, 7500)
	], tracker);
}


function finalRepeatAndHandin(d, tracker) {
	console.log(`generated handin segment RH-${d.videofile}: start ${d.getRepeat()}`);
	var t = new ScreenTimer(60);
	return new Segment([
		new Action(() => {
			slideToNum(d.counter);
			setText("pausetext", `<span style="font-size:4vw">Hand in your answers!</span>`);
			init(d.videofile);
			init(d.audiofile);
			document.getElementById("minutesuntil").style.display = "none";
		}, 0),
		new Action(() => { startPlay(d.getAudio(), d.getRepeat()) }, 0),
		new Action((time) => {
			return fadeInAudio(d.getAudio(), time);
		}, 0),
		new Action(() => { setText("questiontext", d.question); }, 1000),
		new Action(() => { show("questionrevealer"); }, 2000),
		new Action(() => { show(d.hintfile); }, 3000),
		new Action(() => { if (d.isremix) { show("remix"); } }, 4500),
		new Action(() => { hide(d.hintfile); }, 14000),
		new Action(() => { hide("remix"); }, 14000),
		new Action(() => { hide("questionrevealer"); }, 13000),
		new Action(() => { hide("numberscroll"); }, 13500),
		new Action(() => { hide("quiztitlerevealer"); }, 14000),
		new Action(() => { hide("sidebartext"); }, 14000),
		new Action(() => { hideSidebar(); }, 15000),
		new Action(() => { show("pausetext"); }, 17000),
		new Action(() => { show("timerblock"); }, 18000),
		new Action((time) => { return t.tick(time); }, 17000),
		new Action(() => { hide("timerblock") }, 78000),
		new Action(() => { hide("pausetext") }, 78000),
		new Action((time) => {
			return fadeOutAudio(d.getAudio(), time);
		}, 90000),
		new Action(() => { stopPlay(d.getAudio()) }, 91000),
	], tracker);
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
		new Action(() => {
			slideToNum(d.counter);
			init(d.videofile);
			init(d.audiofile);

			var video = document.getElementById(d.videofile);
			video.style.transition = "opacity 2s ease-in-out";
			video.className = "cover";
		}, 0),


		new Action(() => { startPlay(d.getAudio(), d.getRevealAudioStart()) }, 0),
		new Action(function (t) { return fadeInAudio(d.getAudio(), t); }, 0),

		new Action(() => { setText("questiontext", d.question); }, 1000),
		new Action(() => { show("questionrevealer"); }, 3000),
		new Action(() => { show(d.hintfile); }, 4500),
		new Action(() => { if (d.isremix) { show("remix"); } }, 4500),
		new Action(() => { setText("answertext", d.answer); }, 5000),
		new Action(() => { setText("answerextra", d.answer2); }, 5000),
		new Action(() => { hide("questionrevealer"); }, deltaReveal - 2000),
		new Action(() => { hideSidebar(); }, deltaReveal - 2000),
		new Action(() => { hide(d.hintfile); }, deltaReveal - 3000),
		new Action(() => { hide("remix"); }, deltaReveal - 3000),
		new Action(() => {
			if (d.hasSeparateAudio())
				startPlay(d.videofile, d.getRevealVideo());
		}, deltaReveal - 1000),
		new Action(() => { show(d.videofile); }, deltaReveal),
		new Action(() => { hide("quiztitlerevealer"); }, deltaReveal + 3000),
		new Action(() => { show("answerrevealer") }, deltaReveal + 25000),
		new Action(() => { show("answerextra"); }, deltaReveal + 26500),
		new Action(() => { hide("answerextra") }, deltaReveal + 34000),
		new Action(() => { hide("answerrevealer"); }, deltaReveal + 36000),
		new Action(() => { show("goodbye"); }, deltaReveal + 38000),
		new Action(function (t) { return fadeOutAudio(d.getAudio(), t); }, deltaKeyend),
		new Action(() => {
			var video = document.getElementById(d.videofile);
			video.style.transition = "opacity 1s";
			hide(d.videofile);
		}, deltaKeyend - 1000),

		new Action(() => {
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
		"cornerlogo",
		"backgroundvideoloop"
	];
	return new Segment([
		new Action(() => {
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
		new Action(() => {
			for (let id of ids) { hide(id) }
		}, 1000),
		new Action(() => { stopPlay("backgroundvideoloop") }, 2000),
		new Action(() => {
			document.getElementById("menu").style.display = "block";
			document.getElementById("minutesuntil").style.display = "block";
			document.body.style.cursor = "auto";
			Engine.debugmode = false;
		}, 5000),
		new Action(() => { Engine.animationActive = false; }, 6000)
	], tracker);
}
