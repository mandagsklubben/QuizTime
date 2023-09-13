function q_singlevid(d, tracker) {
	qValidate(d)
	console.log(`generated question segment t: ${d.type} Q-${d.videofile}: start ${d.getRegularStart()} hint ${d.getRegularHint()} end ${d.getRegularEnd()}`);
	let deltaEnd = (d.getRegularEnd() - d.getRegularStart());

	let extratextFallback = d.extratext || _settings.defaultextratext || "";
	let extratext = getExtraTextFromSettings(d.counter);
	if(extratext == null) extratext = extratextFallback;
	var actions = [
		new Action(() => {
			init(d.videofile);
			if (d.counter != 1 && d.counter != 9 && d.counter != 17)
				slideToNum(d.counter);
		}, 0),
		new Action(() => { startPlay(d.videofile, d.getRegularStart()) }, 0),
		new Action((time) => { return fadeInAudio(d.videofile, time); }, 0),
		new Action(() => { show(d.videofile) }, 750),
		new Action(() => { setText("questiontext", d.question); }, 1000),
		new Action(() => { show("questionrevealer"); }, 4500),
		new Action(() => { if (d.isremix) { show("remix"); } }, 4500),
		new Action(() => { hide("questionrevealer"); }, deltaEnd - 1000),
		new Action(() => { hide("remix") }, deltaEnd - 1000),
	];
	actions.push(new Action(() => { hide(d.videofile) }, deltaEnd-500));
	actions.push(new Action((time) => { return fadeOutAudio(d.videofile, time); }, deltaEnd));
	actions.push(new Action(() => { stopPlay(d.videofile) }, deltaEnd + 1000));
	actions.push(new Action(() => { }, deltaEnd + 1000)); // empty action to sync with the tracker 1s adjust fix

	return new Segment(actions, tracker);
}



function r_singlevid(d, tracker) {
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

function k_singlevid(d, tracker) {
	// videofile = hintvideo into reveal, 40s playtime from revealaudio
	console.log(`generated key segment t:${d.type} K-${d.videofile}: start ${d.getRevealAudioStart()} reveal ${d.getRevealAudio()} end ${d.getRevealAudioEnd()}`);

	var deltaReveal = (d.getRevealAudio() - d.getRevealAudioStart());
	var deltaKeyend = (d.getRevealAudioEnd() - d.getRevealAudioStart());

	var actions = [
		new Action(() => {
			hide("repeaticon");
			slideToNum(d.counter);
			init(d.videofile);
		}, 0),

		// at t0, start play audio at audiostart offset
		new Action(() => { startPlay(d.videofile, d.getRevealAudioStart()) }, 0),
		new Action(function (t) { return fadeInAudio(d.getAudio(), t); }, 0),


		// hardcoded timestamps for text animations
		new Action(() => { setText("questiontext", d.question); }, 1000),
		new Action(() => { show("questionrevealer"); }, 3000),
		new Action(() => { show(d.videofile); }, 4500),
		new Action(() => { if (d.isremix) { show("remix"); } }, 5000),
		new Action(() => { setText("answertext", d.answer); }, 5000),
		new Action(() => { setText("answerextra", d.answer2); }, 5000),


		new Action(() => { hide("questionrevealer"); }, deltaReveal - 2000),
		new Action(() => { hide("remix"); }, deltaReveal - 3000),
		new Action(() => { show("answerrevealer") }, deltaReveal + 10000),
		new Action(() => { show("answerextra"); }, deltaReveal + 12000),

		new Action(function (t) { return fadeOutAudio(d.videofile, t); }, deltaKeyend),

		new Action(() => { hide(d.videofile); }, deltaKeyend),
		new Action(() => { hide("answerrevealer"); }, deltaKeyend),
		new Action(() => { hide("answerextra"); }, deltaKeyend),
		new Action(() => {stopPlay(d.videofile)}, deltaKeyend + 1300)
	];
	return new Segment(actions, tracker);
}
