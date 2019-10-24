import './helper.js';
import { readyStateCheck } from './helper.js';
// import fetchql from 'fetchql';"

let gamesChart;
let updateChartTimer;

readyStateCheck().then(() => load());

async function load() {
  let count = await totalStayLeave();
  gamesChart = loadGameChart(count.stay, count.leave);

  let lastCount = await lastStayLeave();
  loadLastGameChart(lastCount.stay, lastCount.leave);

  updateChartTimer = setTimeout(() => fetchAndUpdateChart(gamesChart), 5000);
}

function handleUpdate() {

}

async function fetchAndUpdateChart(chart) {
  let count = await totalStayLeave();
  console.log(count);
  updateGameChart(chart, count.stay, count.leave);
}

function updateGameChart(chart, stay, leave) {

  let max = stay > leave ? stay : leave;

  chart.data.datasets[0].data = [-leave];
  chart.data.datasets[1].data = [stay];

  chart.options.scales.xAxes[0].ticks = {
    suggestedMin: -max - max/10,
    suggestedMax: max + max/10
  };

  chart.update();
  
  clearTimeout(updateChartTimer);
  updateChartTimer = setTimeout(() => fetchAndUpdateChart(gamesChart), 5000);
}

function loadLastGameChart(stay, leave) {
  let ctx = document.getElementById('lastGameChart').getContext('2d');
  let max = stay > leave ? stay : leave;

  let myChart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
        datasets: [{
          label: 'Blast off!',
          data: [-leave],
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 2
      },
      {
        label: 'Hold the door.',
        data: [stay],
        backgroundColor: [
          
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 99, 132, 0.2)'
        ],
        borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 2
    },]
    },
    options: {
      scales: {
          xAxes: [{
              ticks: {
                suggestedMin: -max - max/10,
                suggestedMax: max + max/10
              },
              stacked: true
          }],
          yAxes: [{
              stacked: true
          }]
        }
    }
  });

  return myChart;
}

function loadGameChart(stay, leave) {
  let ctx = document.getElementById('gamesChart').getContext('2d');

  let max = stay > leave ? stay : leave;

  let myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
          datasets: [{
            label: 'Blast off!',
            data: [-leave],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 2
        },
        {
          label: 'Hold the door.',
          data: [stay],
          backgroundColor: [
            
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 2
      },]
      },
      options: {
        scales: {
            xAxes: [{
                ticks: {
                  suggestedMin: -max - max/10,
                  suggestedMax: max + max/10
                },
                stacked: true
            }],
            yAxes: [{
                stacked: true
            }]
        }
    }
  });

  return myChart;
}

async function totalStayLeave() {
  const resp = await fetchStats(gamesQ);
  const games = resp.data.games;

  let stay = 0;
  let leave = 0;

  for (let i = 0; i < games.length; i++) {
    stay += games[i].stayPresses;
    leave += games[i].leavePresses;
  }

  return {'stay': stay, 'leave': leave};
}

async function lastStayLeave() {
  const resp = await fetchStats(lastGameQ);
  const game = resp.data.lastGame;

  return {'stay': game.stayPresses, 'leave': game.leavePresses};
}

function fetchStats(query, url = URL, opts = OPTS ) {
  opts.body = JSON.stringify({ query });
  return fetch(url, opts)
    .then(resp => resp.json())
    .catch(console.error);
}

const OPTS = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// games
const gamesQ = `
query {
    games {
      id
      startTime
      endTime
      stayPresses
      leavePresses
    }
}`;

const URL = `http://hexbrew.com/graphql`;

const lastGameQ = `
  query {
    lastGame {
      id
      endTime
      stayPresses
      leavePresses
    }
  }
`;