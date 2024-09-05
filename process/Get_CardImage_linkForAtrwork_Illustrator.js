import axios from 'axios';
import fs from 'fs/promises'; // Using promises for async/await
import Jfs from 'fs';
import path from 'path';

import Loader from './loader.js'; // read <set>.yaml
import resize from './resize.js'; // resize an Image

import select, { Separator } from '@inquirer/select';
import checkbox from '@inquirer/checkbox';

const sets = Loader.loadSets(); // Assuming loadSets is async function

const WORK_DIR = "processed"
const CARDS_DIR = "cards"
const ARTWORK_DIR = "artworks2"
const DOC_IMG = "processed/docs/img"

let Request = ""
let matchExpr = ""

async function getInfos(InfoType, cards) {
  for (let i = 0; i < cards.length; i++) {
    switch (InfoType) {
      case 'Illustrator':
      case 'ArtworkInfo':
      case 'CardImage':
      case 'CardArtwork':
        await getCardInfo((cards[i]), InfoType)
        break;
      default:
        console.log("Invalid InfoType")
    }
  }
}

async function getCardInfo(card, type) {
  //console.log(card.name)
  switch (type) {
    case 'ArtworkInfo':
    case 'CardArtwork':
      cleanCardName(card)
      Request = `https://wiki.dominionstrategy.com/index.php/File:${card.name.replace(/\s/g, "_")}Art.jpg`;
      matchExpr = /class="fullImageLink" id="file"><a href="(\/images\/[^.]+)/
      break
    case 'Illustrator':
      Request = `https://wiki.dominionstrategy.com/index.php/${card.name.replace(/\s/g, "_")}`;
      matchExpr = /Illustrator\(s\)<.th>[ |\n]+<td class="" style="">[ |\n]+<a href=".index.php.[^>]+>([^<]+)<.a>/
      break
    case 'CardImage':
      Request = `https://wiki.dominionstrategy.com/index.php/File:${card.name.replace(/\s/g, "_")}.jpg`;
      matchExpr = /class="fullImageLink" id="file"><a href="(\/images\/[^.]+)/
      break;
  }
  //console.log('requesting ' + Request)
  const response = await axios.get(Request)
    .catch(function (error) {
      console.log(`\n\n============> error getting URL: ${card.name}\n`);
      console.log('url = ' + Request)
    })
  if (!response || response.status != 200) {
    console.log(`\n============>Invalid URL: ${card.name}\n`);
    console.log('url = ' + Request)
    return;
  }
  const match = response.data.match(matchExpr);
  if (!match || match.length < 2) {
    console.log(`\nUnable to find match for ${card.name} in URL : ${Request}`);
    return;
  }
  switch (type) {
    case 'ArtworkInfo':
      console.log(`<img alt="File:${card.name}Art.jpg" src="${match[1]}.jpg" width="287" height="209"></img>`)
      break
    case 'Illustrator':
      console.log(`${card.setId}##${match[1]}##${card.name}`)
      break
    case 'CardImage':
    case 'CardArtwork':
      const imageUrl = `https://wiki.dominionstrategy.com${match[1]}.jpg`;
      console.log("matched : Getting " + imageUrl)
      const imageResponse = await axios.get(imageUrl, { responseType: "stream" });
      let tempFilename = path.join(WORK_DIR, CARDS_DIR, card.setId, card.id + '.jpg');
      let outputFilename = path.join(DOC_IMG, CARDS_DIR, card.setId, card.id + '.jpg')
      if (type == 'CardArtwork') tempFilename = path.join(WORK_DIR, ARTWORK_DIR, match[1] + '.jpg');
      if (type == 'CardArtwork') outputFilename = path.join(DOC_IMG, ARTWORK_DIR, match[1] + '.jpg');

      Jfs.mkdirSync(path.dirname(tempFilename), { recursive: true });
      Jfs.mkdirSync(path.dirname(outputFilename), { recursive: true });
      
      const writer = Jfs.createWriteStream(tempFilename);
      imageResponse.data.pipe(writer);

      return new Promise((resolve) => {
        writer.on("finish", () => {
          resize(tempFilename, type, outputFilename, card.id);
          resolve(); 
        });
      });
      break;
  }
}
// Function to get all cards from a set (including sub-categories)
function getCards(set) {
  const cards = set.cards || [];
  if (set.events) cards.push(...set.events);
  if (set.landmarks) cards.push(...set.landmarks);
  if (set.projects) cards.push(...set.projects);
  if (set.boons) cards.push(...set.boons);
  if (set.ways) cards.push(...set.ways);
  if (set.allies) cards.push(...set.allies);
  if (set.traits) cards.push(...set.traits);
  if (set.othercards) cards.push(...set.othercards
    .filter(card => card.type != "Mat Vertical")
    .filter(card => card.type != "Mat Horizontal")
    .filter(card => card.type != "Tokens")
    .filter(card => card.type != "advToken")
  );
  return cards;
}

