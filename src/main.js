
function initializedata() {
	recolorQuiz();
	document.getElementById("menu").innerHTML += `<span>-${_settings.quiznumber}</span>`

	data = window.__data = _data.map(function(d) {
		return Object.create(Data.prototype, Object.getOwnPropertyDescriptors(d))
	});
	for (let d in data) {
		data[d].validate();
		var ix = parseInt(d);
		var adjust = Math.floor(ix / 7) + 1;
		generate(data[d], parseInt(d) + adjust);
	}
	data.forEach(function(d) {
		console.log(d.toString())
	})
	var bgvid = document.getElementById("backgroundvideoloop");
	var source = document.createElement("source");
	source.type = "video/mp4";
	source.src = _settings.backgroundvideo;
	if(_settings.backgroundstyle){
		source.style = _settings.backgroundstyle
	}
	bgvid.appendChild(source);

	if(!window._breaks ){
		window._breaks =[];
	}
	for (let b of window._breaks) {
		if (b.plays)
			for (let play of b.plays) {
				if (play.videofile) {
					addVideo(play.videofile, play.videofile, "", "cover")
				}
				if (play.audiofile && play.videofile != play.audiofile) {
					addVideo(play.audiofile, play.audiofile, "display:none");
				}
			}
	}
	if( _settings.showlogo !== undefined )
	{
		if( !_settings.showlogo )
			document.getElementById("cornerlogo").style.visibility = "hidden";
		else
			replaceLogo(_settings.showlogo);
	}
	if( _settings.sidebarbackground !== undefined ){
		document.getElementById("sidebar").style.background = _settings.sidebarbackground;
		document.getElementById("sidebarheader").style.background = _settings.sidebarbackground;
	}
}

function addVideo(name, src, style, classes) {
	var existing = document.getElementById(name);
	if (existing != null)
		return existing;
	var source = document.createElement("source");
	source.type = "video/mp4";
	source.src = src;
	var vid = document.createElement("video");
	vid.appendChild(source);
	vid.id = name;
	vid.style.cssText = style || "";
	vid.className = classes || "";
	document.body.appendChild(vid);
	return vid;
}

function addImage(name, src, style, classes) {
	var existing = document.getElementById(name);
	if (existing != null)
		return existing;
	var em = document.createElement("img");
	em.id = name;
	em.src = src;
	em.style.cssText = style || "";
	em.className = classes || "";
	document.body.appendChild(em);
	return em;
}

function addDiv(name, html, style, classes) {
	var em = document.createElement("div");
	em.id = name;
	em.innerHTML = html;
	em.style.cssText = style || "";
	em.className = classes || "";
	document.body.appendChild(em);
	return em;
}

function addHintImage(d) {
	if (!d.hintcss) {
		d.hintcss = ""
	}
	if (!d.hintclass) {
		d.hintclass = ""
	}
	d.hintcss += ";opacity:0;z-index:10;transition:opacity 1s";
	d.hintclass += " hintcover absolute";
	return addImage(d.hintfile, d.hintfile, d.hintcss, d.hintclass);
}

function addHintVideo(d) {
	if (!d.hintcss) {
		d.hintcss = ""
	}
	if (!d.hintclass) {
		d.hintclass = "hintcover"
	}
	d.hintcss += ";opacity:0;z-index:10;transition:opacity 1s";
	return addVideo(d.hintfile, d.hintfile, d.hintcss, d.hintclass);
}

function generate(d, counter) {
	d.counter = counter;
	if(d.hintfile){
		d.hintelement = d.isHintVideo() ? addHintVideo(d) : addHintImage(d);
	}
	if(d.videofile){
		d.video = addVideo(d.videofile, d.videofile, "z-index:50", "hintcover")
	}
	if(d.questionfile){
		addVideo(d.questionfile, d.questionfile, "z-index:50", "hintcover")
	}
	if(d.answerfile){
		addVideo(d.answerfile, d.answerfile, "z-index:50", "hintcover")
	}
	if(d.audiofile){
		d.audio = addVideo(d.getAudio(), d.getAudio());
	}
}

