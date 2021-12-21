# Internet of Plants Monitor Client

**Live at:** [`https://internet-of-plants.github.io/`](https://internet-of-plants.github.io/)

This is the client that is used to monitor (keep track / order around) the iot devices. It is supposed to generate useful graphics and allows you to also keep track at scale of your devices. The idea is to utilize human input together with a bunch of data to better manage the devices.

You can't automate what you don't personally understand, or without a specialist available. This is here to provide all the tools to better automate the process after understanding it.

It's not there yet.

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

Since this project is a simple static folder (when compiled), we use github pages. At [`https://github.com/internet-of-plants/internet-of-plants.github.io`](https://github.com/internet-of-plants/internet-of-plants.github.io).

First you need writing permissions to the repository quoted above.

Then you have to git clone the repository quoted above, in the parent folder of this. And move it to a folder named `static`:

```
cd .. # Assuming you are in this project's folder
git clone git@github.com:internet-of-plants/internet-of-plants.github.io.git
mv monitor static
```

Now to deploy you can just run:

`./deploy.sh`
