/*
*/
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

export default function DominionContentPlugin() {
  return {
    name: 'dominion-content-plugin',
    apply: 'build', // <-- spécifie que le plugin doit s'exécuter lors de la phase build
    enforce: "post",
    async generateBundle(options, bundle) {
      const script = "window.DominionSets=" + JSON.stringify(loadSets()) +
          ";window.DominionKingdoms=" + JSON.stringify(loadKingdoms()) + ";";

      bundle['dominion-content.js'] = {
        fileName: 'dominion-content.js',
        isAsset: true,
        source: script,
        type: 'asset'
      };
    }
  };
}

function loadSets() {
  const sets = loadFilesFromDirectory(path.join(__dirname, '../sets'));
  // Add the id for each set.
  for (var setId in sets) {
    sets[setId].id = setId;
  }
  // Create an id for each card.
  for (var setId in sets) {
    var set = sets[setId];
    for (var i = 0; i < set.cards.length; i++) {
      var card = set.cards[i];
      card.id = convertToCardId(setId, card.name);
      card.shortId = tokenize(card.name);
      card.setId = setId;
    }
    if (set.events) {
      for (var i = 0; i < set.events.length; i++) {
        var card = set.events[i];
        card.id = convertToEventId(setId, card.name);
        card.shortId = tokenize(card.name);
        card.setId = setId;
      }
    }
    if (set.landmarks) {
      for (var i = 0; i < set.landmarks.length; i++) {
        var card = set.landmarks[i];
        card.id = convertToLandmarkId(setId, card.name);
        card.shortId = tokenize(card.name);
        card.setId = setId;
      }
    }
    if (set.projects) {
      for (var i = 0; i < set.projects.length; i++) {
        var card = set.projects[i];
        card.id = convertToProjectId(setId, card.name);
        card.shortId = tokenize(card.name);
        card.setId = setId;
      }
    }
    if (set.boons) {
      for (var i = 0; i < set.boons.length; i++) {
        var card = set.boons[i];
        card.id = convertToBoonId(setId, card.name);
        card.shortId = tokenize(card.name);
        card.setId = setId;
      }
    }
    if (set.ways) {
      for (var i = 0; i < set.ways.length; i++) {
        var card = set.ways[i];
        card.id = convertToWayId(setId, card.name);
        card.shortId = tokenize(card.name);
        card.setId = setId;
      }
    }
    if (set.allies) {
      for (var i = 0; i < set.allies.length; i++) {
        var card = set.allies[i];
        card.id = convertToAllyId(setId, card.name);
        card.shortId = tokenize(card.name);
        card.setId = setId;
      }
    }
    if (set.traits) {
      for (var i = 0; i < set.traits.length; i++) {
        var card = set.traits[i];
        card.id = convertToTraitId(setId, card.name);
        card.shortId = tokenize(card.name);
        card.setId = setId;
      }
    }
    if (set.othercards) {
      for (var i = 0; i < set.othercards.length; i++) {
        var card = set.othercards[i];
        card.id = convertToCardId(setId, card.name);
        card.shortId = tokenize(card.name);
        card.setId = setId;
      }
    }
  }
  return sets;
}

function loadKingdoms() {
  const kingdoms = loadFilesFromDirectory(path.join(__dirname, '../kingdoms'));
  identifyTraitSuppliesForKingdoms(kingdoms);
  return kingdoms;
}

function identifyTraitSuppliesForKingdoms(kingdomsSets) {
  Object.values(kingdomsSets).forEach((kingdomSet) => {
    Object.values(kingdomSet).forEach((kingdoms) => {
      Object.values(kingdoms).forEach((kingdom) => {
        if (kingdom.traits) {
          kingdom.traitSupplies = [];
          kingdom.traits.forEach((trait, index) => {
            if (typeof trait !== 'string') {
              console.error(`Trait at index ${index} is not a string:`, trait);
              return;
            }
            const traitParts = trait.split('->');
            if (traitParts.length === 2) {
              kingdom.traits[index] = traitParts[0];
              kingdom.traitSupplies.push(traitParts[1]);
            }
          });
        }
      });
    });
  });
}

function loadFilesFromDirectory(directory) {
  const values = {};
  const files = fs.readdirSync(directory);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(directory, files[i]);
    const id = tokenize(path.basename(files[i], '.yaml'));
    values[id] = yaml.load(fs.readFileSync(filename, 'utf8'));
  }
  return values;
}

function convertToEventId(setId, name) {
  return `${setId}_event_${tokenize(name)}`;
}

function convertToLandmarkId(setId, name) {
  return `${setId}_landmark_${tokenize(name)}`;
}

function convertToProjectId(setId, name) {
  return `${setId}_project_${tokenize(name)}`;
}

function convertToBoonId(setId, name) {
  return `${setId}_boon_${tokenize(name)}`;
}

function convertToWayId(setId, name) {
  return `${setId}_way_${tokenize(name)}`;
}

function convertToAllyId(setId, name) {
  return `${setId}_ally_${tokenize(name)}`;
}

function convertToTraitId(setId, name) {
  return `${setId}_trait_${tokenize(name)}`;
}

function convertToCardId(setId, name) {
  return `${setId}_${tokenize(name)}`;
}

function tokenize(str) {
  return str.replace(/[\s'-\/]/g, '').toLowerCase();
}