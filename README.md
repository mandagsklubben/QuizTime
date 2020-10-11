# QuizTime
Html-based app for producing Måndagsklubben Music Quiz. This repository isn't always kept up-to-date, if you are interested in the latest version come yell at Zaz#8380 in https://discord.gg/vSCn2tZ


If you wish to make your own quiz, these are generally the steps:

# Step 1
Find 21 music tracks that you can write questions to. The music is from a game or movie, or associates with it, or is a remix of something.

# Step 2
Find good reveal/answer videos. Trawl through youtube, collect 21 of them in a playlist. While doing this, also be on the lookout for good drop-moments/reveal-moments. If the videos already contain the music from step 1, so much the better.

If you can't find any good reveal videos, you may have to cut together your own. Try downloading Davinci Resolve and give it the ol' college try. You only need some 20+ seconds of video.

# Step 3
Make a list of timestamps. Go through the music tracks in the list, and find one good moment - like where the refrain kicks in - in each. Note the timestamps in a text file, in order. Try to get timestamps around 60 seconds into the music. 40-80 seconds are ok, but 50-60 is best. Save the text file as data.js in a subfolder in this directory.

	45
	64
	59
	50
	39

# Step 4
Amend the timestamp list with the question/answer combo for each video. One day we'll have a script that outputs the json result, but for now:

	{
		"question":"Name of Internet Personality",
		"answer":"Neil Cicirega",
		"revealaudio":60
	},
	...

# Step 5
Run youtube 4K video downloader, download the videos from the playlist. You can - either - write the full filenames into the json - or - rename the files to match existing json. If the audio comes from the video, that is enough, otherwise also add the audio file name.

	{
		"videofile": "questions/example-two/02.mp4",
		"audiofile": "questions/example-two/02.mp3",
		"question":"Name of Internet Personality",
		"answer":"Neil Cicirega",
		"revealaudio":60
	},
	...

# Step 6
Search and find hint images for all questions, save them, enter the file names into the json.

	{
		"videofile": "questions/example-two/02.mp4",
		"audiofile": "questions/example-two/02.mp3",
		"question":"Name of Internet Personality",
		"answer":"Neil Cicirega",
		"hintfile":"questions/example-two/puppetpals.jpg",
		"revealaudio":60
	},
	...

# Step 7
Create subfolders for your questions and save the json objects as javascript objects in files named q.js. Look at the existing files for hints and details on which other propeties can go in the data file. Also grab the settings object from the top of that file, and add it as well. Change titles and the text color to something that fits.

# Step 8
Make an intro video, with good music. If you have insane luck, you can find something premade on youtube. Most likely you will have to cut together your own 90-ish second long intro.

# Step 9
Add a line `<label><input type="radio" name="quizchoice" /> foldername</label><br>` to the menu section of index.html, with your own quiz folder name in there.
