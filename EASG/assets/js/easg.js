(function () {
  'use strict';

  var body = document.body;
  var intro = document.getElementById('intro');
  var introStage = document.querySelector('.intro-stage');
  var introProgress = Array.prototype.slice.call(document.querySelectorAll('.intro-progress span'));
  var stage = 0;
  var stageLocked = false;

  function finishIntro() {
    if (!intro) return;
    intro.classList.add('hidden');
    body.classList.remove('intro-lock');
    window.setTimeout(function () { intro.classList.add('retired'); }, 700);
  }

  function updateIntro(next) {
    stage = Math.max(0, Math.min(3, next));
    if (introStage) introStage.dataset.stage = stage;
    introProgress.forEach(function (item, index) { item.classList.toggle('active', index <= stage); });
  }

  var alreadySeen = false;
  body.classList.add('intro-lock');
  updateIntro(0);
  document.getElementById('scroll-cue')?.addEventListener('click', function () {
    if (stageLocked) return;
    stageLocked = true;
    if (stage >= 3) finishIntro();
    else updateIntro(stage + 1);
    setTimeout(function () { stageLocked = false; }, 720);
  });
  if (intro) {
    intro.addEventListener('wheel', function (event) {
      if (stageLocked || alreadySeen) return;
      event.preventDefault();
      if (Math.abs(event.deltaY) < 5) return;
      stageLocked = true;
    if (event.deltaY > 0 && stage >= 3) finishIntro();
      else updateIntro(stage + (event.deltaY > 0 ? 1 : -1));
      setTimeout(function () { stageLocked = false; }, 720);
    }, { passive: false });
    var touchY = null;
    intro.addEventListener('touchstart', function (event) { touchY = event.touches[0].clientY; }, { passive: true });
    intro.addEventListener('touchend', function (event) {
      if (touchY === null || alreadySeen) return;
      var delta = touchY - event.changedTouches[0].clientY;
      if (Math.abs(delta) > 25) {
        if (delta > 0 && stage >= 3) finishIntro();
        else updateIntro(stage + (delta > 0 ? 1 : -1));
      }
      touchY = null;
    }, { passive: true });
  }

  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-section]'));
  var sectionRail = document.querySelector('.section-rail');
  var railBars = document.getElementById('rail-bars');
  var railTitle = document.getElementById('rail-title');
  var railCopy = document.getElementById('rail-copy');
  var railPreview = document.getElementById('rail-preview');
  var railItems = [
    { label: 'Intro', target: 'introduction', copy: 'EASG as an appropriate action interface.' },
    { label: 'Overview', target: 'overview', copy: 'EASG as an appropriate action interface.' },
    { label: 'METHOD', target: 'method', copy: 'A unified action interface.' },
    { label: 'METHOD · ACTION FRAME', target: 'method', copy: 'Anchor a local action frame at the current TCP.' },
    { label: 'METHOD · NATIVE ACTION', target: 'method', copy: "Serialize continuous robot actions with VLM's native textual vocabulary." },
    { label: 'Experiments', target: 'experiments', copy: 'Overview of experiment setups.' },
    { label: 'EXP · Zero-shot', target: 'zero-shot', copy: 'Qwen-3.8-27B on task group 1.' },
    { label: 'EXP · Zero-shot', target: 'data-efficiency', copy: 'Thirty demos for VLA to match EASG-VLM zero-shot.' },
    { label: 'EXP · RANDOMIZATION', target: 'randomization', copy: 'Free movement and rotation\nwithin manipulation area.' },
    { label: 'EXP · Sim', target: 'libero', copy: 'Qwen-3.5-0.8B approaches π₀-FAST on LIBERO.' },
    { label: 'EXP · FINETUNE', target: 'finetune', copy: 'VLMs can be fine-tuned beyond their zero-shot capabilities.' },
    { label: 'Cross-embodiment', target: 'cross-embodiment', copy: 'Policies trained w/ UR3 data can be transferred to Flexiv.' },
    { label: 'VLM boundary', target: 'frontier', copy: 'Zero-shot capability varies across VLM families and scales.' },
    { label: 'Ablations', target: 'ablations', copy: 'Frame and metric depth are necessary anchors for EASG to work.' },
    { label: 'Summary', target: 'summary', copy: '' }
  ];
  function updateRailPreview(label, copy, target) {
    railTitle.textContent = label;
    railCopy.textContent = copy;
    railCopy.hidden = !copy;
    var isRandomization = target === 'randomization';
    railCopy.classList.toggle('randomization-caption', isRandomization);
    if (railPreview) railPreview.classList.toggle('randomization-card', isRandomization);
  }
  var bars = [];
  railItems.forEach(function (item, index) {
    var bar = document.createElement('button');
    bar.className = 'rail-bar';
    bar.type = 'button';
    bar.setAttribute('aria-label', 'Jump to ' + item.label);
    bar.addEventListener('click', function () {
      var target = document.getElementById(item.target);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
    bar.addEventListener('mouseenter', function () {
      updateRailPreview(item.label, item.copy, item.target);
      bars.forEach(function (other, otherIndex) {
        var distance = Math.abs(otherIndex - index);
        other.style.width = distance === 0 ? '46px' : distance === 1 ? '30px' : distance === 2 ? '24px' : '18px';
      });
    });
    railBars.appendChild(bar);
    bars.push(bar);
  });
  railBars.addEventListener('mouseleave', function (event) {
    if (sectionRail && event.relatedTarget && sectionRail.contains(event.relatedTarget)) return;
    bars.forEach(function (bar) { bar.style.width = ''; });
  });
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var sectionIndex = sections.indexOf(entry.target);
      var section = sections[sectionIndex];
      var first = railItems.findIndex(function (item) { return item.target === section.id; });
      bars.forEach(function (bar, i) { bar.classList.toggle('active', i === first); });
      if (sectionRail) sectionRail.classList.toggle('dark-context', section.classList.contains('section-dark') || section.classList.contains('section-ink'));
      updateRailPreview(first >= 0 ? railItems[first].label : entry.target.dataset.section, first >= 0 ? railItems[first].copy : entry.target.dataset.railCopy || '', section.id);
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  sections.forEach(function (section) { observer.observe(section); });

  var zeroData = {
    Rigid: [
      ['1.1.1', 'Grasp the cucumber', 'assets/project/videos/videos/grasp_the_cucumber/combine-web.mp4'],
      ['1.1.2', 'Pick up the block', 'assets/project/videos/videos/pick_up_block/combine-web.mp4'],
      ['1.1.3', 'Pick up the banana and put it on the plate', 'assets/project/videos/videos/pnp_banana/combine-web.mp4']
    ],
    Articulated: [
      ['1.2.1', 'Close the laptop', 'assets/project/videos/videos/close_the_laptop/combine-web.mp4'],
      ['1.2.2', 'Push the drawer closed', 'assets/project/videos/videos/push_the_drawer_closed/combine-web.mp4']
    ],
    Deformable: [['1.3', 'Fold the towel', 'assets/project/videos/videos/fold_the_towel/combine-web.mp4']]
  };
  var zeroTypeLabel = document.getElementById('zero-type-label');
  var zeroTaskLabel = document.getElementById('zero-task-label');
  var zeroDescription = document.getElementById('zero-description');
  var zeroSwitcher = document.getElementById('zero-switcher');
  var zeroVideo = document.getElementById('zero-video');
  var zeroVideoPlaceholder = document.getElementById('zero-video-placeholder');
  var zeroVideoStatus = document.getElementById('zero-video-status');
  function renderZeroType(type, shouldPlay) {
    var items = zeroData[type];
    zeroTypeLabel.textContent = type.toUpperCase() + ' · EXTERIOR + WRIST';
    zeroSwitcher.innerHTML = '';
    items.forEach(function (item, index) {
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = item[0];
      if (index === 0) button.className = 'active';
      button.addEventListener('click', function () { renderZeroTask(item, button, true); });
      zeroSwitcher.appendChild(button);
    });
    renderZeroTask(items[0], zeroSwitcher.querySelector('button'), Boolean(shouldPlay));
  }
  function renderZeroTask(item, activeButton, shouldPlay) {
    zeroTaskLabel.textContent = item[0] + ' · ' + item[1];
    zeroDescription.textContent = item[1];
    if (item[2]) {
      if (zeroVideo.dataset.source !== item[2]) {
        zeroVideo.src = item[2];
        zeroVideo.dataset.source = item[2];
        zeroVideo.load();
      }
      zeroVideo.hidden = false;
      zeroVideoPlaceholder.hidden = true;
      zeroVideoStatus.textContent = 'ZERO-SHOT VIDEO';
      if (shouldPlay) zeroVideo.play().catch(function () {});
      else zeroVideo.pause();
    } else {
      zeroVideo.pause();
      zeroVideo.hidden = true;
      zeroVideoPlaceholder.hidden = false;
      zeroVideoStatus.textContent = 'VIDEO PLACEHOLDER';
    }
    zeroSwitcher.querySelectorAll('button').forEach(function (button) { button.classList.toggle('active', button === activeButton); });
  }
  document.querySelectorAll('.task-type').forEach(function (button) {
    button.addEventListener('click', function () {
      document.querySelectorAll('.task-type').forEach(function (other) { other.classList.remove('active'); });
      button.classList.add('active');
      renderZeroType(button.dataset.type, true);
    });
  });
  renderZeroType('Rigid', false);

  var demoReadout = document.getElementById('demo-readout');
  var demoScore = document.getElementById('demo-score');
  var demoSeriesLayer = document.getElementById('demo-series-layer');
  var demoChart = document.getElementById('demo-chart');
  var demoSteps = [10, 20, 30, 40, 50];
  var demoX = [76, 228, 380, 532, 684];
  var demoBaselines = [
    { key: 'pi05', label: 'π₀.₅', color: '#5DB3AE', values: [43.9, 60.6, 76.1, 90.6, 96.7] },
    { key: 'pifast', label: 'π₀-FAST', color: '#F09137', values: [30.6, 43.9, 56.7, 77.8, 85.6] },
    { key: 'groot', label: 'GR00T N1.6', color: '#9B74D6', values: [38.9, 53.9, 67.8, 88.9, 95.6] },
    { key: 'openvla', label: 'OpenVLA-OFT', color: '#497DB0', values: [41.1, 55.0, 66.1, 82.8, 88.9] }
  ];
  var selectedDemo = '10';
  var previousDemoIndex = -1;
  var svgNamespace = 'http://www.w3.org/2000/svg';
  function demoY(value) { return 258 - (value / 100) * 232; }
  demoBaselines.forEach(function (series) {
    var group = document.createElementNS(svgNamespace, 'g');
    group.classList.add('demo-series-group');
    group.dataset.series = series.key;
    group.style.setProperty('--series-color', series.color);
    for (var segmentIndex = 1; segmentIndex < series.values.length; segmentIndex += 1) {
      var segment = document.createElementNS(svgNamespace, 'line');
      segment.classList.add('demo-segment');
      segment.dataset.index = String(segmentIndex);
      segment.setAttribute('x1', demoX[segmentIndex - 1]);
      segment.setAttribute('y1', demoY(series.values[segmentIndex - 1]).toFixed(2));
      segment.setAttribute('x2', demoX[segmentIndex]);
      segment.setAttribute('y2', demoY(series.values[segmentIndex]).toFixed(2));
      group.appendChild(segment);
    }
    series.values.forEach(function (value, pointIndex) {
      var point = document.createElementNS(svgNamespace, 'circle');
      point.classList.add('demo-point');
      point.dataset.index = String(pointIndex);
      point.setAttribute('cx', demoX[pointIndex]);
      point.setAttribute('cy', demoY(value).toFixed(2));
      point.setAttribute('r', '5.6');
      group.appendChild(point);
    });
    demoSeriesLayer.appendChild(group);
  });
  function renderDemoScores(index) {
    while (demoScore.firstChild) demoScore.removeChild(demoScore.firstChild);
    demoBaselines.forEach(function (series) {
      var row = document.createElement('div');
      var dot = document.createElement('i');
      var label = document.createElement('span');
      var score = document.createElement('b');
      row.className = 'demo-score-row';
      row.style.setProperty('--series-color', series.color);
      label.textContent = series.label;
      score.textContent = series.values[index].toFixed(1) + '%';
      row.appendChild(dot);
      row.appendChild(label);
      row.appendChild(score);
      demoScore.appendChild(row);
    });
  }
  function chooseDemo(value) {
    selectedDemo = String(value);
    var selectedIndex = demoSteps.indexOf(Number(value));
    document.querySelectorAll('.chart-x button').forEach(function (item) { item.classList.toggle('active', item.dataset.demo === selectedDemo); });
    demoChart.dataset.level = selectedDemo;
    demoReadout.textContent = value;
    renderDemoScores(selectedIndex);
    document.querySelectorAll('.demo-segment').forEach(function (segment) {
      var index = Number(segment.dataset.index);
      var isVisible = index <= selectedIndex;
      segment.classList.toggle('is-visible', isVisible);
      if (isVisible && index > previousDemoIndex) {
        var length = segment.getTotalLength();
        segment.style.transition = 'none';
        segment.style.strokeDasharray = String(length);
        segment.style.strokeDashoffset = String(length);
        window.requestAnimationFrame(function () {
          segment.style.transition = 'opacity .25s ease, stroke-dashoffset .58s cubic-bezier(.2,.75,.2,1)';
          segment.style.strokeDashoffset = '0';
        });
      } else if (!isVisible) {
        segment.style.strokeDashoffset = '0';
      }
    });
    document.querySelectorAll('.demo-point').forEach(function (point) {
      var index = Number(point.dataset.index);
      point.classList.toggle('is-visible', index <= selectedIndex);
      point.classList.toggle('is-selected', index === selectedIndex);
    });
    previousDemoIndex = selectedIndex;
  }
  document.querySelectorAll('.chart-x button[data-demo]').forEach(function (item) { item.addEventListener('click', function () { chooseDemo(item.dataset.demo); }); });
  chooseDemo(selectedDemo);

  var randomizationData = {
    cucumber: { title: '1.1.1 · Grasp the cucumber' },
    cube: { title: '1.1.2 · Pick up the block' },
    banana: { title: '1.1.3 · Pick up the banana and put it on the plate' },
    laptop: { title: '1.2.1 · Close laptop' },
    drawer: { title: '1.2.2 · Close the drawer' },
    towel: { title: '1.3 · Fold the towel' }
  };
  var randomizationPanel = document.getElementById('randomization-panel');
  var randomizationVideoTask = document.getElementById('randomization-video-task');
  var randomizationButtons = document.querySelectorAll('[data-randomization-task]');
  function selectRandomizationTask(key) {
    var setting = randomizationData[key];
    if (!setting || !randomizationPanel) return;
    randomizationPanel.dataset.task = key;
    if (randomizationVideoTask) randomizationVideoTask.textContent = setting.title;
    randomizationButtons.forEach(function (button) {
      var active = button.dataset.randomizationTask === key;
      button.classList.toggle('active', active);
      if (button.getAttribute('role') === 'tab') button.setAttribute('aria-selected', String(active));
      else button.setAttribute('aria-pressed', String(active));
    });
  }
  randomizationButtons.forEach(function (button) {
    button.addEventListener('click', function () { selectRandomizationTask(button.dataset.randomizationTask); });
  });
  selectRandomizationTask('cucumber');

  document.querySelectorAll('.method-toggle').forEach(function (button) {
    button.addEventListener('click', function () {
      var method = button.dataset.method;
      button.classList.toggle('active');
      var data = document.querySelector('.radar-' + method);
      data.classList.toggle('visible', button.classList.contains('active'));
      var values = document.querySelector('.radar-values-' + method);
      if (values) values.classList.toggle('visible', button.classList.contains('active'));
    });
  });
  document.querySelector('.radar-ours').classList.add('visible');
  document.querySelector('.radar-values-ours').classList.add('visible');

  var finetuneDescriptions = {
    '2.1': 'Task 2.1 · Fold the T-shirt in half.', '2.2': 'Task 2.2 · Open the laptop.', '2.3.1': 'Task 2.3.1 · Pick up the ring and place it on a peg.', '2.3.2': 'Task 2.3.2 · Hang the cup on the peg.', '2.4.1': 'Task 2.4.1 · Open the drawer, then place the Rubik\'s Cube inside.', '2.4.2': 'Task 2.4.2 · Place the grapes in the drawer, then close it.'
  };
  var finePanel = document.getElementById('finetune-panel');
  var fineCopy = document.getElementById('finetune-description');
  document.querySelectorAll('.task-index').forEach(function (button) {
    button.addEventListener('click', function () {
      if (button.classList.contains('active') && finePanel.classList.contains('open')) {
        button.classList.remove('active');
        finePanel.classList.remove('open');
        return;
      }
      document.querySelectorAll('.task-index').forEach(function (other) { other.classList.remove('active'); });
      button.classList.add('active');
      fineCopy.textContent = finetuneDescriptions[button.dataset.finetune];
      finePanel.classList.add('open');
    });
  });
  var crossCopy = document.getElementById('cross-description');
  var crossPanel = document.getElementById('cross-panel');
  document.querySelectorAll('[data-cross]').forEach(function (button) {
    button.addEventListener('click', function () {
      if (button.classList.contains('active') && crossPanel.classList.contains('open')) {
        button.classList.remove('active');
        crossPanel.classList.remove('open');
        return;
      }
      document.querySelectorAll('[data-cross]').forEach(function (other) { other.classList.remove('active'); });
      button.classList.add('active');
      crossCopy.textContent = 'Task ' + button.dataset.cross + ' · ' + finetuneDescriptions[button.dataset.cross].replace(/^Task [^·]+· /, '');
      crossPanel.classList.add('open');
    });
  });

  var taskBubble = document.getElementById('task-bubble');
  var bubbleTitle = document.getElementById('bubble-title');
  var bubbleCopy = document.getElementById('bubble-copy');
  var bubbleImage = taskBubble ? taskBubble.querySelector('img') : null;
  document.querySelectorAll('[data-task-info]').forEach(function (button) {
    button.addEventListener('mouseenter', function () {
      var parts = button.dataset.taskInfo.split('|');
      bubbleTitle.textContent = parts[0];
      bubbleCopy.textContent = parts[1];
      if (bubbleImage && parts[2]) {
        bubbleImage.src = parts[2];
        bubbleImage.alt = 'Task ' + parts[0] + ' wrist-camera view with the EASG TCP frame';
      }
      taskBubble.classList.add('visible');
    });
    button.addEventListener('mouseleave', function () { taskBubble.classList.remove('visible'); });
    button.addEventListener('focus', function () { button.dispatchEvent(new Event('mouseenter')); });
    button.addEventListener('blur', function () { button.dispatchEvent(new Event('mouseleave')); });
  });

  var ablTitle = document.getElementById('abl-title');
  var ablCopy = document.getElementById('abl-copy');
  var ablGcd = document.getElementById('abl-gcd');
  var ablCopyMap = {
    'w/ TCP frame + Metric Depth': 'It\'s EASG\'s main setting:\nwith the TCP-centered action frame projected into the wrist view\nand metric depth preserving physical information.',
    'w/ TCP frame + w/o Metric Depth': 'The TCP frame remains visible, but without metric depth the same visual displacement does not specify a reliable physical distance.',
    'w/ Wrist-camera frame + Metric Depth': 'A wrist-camera frame supplies view-relative axes, but they are not aligned to the controllable tool center.',
    'w/ Wrist-camera frame + w/o Metric Depth': 'The view-relative frame is not TCP-centered, and reliable physical distance is removed as well.',
    'w/ Robot-base frame + Metric Depth': 'The robot-base frame is embodiment-specific and not directly visible in the robot observation.',
    'w/ Robot-base frame + w/o Metric Depth': 'The base-relative frame is both embodiment-specific and missing reliable metric distance.',
    'w/o any frame + Metric Depth': 'Metric depth provides scale, but no frame tells the model which direction its action coordinates refer to.',
    'w/o any frame + w/o Metric Depth': 'Removing both geometric anchors leaves the action semantics implicit; all tested tasks reach zero success.'
  };
  document.querySelectorAll('.matrix-cell').forEach(function (cell) {
    cell.addEventListener('click', function () {
      document.querySelectorAll('.matrix-cell').forEach(function (other) { other.classList.remove('active'); });
      cell.classList.add('active'); ablTitle.textContent = cell.dataset.abl;
      var copyLines = ablCopyMap[cell.dataset.abl].split('\n');
      ablCopy.replaceChildren();
      copyLines.forEach(function (line, index) {
        if (index === 0 && cell.dataset.abl === 'w/ TCP frame + Metric Depth') {
          var wave = document.createElement('span');
          wave.className = 'ablation-wave';
          wave.textContent = line;
          ablCopy.appendChild(wave);
        } else {
          ablCopy.appendChild(document.createTextNode(line));
        }
        if (index < copyLines.length - 1) ablCopy.appendChild(document.createElement('br'));
      });
      if (ablGcd) ablGcd.hidden = cell.dataset.abl !== 'w/ TCP frame + Metric Depth';
    });
  });

  var copyBibtex = document.getElementById('copy-bibtex');
  var bibtexCode = document.getElementById('bibtex-code');
  if (copyBibtex && bibtexCode) {
    copyBibtex.addEventListener('click', function () {
      var text = bibtexCode.textContent;
      var finishCopy = function () {
        copyBibtex.textContent = 'Copied';
        window.setTimeout(function () { copyBibtex.textContent = 'Copy BibTeX'; }, 1400);
      };
      var fallbackCopy = function () {
        var area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        area.remove();
        finishCopy();
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(finishCopy).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var href = link.getAttribute('href');
      if (href === '#top') {
        event.preventDefault();
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        return;
      }
      var target = document.querySelector(href);
      if (!target) return;
      event.preventDefault(); target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}());
