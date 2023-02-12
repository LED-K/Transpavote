# Transpavote UI : A simple decentralised voting application prototype.

## Set up

- Clone the repo and run: npm i
- Create a .env file at project root and create these 2 variables : 
REACT_APP_PRIVATE_KEY= your wallet private key
REACT_APP_PUBLIC_KEY= your wallet public key
- Run : npm start
###You need to be working with the polygon mumbai RPC.

## Overview
- /admin allows you to deploy a new election by submitting a form.
These are basically the contract constructor's parameters.
You'll be required to upload 2 json files through the form : 
1 - Registered users that are allowed to vote -> just a json file containing whitelisted addressses
2 - Registered candidates
- /vote allowing you to votre for a candidate
- /live to check the election status & data.
