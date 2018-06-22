var express = require('express');
const urlencode = require('urlencode');
const rp = require('request-promise');
var router = express.Router();

const apiKey = 'RGAPI-d7189126-4223-464b-8a53-21a10f4be925';
const summoner_url = 'https://kr.api.riotgames.com/lol/summoner/v3/summoners/by-name';
const league_url = 'https://kr.api.riotgames.com/lol/league/v3/positions/by-summoner';

/* GET users listing. */
router.get('/', function(req, res, next) {
    let userName = urlencode(req.query.userName);
    let summonerObj = {}
    rp(`${summoner_url}/${userName}?api_key=${apiKey}`)
    .then(body => {

        summonerObj = JSON.parse(body);
        console.log(`소환사 아이디 : ${summonerObj['id']}`);
        return rp(`${league_url}/${summonerObj['id']}?api_key=${apiKey}`)

    }).then(body => {
        console.log(body);
        let leagueArray = {};
        let leagueList = {};
        let leagueObj = JSON.parse(body);

        for(let index in leagueObj){
            let obj = leagueObj[index];
            if(obj.queueType == 'RANKED_FLEX_SR'){
                leagueArray['FLEX_SOLO'] = obj;
            }else if(obj.queueType == 'RANKED_SOLO_5x5'){
                leagueArray['SOLO'] = obj;
            }else{
                leagueArray['ETC'] = obj;
            }
        }
        leagueList['LeagueList'] = leagueArray;
        let data = Object.assign(summonerObj, leagueList);
        res.send(data)

    }).catch(err => {
        res.send(err)
    })
});

module.exports = router;
