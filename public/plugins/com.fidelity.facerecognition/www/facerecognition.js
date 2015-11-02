cordova.define("com.facerecognition.FaceRecognition", function(require, exports, module) { var FaceRecognition = {
     recognitionANumber: function(success, fail, types) {
          return cordova.exec(success, fail, "FaceRecognition", "recognitionANumber", types);
     }
};

module.exports = FaceRecognition;
});
