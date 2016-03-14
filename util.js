var fs = require('fs');
var promise = require('promise');
var path = require('path');
var imagediff = require('imagediff');
var canvas = require('canvas');

var util = module.exports = {
    parseStringToPNG: function (s) {
        var image = new canvas.Image;
        image.src = 'data:image/  png;base64,' + s;
        var cnvs = new canvas(image.width, image.height);
        cnvs.getContext('2d').drawImage(image, 0, 0);
        return cnvs;
    },

    compare: function (captures) {
        /*
         * Compares pages for perceptual differences, and saves an imagediff if pages are not equal
         * captures Array An array containing two snapshots
         *
         * returns: boolean representing page equality
         */
        return promise.all(captures).then(function (screens) {
            screens = _.map(screens, util.parseStringToPNG);
            var equal = imagediff.equal(screens[0], screens[1]);
            if (!equal) {
                var diff = imagediff.diff(screens[0], screens[1]);
                var filepath = path.resolve(__dirname + '/screenshots/screen' + Date.now() + '.png');
                imagediff.imageDataToPNG(imagediff.toImageData(diff), filepath);
            }
            return equal;
        });
    }
}
