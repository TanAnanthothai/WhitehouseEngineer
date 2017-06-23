# Flood Management Application

Progressive Web App (PWA) for PWA Online Hackathon 2017

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
- [Node.js](https://nodejs.org) `v6.11.0`
- [npm](https://www.npmjs.com/) `v4.2.0` or [Yarn](https://yarnpkg.com/en/docs/install) `v0.24.6`

### Installing
1. In the root directory, run `npm install` or `yarn`
2. The following dependencies should be globally installed. Run the following command to install them.
```
npm install --global gulp-cli sw-precache firebase-tools
```
For developers who prefer Yarn, use the following command instead.
```
yarn global add gulp-cli sw-precache firebase-tools
```
3. Run `npm start` or `yarn start`.

The application should be now available at `http://localhost:3000/`.

### Scripts
The following table shows all available scripts that facilitate development and deployment process.

| Script   	| Description                                    	|
|----------	|------------------------------------------------	|
| `start`  	| Build and serve an application for development 	|
| `serve` 	| Build and test an application locally           |
| `deploy` 	| Build and deploy this project to Firebase      	|

> **Note that** you can run these scripts by prepending `yarn run` or `npm run`.
* for example, `yarn run deploy`.
* excepting `start` script, you can run it directly. (`yarn start` or `npm start`)

## Authors
* Whitehouse Engineer

See the list of [contributors](https://github.com/TanAnanthothai/WhitehouseEngineer/contributors) who participated in this project.
