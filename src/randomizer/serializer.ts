import type {Card} from "../dominion/card";
import {DominionSets} from "../dominion/dominion-sets";
import {Kingdom} from "./kingdom";
import type {SupplyCard} from "../dominion/supply-card";
import {Metadata as KingdomMetadata} from "./kingdom";
import {Supply, Replacements} from "../randomizer/supply";
import { Landmark } from "../dominion/landmark";
import { Way } from "../dominion/way";

export function serializeKingdom(kingdom: Kingdom): {[index: string]: string} {
  const result: {[index: string]: string} = {
    ...serializeMetadata(kingdom.metadata),
    supply: serializeCards(kingdom.supply.supplyCards)
  };
  if (kingdom.supply.baneCard) {
    result.bane = serializeCards([kingdom.supply.baneCard]);
  } 
  if (kingdom.events.length) {
    result.events = serializeCards(kingdom.events);
  }
  if (kingdom.landmarks.length) {
    if (kingdom.supply.obeliskCard) {
      const landmarkToSerialize=[...kingdom.landmarks]
      for (const index in landmarkToSerialize)
      {
        if (landmarkToSerialize[index].id == "empires_landmark_obelisk") {
          landmarkToSerialize[index] = new Landmark(
                landmarkToSerialize[index].id, 
                landmarkToSerialize[index].shortId+"("+kingdom.supply.obeliskCard.shortId+")",
                landmarkToSerialize[index].setId,
                landmarkToSerialize[index].name,
                landmarkToSerialize[index].orderstring,
                landmarkToSerialize[index].cost)
        }
      }
      result.landmarks = serializeCards(landmarkToSerialize);
    } else {
      result.landmarks = serializeCards(kingdom.landmarks);
    }
  }
  if (kingdom.projects.length) {
    result.projects = serializeCards(kingdom.projects);
  }
  if (kingdom.boons.length) {
    result.boons = serializeCards(kingdom.boons);
  }
  if (kingdom.ways.length) {
    if (kingdom.supply.mouseWay) {
      const wayToSerialize=[...kingdom.ways]
      for (const index in wayToSerialize)
      {
        if (wayToSerialize[index].id == "menagerie_way_wayofthemouse") {
          wayToSerialize[index] = new Way(
            wayToSerialize[index].id, 
            wayToSerialize[index].shortId+"("+kingdom.supply.mouseWay.shortId+")",
            wayToSerialize[index].setId,
            wayToSerialize[index].name,
            wayToSerialize[index].orderstring,
            wayToSerialize[index].cost)
        }
      }
      result.ways = serializeCards(wayToSerialize);
    } else {
      result.ways = serializeCards(kingdom.ways);
    }
  }
  if (kingdom.ally) {
    result.ally = serializeCards([kingdom.ally]);
  }
  if (kingdom.traits.length) {
    result.traits = serializeCards(kingdom.traits)
  }
  console
  /*
      lang=en&
      supply=coven,youngwitch,gatekeeper,hostelry,huntinglodge,livery,mastermind,paddock,stockpile,supplies
      &bane=hamlet
      &events=populate
      &landmarks=obelisk(coven)
      //&obeliskCard=coven
      &ways=wayofthemouse(menagerie)
      //&mouseWayCard=menagerie
      &traits=poor,rich
  */
  return result;
}

