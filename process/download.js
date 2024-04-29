import axios from 'axios';
import Loader from './loader.js'; // Assuming loader.js uses ES modules
import fs from 'fs/promises'; // Using promises for async/await
import resize from './resize.js';

const sets = await Loader.loadSets(); // Assuming loadSets is async function

// Enable logging for debugging
const trace = false;

// Function to get all cards from a set (including sub-categories)
function getCards(set) {
  const cards = set.cards || [];
  if (set.events) cards.push(...set.events);
  if (set.landmarks) cards.push(...set.landmarks);
  if (set.projects) cards.push(...set.projects);
  if (set.boons) cards.push(...set.boons);
  if (set.ways) cards.push(...set.ways);
  if (set.allies) cards.push(...set.allies);
  if (set.othercards) cards.push(...set.othercards);
  return cards;
}

// Function to create the full image URL
function createPageUrl(card) {
  const name = card.name.replace(/\s/g, '_').replace(/'/g, '%27');
  return `http://wiki.dominionstrategy.com/index.php/File:${name}.jpg`;
}

// Async function to download and resize an image
async function downloadAndResizeImage(card) {
  console.log(card)
  try {
    const url = createPageUrl(card);
    console.log(`Request URL : ${url}`)
    const response = await axios.get(url, { responseType: 'stream' });

    if (response.status !== 200) {
      console.log(`Invalid URL: ${card.name}`);
      return;
    }
    //console.log(response.status)

    const name = card.name.replace(/\s/g, '_').replace(/'/g, '%27');
    //console.log(response.data)
    //const match = response.data.toString().match(/class="fullImageLink" id="file"><a href="(\/images\/[^.]+)/);
    const match = response.data.toString().match(/\.jpg\"\ssrc=\"(.+?.jpg)\"/);
    if (!match || match.length < 2) {
      console.log(`Unable to find URL: ${card.setId} - ${card.name} - ${name} for URL ${url}`);
      //console.log(response.data))
      return;
    }

    const imageUrl = `http://wiki.dominionstrategy.com${match[1]}`;
    const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });

    const tempFilename = `process/cards/${card.setId}/${card.id}.jpg`;
    await fs.mkdir(`process/cards/${card.setId}`, { recursive: true }); // Create directories recursively
    const writer = fs.createWriteStream(tempFilename);
    imageResponse.data.pipe(writer);

    await new Promise((resolve) => {
      writer.on('finish', async () => {
        await fs.mkdir('docs/img/cards', { recursive: true }); // Create directories recursively
        await resize(tempFilename, `docs/img/cards/${card.setId}/${card.id}.jpg`);
        console.log(`  ${card.id} : Complete`);
        resolve();
      });
    });
  } catch (error) {
    console.error(`Error downloading image for ${card.name}:`, error);
  }
}

// Function to process all images for a set
async function getAllImages(cards) {
  for (const card of cards) {
    if (trace) console.log(` 0 - before getImage`);
    if (!card.shortId.includes('tohide')) {
      await downloadAndResizeImage(card);
    }
  }
}

// Function to process all sets
async function processAllSets() {
  for (const setName in sets) {
    console.log(setName);
    await getAllImages(getCards(sets[setName]));
  }
}

//processAllSets();
//getAllImages(getCards(sets.plunder));
downloadAndResizeImage(sets.plunder.cards.filter(card => card.name == "Grotto")[0])


