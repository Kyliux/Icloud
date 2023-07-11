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

## TODO List

# Optimisation

- Make the code better / refactorize to improve reusability and maintenance
- Lazyload the pictures / videos inside the swiper too
- make close swiper when clicking around the picture, also make the button bigger
- add a button to print the latest media first
- make the gallery use all the space available on mobile
- center the main gallery
- Decide how to deal with big resolution picture / video 
- when the Table is rly functionnal, add data
- by default, filter the grid so that for each group of the tag1 x tag2 x tag3, only one random element is shown.
    this will be ordened so that tag1 x tag2 will be something different and higher level of tag1 x tag2 x another tag because the occurence of the 2 first tag will be superior and printed before

# Functionality

- add a ICdoc section that is essencially the same as Table but with only confidential documents
- 
