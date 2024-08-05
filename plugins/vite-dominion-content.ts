import fs from 'fs';
import path from 'path';

import { loadSets, loadKingdoms } from './DominionContent-LoadFunc';
import { mergeJSONLanguageFiles, Convert_to_CSV } from './DominionLocaleGeneration-Funcs'
import { Generate_Digitalcard } from './Dominion-Generate-Digital_cards'
const ProjectBaseDir = process.cwd();

//  `DominionContentGeneration` is responsible for generating the Dominion content files.
export async function DominionContentGenerate(destdir:string) {

  const contentString = "window.DominionSets=" + JSON.stringify(loadSets()) +
    ";window.DominionKingdoms=" + JSON.stringify(loadKingdoms()) + ";";
  fs.writeFileSync(path.join(ProjectBaseDir, destdir + '/dominion-content.js'), 
    contentString, { encoding: 'utf8', flag: 'w', mode: 0o666 })
};

export function HandleLocaleGenerateAndMerge(type: string, destdir: string) {
  if (type == "Gen&Merge") {
    Generate_Digitalcard('Baseset')
    Generate_Digitalcard('Alchemy')
    Generate_Digitalcard('Seaside')
    Generate_Digitalcard('Cornucopia')
    Generate_Digitalcard('Prosperity')
    Generate_Digitalcard('Intrigue')
    Generate_Digitalcard('Guilds')
    Generate_Digitalcard('Hinterlands')
    Generate_Digitalcard('Darkages')
    Generate_Digitalcard('Adventures')
    Generate_Digitalcard('Empires')
    Generate_Digitalcard('Nocturne')
    Generate_Digitalcard('Renaissance')
    Generate_Digitalcard('Promo')
    Generate_Digitalcard('Menagerie')
    Generate_Digitalcard('Allies')
    Generate_Digitalcard('Plunder')
    Generate_Digitalcard('Guildscornucopia')






    Convert_to_CSV()
    mergeJSONLanguageFiles(destdir)
  }
  if (type =="Merge") {
    mergeJSONLanguageFiles(destdir)
  }
}