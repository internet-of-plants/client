# Internet of Plants Monitor Client

**Live at:** [`https://internet-of-plants.github.io/monitor/`](https://internet-of-plants.github.io/monitor/)

This is the client that is used to monitor (keep track / order around) the iot devices. It is supposed to generate useful graphics and allows you to also keep track at scale of your devices. The idea is to utilize human input together with a bunch of data to better manage the devices.

You can't automate what you don't personally understand, or without a specialist available. This is here to provide all the tools to better automate the process after understanding it.

It's not there yet.

It also take very bad decisions around managing local state, without using vuex and going for mutating props. Fetching data at the component level. Which is very bad. But it started as a proof-of-concept and outgrown itself. Nobody yet has taken the time (or suffered the consequences of that decision) to fix it, so it is how it is. But yes, we very much would like to fix this. If you can, go for it, we will be very happy. But as far as life goes someone is yet to make us happy.

## Signup

To signup go to `/signup`.

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```
## Deploy

Since this project is a simple static folder (when compiled), we use github pages. At [`https://github.com/internet-of-plants/monitor`](https://github.com/internet-of-plants/monitor/).

First you need writing permissions to the repository quoted above.

Then you have to git clone the repository quoted above, in the parent folder of this. And move it to a folder named `static`:

```
cd .. # Assuming you are in this project's folder
git clone git@github.com:internet-of-plants/monitor.git
mv monitor static
```

Now to deploy you can just run:

`./deploy.sh`