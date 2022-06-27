# Internet of Plants - User's Web Interface

**Live at:** [`https://internet-of-plants.github.io/`](https://internet-of-plants.github.io/)

Web client used to monitor and manage iot devices. Integrates with [internet-of-plants/server](https://github.com/internet-of-plants/server).

Generates measurements charts, displays last device logs and panic events. Helps you to also keep track of and control your devices at scale. Providing updates, enhancing measurements with the available metadata. Using human input paired with a constant timeseries feed of the measurements collected by the device.

## Features

### Unauthenticated routes

- `/login` signs in as specified user for web access
- `/signup` signs up as specified user for web access and signs them in

### Authenticated routes

- `/` list organizations
- `/organization/:orgId` list collections of said organization
- `/organization/:orgId/collection/:colId` list devices of said collection
- `/organization/:orgId/collection/:colId/device/:devId` detail said device
    - Displays device's name, description and last measurements
    - Can edit device's name
    - Display last panic events registered by the device
    - Display last log events registered by the device
    - Plots chart with the last devices measurements
    - Allows configuring the target and sensors (with specified ports + factory settings) for the device
        - This triggers automatic OTA updates, compiled by the backend service

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

## License

[GNU Affero General Public License version 3 or later (AGPL-3.0+)](https://github.com/internet-of-plants/client/blob/main/LICENSE.md)