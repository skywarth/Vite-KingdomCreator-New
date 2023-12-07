import fs from 'fs';
import path from 'path';

import { loadSets, loadKingdoms } from './DominionContent-LoadFunc';

const languages = ['fr', 'de', 'es', 'nl', 'pl']; // Liste des langues à fusionner
const ProjectBaseDir = process.cwd();
const languageSourceDir = 'src/i18n/locales'
const languageDestDir = 'docs/locales'

//  `DominionContentGeneration` is responsible for generating the Dominion content files.
export async function DominionContentGenerate() {
  //console.log('in DominionContentGenerate generating docs/dominion-content.js')
  const contentString = "window.DominionSets=" + JSON.stringify(loadSets()) +
    ";window.DominionKingdoms=" + JSON.stringify(loadKingdoms()) + ";";
  fs.writeFileSync(path.join(ProjectBaseDir, 'docs/dominion-content.js'), 
    contentString, { encoding: 'utf8', flag: 'w', mode: 0o666 })
};

// Fonction pour merger ds JSON dans un seul fichier JSON
export function mergeJSONLanguageFiles() {
  for (const lang of languages) {
    // Chemins vers les répertoires contenant les fichiers JSON à fusionner
    const messagesDir = path.join(ProjectBaseDir, languageSourceDir, 'messages', lang);
    const cardsDir = path.join(ProjectBaseDir, languageSourceDir, 'messages', lang, 'cards');
    //console.log(messagesDir)

    // Chemin vers le fichier de sortie
    const outputFile = path.join(ProjectBaseDir, languageDestDir, `${lang}.json`);
    testExistAndCreateDir(path.join(ProjectBaseDir, languageDestDir));

    // Fusionne tous les fichiers JSON dans le répertoire messagesDir
    const messagesFiles = fs.readdirSync(messagesDir)
      .filter(file => file.includes(`.${lang}.`) && file.endsWith('.json'))
      .map(file => path.join(messagesDir, file));
    //console.log(messagesFiles)
    const messages = messagesFiles.reduce((result, file) => {
      const data = readJsonFile(file);
      return { ...result, ...data };
    }, {});
    // Fusionne tous les fichiers JSON dans le répertoire cardsDir
    let cards
    if (fs.existsSync(cardsDir)) {
      const cardsFiles = fs.readdirSync(cardsDir)
        .filter(file => file.includes(`.${lang}.`) && file.endsWith('.json'))
        .map(file => path.join(cardsDir, file));

      cards = cardsFiles.reduce((result, file) => {
        const data = readJsonFile(file);
        return { ...result, ...data };
      }, {});
    }
    // Fusionne les données et écrit le fichier de sortie
    const mergedData = { ...messages, ...cards };
    //console.log(outputFile)

    writeJsonFile(outputFile, mergedData);
  }

}

// Fonction pour créer une struture de répertoire si elle n'existe pas
function testExistAndCreateDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Fonction pour lire le contenu d'un fichier JSON
function readJsonFile(filePath: string): any {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

// Fonction pour écrire le contenu d'un objet dans un fichier JSON
function writeJsonFile(filePath: string, data: any) {
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, json, 'utf8');
}
