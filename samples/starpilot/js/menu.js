MENU = {};

{

document.getElementById('stage0').onclick = () => {
  LEVEL.loadLevelNum(0);
  document.getElementById('tutorial').style.display = 'block';
};
document.getElementById('stage1').onclick = () => {
  LEVEL.loadLevelNum(1);
  document.getElementById('tutorial').style.display = 'none';
};
document.getElementById('stage2').onclick = () => {
  LEVEL.loadLevelNum(2);
  document.getElementById('tutorial').style.display = 'none';
};

let shown = true;

MENU.show = () => {
  shown = true;
  document.getElementById('title').innerHTML = 'StarPilot';
  document.getElementById('menu').style.display = 'flex';
}

MENU.hide = () => {
  shown = false;
  document.getElementById('menu').style.display = 'none';
}

MENU.victory = () => {
  document.getElementById('title').innerHTML = 'Victory!';
  document.getElementById('menu').style.display = 'flex';
}

MENU.toggle = () => {
  if (shown) {
    MENU.hide();
  } else {
    MENU.show();
  }
}






}