function slideToNum(n, d) {
	if( n >= 1 && n <= 24 )
	for(let i = 1; i <= 24; i++) {
		let lookupid = i == 24 ? "repeaticon" : `sidebar${i}`;
		let val = i == n ? "current" : "inactive";
		let sidebarem = document.getElementById(lookupid);
		if(sidebarem) {
			if(sidebarem.className.indexOf("sprite") != -1)
				sidebarem.className = val + " sprite";
			else
				sidebarem.className = val;
		}
		else {
			console.log(`bad id ${lookupid} at scroll to ${n}`)
		}

	}
	var sb = document.getElementById("numberscroll");
	sb.style.transition = `opacity .5s, top ${d||1000}ms ease-in-out`;
	if (n) {
		var dist = (310 - n * 210) / 19.2;
		sb.style.top = `${dist}vw`;
	} else
		sb.style.top = "120vh";
	setTimeout(function(){
		// tries to mitigate the transparent lines across sidebar numbers
		// probably caused by the combination of opacity and scale transitions
		sb.style.display = "none";
		sb.style.display = "block";
	},d+100);
	return true;
}

function fillSidebar() {
	var str = "";
	var ix = 1;
	for (var i = 1; i <= 21; i++) {
		str += `<div id="sidebar${ix}">${i}</div>`
		ix++;
		if (i == 7) {
			str += beerIcon(`sidebar${ix}`);
			ix++;
		}
		if (i == 14) {
			str += wineIcon(`sidebar${ix}`);
			ix++;
		}
		if (i == 21) {
			str += repeatIcon("repeaticon");
		}
	}

	setText("numberscroll", str);
}


function addPartOne(segments, tracker) {
	segments.push(setupQuizArea(tracker.fork(), 0));
	tracker.push(1000);
	for (var i = 0; i < 7; i++)
		segments.push(qSegmentByType(data[i].type)(data[i], tracker));
	segments.push(quizBreak(data[6], tracker));
	segments.push(cleanup(tracker));
	return segments;
}

function addPartTwo(segments, tracker) {
	segments.push(setupQuizArea(tracker.fork(), 1));
	tracker.push(1000);
	for (var i = 7; i < 14; i++)
		segments.push(qSegmentByType(data[i].type)(data[i], tracker));
	segments.push(quizBreak(data[13], tracker));
	segments.push(cleanup(tracker));
	return segments;
}

function addPartThree(segments, tracker) {
	segments.push(setupQuizArea(tracker.fork(), 2));
	tracker.push(1000);
	for (var i = 14; i < 21; i++)
		segments.push(qSegmentByType(data[i].type)(data[i], tracker));
	segments.push(timeForRepeat(tracker));
	tracker.push(1000); // avoid bad scroll
	for (ix = 0; ix < 20; ix++) {
		segments.push(repeatSegmentByType(data[ix].type)(data[ix], tracker));
	}
	segments.push(finalRepeatAndHandin(data[20], tracker));
	segments.push(cleanup(tracker));
	return segments;
}

function addPartAnswers(segments, tracker) {
	segments.push(setupQuizArea(tracker.fork(), 3));
	tracker.push(1000);
	for (var ix = 0; ix <= 19; ix++) {
		segments.push(keySegmentByType(data[ix].type)(data[ix], tracker));
	}
	// last question gets special reveal
	segments.push(finalRevealAndGoodbye(data[20], tracker));
	segments.push(cleanup(tracker));
	console.log(segments)
	return segments;
}


// use static scope hack to be able to do basic ff only stepping.
function debugff(ms) {
	Engine.starttime -= ms;
	var ems = document.getElementsByTagName("video");
	for (var i = 0; i < ems.length; i++)
		if (!ems[i].ended && !ems[i].paused)
			ems[i].currentTime += ms / 1000;
}

function debugrw(ms) {
	debugff(-1 * ms);
}

function debugp() {
	Engine.isPaused = !Engine.isPaused;
}

function debugskip() {
	var activesegments = window._engine.segments.filter(function(s) {
		return !s.isDone
	});
	if (activesegments.length > 0) {
		// timeline
		// delta epoch                    delta enginestart                                    delta segmentstart
		// Engine.starttime   >     >     segment.startTime     >           >       >    >     segmentend |last action triggerTime]
		//                                                     now (currenttime, delta:epoch)
		//                                                       |---------------------------------| we seek this delta

		var currenttime = new Date().getTime();
		var segmentstart = activesegments[0].startTime;
		var actions = activesegments[0].actions;
		var segmentlength = actions[actions.length - 1].triggerTime;
		var absolutesegmentend = segmentlength + segmentstart + Engine.starttime;
		var remaining = absolutesegmentend - currenttime;

		if (remaining > 0)
			debugff(remaining);
	}
}

