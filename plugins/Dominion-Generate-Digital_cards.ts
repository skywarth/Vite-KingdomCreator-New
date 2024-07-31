import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx'; 

// for function Convert_to_CSV
const ArtworkFileDir = 'design'
const ArtworkFileName = 'artwork.xlsx'
const DigitalCardFileName = 'digital-cards - '
const DigitalCardDir = 'src/dominion/digital_cards'

// Fonction pour convertir le fichier xlsx de messages traduit en CSV
export function Generate_Digitalcard (setid:string) {
  console.log("Starting Generation")
  const inputfile = path.join(ArtworkFileDir, ArtworkFileName)
  const outputfile = path.join(DigitalCardDir, DigitalCardFileName + setid +'.ts')
  XLSX.set_fs(fs);

  // Charger le fichier Excel source
  const workbook = XLSX.readFile(inputfile);
    // Sélectionner la feuille "Digital_cards"
  const worksheet = workbook.Sheets['digital_cards'];
    // Définir la plage à copier (A1:C250)
  const range = getRange(setid);
  
  const mydata = XLSX.utils.sheet_to_json(worksheet, { range });
  // Convertir les données en une chaîne de caractères, chaque ligne étant séparée par des retours à la ligne
  //const textData = mydata.map(row => Object.values(row as string ).join('\t')).join('\n');

  const textData = `import type { DigitalCard } from "./digital-cards-type";

export const Cards_list_${setid}: DigitalCard[] = [

${mydata.map(row => Object.values(row as string).join('\t')).join('\n')}



];`;
  
  // Écrire les données dans le fichier texte
  fs.writeFileSync(outputfile, textData);


}

function getRange(setid:string) {
  // Tableau associatif pour mapper les valeurs de setid aux valeurs de range
  const rangeMap: { [key: string]: string }  = {
    'Promo': 'A1610:C1649',
    'setid2': 'range2',
    // ... ajoutez les autres paires ici
    'setid10': 'range10'
  };

  // Récupérer la valeur de range associée à setid
  const range = rangeMap[setid] 

  // Si aucune valeur correspondante n'est trouvée, retourner une valeur par défaut ou gérer l'erreur
  return range ;
}