export function deserializeKingdom(serializedKingdom: any, selectedSets: string[]): Kingdom | null {
  const serializedSupply = serializedKingdom.supply || serializedKingdom.cards;
  const supplyIds = parseCommaSeparatedValues(serializedSupply)
  console.log("deserialized supplyIds", supplyIds)

  // Only use the deserialized kingdom if the supply exists.
  if (!supplyIds || !supplyIds.length) {
    return null;
  }

  const baneIds = parseCommaSeparatedValues(serializedKingdom.bane) || [];
  const eventIds = parseCommaSeparatedValues(serializedKingdom.events) || [];
  // const  landmarkIds = parseCommaSeparatedValues(serializedKingdom.landmarks) || [];
  const [obeliskCardIds, landmarkIds] = extractStringParenthesis(parseCommaSeparatedValues(serializedKingdom.landmarks) || [])
  const projectIds = parseCommaSeparatedValues(serializedKingdom.projects) || [];
  const boonIds = parseCommaSeparatedValues(serializedKingdom.boons) || [];
  // const wayIds = parseCommaSeparatedValues(serializedKingdom.ways) || [];
  const [mouseWayCardIds, wayIds] = extractStringParenthesis(parseCommaSeparatedValues(serializedKingdom.ways) || [])
  const allyIds = parseCommaSeparatedValues(serializedKingdom.ally) || [];
  const traitIds = parseCommaSeparatedValues(serializedKingdom.traits) || [];
  
  const supplyCards = findByIds(supplyIds, DominionSets.getSupplyCardById, "", selectedSets).slice(0, 10);
  //const supplyCards = findByIds(supplyIds, DominionSets.getSupplyCardById).slice(0, 10);
  let baneCard: SupplyCard | null = null;
  if (baneIds.length) {
     baneCard = findByIds(baneIds, DominionSets.getSupplyCardById, "", selectedSets)[0] || null;
  }
  const events = findByIds(eventIds, DominionSets.getEventById, "event_", selectedSets).slice(0, 2);
  const landmarks =
      findByIds(landmarkIds, DominionSets.getLandmarkById, "landmark_", selectedSets).slice(0, Math.max(0, 2 - events.length));
  let obeliskCard: SupplyCard | null = null;
  if (obeliskCardIds.length) {
    obeliskCard = findByIds(obeliskCardIds, DominionSets.getSupplyCardById, "", selectedSets)[0] || null;
 }
  const projects = 
      findByIds(projectIds, DominionSets.getProjectById, "project_", selectedSets)
          .slice(0, Math.max(0, 2 - events.length - landmarks.length));
  const ways = 
      findByIds(wayIds, DominionSets.getWayById, "way_", selectedSets)
          .slice(0, Math.max(0, 2 - events.length - landmarks.length - projects.length));
  let mouseWayCard: SupplyCard | null = null;
  if (mouseWayCardIds.length) {
    mouseWayCard = findByIds(mouseWayCardIds, DominionSets.getSupplyCardById, "", selectedSets)[0] || null;
  }
  const traits = 
      findByIds(traitIds, DominionSets.getTraitById, "trait_", selectedSets)
          .slice(0, Math.max(0, 2 - events.length - landmarks.length - projects.length - ways.length));
  const allies = findByIds(allyIds, DominionSets.getAllyById, "ally_", selectedSets).slice(0, 1);
  const boons = findByIds(boonIds, DominionSets.getBoonById, "boon_", selectedSets).slice(0, 3);
  const supply = new Supply(supplyCards, baneCard, obeliskCard, mouseWayCard, [], Replacements.empty());

  return new Kingdom(
               Date.now(),                                /* id: number,  */
               supply,                                    /* supply: Supply, */
               events,                                    /* events: Event[], */
               landmarks,                                 /* landmarks: Landmark[], */
               projects,                                  /* projects: Project[], */
               ways,                                      /* ways: Way[], */
               boons,                                     /* boons: Boon[], */
               allies[0] || null,                         /* allies: Ally | null */
               traits,                                    /* traits: Trait[] */
       deserializeMetadata(serializedKingdom)
  );
}

function serializeCards<T extends Card>(cards: T[]): string {
  if (!cards.length) {
    return "";
  }
  return cards.map((card) => card.shortId).sort().join(",");
}

function serializeMetadata(metadata: KingdomMetadata): {[index: string]: string} {
  const result: {[index: string]: string} = {};
  if (metadata.useColonies) {
    result.colonies = "1";
  }
  if (metadata.useShelters) {
    result.shelters = "1";
  }
  return result;
}

function deserializeMetadata(serializedKingdom: any): KingdomMetadata {
  return new KingdomMetadata(
    parseBoolean(serializedKingdom.colonies),
    parseBoolean(serializedKingdom.shelters)
  );
}


function findByIds<T>(ids: string[], lookupFn: (id: string) => T, ext?: string, filteredSet?: string[])  : T[] {
  const results = [];
  if (typeof filteredSet !== 'undefined' ) {
    for (const id of ids) {
      try {
        for (const set of filteredSet) {
          try {
            results.push(lookupFn(set+'_'+ ext + id));
            break;
          } catch (e) {
            // Silently catch failed lookups of 'set'_'id'
          }
        }
      } catch (e) {
        // Silently catch failed lookups for 'id'
      }
    }
  } else {
    for (const id of ids) {
      try {
        results.push(lookupFn(id));
      } catch (e) {
        // Silently catch failed lookups.
      }
    }
  }
  return results;
} 

function parseCommaSeparatedValues(value: any | null): string[] | null {
  if (typeof value === "string" ) return value ? value.split(",") : null;
  return null;
}

function parseBoolean(value: string | null): boolean {
  return value == "1" || value == "true";
}

function extractStringParenthesis(arr: string[]): [string [], string[]] {
  const array1: string[] = [];
  const array2: string[] = [];
  for (let str of arr) {
    const match = str.match(/^(.*?)\((.*?)\)$/); // recherche la chaine entre ()
    if (match) {
      array1.push(match[2]); // ajoute la chaîne entre () à l'array1
      array2.push(match[1]); // ajoute la chaîne avant () à l'array2
    } else {
      array2.push(str); // sinon ajoute la string à l'array2
    }
  }
  return [array1, array2];
}