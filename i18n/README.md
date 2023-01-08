Language models stored here:  
    `~/.local/share/argos-translate`

Less-technical LibreTranlate discussion board:  
    https://community.libretranslate.com/ 

Attaching to libretranslate container takes a while post download of language models


Running ltmanage command
    - Connect docker iamge ans start with the --api-keys flag. the api-db database will be automatically created when you enable the API key flag.
    - In order to use an api key, you need to create it using the ltmanage command which can be found in the "./venv/bin/" directory, which is created when you create the docker image.
    - Once there, cd into the "ltmanage" directory and run the command "./venv/bin/ltmanage".
