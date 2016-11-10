jQuery(document).ready(function(){
	$(".displayUpload").fileinput({
		'language':'ja',
		'maxFileCount': 1,
		'uploadUrl': '/display/upload',
		'dropZoneEnabled': false,
		uploadExtraData: function() {
			var out = {};
			out.client = this.client;
			return out;
		}
	});
	$(".displayUpload").on('fileuploaded', function(event, data, previewId, index) {
    	var form = data.form, files = data.files, extra = data.extra,
        	response = data.response, reader = data.reader;
    	$(this).fileinput('clear');
    	$(this).fileinput('reset');
    	$('.uploaderContainer[data-index=' + $(this).data('index') + ']').addClass('hidden');
    	$('.uploadSuccess[data-index=' + $(this).data('index') + ']').removeClass('hidden');
	});

	$('.uploadSuccess button').click(function() {
		$('.uploadSuccess[data-index=' + $(this).data('index') + ']').addClass('hidden');
		$('.uploaderContainer[data-index=' + $(this).data('index') + ']').removeClass('hidden');
		return false;
	});

	$('.displayUpload').on('fileuploaderror', function(event, data, msg) {
    	var form = data.form, files = data.files, extra = data.extra,
        	response = data.response, reader = data.reader;
    	console.log('File upload error');
   		// get message
   		// TODO implement
   		alert(msg);
	});

  $('.confirm').click(function() {
    return confirm($(this).data('confirm'));
  });
});
