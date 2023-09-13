function questionSegment(d, tracker) {
	qValidate(d)
	console.log(`generated question segment Q-${d.videofile}: start ${d.getRegularStart()} hint ${d.getRegularHint()} end ${d.getRegularEnd()}`);
	let deltaHint = (d.getRegularHint() - d.getRegularStart());
	let deltaEnd = (d.getRegularEnd() - d.getRegularStart());

	let extratextFallback = d.extratext || _settings.defaultextratext || "";
	let extratext = getExtraTextFromSettings(d.counter);
	if(extratext == null) extratext = extratextFallback;

	if(d.isHintVideo())
		d.hintelement.transition = "opacity 1s, left 4s";

	var actions = [
		new Action(() => {
			init(d.videofile);
			init(d.audiofile);
			if(d.isHintVideo()) {
				console.log("init hint video");
				init(d.hintfile);
			}
			if (d.counter != 1 && d.counter != 9 && d.counter != 17)
				slideToNum(d.counter);
		}, 0),
		new Action(() => { startPlay(d.getAudio(), d.getRegularStart()) }, 0),
		new Action((time) => { return fadeInAudio(d.getAudio(), time); }, 0),
		new Action(() => { setText("questiontext", d.question); }, 1000),
		new Action(() => { setText("extratext", extratext); }, 1000),
		new Action(() => { show("questionrevealer"); }, 4500),
		new Action(() => { if (d.isremix) { show("remix"); } }, 4500),
		new Action(() => { if (d.getRegularHint() > 20000) show("extratext") }, 8000),
		new Action(() => { show(d.hintfile) }, deltaHint),
		new Action(() => { hide("extratext") }, deltaHint),
		new Action(() => { hide("questionrevealer"); }, deltaEnd - 1000),
		new Action(() => { hide("remix") }, deltaEnd - 1000),
	];
	if (d.counter == 23 || d.counter == 15 || d.counter == 7) { // last question, before repeat or a break, gets special treatment
		if(d.isHintVideo())
			actions.push(new Action(() => {
				d.hintelement.style.transition = "opacity 1s,left 0.4s,min-width 0.4s,min-height 0.4s,top 0.4s,transform 0.4s";
				d.hintelement.className = "cover";
			}, deltaEnd - 4000));
			else
			actions.push(new Action(() => { hide(d.hintfile) }, deltaEnd));
	}
	else {
		actions.push(new Action(() => { hide(d.hintfile) }, deltaEnd-500));
		actions.push(new Action((time) => { return fadeOutAudio(d.getAudio(), time); }, deltaEnd));
		actions.push(new Action(() => { stopPlay(d.getAudio()) }, deltaEnd + 1000));
	}
	actions.push(new Action(() => { }, deltaEnd + 1000)); // empty action to sync with the tracker 1s adjust fix

	return new Segment(actions, tracker);
}



function repeatSegment(d, tracker) {
	console.log(`generated repeat segment R-${d.videofile}: start ${d.getRepeat()}`);

	return new Segment([
		new Action(() => {
			slideToNum(d.counter);
			init(d.videofile);
			init(d.audiofile);
		}, 0),
		new Action(() => { startPlay(d.getAudio(), d.getRepeat()) }, 0),
		new Action((time) => { return fadeInAudio(d.getAudio(), time); }, 0),
		new Action(() => { setText("questiontext", d.question); }, 1000),
		new Action(() => { show("questionrevealer"); }, 2000),
		new Action(() => { show(d.hintfile); }, 3000),
		new Action(() => { if (d.isremix) { show("remix"); } }, 4500),
		new Action(() => { hide(d.hintfile); }, 13000),
		new Action(() => { hide("remix"); }, 13000),
		new Action(() => { hide("questionrevealer"); }, 12000),
		new Action((time) => {
			return fadeOutAudio(d.getAudio(), time);
		}, 15000),
		new Action(() => { stopPlay(d.getAudio()) }, 16000),
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

	// hint is reveal video, audio is separate
	// detect by videofile and hintfile props are same
	// same as above but never hide hint, and dont reveal key

	//revealaudiostart is where in the audio the music should begin playing, default is ~20 music only, then reveal
	//revealaudio: is the moment in the audio the drop appears, and thus when the video should fade in
	// revealvideo: is the timestamp in the video where video should start playing - it matches the drop,
	// and if audio and video are the same object, care has to be taken to avoid accidental skips, defaults to the same as revealaudio
	// i suspect if audio and video are same object, this just has no effect?
	// revealaudioend is the moment in the audio when the music fades out and key proceeds to the next item. video vill fade out wherever it happens to be at this moment, defaults to the drop moment + 20 s, so audience will se ~20 seconds of video

	var hintIsAlsoReveal= d.hintfile == d.videofile;
	var deltaReveal = (d.getRevealAudio() - d.getRevealAudioStart());
	var deltaKeyend = (d.getRevealAudioEnd() - d.getRevealAudioStart());

	var actions = [
		new Action(() => {
			hide("repeaticon");
			slideToNum(d.counter);
			init(d.videofile);
			init(d.audiofile);
		}, 0),

		// at t0, start play audio at audiostart offset
		new Action(() => { startPlay(d.getAudio(), d.getRevealAudioStart()) }, 0),
		new Action(function (t) { return fadeInAudio(d.getAudio(), t); }, 0),

		// hardcoded timestamps for text animations
		new Action(() => { setText("questiontext", d.question); }, 1000),
		new Action(() => { show("questionrevealer"); }, 3000),
		new Action(() => { show(d.hintfile); }, 4500),
		new Action(() => { if (d.isremix) { show("remix"); } }, 5000),
		new Action(() => { setText("answertext", d.answer); }, 5000),
		new Action(() => { setText("answerextra", d.answer2); }, 5000),


		new Action(() => { hide("questionrevealer"); }, deltaReveal - 2000),
		new Action(() => { if(!hintIsAlsoReveal) hide(d.hintfile); }, deltaReveal - 3000),
		new Action(() => { hide("remix"); }, deltaReveal - 3000),
		new Action(() => {
			if (d.hasSeparateAudio())
				startPlay(d.videofile, Math.max(0, d.getRevealVideo() - 750));
		}, deltaReveal - 750),
		new Action(() => { if(!hintIsAlsoReveal) show(d.videofile); }, deltaReveal),
		new Action(() => { show("answerrevealer") }, deltaReveal + 10000),
		new Action(() => { show("answerextra"); }, deltaReveal + 12000),

		new Action(function (t) { return fadeOutAudio(d.getAudio(), t); }, deltaKeyend),

		new Action(() => { hide(d.videofile); }, deltaKeyend),
		new Action(() => { hide("answerrevealer"); }, deltaKeyend),
		new Action(() => { hide("answerextra"); }, deltaKeyend),
		new Action(() => {
			if (d.audiofile) stopPlay(d.audiofile);
			stopPlay(d.videofile)
		}, deltaKeyend + 1300)
	];
	return new Segment(actions, tracker);
}