function getQuizName(){
	var ems = document.getElementsByName("quizchoice");
	if(ems.length == 0){
		return "effort";
	}
	for( let em of ems ){
		if( em.checked ){
			return em.labels[0].textContent.trim();
		}
	}
}

function ensureMediaLoaded(callback,depth){
	if( !depth) depth = 1;
	console.log(`ensure @ ${depth}`);
	if(depth > 40){
		throw "media won't load in reasonable time";
	}
	let video = document.getElementsByTagName("video");
	let notready = false;
	for( let v of video ){
		if( v.readyState < 4 ){
			notready = true;
			console.log(`not ready: ${v.id}: ${v.readyState}`);
		}
	}
	if( notready )
		setTimeout(function(){ensureMediaLoaded(callback,depth+1)},250);
	else
		callback();
}

function runSetup(...segmentnames){
	let qch = getQuizName();
	loadScriptFile(qch+"/data.js");
	loadScriptFile(qch+"/intro.js");
	var lem = document.createElement("link");
	lem.href = qch+"/style.css"
	lem.rel = "stylesheet"
	document.head.appendChild(lem);

	setTimeout(function(){
		initializedata();
		ensureMediaLoaded(function(){
			if( _settings.cobrarule !== undefined && !_settings.cobrarule )
				segmentnames = segmentnames.map(function(s){ return s == "cobra" ? "shortpause" : s; });
			run(...segmentnames);
		});
	},500);
}

function run(...segmentnames) {
	var tracker = new Tracker();
	var segments = [];
	for (var name of segmentnames) {
		if (name == "introjingle")
			segments.push(getIntroSegment(tracker));
		else if (name == "intro")
			segments.push(getIntroSegment(tracker, true));
		else if (name == "cobra")
			segments.push(getCobraSegment(tracker));
		else if (name == "part1")
			addPartOne(segments, tracker);
		else if (name == "part2")
			addPartTwo(segments, tracker);
		else if (name == "part3")
			addPartThree(segments, tracker);
		else if (name == "partkey")
			addPartAnswers(segments, tracker);
		else if (name == "shortpause")
			tracker.push(1000);
	}
	var delay = 500;
	if (!Engine.debugmode) {
		if (window.location.hash != "#broadcast") {
			document.body.requestFullscreen();
			document.body.style.cursor = "none";
		}
		delay = 3500; // delay to account for firefox "you are now in fullscreen mode" message to scroll off screen
	} else {
		document.getElementById("ff").style.display = "block";
	}

	document.getElementById("menu").style.display = "none";
	document.getElementById("backgroundvideoloop").play();
	setTimeout(function() {
		window._engine = new Engine(segments);
		window._engine.run()
	}, delay);
}

function rundebug() {
	saveConfig();
	Engine.debugmode = true;
	var vars = ["intro", "cobra", "shortpause", "part1", "part2", "part3", "partkey"];
	runSetup(...(vars.filter(function(v) {
		return document.getElementById(`include${v}`).checked;
	})));
}


const keySegmentMapper = {
	"default": keySegment,
	"singlevid": k_singlevid,
	"simple": k_simple,
}

const qSegmentMapper = {
	"default": questionSegment,
	"singlevid": q_singlevid,
	"simple": q_simple,
}
const repeatSegmentMapper = {
	"default": repeatSegment,
	"singlevid": r_singlevid,
	"simple": r_simple,
}

function keySegmentByType(type) {
	if(keySegmentMapper.hasOwnProperty(type)){
		return keySegmentMapper[type]
	}
	return keySegment
}
function qSegmentByType(type) {
	if(qSegmentMapper.hasOwnProperty(type)){
		return qSegmentMapper[type]
	}
	return questionSegment
}
function repeatSegmentByType(type) {
	if(repeatSegmentMapper.hasOwnProperty(type)){
		return repeatSegmentMapper[type]
	}
	return repeatSegment
}
