cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.facerecognition/www/facerecognition.js",
        "id": "com.facerecognition.FaceRecognition",
        "clobbers": [
            "FaceRecognition"
        ]
    }
];
module.exports.metadata =
// TOP OF METADATA
{
    "com.facerecognition": "0.0.1"
}
// BOTTOM OF METADATA
});