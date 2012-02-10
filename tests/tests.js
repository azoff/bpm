var global = this;

$(document).ready(function(){
    
    module("bpm.ready");
    
    test("init", 1, function() {
        ok(('bpm' in global), 'bpm found on global object');
    });
    
    asyncTest("load package definitions", 2, function() {
        ok(('ready' in bpm), 'bpm.ready found');
        bpm.ready(function(){
            ok(bpm._db.count > 0, 'package definitions loaded');
            start();
        });
    });
    
    module("utils");
    
    test('ensure utils.each works', 2, function(){
        ok(('each' in bpm.utils), 'bpm.utils.each found');
        var sum = 0;
        bpm.utils.each([1,1,1], function(value){
            sum+=value;
        });
        equal(3, sum, 'each loop worked');
    });
    
    module("core");
    
    asyncTest("load single library as string", 5, function(){
        bpm.install('dojo', function(matches, urls){
            equal(matches.length, 1, 'dojo package installed');
            equal(urls.length, 1, 'dojo script installed');
            equal(matches[0].version, bpm.latest(matches[0].key), 'expected version installed');
            equal(urls[0], bpm.url(matches[0].key, matches[0].version), 'expected script installed');
            ok(('dojo' in global), 'dojo exists on window object');
            start();
        });
    });

    asyncTest("load a bad library", 2, function(){
        bpm.install(['jquery', 'camann', 'jqueryui'], null, function(error, match){
            equals(error, 'key', 'failed on key match');
            equals(match.key, 'camann', 'failed on the "camann" key');
            start();
        });
    });

    asyncTest("load two unrelated libraries", 1, function(){
        bpm.install(['caman', 'cufon'], function(matches, urls){
            equals(urls.length, 2, 'loaded both libraries');
            start();
        });
    });
    
    asyncTest("load single library with dependency", 2, function(){
        bpm.install('graphael', function(){
            ok(('Raphael' in global), 'Raphael exists on window object');            
            ok(('g' in global.Raphael.fn), 'Graphael exists on Raphael object');
            start();
        });
    });
    
    asyncTest("add and remove listeners", 3, function(){
        var listener = function(matches, url){    
            if (url) {
                ok(bpm.installed(matches[0].key), 'prototype installed');
            } else {
                equals(matches[0].key, 'prototype', 'installing prototype');
            }                 
        };
        bpm.addListener('install', listener);        
        bpm.addListener('installed', listener);
        bpm.install('prototype', function(){
            bpm.removeListener('install', listener);            
            bpm.removeListener('installed', listener);            
            bpm.install('scriptaculous', function(){
                ok(true, 'there should only be three assertions...');
                start();
            });
        });
    });
    
    module('packages');
    
    bpm.ready(function(){
        bpm.utils.each(bpm._db.keys, function(key){
            asyncTest(key, 1, function(){
                bpm.install(key, function(){
                    ok(bpm.installed(key), 'library installed!');
                    start();
                }, function(error){
                    equals(error, 'noop', 'noops are ok!');
                    start();
                });
            });
        });
    });
    

});