cd ./dist
zip -r ./function.zip .
aws lambda update-function-code --function-name poodle-lol --zip-file fileb://function.zip