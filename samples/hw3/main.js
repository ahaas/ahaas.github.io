MAIN = {};

(function() {

// Set up size
var mapWidth = 1000;
var mapHeight = 750;

// Set up projection that the map is using
var scale = 190000;
var projection = d3.geoMercator()
  .center([-122.061578, 37.385532]) 
  .scale(scale)
  .translate([mapWidth / 2, mapHeight / 2]);

// This is the mapping between <longitude, latitude> position to <x, y> pixel position on the map
// projection is a function and it has an inverse:
// projection([lon, lat]) returns [x, y]
// projection.invert([x, y]) returns [lon, lat]

let svg = d3.select('#svg');

// Add SVG map at correct size, assuming map is saved in a subdirectory called `data`
svg.append('image')
  .attr('width', mapWidth)
  .attr('height', mapHeight)
  .attr('xlink:href', 'data/map.svg');

// Get [x, y] for d.
function prj(d) {
  return projection([d.Longitude, d.Latitude]);
}

let data = [];

var colorScale = d3.scaleLinear().domain([0, 60, 80, 100]).range(['red', 'orange', 'yellow', 'green']);
const legend = d3.legendColor()
  .scale(colorScale)
d3.select('#legend').call(legend);
d3.csv('data/data.csv').then((loadedData) => {
  MAIN.data = data = loadedData;
  const newdata = svg.selectAll('circle.data')
      .data(data)
      .enter();
  newdata.append('circle')
          .attr('class', 'graydata')
          .attr('cx', (d) => prj(d)[0])
          .attr('cy', (d) => prj(d)[1])
          .attr('fill', 'rgba(150,150,150,0.4)');
  newdata.append('circle')
          .attr('class', 'data')
          .attr('cx', (d) => prj(d)[0])
          .attr('cy', (d) => prj(d)[1])
          .attr('fill', (d) => d.scaleColor = colorScale(d.Score))
          .attr('score', d => d.Score)
          .attr('grade', d => d.Grade)
          .on('mouseover', handleDataMouseOver)
          .on('mouseout', handleDataMouseOut)
  initSelectors();
  updateDataColor();
  d3.select('#loading').remove();
});

const datumInfo = d3.select('#datum-info');
function handleDataMouseOver(d) {
  datumInfo
      .style('display', 'block')
      .style('left', d3.event.pageX + 'px')
      .style('top', d3.event.pageY + 'px')
      .html([
        d.Name,
        'Address: ' + d.Address,
        'Score: ' + d.Score,
        'Grade: ' + d.Grade,
      ].join('<br>'))
}
function handleDataMouseOut() {
  datumInfo.style('display', 'none');
  //d3.select('#data-info').attr('style', 'display: none');
}

DEFAULT_SELECTOR_RADIUS = 10;

let selectors = [];

function initSelectors() {
  svg.selectAll('circle.selector')
      .data([
          {id: 'A', selectionRadius: 200, x: 300, y: 300},
          {id: 'B', selectionRadius: 250, x: 550, y: 470} 
      ]).enter().append('circle')
      .attr('id', (d) => 'selector-' + d.id)
      .attr('class', 'selector')
      .attr('r', DEFAULT_SELECTOR_RADIUS)
      .attr('selr', (d) => d.selectionRadius + 'px')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .call(d3.drag().on('drag', handleDrag))
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut);
  selectors = svg.selectAll('circle.selector').data();
  updateDataColor();
  drawSelectors();
}

function updateDataColor() {
  svg.selectAll('circle.data')
      .attr('visible', (d) => isSelected(d));
}

function handleDrag(d) {
  drawSelectors();
  d3.select(this)
      .attr('cx', d.x = d3.event.x)
      .attr('cy', d.y = d3.event.y);
  updateDataColor();
}

function dist(x1, y1, x2, y2) {
  const a = x1 - x2;
  const b = y1 - y2;
  return Math.hypot(a, b);
}

// d is a datapoint from the restaurants dataset.
function isSelected(d) {
  let selected = true;
  selectors.forEach(s => {
    if (!selected ||
        dist(s.x, s.y, prj(d)[0], prj(d)[1]) > s.selectionRadius) {
      selected = false;
    }
  });
  if (!selected) return false;
  if (+d.Score < minHS) return false;
  if (+d.Score > maxHS) return false;
  return true;
}


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSelector(d) {
  ctx.strokeStyle = "rgba(0,0,0, 0.3)";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.arc(d.x, d.y, d.selectionRadius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawSelectors() {
  clearCanvas();
  selectors.forEach(d => drawSelector(d));
}

function handleMouseOver(d) {
  drawSelectors();
}

function handleMouseOut(d) {
  //clearCanvas();
}


d3.selectAll('.radius-sel')
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
      .on('input', handleRadiusChange);

const PX_TO_DIST = 0.0331;
function handleRadiusChange() {
  let selector;
  if (this.id == 'radius-A') {
    selector = d3.select('#selector-A');
    d3.select('#rad-a-val').html(Math.round(this.value*PX_TO_DIST) + ' mi');
  } else {
    selector = d3.select('#selector-B');
    d3.select('#rad-b-val').html(Math.round(this.value*PX_TO_DIST) + ' mi');
  }
  selector.data()[0].selectionRadius = +this.value;
  drawSelectors();
  updateDataColor();
}

let minHS = 0;
let maxHS = 100;

d3.select('#hs-min').on('input', function() {
  minHS = +this.value;
  updateDataColor();
});

d3.select('#hs-max').on('input', function() {
  maxHS = +this.value;
  updateDataColor();
});

})();
