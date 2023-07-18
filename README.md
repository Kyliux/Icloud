# React + Tailwind + ICP

An evolution of the diary example from https://github.com/buildwithjuno/examples showcasing web3 capabilities

This web3 sample app is totally stored ON-CHAIN, it uses React and Tailwind Javascript that showcases authentication, datastore and storage usage in the internet computer from Dfinity.

Added functionnality :
- CRUD
- Packery
- pictures and videos support
- Lazyload implemented
- swiper to navigate the elements individually
- Usage tags buttons to filter


## Getting started

Make sure you have [node.js](https://nodejs.org) LTS installed.

Log in Juno website, get your satellite ID and change juno.json

```bash
git clone https://github.com/Kyliux/Icloud
npm ci
npm run build && juno deploy 

```

Example : https://m5rwi-daaaa-aaaal-acrpq-cai.icp0.io/ Please note that only the sattelite owner have the possibility to add or remove items. The principalid of your satelite login device have to be configured in Principalid.js to be able to change your data.

# TODO List

## Optimisation Gallery

- Make the code better / refactorize to improve reusability and maintenance
- Lazyload the pictures / videos inside the swiper too
- make close swiper when clicking around the picture, also make the button bigger
- add a button to print the latest media first
- make the gallery use all the space available on mobile
- Decide how to deal with big resolution picture / video 
- when the Table is rly functionnal, add data
- video tag default for videos
- url / video tag filtered.


## Functionality

- make Iscan data encrypted with https://docs.cossacklabs.com/themis/languages/react-native/features/#secure-cell
- Add travel/home tab with maps  with function add coord and recent pic and tweet
- Add tweet archive section
- add article section

## inspiration

- https://app.papy.rs/
- https://www.watashi.fr/
- comments : https://giscus.app/fr
- https://zur5z-byaaa-aaaag-aaxeq-cai.ic0.app/tags/IC
