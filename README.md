A Simple Redis + Express App showing how to use Redis as session store & run it on Cloud Foundry.

The main purpose of this app is to show you how to configure Redis as session store for an Express based Node.js app.
All this app does is to keep count of number of times the user has visited in session. And it shows that if we are not using Redis or external session store, then:

* Sessions won't persist when the server restarts
* You can't scale the app because loadbalancer will be sending requests to different instances & those other instances won't know about this user/session.
<p align='center'>
<img src="https://github.com/rajaraodv/redissessions/raw/master/pics/rs_browser.png" height="300px" width="450px" />
</p>

####The below diagram shows how the architecture of the app looks w/in Cloud Foundry.####

 
<p align='center'>
<img src="https://github.com/rajaraodv/redissessions/raw/master/pics/redisSessionStore.png" height="300px" width="450px" />
</p>

1. When a user opens the app, the browser connects to Cloud Foundry & hits reverse proxy / load balancer.
2. Request is sent to one of the many Express server instances
3. Express server instance (say instance #1) creates a session w/ cookie name connect.sid.
4. Express stores then stores the session information in Redis & sends the response back.
5. Next time when the user refreshes the browser, if the request goes to server instance #2 or #3, that instance will still be able to fetch session because all of the instances are connected to Redis and so your app can easily scale.

## Code Highlights ##

To add Redis session store to your Express app, first add: `connect-redis` and `redis` modules to package.json and load it in your app.

```
//package.json
{
  "name": "RedisSessions",
  "description": "A Simple Redis + Express App showing how to use Redis as session store & run it on Cloud Foundry.",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "start": "node app"
  },
  "dependencies": {
    "express": "3.x",
    "jade": "*",
    "connect-redis": "*",  // Connect/Express session store
    "redis": "*"           // Redis module.  
  }
}
```
And load those modules in your app like below:

```
//app.js

var RedisStore = require('connect-redis')(express);
var redisClient = require('redis').createClient();

```

And finally add RedisStore to Express's session middleware like below:

```
 //Add RedisStore to Express's sessions middleware
  app.use(express.session({store: new RedisStore({client: redisClient})}));
  ```

  And that's it.

## Running / Testing it on Cloud Foundry ##
* Clone this app to `redisSessions` folder
* ` cd redisSessions`
* `npm install` & follow the below instructions to push the app to Cloud Foundry

```

[~/success/git/redisSessions]
> vmc push redisSessions
Instances> 4       <----- Run 4 instances of the server

1: node
2: other
Framework> node

1: node
2: node06
3: node08
4: other
Runtime> 3  <---- Choose Node.js 0.8v

1: 64M
2: 128M
3: 256M
4: 512M
Memory Limit> 64M

Creating redisSessions... OK

1: redisSessions.cloudfoundry.com
2: none
URL> redisSessions.cloudfoundry.com  <--- URL of the app (choose something unique)

Updating redisSessions... OK

Create services for application?> y

1: blob 0.51
2: mongodb 2.0
3: mysql 5.1
4: postgresql 9.0
5: rabbitmq 2.4
6: redis 2.6
7: redis 2.4
8: redis 2.2
What kind?> 6 <----- Select & Add Redis 2.6v service

Name?> redis-e9771 <-- This is just random name for Redis service

Creating service redis-e9771... OK
Binding redis-e9771 to redisSessions... OK
Create another service?> n

Bind other services to application?> n

Save configuration?> n

Uploading redisSessions... OK
Starting redisSessions... OK
Checking redisSessions... OK
```

#### Test 1 ####

* Open the browser & go to app url `redisSessions.cloudfoundry.com`

* Refresh browser multiple times

*  Notice that the count properly increments


#### Test 2 ####
* Restart the server: `vmc restart redisSessions`
* Refresh browser multiple times

*  Notice that the count properly increments from where we started before restart.


#### Notes ####
* If you don't have a Cloud Foundry account, sign up for it <a href='https://my.cloudfoundry.com/signup' target='_blank'>here</a> & install `VMC` Ruby command line tool.
* Check out Cloud Foundry getting started <a href='http://docs.cloudfoundry.com/getting-started.html' target='_blank'>here</a>
* Install latest vmc tool by running `sudo gem install vmc ---pre`
