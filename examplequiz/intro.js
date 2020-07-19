
function getIntroSegment(tracker,hidejingle){
	var introvideo = addVideo("introvideo","examplequiz/introvideo.mp4","","fullscreencenter");
	var actions = [
		new Action(function(){
			init("introvideo");
			introvideo.style.transition = "opacity 2s";
			startPlay("introvideo",0);
		},0),
		new Action(function(time){return fadeInAudio("introvideo",time);},0),
		new Action(function(){introvideo.style.opacity = 1;}	,500),
		new Action(function(){hide("introvideo")}		,93000),
		new Action(function(time){return fadeOutAudio("introvideo",time);},93000),
		new Action(function(){stopPlay("introvideo")}				,93900)
	];
	actions.push(new Action(function(){
		introvideo.parentNode.removeChild(introvideo);
	},94000));
	return new Segment(actions,tracker);
}