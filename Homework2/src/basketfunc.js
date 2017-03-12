// basketfunc.js
const rev = {

  processGameData: function(gameData) {
    let str = "";
    //console.log(gameData.g.hls.pstsg);
    // Game ID and Date/Time
    str = 'Game ID: ' + gameData.g.gid + ', ' + gameData.g.gdtutc + '\n=====\n';
    // Final Score
    const team1 = gameData.g.hls.pstsg;
    const team2 = gameData.g.vls.pstsg;
    function calcScore(team) {
      let obj = {};
      const array = [];
      team.forEach(function(element) {
        obj = element;
        array.push(obj.ftm);
        array.push((obj.fgm - obj.tpm)*2);
        array.push(obj.tpm * 3);
      });
      const score = array.reduce((a, b) => a + b);
      return score;
    }
    const score1 = calcScore(team1);
    const score2 = calcScore(team2);

    const finalStr = gameData.g.hls.tc + ' ' + gameData.g.hls.tn + ' - ' + score1 + '\n' + gameData.g.vls.tc + ' ' + gameData.g.vls.tn + ' - ' + score2 + '\n';
    str += finalStr;
    // Player With the Most Rebounds
    function calcMaxRebounds(team) {
      let obj = {};
      let max = 0;
      let maxName = "";
      team.forEach(function(element) {
        obj = element;
        const rebs = obj.oreb + obj.dreb;
        const name = obj.fn + ' ' + obj.ln;
        if(rebs > max) {
          max = rebs;
          maxName = name;
        }
      });
      return [maxName, max];
    }
    const rebounds = calcMaxRebounds(team1);
    const rebounds2 = calcMaxRebounds(team2);

    let finalRebStr = "";
    if(rebounds[1] > rebounds2[1]) {
      finalRebStr = rebounds[0] + ' with ' + rebounds[1];
    } else if (rebounds2[1] > rebounds[1]){
      finalRebStr = rebounds2[0] + ' with ' + rebounds2[1];
    } else {
      finalRebStr = rebounds[0] + ' and ' + rebounds2[1] + ' tie with ' + rebounds[1];
    }
    const mostRebounds = '* Most rebounds: ' + finalRebStr + '\n';
    str += mostRebounds;
    // Player with Highest 3 Pointer Percentage
    function calcPercent(team) {
      let obj = {};
      let max = 0;
      let maxName = "";
      let maxFrac = "";
      team.forEach(function(element) {
        obj = element;
        const tpaPercent = obj.tpm / obj.tpa;
        const name = obj.fn + ' ' + obj.ln;
        const frac = '('+ obj.tpm + '/' + obj.tpa +')';
        if(obj.tpa >= 5 && tpaPercent > max) {
          max = tpaPercent;
          maxName = name;
          maxFrac = frac;
        }
      }); return [maxName, max, maxFrac];
    }
    const percentTeam1 = calcPercent(team1);
    const percentTeam2 = calcPercent(team2);
    let strPer = "";
    if(percentTeam1[1] > percentTeam2[1]) {
      strPer = percentTeam1[0] + 'at %' + (Math.round((percentTeam1[1]*100) * 100) / 100)+ ' ' + percentTeam1[2];
    } else if(percentTeam2[1]>percentTeam1[1]) {
      strPer = percentTeam2[0] + ' at %' + (Math.round((percentTeam2[1]*100) * 100) / 100) + ' ' + percentTeam2[2];
    }
    const pointerPercentage = '* Player with highest 3 point percentage that took at least 5 shots: ' + strPer;
    str += pointerPercentage;
    // Total Number of Players with at Least One Block
    function calcBlocks(team) {
      let obj = {};
      const blockArray = [];
      team.forEach(function(ele) {
        obj = ele;
        blockArray.push(obj.blk);
      });
      const newArray = blockArray.filter(function(word) {
        return word > 0;
      });
      return newArray.length;
    }
    const blocks = calcBlocks(team1) + calcBlocks(team2);
    const strBlocks = '\n* There were ' + blocks + ' players that had at least one block';
    str += strBlocks;
    //  Players with more Turnovers than Assists
    function calcTurnovers(team) {
      const finalArray = [];
      let obj = {};
      team.forEach(function(element) {
        function appendText(value) {
          const newValue = value.concat(' has an assist to turnover ratio of ' + obj.ast + ':' + obj.tov);
          return newValue;
        }
        let newArray = [];
        obj = element;
        const name = obj.fn + ' ' + obj.ln;
        if(obj.tov > obj.ast) {
          newArray.push(name);
          newArray = newArray.map(appendText);
          finalArray.push(newArray);
        }
      });
       return finalArray;
    }
    const turnovers1 = calcTurnovers(team1);
    const turnovers2 = calcTurnovers(team2);
    let strAssists = '\n* Players with more turnovers than assists:\n\t' + gameData.g.hls.tc + ' - ' + gameData.g.hls.tn + '\n';
    turnovers1.forEach(function(ele) {
      ele = '\t* ' + ele + '\n';
      strAssists += ele;
    });
    strAssists += '\n\t'+ gameData.g.vls.tc + ' - ' + gameData.g.vls.tn + '\n';
    turnovers2.forEach(function(ele) {
      ele = '\t* ' + ele + '\n';
      strAssists += ele;
    });
    str += strAssists;
    return str;
  }

};

module.exports = rev;
