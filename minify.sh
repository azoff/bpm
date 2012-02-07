#!/bin/sh
# Running this is not necessary to use bpm, I just have it to save me time.
uglifyjs bpm.js > bpm.min.js
uglifyjs packages.js > packages.min.js
sed -i '' -e 's/packages.js",mode:"dev",logging:!0/packages.min.js",mode:"prod",logging:!1/' bpm.min.js