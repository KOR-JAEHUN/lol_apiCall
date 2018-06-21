var express = require('express');
const urlencode = require('urlencode');
const rp = require('request-promise');

var router = express.Router();

const apiKey = 'RGAPI-b31cb34d-46de-4e0e-aa8f-908a91de76d7';
const summoner_url = 'https://kr.api.riotgames.com/lol/summoner/v3/summoners/by-name';
const league_url = 'https://kr.api.riotgames.com/lol/league/v3/positions/by-summoner';

/* GET users listing. */
router.get('/', function(req, res, next) {
    let userName = urlencode(req.query.userName);
    rp(`${summoner_url}/${userName}?api_key=${apiKey}`)
        .then(body => {
            let summonerObj = JSON.parse(body);
            console.log(`소환사 아이디 : ${summonerObj['id']}`);

            let leagueArray = {};
            let leagueList = {};
            rp(`${league_url}/${summonerObj['id']}?api_key=${apiKey}`)
            .then(body => {
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
            })
            .catch(function (err) {
                res.send(err)
            })
        })
        .catch(function (err) {
            res.send(err)
        })
});

module.exports = router;
