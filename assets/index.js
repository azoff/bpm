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
            info: global.log = function(msg) {
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
    
    function installPackage() {
        var element = $(this).addClass('installing'),
        key = element.text();
        bpm.install(key, function(){
            element.removeClass('installing').addClass('installed');
        })
    }
    
    function buildShortcuts() {
        var shortcuts = $('#shortcuts');
        $.each(bpm.list().slice(1), function(i, key){
            shortcuts.append('<li>'+key+'</li>');
        });
        shortcuts.on('click', 'li:not(.installed,.installing)', installPackage);
    }
    
    function startConsole() {
        var selector = '#console',
        prompt = '$> ',
        msg = 'Take bpm for a test drive! Hit the enter key to install dojo. Need help? Run bpm.usage().\n',
        container = $(selector),
        console = container.jqconsole(msg, prompt);
        bpm.logger = logger = logger(console, container);
        repl(console);
        logger.prefill(' bpm.install("dojo", function(){\n\tlog("Dojo " + dojo.version + " Ready!");\n});');
    }
    
    function main() {
        $(startConsole);
        $(buildShortcuts);
    }    
    
    bpm.define('jqconsole', {
        versions: ['2.7'],
        cdn: 'assets/jq-console-${v}.min.js'
    });
    
    bpm.install(['jquery', 'jqconsole'], main);
    
})(window, window.bpm);