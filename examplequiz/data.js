// grabbing raw json files off disk is somewhat fraught in different browsers, security and whatnot,
// so for now, this is a js file instead of a json file, grabbed by <script> which at least firefox allows

	// color property supports
	// webcolor names
	// #aabbcc
	// #abc
	// rgb(100,255,0)
	// rgba(100,255,0,255)
var _settings = {
	"color":"pink",
	"quizname":"Random Quiz #33",
	"introtagline":"More Music Quiz, For the People!",
	"introcredit":"&quot;Music name&quot; by Artist Name",
	"defaultextratext":"Listen to the song<br>Wait for visual clue",
	"extratext":[ // the priority for extra text is #1 this, #2 extratext property on data object, #3 defaultextratext property
		null,
		"Almost too easy<br>Wait for visual clue",
		"Let's try another<br>Wait for visual clue",
		"You know the drill<br>Wait for visual clue",
	],
	"backgroundvideo":"examplequiz/bgloop.mp4",
	"quiznumber":"0" // this is just a version number
};



var _breaks =[
	{
		"breaklength":60*8, // override default break length
		"plays":[]
	},{
		"plays":[
			{
				"audiofile":"music.mp3"
			}
		]
	}
]


// data array object properties:

// NOTE: all video files are asssumed to be mime type video/mp4 for now

// these should be obvious:

// "question":"Name of Video Game?",
// "answer":"Pong",
// "answer2":"Music: &quot;Pongmix&quot;<br>by Artist Musicperson",
// "videofile":"examplequiz/01.mp4",
// "hintfile":"examplequiz/01.jpg",

// this may be less obvious, it is the "wait for visual clue" instruction text
// "extratext":"You know the drill<br>Wait For Visual Clue",

// if the reveal video does not use the audio you wish to use, add
// "audiofile":"examplequiz/01.mp3",
// now this will be used everywhere instead. videofile audio will be muted always.

// to display the remix obfuscation symbol
// "isremix":true,

// hints are assumed to be images, but hints can also be video
// "hintfile":"hintvideo.mp4",
// "hintvideo":true,


// what about placement?
// default should be all images and videos added center on display area and guarantee cover it. I've tested it for images at least. Video aspect ratios could be a problem.
// the hintcss property can be any css you want except transition, z-index and opacity.
// there are also some classes you can use with the hintclass property
// if you want the image in a smaller size and centered in the middle instead you can add
// "hintclass":"largehint",
// if you want smaller size, and centered in the middle, but also down a little bit because the text covers the hint
// "hintcss":"top: 275px",
// "hintclass":"largehint centerHorizontally",

// sizing classes largehint, mediumhint, and smallhint are available


// configurable timestamps:
// all timestamps are in seconds, relative to whatever media they apply to

// a question has
// audio [audiofile or videofile]
// hint (img or video) [hintfile]
// reveal video [videofile]

// the reveal video and the audio can be the same file
// if that is the case, just ignore the audiofile property, it will default to using videofile instead

// a question is shown 3 times: regular, repeat, reveal

// regular has
// start audio [regularstart]
//		defaults to 0
//		is the timestamp in the audio where we fade in
// hint reveal [regularhint]
//		defaults to whatever the answer revealaudio moment is set to
//		the timestamp in the audio when we show the hint
//		(hint video start marker can be assumed to be synced with audio start until we get a case which proves otherwise)
// end moment, next question [regularend]
//		timestamp in the audio where we fade out
//		defaults to 100s after regularstart

// repeat has
// start repeat audio marker [repeat]
//		defaults to regularhint (which in turn defaults to revealaudio)
//		hint video start marker can be assumed to be synced with audio start until we get a case which proves otherwise
//		repeat is always 10s, so no end marker used - but could easily be extended i suppose

// reveal has
// the answer reveal moment [revealaudio]
//		the moment in the audio the hint fades and it cuts to the video with the answer
//		possibly the most important moment to customize, all others can most likely fall in place on their defaults, but not this. has a default value of 50 anyway.
//		if audio and video are the same file, this is also the moment in the video where it will start playing
//		if audio and video are the same file, do not set both audiofile and videofile to the same file. just ignore the audiofile property, it defaults to videofile for audio.
// audio start marker [revealaudiostart]
//		defaults to 20s before revealaudio
//		where audio will fade in
// video reveal timestamp [revealvideo]
//		defaults to revealaudio
//		if you use separate video and audio, this is the moment in the video we fade in to when revealing the answer
// audio fade out moment [revealaudioend]
//		defaults to 20 after revealaudio
//		the timestamp in the audio where we fade out, and proceed to the next answer




var _data = Array(21)

var qs=[
	"example-one",
	"example-two",
	"example-three",
	"example-four",
	"example-five",
	"example-six",
	"example-seven",

	"example-8",
	"example-9",
	"example-10",
	"example-11",
	"example-12",
	"example-13",
	"example-14",

	"example-question",
	"example-these",
	"example-can",
	"example-be",
	"example-named",
	"example-whatever",
	"example-lol",
]

function register(d){
	for(let q in qs)
	{
		if(d.videofile.indexOf(`/${qs[q]}/`) != -1)
		{
			_data[q]=d
			return
		}
	}
}

for( let qname of qs ){
	let path = `questions\\${qname}\\q.js`
	loadScriptFile(path);
}
