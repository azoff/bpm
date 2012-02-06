var global = this;

$(document).ready(function(){
    
    module("Initialization");
    
    test("Load BPM", 1, function() {
        ok(('bpm' in global), 'bpm found on global object');
    });
    
    asyncTest("Load package definitions", 2, function() {
        ok(('ready' in bpm), 'bpm.ready found');
        bpm.ready(function(){
            ok(bpm._db.count > 0, 'package definitions loaded');
            start();
        });
    });
    
    module("Installing");
    
    test('Ensure install method exists', 1, function(){
        ok(('install' in bpm), 'bpm.install found');
    });
    
    asyncTest("Load single library as string", 1, function(){
        bpm.install('dojo', function(){
            ok(!!this.dojo, 'dojo exists on window object');
            start();
        });
    });

});