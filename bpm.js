/*bpm1.0.0b|WTFPL*/
// bpm.js
// Version - 1.0.0b
//
// by
// Jonathan Azoff - @azoff - jon[at]azoffdesign.com
//
// http://azoff.github.com/bpm
// https://github.com/azoff/bpm/
//
// Tri-license - WTFPL | MIT | BSD
 (function(global, logger) {

    var 
    arrays = Array.prototype,
    objects = Object.prototype,
    
    bpm = global.bpm = {

        _manifest: {},

        _db: {
            count: 0,
            keys: [],
            definitions: {}
        },

        repository: '../packages.js',

        mode: 'dev',

        logging: true,

        init: function(definitions) {
            if (!bpm.initialized) {
                if (definitions) {
                    bpm.utils.info('Definitions received, parsing...');
                    bpm.utils.each(definitions, function(definition, key){
                        bpm.define(key, definition);
                    });
                    bpm.utils.info('Parsing complete, ${count} definitions loaded.', { count: bpm._db.count });
                    bpm.initialized = true;
                    if (bpm.ready.list) {
                        bpm.utils.each(bpm.ready.list, function(callback){ callback(bpm); });
                    }
                } else {
                    bpm.utils.info('Starting BPM, loading definitions from ${repo}...', { repo: bpm.repository });
                    bpm.load(bpm.repository);
                }
            }
        },
        
        ready: function(callback) {            
            if (bpm.initialized) {
                callback(bpm);
            } else if (bpm.ready.list) {
                bpm.ready.list.push(callback);
            } else {
                bpm.ready.list = [callback];
            }
        },

        install: function(request, onsuccess) {
            var urls = [], adder, success = true;            
            bpm.ready(function(){                
                bpm.utils.info('Processing install request...');
                bpm.utils.each(bpm.utils.ensureArray(request), adder = function(request){
                    var response = bpm.search(request), url;
                    bpm.utils.info('Creating manifest entry for "${key}" @ "${version}"...', response);
                    // check if package exists
                    if (response.keyMatch) {
                        // check if version exists
                        if (response.versionMatch) {
                            // add all prerequisites
                            bpm.utils.each(bpm.requires(response.key), adder);
                            // error out if the prerequisites failed
                            if (!success) { return false; }
                            // check to see if we already added the script
                            if (response.key in bpm._manifest) {
                                // but error out if we did, and the versions don't match
                                if (bpm._manifest[response.key] !== response.version) {
                                    bpm.utils.error('WARNING: detected request for version "${version}" of "${key}" which conflicts with previously requested version "${previous}"! Ignoring request...', {
                                        key: response.key,
                                        version: response.version,
                                        previous: bpm._manifest[response.key]
                                    });
                                } else {
                                    bpm.utils.info('"${key}" already in manifest, skipping...', response);
                                }
                            // library not added yet, add to manifest and url list.
                            } else {
                                url = bpm.url(response.key, response.version);
                                // try to get the CDN URL, theorhetically this should never fail
                                if (url) {
                                    bpm.utils.info('Manifest entry for "${key}" created, using: ${url}', { 
                                        key: response.key,
                                        url: url 
                                    });
                                    bpm._manifest[response.key] = response.version;
                                    urls.push(url);
                                } else {
                                    return (success = bpm.utils.error('Found definition for "${key}", but could not find CDN URL for "${mode}" mode. Available modes: ${modes}', {
                                        key: response.key,
                                        version: bpm.mode,
                                        versions: bpm
                                    }));
                                }
                            }
                        } else {
                            return (success = bpm.utils.error('Found definition for "${key}", but could not find version "${version}". Available versions: ${versions}', {
                                key: response.key,
                                version: response.version,
                                versions: bpm.versions(response.key).join(', ')
                            }));
                        }
                    } else {
                        return (success = bpm.utils.error('Unable to find definition for "${key}", did you mean "${suggestion}"?',{
                            key: response.key,
                            suggestion: bpm.suggest(response.key)
                        }));
                    }                    
                });                
                // finally load the URLs if we didn't have an error
                if (success && urls.length) {
                    bpm.utils.info('Manifest created! Loading ${count} new script(s)...', { count: urls.length });
                    bpm.load({
                        load: urls,
                        complete: function(){
                            bpm.utils.info('Script(s) successfully loaded, installation complete!');
                            if (onsuccess && onsuccess.call) { onsuccess(); }
                        }
                    });
                }
            });
        },
        
        url: function(key, version) {
            var def = bpm.lookup(key), url = '';
            if (def && def.cdn && (bpm.mode in def.cdn)) {
                url = bpm.utils.format(def.cdn[bpm.mode], { v: version });
            }
            return url;
        },
        
        load: function() {
            var args = arrays.slice.call(arguments);
            yepnope.apply(global, args);
        },
        
        latest: function(key) {
            var versions = bpm.versions(key), len = versions.length;
            return len > 0 ? versions[len-1] : false;
        },
        
        versions: function(key) {
            var def = bpm.lookup(key);
            return (def && def.versions) ? def.versions : [];
        },
        
        requires: function(key) {
            var def = bpm.lookup(key);
            return (def && def.requires) ? def.requires : [];
        },
        
        search: function(request) {
            var response = { 
                keyMatch: false,
                versionMatch: false,
                key: request.key || request, 
                version: request.version || 'latest' 
            },  versions;
            response.keyMatch = !!bpm.lookup(response.key);
            if (response.keyMatch) {
                versions = bpm.versions(response.key);
                if (response.version === 'latest') {
                    response.version = versions[versions.length-1];
                    response.versionMatch = true;
                } else {
                    response.versionMatch = versions.indexOf(response.version) >= 0;
                }                
            }
            return response;
        },
        
        suggest: function(key) {
            return bpm._db.keys.sort(function(keyA, keyB){
                var levA = levenshtein(key, keyA), levB = levenshtein(key, keyB);
                if (levA === levB) {
                    return 0;
                } else {
                    return levA > levB ? 1 : -1;
                }
            })[0];
        },

        lookup: function(key) {
            return (key in this._db.definitions) ? this._db.definitions[key] : null;
        },

        define: function(key, definition) {            
            if (!bpm.lookup(key)) {
                this._db.keys.push(key);
                this._db.count++;                
            }
            this._db.definitions[key] = definition;
        },

        utils: {
            
            ensureArray: function(obj) {
                if (objects.toString.call(obj) === '[object Array]'){ 
                    return obj; 
                } else {
                    return [obj];
                }
            },
            
            each: function(obj, iterator, context) {
                var each = arrays.forEach;
                if (obj === null) return;
                if (each && obj.forEach === each) {
                    obj.forEach(iterator, context);
                } else if (obj.length === +obj.length) {
                    for (var i = 0, l = obj.length; i < l; i++) {
                        if (i in obj && iterator.call(context, obj[i], i, obj) === false) return;
                    }
                } else {
                    for (var key in obj) {
                        if (key in obj) {
                            if (iterator.call(context, obj[key], key, obj) === false) return;
                        }
                    }
                }
            },


            format: function(template, model) {
                if (!model) { return template; }
                return template.replace(/\$\{(.*?)\}/g, function(match, key) {
                    return (key in model) ? model[key] : '';
                });
            },

            info: function(template, model) {
                if (logger && bpm.logging) {
                    logger.info(bpm.utils.format(template, model));
                }
            },

            error: function(template, model) {
                if (logger && bpm.logging) {
                    logger.error(bpm.utils.format(template, model));
                } return false;
            },

            keys: function(obj) {
                return (Object.keys ||
                function(obj) {
                    var keys = [], key;
                    for (key in obj) {
                        if (key in obj) {
                            keys.push(k);
                        }
                    }
                    return keys;
                })(obj);
            }

        }

    };

    /*yepnope1.5.0|WTFPL*/
    // yepnope.js
    // Version - 1.5.0
    //
    // by
    // Alex Sexton - @SlexAxton - AlexSexton[at]gmail.com
    // Ralph Holzmann - @ralphholzmann - ralphholzmann[at]gmail.com
    //
    // http://yepnopejs.com/
    // https://github.com/SlexAxton/yepnope.js/
    //
    // Tri-license - WTFPL | MIT | BSD
    //
    // Please minify before use.
    // Also available as Modernizr.load via the Modernizr Project
    //
    ( function ( window, doc, undef ) {

    var docElement            = doc.documentElement,
        sTimeout              = window.setTimeout,
        firstScript           = doc.getElementsByTagName( "script" )[ 0 ],
        toString              = {}.toString,
        execStack             = [],
        started               = 0,
        noop                  = function () {},
        // Before you get mad about browser sniffs, please read:
        // https://github.com/Modernizr/Modernizr/wiki/Undetectables
        // If you have a better solution, we are actively looking to solve the problem
        isGecko               = ( "MozAppearance" in docElement.style ),
        isGeckoLTE18          = isGecko && !! doc.createRange().compareNode,
        insBeforeObj          = isGeckoLTE18 ? docElement : firstScript.parentNode,
        // Thanks to @jdalton for showing us this opera detection (by way of @kangax) (and probably @miketaylr too, or whatever...)
        isOpera               = window.opera && toString.call( window.opera ) == "[object Opera]",
        isIE                  = !! doc.attachEvent,
        isWebkit              = ( "webkitAppearance" in docElement.style ),
        strJsElem             = isGecko ? "object" : "img",
        strCssElem            = isIE ? "script" : strJsElem,
        isArray               = Array.isArray || function ( obj ) {
          return toString.call( obj ) == "[object Array]";
        },
        isObject              = function ( obj ) {
          return Object(obj) === obj;
        },
        isString              = function ( s ) {
          return typeof s == "string";
        },
        isFunction            = function ( fn ) {
          return toString.call( fn ) == "[object Function]";
        },
        globalFilters         = [],
        scriptCache           = {},
        prefixes              = {
          // key value pair timeout options
          timeout : function( resourceObj, prefix_parts ) {
            if ( prefix_parts.length ) {
              resourceObj.timeout = prefix_parts[ 0 ];
            }
            return resourceObj;
          }
        },
        handler,
        yepnope;

      /* Loader helper functions */
      function isFileReady ( readyState ) {
        // Check to see if any of the ways a file can be ready are available as properties on the file's element
        return ( ! readyState || readyState == "loaded" || readyState == "complete" || readyState == "uninitialized" );
      }


      // Takes a preloaded js obj (changes in different browsers) and injects it into the head
      // in the appropriate order
      function injectJs ( src, cb, attrs, timeout, /* internal use */ err, internal ) {
        var script = doc.createElement( "script" ), done, i;
        timeout = timeout || yepnope.errorTimeout;
        script.src = src;

        // Add our extra attributes to the script element
        for ( i in attrs ) {
            script.setAttribute( i, attrs[ i ] );
        }

        cb = internal ? executeStack : ( cb || noop );

        // Bind to load events
        script.onreadystatechange = script.onload = function () {

          if ( ! done && isFileReady( script.readyState ) ) {

            // Set done to prevent this function from being called twice.
            done = 1;
            cb();

            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;
          }
        };

        // 404 Fallback
        sTimeout(function () {
          if ( ! done ) {
            done = 1;
            // Might as well pass in an error-state if we fire the 404 fallback
            cb(1);
          }
        }, timeout );

        // Inject script into to document
        // or immediately callback if we know there
        // was previously a timeout error
        if (err) { 
            script.onload();
        } else {
            firstScript.parentNode.insertBefore( script, firstScript );
        }
      }

      // Takes a preloaded css obj (changes in different browsers) and injects it into the head
      function injectCss ( href, cb, attrs, timeout, /* Internal use */ err, internal ) {

        // Create stylesheet link
        var link = doc.createElement( "link" ),
            done, i;

        timeout = timeout || yepnope.errorTimeout;

        cb = internal ? executeStack : ( cb || noop );

        // Add attributes
        link.href = href;
        link.rel  = "stylesheet";
        link.type = "text/css";

        // Add our extra attributes to the link element
        for ( i in attrs ) {
          link.setAttribute( i, attrs[ i ] );
        }

        if ( ! err ) {
          firstScript.parentNode.insertBefore( link, firstScript );
          sTimeout(cb, 0);
        }
      }

      function executeStack ( ) {
        // shift an element off of the stack
        var i   = execStack.shift();
        started = 1;

        // if a is truthy and the first item in the stack has an src
        if ( i ) {
          // if it's a script, inject it into the head with no type attribute
          if ( i.t ) {
            // Inject after a timeout so FF has time to be a jerk about it and
            // not double load (ignore the cache)
            sTimeout( function () {
              (i.t == "c" ?  yepnope.injectCss : yepnope.injectJs)( i.s, 0, i.a, i.x, i.e, 1 );
            }, 0 );
          }
          // Otherwise, just call the function and potentially run the stack
          else {
            i();
            executeStack();
          }
        }
        else {
          // just reset out of recursive mode
          started = 0;
        }
      }

      function preloadFile ( elem, url, type, splicePoint, dontExec, attrObj, timeout ) {

        timeout = timeout || yepnope.errorTimeout;

        // Create appropriate element for browser and type
        var preloadElem = {},
            done        = 0,
            firstFlag   = 0,
            stackObject = {
              t: type,     // type
              s: url,      // src
            //r: 0,        // ready
              e : dontExec,// set to true if we don't want to reinject
              a : attrObj,
              x : timeout
            };

        // The first time (common-case)
        if ( scriptCache[ url ] === 1 ) {
          firstFlag = 1;
          scriptCache[ url ] = [];
          preloadElem = doc.createElement( elem );
        }

        function onload ( first ) {
          // If the script/css file is loaded
          if ( ! done && isFileReady( preloadElem.readyState ) ) {

            // Set done to prevent this function from being called twice.
            stackObject.r = done = 1;

            if(!started) { executeStack(); }

            // Handle memory leak in IE
            preloadElem.onload = preloadElem.onreadystatechange = null;
            if ( first ) {
              if ( elem == "object" ) {
                sTimeout(function(){ insBeforeObj.removeChild( preloadElem ); }, 50);
              }

              for ( var i in scriptCache[ url ] ) {
                if ( scriptCache[ url ].hasOwnProperty( i ) ) {
                  scriptCache[ url ][ i ].onload();
                }
              }
            }
          }
        }


        // Just set the src and the data attributes so we don't have differentiate between elem types
        preloadElem.src = preloadElem.data = url;

        // Don't let it show up visually
        preloadElem.width = preloadElem.height = "0";

        // Attach handlers for all browsers
        preloadElem.onerror = preloadElem.onload = preloadElem.onreadystatechange = function(){
          onload.call(this, firstFlag);
        };
        // inject the element into the stack depending on if it's
        // in the middle of other scripts or not
        execStack.splice( splicePoint, 0, stackObject );

        // The only place these can't go is in the <head> element, since objects won't load in there
        // so we have two options - insert before the head element (which is hard to assume) - or
        // insertBefore technically takes null/undefined as a second param and it will insert the element into
        // the parent last. We try the head, and it automatically falls back to undefined.
        if ( elem == "object" ) {
          // If it's the first time, or we've already loaded it all the way through
          if ( firstFlag || scriptCache[ url ] === 2 ) {
            insBeforeObj.insertBefore( preloadElem, isGeckoLTE18 ? null : firstScript );

            // If something fails, and onerror doesn't fire,
            // continue after a timeout.
            sTimeout( onload, timeout );
          }
          else {
            // instead of injecting, just hold on to it
            scriptCache[ url ].push( preloadElem );
          }
        }
      }

      function load ( resource, type, dontExec, attrObj, timeout ) {
        // If this method gets hit multiple times, we should flag
        // that the execution of other threads should halt.
        started = 0;

        // We'll do 'j' for js and 'c' for css, yay for unreadable minification tactics
        type = type || "j";
        if ( isString( resource ) ) {
          // if the resource passed in here is a string, preload the file
          preloadFile( type == "c" ? strCssElem : strJsElem, resource, type, this.i++, dontExec, attrObj, timeout );
        } else {
          // Otherwise it's a callback function and we can splice it into the stack to run
          execStack.splice( this.i++, 0, resource );
          if (execStack.length === 1) { executeStack(); }
        }

        // OMG is this jQueries? For chaining...
        return this;
      }

      // return the yepnope object with a fresh loader attached
      function getYepnope () {
        var y = yepnope;
        y.loader = {
          load: load,
          i : 0
        };
        return y;
      }

      /* End loader helper functions */
      // Yepnope Function
      yepnope = function ( needs ) {

        var i,
            need,
            // start the chain as a plain instance
            chain = this.yepnope.loader;

        function satisfyPrefixes ( url ) {
          // split all prefixes out
          var parts   = url.split( "!" ),
          gLen    = globalFilters.length,
          origUrl = parts.pop(),
          pLen    = parts.length,
          res     = {
            url      : origUrl,
            // keep this one static for callback variable consistency
            origUrl  : origUrl,
            prefixes : parts
          },
          mFunc,
          j,
          prefix_parts;

          // loop through prefixes
          // if there are none, this automatically gets skipped
          for ( j = 0; j < pLen; j++ ) {
            prefix_parts = parts[ j ].split( '=' );
            mFunc = prefixes[ prefix_parts.shift() ];
            if ( mFunc ) {
              res = mFunc( res, prefix_parts );
            }
          }

          // Go through our global filters
          for ( j = 0; j < gLen; j++ ) {
            res = globalFilters[ j ]( res );
          }

          // return the final url
          return res;
        }

        function getExtension ( url ) {
            return url.split(".").pop().split("?").shift();
        }

        function loadScriptOrStyle ( input, callback, chain, index, testResult ) {
          // run through our set of prefixes
          var resource     = satisfyPrefixes( input ),
              autoCallback = resource.autoCallback,
              extension    = getExtension( resource.url );

          // if no object is returned or the url is empty/0 just exit the load
          if ( resource.bypass ) {
            return;
          }

          // Determine callback, if any
          if ( callback ) {
            callback = isFunction( callback ) ?
              callback :
              callback[ input ] || 
              callback[ index ] || 
              callback[ ( input.split( "/" ).pop().split( "?" )[ 0 ] ) ] || 
              executeStack;
          }

          // if someone is overriding all normal functionality
          if ( resource.instead ) {
            return resource.instead( input, callback, chain, index, testResult );
          }
          else {
            // Handle if we've already had this url and it's completed loaded already
            if ( scriptCache[ resource.url ] ) {
              // don't let this execute again
              resource.noexec = true;
            }
            else {
              scriptCache[ resource.url ] = 1;
            }

            // Throw this into the queue
            chain.load( resource.url, ( ( resource.forceCSS || ( ! resource.forceJS && "css" == getExtension( resource.url ) ) ) ) ? "c" : undef, resource.noexec, resource.attrs, resource.timeout );

            // If we have a callback, we'll start the chain over
            if ( isFunction( callback ) || isFunction( autoCallback ) ) {
              // Call getJS with our current stack of things
              chain.load( function () {
                // Hijack yepnope and restart index counter
                getYepnope();
                // Call our callbacks with this set of data
                if (callback) { callback( resource.origUrl, testResult, index ); }
                if (autoCallback) { autoCallback( resource.origUrl, testResult, index ); }

                // Override this to just a boolean positive
                scriptCache[ resource.url ] = 2;
              } );
            }
          }
        }

        function loadFromTestObject ( testObject, chain ) {
            var testResult = !! testObject.test,
                group      = testResult ? testObject.yep : testObject.nope,
                always     = testObject.load || testObject.both,
                callback   = testObject.callback || noop,
                cbRef      = callback,
                complete   = testObject.complete || noop,
                needGroupSize,
                callbackKey;

            // Reusable function for dealing with the different input types
            // NOTE:: relies on closures to keep 'chain' up to date, a bit confusing, but
            // much smaller than the functional equivalent in this case.
            function handleGroup ( needGroup, moreToCome ) {
                var callbackKey;
              if ( ! needGroup ) {
                // Call the complete callback when there's nothing to load.
                if (!moreToCome) { complete(); }
              }
              // If it's a string
              else if ( isString( needGroup ) ) {
                // if it's a string, it's the last
                if ( !moreToCome ) {
                  // Add in the complete callback to go at the end
                  callback = function () {
                    var args = [].slice.call( arguments );
                    cbRef.apply( this, args );
                    complete();
                  };
                }
                // Just load the script of style
                loadScriptOrStyle( needGroup, callback, chain, 0, testResult );
              }
              // See if we have an object. Doesn't matter if it's an array or a key/val hash
              // Note:: order cannot be guaranteed on an key value object with multiple elements
              // since the for-in does not preserve order. Arrays _should_ go in order though.
              else if ( isObject( needGroup ) ) {
                // I hate this, but idk another way for objects.
                needGroupSize = (function(){
                  var count = 0, i;
                  for (i in needGroup ) {
                    if ( needGroup.hasOwnProperty( i ) ) {
                      count++;
                    }
                  }
                  return count;
                })();

                for ( callbackKey in needGroup ) {
                  // Safari 2 does not have hasOwnProperty, but not worth the bytes for a shim
                  // patch if needed. Kangax has a nice shim for it. Or just remove the check
                  // and promise not to extend the object prototype.
                  if ( needGroup.hasOwnProperty( callbackKey ) ) {
                    // Find the last added resource, and append to it's callback.
                    if ( ! moreToCome && ! ( --needGroupSize ) ) {
                      // If this is an object full of callbacks
                      if ( ! isFunction( callback ) ) {
                        // Add in the complete callback to go at the end
                        callback[ callbackKey ] = (function( innerCb ) {
                          return function () {
                            var args = [].slice.call( arguments );
                            innerCb.apply( this, args );
                            complete();
                          };
                        })( cbRef[ callbackKey ] );
                      }
                      // If this is just a single callback
                      else {
                        callback = function () {
                          var args = [].slice.call( arguments );
                          cbRef.apply( this, args );
                          complete();
                        };
                      }
                    }
                    loadScriptOrStyle( needGroup[ callbackKey ], callback, chain, callbackKey, testResult );
                  }
                }
              }
            }

            // figure out what this group should do
            handleGroup( group, !!always );

            // Run our loader on the load/both group too
            // the always stuff always loads second.
            if (always) { handleGroup( always ); }
        }

        // Someone just decides to load a single script or css file as a string
        if ( isString( needs ) ) {
          loadScriptOrStyle( needs, 0, chain, 0 );
        }
        // Normal case is likely an array of different types of loading options
        else if ( isArray( needs ) ) {
          // go through the list of needs
          for( i = 0; i < needs.length; i++ ) {
            need = needs[ i ];

            // if it's a string, just load it
            if ( isString( need ) ) {
              loadScriptOrStyle( need, 0, chain, 0 );
            }
            // if it's an array, call our function recursively
            else if ( isArray( need ) ) {
              yepnope( need );
            }
            // if it's an object, use our modernizr logic to win
            else if ( isObject( need ) ) {
              loadFromTestObject( need, chain );
            }
          }
        }
        // Allow a single object to be passed in
        else if ( isObject( needs ) ) {
          loadFromTestObject( needs, chain );
        }
      };

      // This publicly exposed function is for allowing
      // you to add functionality based on prefixes on the
      // string files you add. 'css!' is a builtin prefix
      //
      // The arguments are the prefix (not including the !) as a string
      // and
      // A callback function. This function is passed a resource object
      // that can be manipulated and then returned. (like middleware. har.)
      //
      // Examples of this can be seen in the officially supported ie prefix
      yepnope.addPrefix = function ( prefix, callback ) {
        prefixes[ prefix ] = callback;
      };

      // A filter is a global function that every resource
      // object that passes through yepnope will see. You can
      // of course conditionally choose to modify the resource objects
      // or just pass them along. The filter function takes the resource
      // object and is expected to return one.
      //
      // The best example of a filter is the 'autoprotocol' officially
      // supported filter
      yepnope.addFilter = function ( filter ) {
        globalFilters.push( filter );
      };

      // Default error timeout to 10sec - modify to alter
      yepnope.errorTimeout = 1e4;

      // Webreflection readystate hack
      // safe for jQuery 1.4+ ( i.e. don't use yepnope with jQuery 1.3.2 )
      // if the readyState is null and we have a listener
      if ( doc.readyState === null && doc.addEventListener ) {
        // set the ready state to loading
        doc.readyState = "loading";
        // call the listener
        doc.addEventListener( "DOMContentLoaded", handler = function () {
          // Remove the listener
          doc.removeEventListener( "DOMContentLoaded", handler, 0 );
          // Set it to ready
          doc.readyState = "complete";
        }, 0 );
      }

      // Attach loader &
      // Leak it
      window.yepnope = getYepnope();

      // Exposing executeStack to better facilitate plugins
      window.yepnope.executeStack = executeStack;
      window.yepnope.injectJs = injectJs;
      window.yepnope.injectCss = injectCss;

    })( global, global.document );

    // http://kevin.vanzonneveld.net
    // +    original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
    // +    bugfixed by: Onno Marsman
    // +    revised by: Andrea Giammarchi (http://webreflection.blogspot.com)
    // + reimplemented by: Brett Zamir (http://brett-zamir.me)
    // + reimplemented by: Alexander M Beedie
    // *    example 1: levenshtein('Kevin van Zonneveld', 'Kevin van Sommeveld');
    // *    returns 1: 3
    function levenshtein(s1, s2) {
        if (s1 == s2) {
            return 0;
        }

        var s1_len = s1.length;
        var s2_len = s2.length;
        if (s1_len === 0) {
            return s2_len;
        }
        if (s2_len === 0) {
            return s1_len;
        }

        // BEGIN STATIC
        var split = false;
        try {
            split = !('0')[0];
        } catch(e) {
            split = true;
            // Earlier IE may not support access by string index
        }
        // END STATIC
        if (split) {
            s1 = s1.split('');
            s2 = s2.split('');
        }

        var v0 = new Array(s1_len + 1);
        var v1 = new Array(s1_len + 1);

        var s1_idx = 0,
        s2_idx = 0,
        cost = 0;
        for (s1_idx = 0; s1_idx < s1_len + 1; s1_idx++) {
            v0[s1_idx] = s1_idx;
        }
        var char_s1 = '',
        char_s2 = '';
        for (s2_idx = 1; s2_idx <= s2_len; s2_idx++) {
            v1[0] = s2_idx;
            char_s2 = s2[s2_idx - 1];

            for (s1_idx = 0; s1_idx < s1_len; s1_idx++) {
                char_s1 = s1[s1_idx];
                cost = (char_s1 == char_s2) ? 0: 1;
                var m_min = v0[s1_idx + 1] + 1;
                var b = v1[s1_idx] + 1;
                var c = v0[s1_idx] + cost;
                if (b < m_min) {
                    m_min = b;
                }
                if (c < m_min) {
                    m_min = c;
                }
                v1[s1_idx + 1] = m_min;
            }
            var v_tmp = v0;
            v0 = v1;
            v1 = v_tmp;
        }
        return v0[s1_len];
    }
    
    // start loading the repo as soon as this file is parsed!
    bpm.init();


})(this, this.console);