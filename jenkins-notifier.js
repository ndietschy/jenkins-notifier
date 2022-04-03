var runningJob, successAudio, unstableAudio, failAudio, htmlContent;
var played = 0;
var i=0;
var title = document.title;
var waitTime = 3000; // ms à attendre entre chaque recherche dans la page


if(navigator.userAgent.indexOf("Chrome") != -1 ) {
	successAudio = chrome.runtime.getURL('src/success.mp3');
	unstableAudio = chrome.runtime.getURL('src/unstable.mp3');
	failAudio = chrome.runtime.getURL('src/fail.mp3');		
} 
else if(navigator.userAgent.indexOf("Firefox") != -1 ) {
	successAudio = browser.runtime.getURL('src/success.mp3');
	unstableAudio = browser.runtime.getURL('src/unstable.mp3');
	failAudio = browser.runtime.getURL('src/fail.mp3');
}
else {
	console.log("Browser is not supported")
}

function playSound(audioUrl) {
  	const audio = new Audio(audioUrl);
  	audio.play();
}

function analyzeHTML(content){
	if(content.includes("Success")){
		playSound(successAudio);
	}
	else if(content.includes("Failed")){
		playSound(failAudio);
	}
	else{
		playSound(unstableAudio);
	}
}

function getElementByXpath(path) {
	return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
  
function searchPage(){

	if(window.location.href.endsWith("console")){
		console.log("Console view i=" + i);
		// Si la page contient Finished
		console.log((document.documentElement.innerText).indexOf('Finished: SUCCESS'));
		if ((document.documentElement.textContent || document.documentElement.innerText).indexOf('Finished:') > -1) {
			console.log("Job Finished !");
			if(i == 0){
				played = 1;
				console.log("Job already finished");
			}
			// Si Finished n'a pas été trouvé dans un premier temps (on évite de jouer le son à chaque fois qu'on ouvre un log)
			else if(i > 0 && played == 0){
				console.log("play sound")
				if ((document.documentElement.innerText).indexOf('Finished: SUCCESS') > -1) {
					playSound(successAudio);				
				}
				else if ((document.documentElement.textContent || document.documentElement.innerText).indexOf('Finished: UNSTABLE') > -1) {
					playSound(unstableAudio);				
				}
				else {
					playSound(failAudio);				
				}
				played = 1;
				var newTitle = '(!) ' + title;
				document.title = newTitle;
			}
		}
	i++;
	}
	else{
		console.log("Jobs view");
		if (document.getElementsByClassName("progress-bar ").length > 1) {
			console.log("Job is in progress");
			runningJob = true;
		}
		else {
			if(runningJob){
				// --- Fonctionne pas trop ----
				//console.log("Récupération du statut du dernier job");
				//htmlContent = getElementByXpath("//html/body/div[4]/div[1]/div[2]/div[2]/div[2]/table/tbody/tr[2]").innerHTML;
				//console.log("html content : "+htmlContent);
				//analyzeHTML(htmlContent);
				// ----------------------------
				var newTitle = '(!) ' + title;
				document.title = newTitle;			
				playSound(successAudio);
			}
			runningJob = false;
			console.log("No job is running");
		}
	}
	setTimeout(searchPage, waitTime);
}

searchPage();
