import axios from 'axios';
import Loader from './loader.js'; // Assuming loader.js uses ES modules
import fs from 'fs/promises'; // Using promises for async/await
import Jfs from 'fs';
import resize from './resize.js'

const sets = Loader.loadSets(); // Assuming loadSets is async function

const WORK_CARDS = "processed/cards"
const DOC_IMG = "processed/docs/img/cards"
// Enable logging for debugging
const trace = false;

async function getImages(cards) {
  for (let i = 0; i < cards.length; i++) {
    console.log(cards[i].id);
    await getImage(cards[i]);
  }
}

async function getImage(card) {
  console.log("Requesting : " + createPageUrl(card))

  const response = await axios.get(createPageUrl(card))
      .catch(function (error) {
        // handle error
        console.log(`\n\n============> error getting URL: ${card.name}\n`);
      })
  if (!response || response.status != 200) {
    console.log(`============>Invalid URL: ${card.name}\n`);
    return;
  }
  const match1 = response.data.match(/\.jpg\"\ssrc=\"(.+?.jpg)\"/);
  const match = response.data.match(/class="fullImageLink" id="file"><a href="(\/images\/[^.]+)/);

  if (!match || match.length < 2) {
    console.log(`Unable to find URL: ${card.name}`);
    return;
  }

  const imageUrl = `https://wiki.dominionstrategy.com${match[1]}.jpg`;
  console.log("matched : Getting " + imageUrl)
  const imageResponse = await axios.get( imageUrl, { responseType: "stream" });
  const tempFilename = `${WORK_CARDS}/${card.setId}/${card.id}.jpg`;

  await fs.mkdir(`${DOC_IMG}/${card.setId}`, { recursive: true }); // Create directories recursively
  await fs.mkdir(`${WORK_CARDS}/${card.setId}`, { recursive: true }); // Create directories recursively

  const writer = Jfs.createWriteStream(tempFilename);
  imageResponse.data.pipe(writer);

  return new Promise((resolve) => {
    writer.on("finish", () => {
      resize(tempFilename, `${DOC_IMG}/${card.setId}/${card.id}.jpg`);
      resolve();
    });
  });
}

function createPageUrl(card) {
  const name = card.name.replace(/\s/g, "_");
  return `https://wiki.dominionstrategy.com/index.php/File:${name}.jpg`;
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

function cleanCardName(card) {
  switch (card.setId) {
    case 'allies' :
      if (card.name.endsWith(" - to hide split card")) {
       card.name = card.name.replace(" - to hide split card", "");
      }
    break
    case 'empires' :
      if (card.name.includes(" / ") | card.name.endsWith(" - to hide split card")){
          card.name = card.name.replace(" - to hide split card", "").replace(" / ", "_");
      }
    break
    case 'promos' :
      if (card.name.includes(" / ")) {
        card.name = card.name.replace(" - to hide split card", "").replace(" / ", "_");
      }
    break
    default:  
  };
}


/*
 * Program main activity
 *  - Select 1 set (dominion expansion) to query
 *  - Within this set select either all the cards or a selection 
 *  
 *  Run GetImages for cards list
 */

/* Define Set to query */
const setChoices = Object.keys(sets).map(setName => ({ name: setName,
  value: setName }));

const selectedSet = await select({
  message: "Select a set",
  choices: setChoices,
  pageSize: 15,
  loop: false
});

/* Define Cards to query */
let selectedCards = await checkbox({
  message: "Select cards",
  choices: [
    { name: 'All cards', value: 'ALL_CARDS'},
    new Separator(),
    ...getCards(sets[selectedSet]).map(card => ({
      name: card.name,
      value: card
    }))
  ],
  pageSize: 15,
  loop: false
});
if (selectedCards.includes('ALL_CARDS')) { selectedCards=getCards(sets[selectedSet]) }

/* Query */
getImages(selectedCards)
