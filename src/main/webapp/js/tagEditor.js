var ariadne = {
	files : {},
	templates : {},
}

Handlebars.registerHelper('list', function(items, options) {
	var out = '<ul class="dropdown-menu">';
	for ( var element in items) {
		var value = options.fn({
			'name' : element
		});
		// var handler = '$(\'#input_' + this.type + '\').val(\'' + value
		// + '\');';
		var handler = "dropDownSelectionHandler('" + this.type + "', '" + value
				+ "');";
		out = out + '<li><a onclick="' + handler + '">' + value + "</a></li>";
	}
	return out + "</ul>";
});

$(document).ready(
		function() {
			showScanSummary();
			applyFilter({
				'artist' : '*'
			});
			ariadne.templates.tageditorControls = Handlebars.compile($(
					"#tageditor-controls-template").html());
			selectedFileChangedHandler();
		});

function startScanner() {
	$("#scanner_running").show();

	var scan;

	$.ajax({
		url : "http://localhost:8080/ariadne/service/scan",
		type : "POST",
		success : function($data) {
			showScanSummary($data);
		},
		error : function($data) {
			console.log("Cannot post new scan");
		}
	});

}

function showScanSummary() {
	$.ajax({
		url : "http://localhost:8080/ariadne/service/scan",
		type : "GET",
		success : function($data) {
			if (typeof $data.scanId !== 'undefined' && $data.scanId != null) {

				var text = "";

				if ($data.finish == null) {
					text = "Scanner running";
				} else {
					var date = new Date($data.start);
					text = "Files scaned on " + date;
				}

			} else {
				text = "No files in database";
			}

			$("#scan_summary").text(text);
		},
		error : function($data) {
			console.log('Cannot fetch last scan');
		}
	});
}

function applyFilter(filter) {
	if ((filter === null) || (typeof (filter) == 'undefined')) {
		filter = {
			"firstResult" : 0,
			"maxResults" : 30
		};

		if ($('#filterEnableArtist').prop('checked') == true) {
			filter.artist = $("#filterInputArtist").val();
		}
		if ($('#filterEnableAlbum').prop('checked') == true) {
			filter.album = $("#filterInputAlbum").val();
		}
		if ($('#filterEnableGenre').prop('checked') == true) {
			filter.genre = $("#filterInputGenre").val();
		}
		if ($('#filterEnableTitle').prop('checked') == true) {
			filter.title = $("#filterInputTitle").val();
		}
		if ($('#filterEnableYear').prop('checked') == true) {
			filter.year = $("#filterInputYear").val();
		}
		if ($('#filterEnableTrack').prop('checked') == true) {
			filter.track = $("#filterInputTrack").val();
		}
	}

	$("#file_list").empty();

	$.ajax({
		url : 'http://localhost:8080/ariadne/service/filter',
		data : JSON.stringify(filter),
		type : 'POST',
		contentType : "application/json",
		success : function(data) {

			ariadne.files = {};

			var fileList = "";
			for (var i = 0; i < data.length; i++) {
				ariadne.files[data[i].fileId] = data[i];
				$('#file_list').append(
						'<option value="' + data[i].fileId + '">'
								+ basename(data[i].path) + '</option>');
			}
		},
		errors : function(data) {
			console.log("Filter crashed...");
		}
	});
}

/**
 * HTML-Handler implementation 
 * 
 * Called whenever the selection state of the File-select changes. 
 */
function selectedFileChangedHandler() {
	
	initializeSelectedFiles();

	updateTagInputgroup('artist');
	updateTagInputgroup('album');
	updateTagInputgroup('title');
	updateTagInputgroup('genre');
	updateTagInputgroup('year');
	updateTagInputgroup('track');

	$('#tageditor_input_file').val(ariadne.selectedFiles.mainFile);
	
	var fileCount = ariadne.selectedFiles.count;
	var text = '' + ariadne.selectedFiles.mainFile + '&nbsp;';
	if (fileCount > 1) {
		text += "(" + fileCount + " files total)";
	}
	$("#selectedFileDiv").html(text);

	if (typeof ariadne.selectedFiles.image === 'undefined') {
		$("#ItemPreview").hide();
		document.getElementById("ItemPreview").src = "";
	} else {
		document.getElementById("ItemPreview").src = "data:image/png;base64,"
				+ ariadne.selectedFiles.image;
		$("#ItemPreview").show();
	}
}

/**
 * CSS Handler: Called if a value in the selected-values-dropwown is selected
 **/
function dropDownSelectionHandler(type, value) {
	$("#input_" + type).val(value);
	updateTageditorDecorations(type);
}

/**
 * CSS-handler implementation. 
 * Called whenever the value of a tageditor input changed
 */
function tageditorChangedHandler(type) {
	updateTageditorDecorations(type)
}

/**
 * onclick-handler: Called when the user clicks the reset button
 */
function resetChangesHandler() {
	resetChanges(getSelectedMainId());
}

/**
 * onclick-handler: Called when the user clicks the reset all button
 */