// Fonction pour agréger toutes les cartes de tous les sets
function getAllCards() {
  const allCards = [];
  for (const set of Object.values(sets)) { 
    allCards.push(...getCards(set));
  }
  return allCards;
}

function cleanCardName(card) {
  // used only for CardArtwork
  switch (card.setId) {
    case 'adventures':
      const exceptionForSpace = ['Bridge Troll','Haunted Woods', 'Wine Merchant', 'Scouting Party', 'Lost Arts' ];
      if (exceptionForSpace.indexOf(card.name) >= 0) card.name = card.name.replace(" ", "");
      break;
    case 'allies':
      if (card.name.endsWith(" - to hide split card")) {
        card.name = card.name.replace(" - to hide split card", "");
      }
      break
    case 'empires':
      if (card.name.includes(" / ") | card.name.endsWith(" - to hide split card")) {
        card.name = card.name.replace(" - to hide split card", "").replace(" / ", "_");
      }
      //card.name = card.name.replace("'", "");
      break
    case 'promos':
      if (card.name.includes(" / ")) {
        card.name = card.name.replace(" - to hide split card", "").replace(" / ", "_");
      }
      break
    case 'hinterlands':
    case 'hinterlands2':
    case 'hinterlands2add':
      card.name = card.name.replace("-", "");
      break;
    case 'alchemy':
      card.name = card.name.replace("'", "");
      break;
    case 'prosperity':
    case 'prosperity2':
    case 'prosperity2add':
      card.name = card.name.replace("'", "");
      break;

    default:
  };
}

/*
 * Program main activity
 *  - give choice of information to retrieve: 
 *      Illustrator or Artwork or Card Image
 *  - Select 1 set (dominion expansion) to query
 *  - Within this set select either all the cards or a selection 
 *  
 *  Run GetInfos with type of information and cards list
 */

/* Define Illustrator or Artwork */
const type = await select({
  message: "Select a type: Illustrator or Artwork or ...",
  choices: [
    { name: 'Illustrator', value: 'Illustrator' },
    { name: 'Artwork', value: 'ArtworkInfo' },
    { name: 'Card Image', value: 'CardImage' },
    { name: 'Card Artwork', value: 'CardArtwork' },
  ]
});

/* Define Set to query */
const setChoices = Object.keys(sets).map(setName => ({
  name: setName,
  value: setName
}));

const selectedSet = await select({
  message: "Select a set",
  choices: [
    { name: 'All sets', value: 'ALL_SETS' },
    new Separator(),
    ...setChoices
  ],
  pageSize: 15,
  loop: false
});

let selectedCards
if (selectedSet.includes('ALL_SETS')) { selectedCards = getAllCards()
} else {
  /* Define Cards to query */
  selectedCards = await checkbox({
    message: "Select cards - no selection = Cancel",
    choices: [
      { name: 'All cards', value: 'ALL_CARDS' },
      new Separator(),
      ...getCards(sets[selectedSet]).map(card => ({
        name: card.name,
        value: card
      }))
    ],
    pageSize: 15,
    loop: false
  });
  if (selectedCards.includes('ALL_CARDS')) { selectedCards = getCards(sets[selectedSet]) }
} 

/* Query */
getInfos(type, selectedCards);
if (selectedCards.length === 0) { console.log("No cards selected."); }


