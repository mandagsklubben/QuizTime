function q_simple(d, tracker) {
	qValidate(d)
	console.log(`generated question segment Q-${d.questionfile}: start ${d.getRegularStart()} hint ${d.getRegularHint()} end ${d.getRegularEnd()}`);
	let deltaHint = (d.getRegularHint() - d.getRegularStart());
	let deltaEnd = (d.getRegularEnd() - d.getRegularStart());

	let extratextFallback = d.extratext || _settings.defaultextratext || "";
	let extratext = getExtraTextFromSettings(d.counter);
	if(extratext == null) extratext = extratextFallback;

	d.questionfile.transition = "opacity 1s, left 4s";

	var actions = [
		new Action(() => {
			init(d.questionfile);
			if (d.counter != 1 && d.counter != 9 && d.counter != 17)
				slideToNum(d.counter);
		}, 0),
		new Action(() => { startPlay(d.questionfile, d.getRegularStart()) }, 0),
		new Action(function (time) { return fadeInAudio(d.questionfile, time); }, 0),
		new Action(() => { setText("questiontext", d.question); }, 1000),
		new Action(() => { setText("extratext", extratext); }, 1000),
		new Action(() => { show("questionrevealer"); }, 4500),
		new Action(() => { if (d.isremix) { show("remix"); } }, 4500),
		new Action(() => { if (d.getRegularHint() > 20000) show("extratext") }, 8000),
		new Action(() => { show(d.questionfile) }, deltaHint),
		new Action(() => { hide("extratext") }, deltaHint),
		new Action(() => { hide("questionrevealer"); }, deltaEnd - 1000),
		new Action(() => { hide("remix") }, deltaEnd - 1000),
		new Action(() => { hide(d.questionfile) }, deltaEnd-500),
		new Action((time)=> { return fadeOutAudio(d.questionfile, time); }, deltaEnd),
		new Action(() => { stopPlay(d.questionfile) }, deltaEnd + 1000),
		new Action(() => { }, deltaEnd + 1000) // empty action to sync with the tracker 1s adjust fix
	];
	return new Segment(actions, tracker);
}



function r_simple(d, tracker) {
	console.log(`generated repeat segment R-${d.videofile}: start ${d.getRepeat()}`);

	return new Segment([
		new Action(() => {
			slideToNum(d.counter);
			init(d.questionfile);
		}, 0),
		new Action(() => { startPlay(d.questionfile, d.getRepeat()) }, 0),
		new Action((time) => { return fadeInAudio(d.questionfile, time); }, 0),
		new Action(() => { setText("questiontext", d.question); }, 1000),
		new Action(() => { show("questionrevealer"); }, 2000),
		new Action(() => { show(d.questionfile); }, 3000),
		new Action(() => { if (d.isremix) { show("remix"); } }, 4500),
		new Action(() => { hide(d.questionfile); }, 13000),
		new Action(() => { hide("remix"); }, 13000),
		new Action(() => { hide("questionrevealer"); }, 12000),
		new Action((time) => {
			return fadeOutAudio(d.questionfile, time);
		}, 15000),
		new Action(() => { stopPlay(d.questionfile) }, 16000),
	], tracker);
}


function k_simple(d, tracker) {
	console.log(`generated key segment K-${d.answerfile}: start ${d.getRevealAudioStart()} reveal ${d.getRevealAudio()} end ${d.getRevealAudioEnd()}`);

	var deltaReveal = (d.getRevealAudio() - d.getRevealAudioStart());
	var deltaKeyend = (d.getRevealAudioEnd() - d.getRevealAudioStart());

	var actions = [
		new Action(() => {
			hide("repeaticon");
			slideToNum(d.counter);
			init(d.answerfile);
		}, 0),

		// at t0, start play audio at audiostart offset
		new Action(() => { startPlay(d.answerfile, d.getRevealAudioStart()) }, 0),
		new Action(function (t) { return fadeInAudio(d.answerfile, t); }, 0),

		// hardcoded timestamps for text animations
		new Action(() => { setText("questiontext", d.question); }, 1000),
		new Action(() => { show("questionrevealer"); }, 3000),
		new Action(() => { show(d.answerfile); }, 4500),
		new Action(() => { if (d.isremix) { show("remix"); } }, 5000),
		new Action(() => { setText("answertext", d.answer); }, 5000),
		new Action(() => { setText("answerextra", d.answer2); }, 5000),


		new Action(() => { hide("questionrevealer"); }, deltaReveal - 2000),
		new Action(() => { hide("remix"); }, deltaReveal - 3000),
		new Action(() => { show("answerrevealer") }, deltaReveal + 10000),
		new Action(() => { show("answerextra"); }, deltaReveal + 12000),

		new Action(function (t) { return fadeOutAudio(d.answerfile, t); }, deltaKeyend),

		new Action(() => { hide(d.answerfile); }, deltaKeyend),
		new Action(() => { hide("answerrevealer"); }, deltaKeyend),
		new Action(() => { hide("answerextra"); }, deltaKeyend),
		new Action(() => { stopPlay(d.answerfile) }, deltaKeyend + 1300)
	];
	return new Segment(actions, tracker);
}
