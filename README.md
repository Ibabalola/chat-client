Chat Client
================

# Setting up the project

Clone the repos
---------------------

Start the databases
----------------------
From a terminal run 'mongod --dbpath ~/data/chat-client-db'
From another terminal run 'mongo'

Start the application
----------------------
chat-client
git checkout master
npm i
npm run start

Go to localhost:3000

Code
-------------------------

```
   // an example of an nested callback aka 'callback hell'
   Message.findOne({ message: 'badword' }, (err, censored) => {
    if (censored) {
        console.log('censored words found', censored);
        Message.deleteOne({ _id: censored }, (err) => {
            console.log(`we've removed the censored message`);
            });
        }
    });
```