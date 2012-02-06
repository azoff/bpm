bpm.init({
    
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
            dev: 'https://ajax.googleapis.com/ajax/libs/dojo/${v}/dojo/dojo.xd.js.uncompressed.js',
            prod: 'https://ajax.googleapis.com/ajax/libs/dojo/${v}/dojo/dojo.xd.js'            
        }
        
    },
    
    ext: {
        
        versions: [
            '3.0.0', 
            '3.1.0'
        ],
        
        cdn: {
            dev: 'https://ajax.googleapis.com/ajax/libs/ext-core/${v}/ext-core.js',
            prod: 'https://ajax.googleapis.com/ajax/libs/ext-core/${v}/ext-core-debug.js'
        }
        
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
            dev: 'https://ajax.googleapis.com/ajax/libs/jquery/${v}/jquery.js',
            prod: 'https://ajax.googleapis.com/ajax/libs/jquery/${v}/jquery.min.js'
        }
        
    },
    
    jqueryui: {
        
        requires: ['jquery'],
        
        versions: [
            '1.5.2', '1.5.3', 
            '1.6.0', 
            '1.7.0', '1.7.1', '1.7.2', '1.7.3', 
            '1.8.0', '1.8.1', '1.8.2', '1.8.4', '1.8.5', '1.8.6', '1.8.7', '1.8.8', '1.8.9', '1.8.10', '1.8.11' , '1.8.12' , '1.8.13', '1.8.14', '1.8.15', '1.8.16'
        ],
        
        cdn: {
            dev: 'https://ajax.googleapis.com/ajax/libs/jqueryui/${v}/jquery-ui.js',
            prod: 'https://ajax.googleapis.com/ajax/libs/jqueryui/${v}/jquery-ui.min.js'
        }
        
    }
    
});