function resetAllChangesHandler() {
	for (id in getSelectedFileIds()) {
		resetChanges(id);
	}
}

function resetChanges(id) {
	console.log("Resetting " + id);
	ariadne.files[id]['changes'] = {
		'artist': null, 
		'album': null, 
		'title': null, 
		'image': null,
		'track': null,
		'year': null
	};

	selectedFileChangedHandler();
}

function getSelectedMainId() {
	return Object.keys(ariadne.selectedFiles.id)[0];
}

function getSelectedFileIds() {
	return ariadne.selectedFiles.id;
}

function updateTagInputgroup(type) {
	var selected = ariadne.selectedFiles[type];
	var id = Object.keys(ariadne.selectedFiles.id)[0];
	var changed = isUncommittedChange(id, type);

	var context = {
		'selected' : selected,
		'value' : Object.keys(selected)[0],
		'type' : type,
		'caption' : type,
		'changed' : changed
	}

	var value = Object.keys(selected)[0];

	$("#tageditor_" + type).html(ariadne.templates.tageditorControls(context))

	if (changed.changed) {
		$("#input-addon-" + type).addClass('changed');
	}

	$('#input_' + type).val(value);

	updateTageditorDecorations(type);
}


/**
 * Updated tag editor input decorations - 
 * a drop down menu with all selected values for this input, 
 * a badge indicating the number of affected files 
 * and an apply button
 */
function updateTageditorDecorations(type) {
	var selected = ariadne.selectedFiles[type];
	var value = $("#input_" + type).val();

	var affectedFiles = 0;
	for (currentValue in selected) {
		if (currentValue != value) {
			affectedFiles += selected[currentValue];
		}
	}

	$("#badge_" + type).text(affectedFiles);
}

/**
 * Checks whether an input contains a change that is 
 * not yet written into the physical file.
 */
function isUncommittedChange(id, type) {
	var id = Object.keys(ariadne.selectedFiles.id)[0];

	if (id == null) {
		return false;
	}

	var originalValue = ariadne.files[id].tags[type];
	var currentValue = ariadne.files[id].changes[type];
	var changed = false;
	if ((currentValue != null) && (currentValue != originalValue)) {
		changed = true;
	}
	return {
		changed : changed,
		original : originalValue,
		current : currentValue
	}
}

function persistTagValue(type) {
	var field = type;
	var value = $("#input_" + type).val();

	for (id in ariadne.selectedFiles.id) {
		var requestData = {};

		requestData['fileId'] = id;
		requestData['tags'] = {};
		requestData['tags'][field] = value;

		$.ajax({
			url : "http://localhost:8080/ariadne/service/tag",
			type : "PUT",
			id : id,
			field : field,
			value : value,
			contentType : "application/json",
			data : JSON.stringify(requestData),
			success : function($data) {
				ariadne.files[this.id]['changes'][this.field] = this.value;
				selectedFileChangedHandler();
			},
			error : function($data) {
				console.log("Cannot update tag");
			}
		});
	}
}

function _countMembers(object) {
	if (typeof object !== 'object') {
		return 0;
	}

	var counter = 0;
	for (element in object) {
		counter++;
	}
	return counter;
}

function basename(str) {
	var base = new String(str).substring(str.lastIndexOf('/') + 1);
	if (base.lastIndexOf(".") != -1)
		base = base.substring(0, base.lastIndexOf("."));
	return base;
}

function initializeSelectedFiles() {

	var selected = $("#file_list").find(":selected");

	var dim = selected.get("length");

	var artists = {};
	var albums = {};
	var titles = {};
	var genres = {};
	var years = {};
	var tracks = {};
	var ids = {};

	function add(set, element, override) {

		var effective = element;
		if (override != null) {
			effective = override
		}

		if (set[effective] == null) {
			set[effective] = 1;
			return;
		}

		set[effective] += 1;
	}

	for (i = 0; i < dim; i++) {
		var idSelected = selected.get(i).value;
		var selectedFile = ariadne.files[idSelected];

		add(artists, selectedFile.tags.artist, selectedFile.changes.artist);
		add(titles, selectedFile.tags.title, selectedFile.changes.title);
		add(albums, selectedFile.tags.album, selectedFile.changes.album);
		add(genres, selectedFile.tags.genre, selectedFile.changes.genre);
		add(years, selectedFile.tags.year, selectedFile.changes.year);
		add(tracks, selectedFile.tags.track, selectedFile.changes.track);
		add(ids, idSelected);
	}

	var result = {
		'id' : ids,
		'artist' : artists,
		'album' : albums,
		'title' : titles,
		'genre' : genres,
		'year' : years,
		'track' : tracks,
		'count' : dim
	};

	var image = null;
	if (dim > 0) {
		image = ariadne.files[selected.get(0).value].image;
		result.mainFile = selected.get(0).text;
	} else {
		result.mainFile = "";
	}

	if (image !== null) {
		result.image = image
	}

	ariadne.selectedFiles = result;
}
