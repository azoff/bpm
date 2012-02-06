var global = this;

$(document).ready(function(){
    
    module("Basic Setup");
    
    test("BPM Exists", function() {
        ok(global.hasOwnProperty('bpm'), 'BPM found on global object.');
    });

});