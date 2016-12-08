var app = angular.module('musicMod');

app.controller('musicCtrl', function($scope, $http, ytFactory){
	console.log("music controller!");

	// Create a variable to store the returned videoID in
	var stuff2 = ytFactory.getYTData();
	var ytArray =[];

	stuff2.items.forEach(function(vidData) {
		var newData =
			{
			vidID: vidData.id.videoId,
			title: vidData.snippet.channelTitle
		};
		ytArray.push(newData);
	});

	randomVevo(ytArray);
	var youtubeVidTitle;

	function randomVevo(ytArray){
	var youtubeStuff = ytArray[Math.floor(Math.random()*ytArray.length)];
	var findVevo = youtubeStuff.title.match(/VEVO/g);

	if (findVevo) {
		$scope.link = 'https://www.youtube.com/watch?v=' + youtubeStuff.vidID;
		console.log('vevothingsearch passed');
		youtubeVidTitle = youtubeStuff;
	} else {
		console.log('vevothingsearch failed');
		randomVevo(ytArray);
	}
}

// do {
// 	$scope.link = 'https://www.youtube.com/watch?v=' + youtubeStuff.vidID;
// } while (findVevo);

	// YouTube Embed
	// $scope.link = 'https://www.youtube.com/watch?v=' + youtubeStuff.vidID;

//lastFM
	//format YT data for LastFM API:
	var ytChannelData = youtubeVidTitle.title;
	//console.log(ytChannelData);

	var formattedYTString = ytChannelData.substr(0, ytChannelData.length-4);
	//console.log(formattedYTString);

	var lastFMQueryString = spacecamel(formattedYTString);

	//to remove camel case
	function spacecamel(s){
    	return s.replace(/([a-z])([A-Z])/g, '$1 $2');
	}

	//console.log(lastFMQueryString);

	$http.get('http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' +lastFMQueryString+ '&api_key=ccdf156dfa78f0a2462aa132687608f0&format=json')
			.then(function successCallback(response){

				//console.log(response.data);
				//console.log($scope.artistBio);
				//console.log(response.data);

				if(response.data.message === "The artist you supplied could not be found" || response.data.artist.bio.content === "") {

					$scope.artistBio = "Sorry, we could not find the artist's bio";
					//console.log(response.data.message);
				}
				else {

					$scope.artistBio = response.data.artist.bio.content;
				}

	});

	$http.get('http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=' + lastFMQueryString + '&autocorrect=1&api_key=ccdf156dfa78f0a2462aa132687608f0&format=json')
			.then(function successCallback(response){

				//console.log(response.data.topalbums);
				//console.log($scope.albumArray);

				//console.log(response.data);

				if(response.data.message === "The artist you supplied could not be found" || response.data.topalbums.album.length === 0) {

					$scope.showAlbumError = true;
					$scope.albumErrorMsg = 'Sorry, we could not find any top albums';
					//console.log(response.data.message);
					//console.log(response.data.topalbums);

				}
				else {

					$scope.showAlbumData = true;
					$scope.albumArray = response.data.topalbums.album;

				}

	});

	$http.get('http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=' + lastFMQueryString + '&api_key=ccdf156dfa78f0a2462aa132687608f0&format=json')
			.then(function successCallback(response){

				//console.log(response.data);
				//console.log($scope.simArtistArray);

				if(response.data.message === "The artist you supplied could not be found"  || response.data.similarartists.artist.length === 0) {

					$scope.showSimArtistError = true;
					$scope.simArtistErrorMsg = "Sorry, we could not find similar artists";
					//onsole.log(response.data.message);
					//console.log(response.data.similarartists);

				}
				else {
					//console.log(response.data.similarartists);
					$scope.showSimArtistData = true;
					$scope.simArtistArray = response.data.similarartists.artist;
				}

	});

});
