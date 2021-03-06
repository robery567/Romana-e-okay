/*
	Interprets expressions.
*/

app.controller('FiguriInterpreterCtrl', function ($scope, $http) {
	$scope.Figure = "";
	$scope.Descriptions;
	$scope.FigureType = "";
	$scope.PrincipalIdea = "";
	$scope.canBeSaved = false;
	$scope.Saved = true;

	function comp(a, b) {
		if (a.noDiacritics < b.noDiacritics) return -1;
		else if (a.noDiacritics == b.noDiacritics) return 0;
		return 1;
	}

	$http({method: 'GET', url: 'php/get_symbols.php'}).success(function(data, status, headers, config) {
		//gets symbols from database, removes diacritics for better search.
		//sorts symbols by .noDiacritics
		$scope.Descriptions = data;
		var len = $scope.Descriptions.length;
		for (var i = 0; i < len; i++) {
			$scope.Descriptions[i].noDiacritics = removeDiacritics($scope.Descriptions[i].name);
			$scope.Descriptions[i].noDiacritics = $scope.Descriptions[i].noDiacritics.toLowerCase();
		}
		$scope.Descriptions.sort(comp);
	});

	$scope.BinarySearch = function(symbol) {
		//binary searches user's symbol in dictionary
		a = symbol.name.toLowerCase();
		a = removeDiacritics(a);
		var left = 0, right = $scope.Descriptions.length - 1, middle, done = false;
		while (left <= right && !done) {
			middle = Math.floor((left + right) / 2);
			b = $scope.Descriptions[middle].noDiacritics;
			if (a == b) {
				done = true;
				symbol.name = $scope.Descriptions[middle].name;
				symbol.description = $scope.Descriptions[middle].description;
			}
			else if (a < b) right = middle - 1;
			else left = middle + 1;
		}
	}

	//initializing user's symbols and ideas
	$scope.Symbols = [
		{
			"name": "",
			"id": 0,
			"description": ""
		}
	];
	$scope.Ideas = [
		{
			"name": "",
			"description": "",
			"id": 0
		}
	]
	$scope.showDescriptions = false;
	$scope.SortableIdeas = [];
	$scope.showSortableIdeas = false;
	$scope.Checked = false;
	$scope.Okay = false;
	$scope.Error = "";
	$scope.wordCount = 0;

	$scope.AddSymbol = function() {
		//add symbol input to form
		$scope.showSortableIdeas = false;
		$scope.showDescriptions = false;
		$scope.Checked = false;
		$scope.Okay = false;
		$scope.Error = "";
		$scope.Symbols.push({
			"name": "",
			"id": $scope.Symbols[$scope.Symbols.length - 1].id + 1,
			"description": ""
		});
	}

	$scope.InterpretSymbols = function() {
		//search for symbols definitions in dictionary.

		$scope.showDescriptions = true;
		$scope.showSortableIdeas = false;
		$scope.Checked = false;
		$scope.Okay = false;
		$scope.Error = "";
		var pos = $(window).scrollTop();
		$('html, body').animate({scrollTop: pos + 300}, 'slow');
		var len = $scope.Symbols.length;
		for (var i = 0; i < len; i++)
			$scope.BinarySearch($scope.Symbols[i]);
	}

	$scope.AddIdea = function() {
		//add idea input to form
		$scope.showSortableIdeas = false;
		$scope.Checked = false;
		$scope.Okay = false;
		$scope.Error = "";
		$scope.Ideas.push({
			"name": "",
			"description": "",
			"id": $scope.Ideas[$scope.Ideas.length - 1].id + 1
		});
	}


	$scope.checkText = function(s) {
		//Checks if there are enough letters in string s to be considered valid
		
		var l = s.length;
		s = s.toLowerCase();
		var letters = 0;
		for (var i = 0; i < l; i++) {
			var code = s.charCodeAt(i);
			if ((code >= 97) && (code <= 122)) letters++;
		}
		if (letters < 3) return false;
		return true;
	}
	
	$scope.SymbolsCount = 0;
	$scope.IdeasCount = 0;

	$scope.BuildSortableIdeas = function() {
		//gets symbols definitions and user's ideas and builds a sortable list
		if ($scope.showDescriptions == false) $scope.InterpretSymbols();
		$scope.SortableIdeas = [];
		$scope.Checked = false;
		$scope.Okay = false;
		$scope.Error = "";

		var len = $scope.Symbols.length;
		for (var i = 0; i < len; i++)
			if ($scope.checkText($scope.Symbols[i].name) && $scope.checkText($scope.Symbols[i].description)) {
				$scope.SortableIdeas.push($scope.Symbols[i]);
				$scope.SymbolsCount++;
			}

		len = $scope.Ideas.length;
		for (var i = 0; i < len; i++)
			if ($scope.checkText($scope.Ideas[i].description)) {
				$scope.SortableIdeas.push($scope.Ideas[i]);
				$scope.IdeasCount++;
			}
		$scope.showSortableIdeas = true;
		var pos = $(window).scrollTop();
		$('html, body').animate({scrollTop: pos + 200 * $scope.Ideas.length + 100}, 'slow');
	}

	

	$scope.Check = function() {
		//checks if input is valid
		$scope.Okay = true;
		$scope.Error = "";
		if (!$scope.checkText($scope.Figure)) {
			$scope.Okay = false;
			$scope.Error += "Nu ai completat corect figura de stil. ";
		}
		if ($scope.FigureType == "") {
			$scope.Okay = false;
			$scope.Error += "Nu ai ales tipul figurii de stil."
		}
		$scope.Checked = true;
	}

	$scope.Result = "";

	$scope.Tags = "";

	$scope.saveHomework = function() {
		//save comment to database if user is logged in
		addHomework($scope.Result, $scope.Tags);
		$scope.Saved = true;
		$scope.canBeSaved = false;
	}
	
	$scope.BuildComment = function() {
		//checks if input is valid and builds comment.
		$scope.Check();
		if ($scope.Okay == false) return;
		$scope.Result = "";
		$scope.Result = "Secvența „" + $scope.Figure + "” conține " + $scope.FigureType;
		if ($scope.checkText($scope.PrincipalIdea)) $scope.Result += " ce exprimă " + $scope.PrincipalIdea + ". ";
		else $scope.Result += ". ";

		var len = $scope.SortableIdeas.length;
		var currentSymbol = 0;

		for (var i = 0; i < len; i++) {
			var idea = $scope.SortableIdeas[i];
			if (idea.name != "") {
				//simbol
				currentSymbol++;
				if (currentSymbol == 1) {
					$scope.Result += "Un prim simbol ce apare în secvență este reprezentat de " + idea.name + ". ";
					$scope.Result += idea.description + " ";
				}
			}
			else $scope.Result += idea.description + " ";
		}
		var pos = $(window).scrollTop();
		$('html, body').animate({scrollTop: pos + 200}, 'slow');
		$scope.wordCount = countWords($scope.Result);
		$scope.canBeSaved = true;
		$scope.Saved = false;
		$scope.Tags = $scope.Tags.replace("script", "");
	}

	$scope.Reset = function() {
		//reset input
		var deleteEverything = confirm("Sigur vrei să ștergi tot comentariul?");
		if (deleteEverything == true) {
			$scope.Tags = "";
			$scope.Result = "";
			$scope.SymbolsCount = 0;
			$scope.IdeasCount = 0;
			$scope.Symbols = [
				{
					"name": "",
					"id": 0,
					"description": ""
				}
			];
			$scope.Ideas = [
				{
					"name": "",
					"description": "",
					"id": 0
				}
			]
			$scope.showDescriptions = false;
			$scope.SortableIdeas = [];
			$scope.showSortableIdeas = false;
			$scope.Checked = false;
			$scope.Okay = false;
			$scope.Error = "";	
			$scope.Figure = "";
			$scope.FigureType = "";
			$scope.PrincipalIdea = "";
			$scope.wordCount = 0;
			$scope.canBeSaved = false;
			$scope.Saved = true;
			scrollToTop();
		}
	}
});