var global = this;

$(document).ready(function(){
    
    module("bpm.ready");
    
    test("load bpm", 1, function() {
        ok(('bpm' in global), 'bpm found on global object');
    });
    
    asyncTest("load package definitions", 2, function() {
        ok(('ready' in bpm), 'bpm.ready found');
        bpm.ready(function(){
            ok(bpm._db.count > 0, 'package definitions loaded');
            start();
        });
    });
    
    module("bpm.utils");
    
    test('ensure utils object exists', 1, function(){
        ok(('utils' in bpm), 'bpm.utils found');
    });
    
    test('ensure utils.each works', 2, function(){
        ok(('each' in bpm.utils), 'bpm.utils.each found');
        var sum = 0;
        bpm.utils.each([1,1,1], function(value){
            sum+=value;
        });
        equal(3, sum, 'each loop worked');
    });
    
    module("bpm.install");
    
    test('ensure install method exists', 1, function(){
        ok(('install' in bpm), 'bpm.install found');
    });
    
    asyncTest("load single library as string", 1, function(){
        bpm.install('dojo', function(){
            ok(!!global.dojo, 'dojo exists on window object');
            start();
        });
    });
    
    asyncTest("load single library with dependency", 3, function(){
        ok(delete global.jQuery, 'deleted existing jQuery');
        bpm.install('jqueryui', function(){
            ok(!!global.jQuery, 'jQuery exists on window object');
            ok(!!global.jQuery.ui, 'jQuery.ui exists on window object');
            start();
        });
    });
    
    module('package');
    
    bpm.ready(function(){
        bpm.utils.each(bpm._db.keys, function(key){
            asyncTest(key, 1, function(){
                bpm.install(key, function(){
                    ok(true, 'passed!');
                    start();
                });
            });
        });
    });
    

});