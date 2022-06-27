# Internet of Plants - User's Web Interface

**Live at:** [`https://internet-of-plants.github.io/`](https://internet-of-plants.github.io/)

Web client used to monitor and manage iot devices. Integrates with [internet-of-plants/server](https://github.com/internet-of-plants/server).

Generates measurements charts, displays last device logs and panic events. Helps you to also keep track of and control your devices at scale. Providing updates, enhancing measurements with the available metadata. Using human input paired with a constant timeseries feed of the measurements collected by the device.

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
mv internet-of-plants.github.io static
```

Now to deploy you can just run:

`./deploy.sh`
