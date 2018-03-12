# 4Free - Free Stuff Enhancements[4Free-FSE]
## Navigation
This folder contains QAJPYOtGo's MD5 filters for 4chanX, the .ts src folder, and the built user.js file in builds.<br/>
In the releases you can find individual scripts <a href="">as V0 : Individual Packages</a> or you can look here to see the current work on the combined Typescipt version.
## Future Developement
	Combine all into one master script relying entirely on 4chanX and it's API.
## About 4Free-FSE
4chanX-Free Stuff Enhancements is a userscript that operates with 4chanX to give it additional features. These enhancements were written by me from early 2017 up to 2018 as a way to teach myself how to work with JavaScript while giving something back to the community I took part in.
Some of these features are simple, like the password viewer, others are more complex using multiple concurent AJAX calls such as the thread rebuilder or the image adder. <br/>
Below is a description of the features this package has to offer.

### Danbooru Image Adder
#### Adds images to your posts
Adds an image to your post taken from the danbooru's image collection.<br/>
Supply it with tags via an autocomplete, set the rating(s/q/e) and it will give an image for you to post with. 

### 4chan-Ignoring-Enhancements
#### Hides images.
Gives the ability to hide images with ___ctrl+shift+click___. Stores in browser memory for new sessions.<br/>
Also includes over 20,000 MD5 filters of things like frogs, goldface, guro done by from QAJPYOtGo<br/>
https://github.com/ECHibiki/4chan-UserScripts/blob/master/MD5%20Filters%20by%20QAJPYOtGo.txt
#### Word Filters
Also includes the ability to do word replacements with a regex replacement system.<br>

### Thread Rebuilder
#### Rebuild dead threads from scratch
Rebuild a thread from 4chan's archive.<br/>
Simple system that could use some additions(using 4chan's offsite archives for example)

### Kita-Yen
#### Color text
Converts the colors of special symbols from plain black into other prettier colors(yen == purple, kita == dark grey).<br/>
#### Hotkeys for Convinience
<strong>Press ctrl+\ for ¥</strong>
Highlights the whole line in purple much like how greentext works<br/>
<strong>Press ctrl+k for ｷﾀ━━━(ﾟ∀ﾟ)━━━!!</strong>
Highlights just the word in dark gray<br/>
Plans are for these to also include custom inputs and colors.

### Visible Password
#### Shows your 4chan post/delete password
* Displays your 4chan password in an inputbox.
* Top left is the post password, Bottom right is the delete password.
* Edit the input boxes to change them.

__Note:__ some 4chan boards don't allow custom post passwords. May require cookie manipulation, but this has not yet been tested...
