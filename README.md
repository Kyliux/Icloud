# React + Tailwind

An evolution of the diary example from https://github.com/buildwithjuno/examples showcasing web3 capabilities

This web3 sample app uses React and Tailwind Javascript that showcases authentication, datastore and storage usage in the internet computer from Dfinity.

Added functionnality :
- CRUD
- Packery
- pictures and videos support
- Usage tags buttons to filter


## Getting started

Make sure you have [node.js](https://nodejs.org) LTS installed.

Log in Juno website, get your satellite ID and change juno.json

```bash
git clone https://github.com/Kyliux/Icloud
npm ci
npm run build && juno deploy 

```

Example : https://m5rwi-daaaa-aaaal-acrpq-cai.icp0.io/ Please note that only the sattelite owner have the possibility to add or remove items. The principalid of your sattelite login device have to be configured in Principalid.js to be able to change your data.