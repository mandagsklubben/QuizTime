
register({
	"videofile":"questions/example-one/reveal.mp4",
	"audiofile":"questions/example-one/music.mp3",
	"question":"Name of Video Game?",
	"answer":"Game Name",
	"answer2":"Music: &quot;musicthing&quot; by Whoever",
	"hintfile":"questions/example-one/hint.webp",
	"revealaudio":45,
});

/*



// minimal question data
// here, the videofile already contains the audio to play
{
	"videofile":"examplequiz/01.mp4",
	"question":"Name of Thing?",
	"answer":"Cobra",
	"hintfile":"examplequiz/hint01.png",
	"revealaudio":73,
},

// same example, but with separate audio track
{
	"videofile":"examplequiz/02.mp4",
	"audiofile":"examplequiz/02.mp3",
	"question":"Name of Thing?",
	"answer":"Cobra",
	"hintfile":"examplequiz/imagefromgooglesearch.png",
	"revealaudio":47,
	"revealvideo":4
},

// example with video hint, in this case the hint is also the audio, but that is not required
// note the very early hint reveal timestamp, to show the hint video immediately
{
	"videofile":"examplequiz/03.mp4",
	"audiofile":"examplequiz/hintvideo.mp4",
	"question":"Name of Thing?",
	"answer":"Cobra",
	"hintfile":"examplequiz/hintvideo.mp4",
	"hintvideo":true,
	"regularhint":1,
	"revealaudio":74
},

// question, answer, and answer2 can contain html
{
	"videofile":"examplequiz/04.mp4",
	"question":"Name of Thing?",
	"answer":"<span style='font-size:90px'>The Extra Long Name that wont fit on the screen properly</span>",
	"answer2":"from Cobra",
	"hintfile":"examplequiz/hint3393.jpg",
	"revealaudio":45
},

//question with the remix logo in the corner
{
	"videofile":"examplequiz/05.mp4",
	"question":"Name of Thing?",
	"answer":"Cobra",
	"answer2":"from Cobra",
	"isremix":true,
	"hintfile":"examplequiz/hint05.png",
	"revealaudio":73
},

// question with a custom extratext message (it will default to using what is set in the settings object above)
{
	"videofile":"examplequiz/06.mp4",
	"question":"Name of Thing?",
	"answer":"Cobra",
	"answer2":"from Cobra",
	"extratext":"Isn't this nice<br>Wait for visual clue",
	"hintfile":"examplequiz/hint06.png",
	"revealaudio":73
},

// for question 7 (and question 14) the audio will not fade at "regularend", but rather continue into the break.
// if the hint is video, the video will also keep playing into the break
{
	"videofile":"examplequiz/07.mp4",
	"question":"Name of Thing?",
	"answer":"Cobra",
	"answer2":"from Cobra",
	"hintfile":"examplequiz/hint07.png",
	"revealaudio":55,
},

// question with all the timing properties set, which is usually unneccesary, but here for reference
{
	"videofile":"examplequiz/08.mp4",
	"question":"Name of Thing?",
	"answer":"Cobra",
	"answer2":"from Cobra",
	"hintfile":"examplequiz/hint08.png",
	"regularstart":0,
	"regularhint":60,
	"regularend":100,
	"repeat":60,
	"revealaudiostart":40,
	"revealaudio":60,
	"revealvideo":60,
	"revealaudioend":80,
},


// question with a non-cover hint file, manually adjusted down
{
	"videofile":"examplequiz/09.mp4",
	"question":"Name of Thing?",
	"answer":"Cobra",
	"answer2":"from Cobra",
	"hintfile":"examplequiz/hint06.png",
	"hintcss":"top: 275px",
	"hintclass":"largehint centerHorizontally",
	"revealaudio":73
},


// notice: if your revealaudio is rather low, you should set a manual regularhint to get closer to a 69s/30s setup when the question is presented.
// since regularhint defaults to the revealaudiovalue this can otherwise accidently hint too early or too late, or not at all.
{
	"videofile":"examplequiz/10.mp4",
	"question":"Name of Thing?",
	"answer":"Cobra",
	"answer2":"from Cobra",
	"hintfile":"examplequiz/hint10.png",
	"regularhint":65,
	"revealaudio":33
},

// you will need a total of 21 questions in this array


// the final question should have revealaudioend set to the moment in the audio that the quiz ends on
{
	"videofile":"examplequiz/21.mp4",
	"question":"Name of Last Question?",
	"answer":"answer",
	"hintfile":"examplequiz/21.jpg",
	"revealaudio":33,
	"revealaudioend": 4*60+20
}
*/