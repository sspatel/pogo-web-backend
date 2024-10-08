import fs from "fs";
import https from "https"
import { Pokedex as pokedex } from "../data/pokedex";
import { getLearnSetKey } from './util';

let pokemonList: any = {}
const unreleasedTag = "unreleased"

const replaceMap:Record<string,string> = {
    "_shadow": "",
    "_alolan": "_alola",
    "_galarian": "_galar",
    "_hisuian": "",
    "_female": "_f",
    "indeedee_male": "indeedee",
    "_male": "_m",
    "pikachu_kariyushi": "pikachu_pop_star",
    "pikachu_5th_anniversary": "pikachu_pop_star",
    "pikachu_flying": "pikachu_pop_star",
    "_armored": "",
    "_plant": "",
    "_overcast": "",
    "cherrim_sunny": "cherrim_sunshine",
    "_east_sea": "_east",
    "_west_sea": "",
    "_altered": "",
    "_land": "",
    "_standard": "",
    "_incarnate": "",
    "_ordinary": "",
    "_aria": "",
    "pyroar_f": "pyroar",
    "_midday": "",
    "_average": "",
    "_confined": "",
    "_amped": "_low_key",
    "_phony": "",
    "eiscue_ice": "eiscue",
    "_full_belly": "",
    "_hero": "",
    "_sword": "",
    "_shield": "",
    "_single_strike": "",
    "_ice_rider": "_ice",
    "_baile": "",
    "_solo": "",
    "_core": ""
}

function orderKeysAlphabetically(obj:any) {
    // Get the keys of the object and sort them alphabetically
    const sortedKeys = Object.keys(obj).sort();
    
    // Create a new object to store the sorted key-value pairs
    const sortedObj:Record<any,any> = {};
    
    // Iterate over the sorted keys and populate the new object
    for (const key of sortedKeys) {
        sortedObj[key] = obj[key];
    }
    
    return sortedObj;
}

const getSid = (speciesId: string, sids: Record<string,any>) => {
    // Apply replacements of the replacemap to the speciesId to match the strings of the integrated data
    for(const needle of Object.keys(replaceMap)) {
        const index:string = needle
        speciesId = speciesId.replace(needle, replaceMap[index])
    }

    // Search the object in the Array that matches the speciesId
    const sidReference: string | undefined = Object.keys(sids).find(sid => {
        let sidObj = sids[sid]
        let sidString = sidObj.base
        if (sidObj.forme) {
            sidString += "_" + sidObj.forme
        }
        sidString = sidString.replace("-", "_").replace("’", "").replace("'", "").replace(".", "").replace(":", "").replace(" ", "_").replace(/é/g, "e").toLowerCase()

        return speciesId === sidString
    });
    
    if(!sidReference)  {
        return NaN;
    }

    // Remove the "s" at the beginning and return the number
    return parseInt(sidReference.slice(1));
}

https.get("https://raw.githubusercontent.com/pvpoke/pvpoke/new-season-2024/src/data/gamemaster.json", (res) => {
    let body = ""
    res.on("data", (data) => body += data.toString());
    res.on("end", () => {
        https.get("https://raw.githubusercontent.com/smogon/sprites/master/data/species.json", res => {
            let sidBody = ""
            res.on("data", (data) => sidBody += data.toString());
            res.on("end", () => {

                let bodyJSON = JSON.parse(body).pokemon
                let sids = JSON.parse(sidBody)
        
                for(let pokemon of bodyJSON) {
                    if(pokemon.speciesId.includes("_xs")) {
                        continue;
                    }
                    
                    if(!pokemon.released) {
                        if(!pokemon.tags) {
                            pokemon.tags = []
                        }
                        pokemon.tags.push(unreleasedTag)
                    }
                    delete pokemon.released
                    delete pokemon.buddyDistance
                    delete pokemon.thirdMoveCost
                    delete pokemon.defaultIVs

                    pokemon.sid = getSid(pokemon.speciesId, sids)
                    pokemon.gender = pokedex[getLearnSetKey(pokemon.speciesId)]?.gender ?? "male"

                    if(["shellos", "gastrodon"].includes(pokemon.speciesId)) {
                        let copy = { ...pokemon };
                        copy.speciesId = pokemon.speciesId + "_west_sea"
                        copy.speciesName = pokemon.speciesName + " (West)"
                        copy.sid = getSid(copy.speciesId, sids)
                        pokemonList[copy.speciesId] = copy

                        pokemon.speciesId = pokemon.speciesId + "_east_sea"
                        pokemon.speciesName = pokemon.speciesName + " (East)"
                        pokemon.sid = getSid(pokemon.speciesId, sids)
                    }

                    pokemonList[pokemon.speciesId] = pokemon
                }
                const sortedList = orderKeysAlphabetically(pokemonList)           
                fs.writeFileSync("data/pokemon.json", JSON.stringify(sortedList, null, 2))
            })
        })
    })
})