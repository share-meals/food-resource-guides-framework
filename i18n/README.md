# Food Resource Guide i18n Framewaaork README

## Language models stored here:  
    `~/.local/share/argos-translate`

## Less-technical LibreTranlate discussion board:  
- https://community.libretranslate.com/ 


## Building & Publishing LibreTranslate docker containers
    `https://github.com/t-lo/LibreTranslate-ghcr-publisher`
- Automation to build and publish LibreTranslate docker containers. Grabs base LibreTranslate image and builds on top of that image with the language models

## Running ltmanage command
1. Connect docker iamge ans start with the --api-keys flag. the api-db database will be automatically created when you enable the API key flag.
2. In order to use an api key, you need to create it using the ltmanage command which can be found in the "./venv/bin/" directory, which is created when you create the docker image.
3. Once there, cd into the "ltmanage" directory and run the command "./venv/bin/ltmanage".