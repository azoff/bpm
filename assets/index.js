(function(global, bpm, undef){
    
    function repl(console) {
        console.Prompt(true, function(input) {
            try { var output;
                if (input !== undef && input.length) {
                    output = eval(input) || '';
                } else {
                    output = '';
                }                
                logger.info(output);
            } catch(e) {
                logger.error(e.toString());
            } finally {
                repl(console);
            }
        });
    }
    
    function logger(console, container) {
        return {
            info: function(msg) {
                if (msg.length) {
                    console.Write(msg + '\n', 'jqconsole-output');
                }
            },
            error: function(msg) {
                if (msg.length) {
                    console.Write(msg + '\n', 'jqconsole-error');
                }
            },
            clear: global.clear = function() {
                container.find('.jqconsole-prompt').prevAll(':not(.jqconsole-header)').remove();
            },
            prefill: function(msg) {
                console.SetPromptText(msg);
            }
        };
    }
    
    function main() {
        var selector = '#console',
        msg = 'Take bpm for a test drive! Need help? Run bpm.usage().\n',
        prompt = 'bpm$ ', console, container;
        $(function() {
            container = $(selector);
            console = container.jqconsole(msg, prompt);
            bpm.logger = logger = logger(console, container);
            repl(console);
            logger.prefill('bpm.install("dojo");');            
        });
    }    
    
    bpm.define('jqconsole', {
        versions: ['2.7'],
        cdn: 'assets/jq-console-${v}.min.js'
    });
    
    bpm.install(['jquery', 'jqconsole'], main);
    
})(window, window.bpm);