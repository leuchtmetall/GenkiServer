var developmentMode = false

var config = {};

var contentDisplayPath = '../content_display_data/'
config.contentDisplayPath = __dirname + '/' + contentDisplayPath;
config.contentDisplayPathShort = contentDisplayPath;

config.teachingMaterialsPath = __dirname + '/../data/';

config.displayFileTypes = ['pdf', 'm4v'];

if(developmentMode) {
	config.zeroconfTypeServer = "genkiserverdev"
	config.zeroconfTypeContent = "genkicontentdev"
} else {
	config.zeroconfTypeServer = "genkiserver"
	config.zeroconfTypeContent = "genkicontent"
}
module.exports = config;