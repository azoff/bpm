bpm.init({
    
    backbone: {
        
        requires: 'underscore',
        
        versions: ['0.9.0'],
        
        cdn: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/${v}/backbone-min.js'
        
    },    
    
    caman: {
        
        versions: ['3.1.0'],
        
        cdn: '//cdnjs.cloudflare.com/ajax/libs/camanjs/${v}/caman.full.min.js'
        
    },
    
    cufon: {
        
        versions: ['1.09i'],
        
        cdn: '//cdnjs.cloudflare.com/ajax/libs/cufon/${v}/cufon-yui.js'
        
    },
    
    dojo: {
        
        versions: [
            '1.1.1', 
            '1.2.0', '1.2.3', 
            '1.3.0', '1.3.1', '1.3.2', 
            '1.4.0', '1.4.1', '1.4.3', 
            '1.5.0', '1.5.1', 
            '1.6.0', '1.6.1'
        ],
        
        cdn: {
            dev: '//ajax.googleapis.com/ajax/libs/dojo/${v}/dojo/dojo.xd.js.uncompressed.js',
            prod: '//ajax.googleapis.com/ajax/libs/dojo/${v}/dojo/dojo.xd.js'            
        }
        
    },
        
    ext: {
    
        versions: [
            '3.0.0', 
            '3.1.0'
        ],
    
        cdn: {
            dev: '//ajax.googleapis.com/ajax/libs/ext-core/${v}/ext-core.js',
            prod: '//ajax.googleapis.com/ajax/libs/ext-core/${v}/ext-core-debug.js'
        }
    
    },

    facebook: {
    
        cdn: '//connect.facebook.net/en_US/all.js'
    
    },
    
    galleria: {
        
        versions: ['1.2.6'],
        
        cdn: '//cdnjs.cloudflare.com/ajax/libs/galleria/${v}/galleria.min.js'
        
    },

    graphael: {
        
        requires: 'raphael',

        versions: ['0.4.1'],

        cdn: '//cdnjs.cloudflare.com/ajax/libs/graphael/${v}/g.raphael-min.js'

    },
        
    jquery: {
        
        versions: [
            '1.2.3', '1.2.6', 
            '1.3.0', '1.3.1', '1.3.2', 
            '1.4.0', '1.4.1', '1.4.2', '1.4.3', '1.4.4', 
            '1.5.0', '1.5.1', '1.5.2', 
            '1.6.0', '1.6.1', '1.6.2', '1.6.3', '1.6.4', 
            '1.7.0', '1.7.1'
        ],
        
        cdn: {
            dev: '//ajax.googleapis.com/ajax/libs/jquery/${v}/jquery.js',
            prod: '//ajax.googleapis.com/ajax/libs/jquery/${v}/jquery.min.js'
        }
        
    },
    
    jqueryui: {
        
        requires: 'jquery',
        
        versions: [
            '1.5.2', '1.5.3', 
            '1.6.0', 
            '1.7.0', '1.7.1', '1.7.2', '1.7.3', 
            '1.8.0', '1.8.1', '1.8.2', '1.8.4', '1.8.5', '1.8.6', '1.8.7', '1.8.8', '1.8.9', '1.8.10', '1.8.11' , '1.8.12' , '1.8.13', '1.8.14', '1.8.15', '1.8.16'
        ],
        
        cdn: {
            dev: '//ajax.googleapis.com/ajax/libs/jqueryui/${v}/jquery-ui.js',
            prod: '//ajax.googleapis.com/ajax/libs/jqueryui/${v}/jquery-ui.min.js'
        }
        
    },
    
    'js-signals': {
        
        versions: [],
        
        cdn: '//cdnjs.cloudflare.com/ajax/libs/js-signals/0.6.1/js-signals.min.js'
        
    },
        
    json2: {
        
        versions: ['20110223'],
        
        cdn: '//cdnjs.cloudflare.com/ajax/libs/json2/${v}/json2.js'
        
    },
    
    labjs: {
        
        versions: ['2.0.3'],
        
        cdn: '//cdnjs.cloudflare.com/ajax/libs/labjs/${v}/LAB.min.js'
        
    },

    less: {

        versions: ['1.1.5'],

        cdn: '//cdnjs.cloudflare.com/ajax/libs/less.js/${v}/less-${v}.min.js'

    },
    
    modernizr: {
        
        versions: ['2.0.6'],
        
        cdn: '//cdnjs.cloudflare.com/ajax/libs/modernizr/${v}/modernizr.min.js'
        
    },
    
    mootools: {
        
        versions: [
            '1.1.1', '1.1.2', 
            '1.2.1', '1.2.2', '1.2.3', '1.2.4', '1.2.5', 
            '1.3.0', '1.3.1', '1.3.2', 
            '1.4.0', '1.4.1'
        ],
        
        cdn: {
            dev: '//ajax.googleapis.com/ajax/libs/mootools/${v}/mootools-yui-compressed.js',
            prod: '//ajax.googleapis.com/ajax/libs/mootools/${v}/mootools.js'
        }
        
    },

    'prototype': {

        versions: [
            '1.6.0.2', '1.6.0.3', '1.6.1.0',
            '1.7.0.0'
        ],

        cdn: '//ajax.googleapis.com/ajax/libs/prototype/${v}/prototype.js'

    },

    pubnub: {

        versions: ['3.1.2'],

        cdn: '//cdnjs.cloudflare.com/ajax/libs/pubnub/${v}/pubnub.min.js'

    },
    
    raphael: {
        
        versions: ['2.0.1'],
        
        cdn: '//cdnjs.cloudflare.com/ajax/libs/raphael/${v}/raphael-min.js'
        
    },
    
    requirejs: {
        
        versions: ['0.26.0'],
        
        cdn: '//cdnjs.cloudflare.com/ajax/libs/require.js/${v}/require.min.js'
        
    },
    
    sammy: {
        
        versions: ['0.7.0'],
        
        cdn: '//cdnjs.cloudflare.com/ajax/libs/sammy.js/${v}/sammy.min.js'
        
    },

    scriptaculous: {

        requires: 'prototype',

        versions: [
            '1.8.1', '1.8.2', '1.8.3',
            '1.9.0'
        ],

        cdn: '//ajax.googleapis.com/ajax/libs/scriptaculous/${v}/scriptaculous.js'

    },
    
    scriptjs: {
        
        versions: ['1.3'],
        
        cdn: '//cdnjs.cloudflare.com/ajax/libs/script.js/${v}/script.min.js'
        
    },
    
    sizzle: {
        
        versions: ['1.4.4'],
        
        cdn: '//cdnjs.cloudflare.com/ajax/libs/sizzle/${v}/sizzle.min.js'
        
    },
    
    socketio: {
        
        versions: ['0.8.4'],
        
        cdn: '//cdnjs.cloudflare.com/ajax/libs/socket.io/${v}/socket.io.min.js'
        
    },
    
    spine: {
        
        versions: ['0.0.4'],
        
        cdn: '//cdnjs.cloudflare.com/ajax/libs/spinejs/${v}/spine.min.js'
        
    },

    swfobject: {

        versions: [
            '2.1',
            '2.2'
        ],

        cdn: {
            dev: '//ajax.googleapis.com/ajax/libs/swfobject/${v}/swfobject_src.js',
            prod: '//ajax.googleapis.com/ajax/libs/swfobject/${v}/swfobject.js'
        }

    },
    
    underscore: {
        
        versions: ['1.3.1'],
        
        cdn: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/${v}/underscore-min.js'
        
    },
    
    xui: {
        
        versions: ['2.0.0'],
        
        cdn: '//cdnjs.cloudflare.com/ajax/libs/xuijs/${v}/xui.min.js'
        
    },
    
    yepnope: {
        
        versions: ['1.0.1'],
        
        cdn: '//cdnjs.cloudflare.com/ajax/libs/yepnope/${v}/yepnope.min.js'
        
    },
    
    yui: {
        
        versions: [
            '3.0.0', 
            '3.1.0', 
            '3.2.0',
            '3.3.0',
            '3.4.0', '3.4.1'
        ],
        
        cdn: {
            dev: '//yui.yahooapis.com/${v}/build/yui/yui.js',
            prod: '//yui.yahooapis.com/${v}/build/yui/yui-min.js'
        }
        
    }
    
});