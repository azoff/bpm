(function(global, bpm){
    
    var console;
    
    function startConsole() {
        $(function () {
            var jqconsole = $('#console').jqconsole('Hi\n', '>>>');
            var startPrompt = function () {
                // Start the prompt with history enabled.
                jqconsole.Prompt(true, function (input) {
                    // Output input with the class jqconsole-output.
                    jqconsole.Write(input + '\n', 'jqconsole-output');
                    // Restart the prompt.
                    startPrompt();
                });
            };
            startPrompt();
        });
    }
    
    bpm.define('jqconsole', {
        versions: ['2.7'],
        cdn: 'assets/jq-console-${v}.min.js'
    });
    
    bpm.install(['jquery', 'jqconsole'], startConsole);
    
})(window, window.bpm);