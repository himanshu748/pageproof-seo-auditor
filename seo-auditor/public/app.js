const $ = id => document.getElementById(id);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let session, report, busy = false;

function node(tag, content, cls) {
  const element = document.createElement(tag);
  if (content !== undefined) element.textContent = content;
  if (cls) element.className = cls;
  return element;
}
function enter(elements, duration = 250) {
  if (reducedMotion.matches) return;
  elements.forEach((element, index) => element.animate(
    [{opacity: 0, transform: 'translateY(10px)'}, {opacity: 1, transform: 'translateY(0)'}],
    {duration, delay: Math.min(index * 55, 220), easing: 'cubic-bezier(.2,0,0,1)'}
  ));
}
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) document.getAnimations().forEach(animation => animation.cancel());
});
function controls(disabled) {
  busy = disabled;
  $('submit').disabled = disabled || !session?.enabled || session.remaining <= 0;
  $('open-saved').disabled = disabled || !$('saved').value;
  $('saved').disabled = disabled;
  $('audit-form').setAttribute('aria-busy', String(disabled));
  for (const button of document.querySelectorAll('[data-fixture]')) button.disabled = disabled;
}
function status(message, kind) {
  $('status').className = 'status ' + kind;
  $('status').textContent = message;
}
async function responseJson(response) {
  let data;
  try { data = await response.json(); }
  catch { throw new Error('The local server returned an unreadable response. Reload the page and try again.'); }
  if (!response.ok) throw new Error(data.message || 'The saved report is unavailable. Choose another receipt or reload the page.');
  return data;
}
async function configure() {
  try {
    session = await responseJson(await fetch('/api/session'));
    $('credit-state').textContent = session.enabled ? `${session.remaining} of ${session.cap} live attempts remaining` : 'Fixtures available / live access needs setup';
    $('submit').textContent = !session.enabled ? 'Live access needs setup' : session.remaining <= 0 ? 'Live budget exhausted' : 'Run live audit ↗';
    const unavailable = !session.enabled || session.remaining <= 0;
    $('availability-note').hidden = !unavailable;
    $('availability-note').textContent = !session.enabled
      ? 'Live access is not configured. Explore the labeled fixtures and any saved reports below.'
      : 'Your configured live allowance has been used. Saved receipts and fixtures remain available without new API calls.';
    const selected = $('saved').value;
    const receipts = await responseJson(await fetch('/api/receipts'));
    $('receipts').hidden = !receipts.length;
    const placeholder = node('option', 'Choose an audit...');
    placeholder.value = '';
    $('saved').replaceChildren(placeholder, ...receipts.map(receipt => {
      const option = node('option', receipt.url + ' · ' + new Date(receipt.observedAt).toLocaleString());
      option.value = receipt.id;
      return option;
    }));
    if (receipts.some(receipt => receipt.id === selected)) $('saved').value = selected;
    controls(busy);
  } catch {
    session = undefined;
    $('credit-state').textContent = 'Local server unavailable';
    $('submit').textContent = 'Local server unavailable';
    $('availability-note').hidden = false;
    $('availability-note').textContent = 'The local server could not be reached. Restart it and reload this page to continue.';
    controls(busy);
  }
}
function renderChecks() {
  const checks = $('checks');
  checks.replaceChildren();
  for (const finding of report.findings.filter(f => $('filter').value === 'all' || f.status === $('filter').value)) {
    const item = node('article', undefined, 'check');
    const top = node('div', undefined, 'check-top');
    top.append(node('span', finding.status, 'badge ' + finding.status.replace(' ', '-')), node('h3', finding.name));
    item.append(top, node('p', finding.impact, 'impact'));
    const evidence = node('details', undefined, 'evidence');
    evidence.append(node('summary', 'Supporting evidence · ' + finding.source), node('pre', finding.evidence));
    const fix = node('p', undefined, 'fix');
    fix.append(node('strong', 'Specific fix '), document.createTextNode(finding.fix));
    item.append(evidence, fix);
    checks.append(item);
  }
  if (!checks.children.length) checks.append(node('p', 'No checks in this category. Choose another filter to see the report.', 'small'));
  enter(Array.from(checks.children).slice(0, 4));
}
function show(result) {
  if (!result || !Array.isArray(result.findings) || !result.score || !result.observations) throw new Error('This saved report is incomplete. Choose another receipt.');
  report = result;
  $('report').hidden = false;
  $('empty').hidden = true;
  $('filter').value = 'all';
  $('mode').textContent = result.mode === 'live' ? 'Genuine live TinyFish receipt' : 'Synthetic fixture / TinyFish not called';
  $('mode').classList.toggle('fixture', result.mode === 'fixture');
  $('report-url').textContent = result.url;
  $('report-time').textContent = `Measured ${new Date(result.observedAt).toLocaleString()} · ID ${result.id}`;
  $('score-number').textContent = result.score.value ?? 'N/A';
  $('score-label').textContent = result.score.value === null ? 'No measured score' : 'Page hygiene / 100';
  $('coverage').textContent = result.score.coverage + '% measurement coverage';
  const dom = result.observations.dom;
  const limit = dom.ok && dom.data.limited ? ` Rendered snapshot limited: ${dom.data.blockedRequests} requests blocked; ${dom.data.settle}.` : '';
  $('coverage-detail').textContent = `${result.score.measured} of ${result.score.total} scored checks measured. Unknowns excluded.${limit}`;
  $('map-caption').textContent = result.mode === 'fixture'
    ? 'Viewing a synthetic fixture. No TinyFish requests were made.'
    : 'Viewing a live receipt measured at ' + new Date(result.observedAt).toLocaleTimeString() + '.';
  $('counts').replaceChildren(...['fail', 'warning', 'pass', 'not tested'].map(s => node('span', `${result.findings.filter(f => f.status === s).length} ${s}`, 'badge ' + s.replace(' ', '-'))));
  $('priorities-list').replaceChildren(...result.priorities.map(finding => {
    const li = node('li');
    li.append(node('strong', finding.name), node('p', finding.fix));
    return li;
  }));
  if (!result.priorities.length) $('priorities-list').append(node('li', 'No measured warnings or fails. Review coverage before drawing conclusions.'));
  $('html-download').href = `/api/reports/${result.id}.html`;
  $('json-download').href = `/api/reports/${result.id}.json`;
  $('html-download').download = '';
  $('json-download').download = '';
  $('formula').textContent = result.score.formula;
  $('calculation').textContent = `Weighted earned value ${result.score.earned} / available measured weight ${result.score.available}.`;
  $('limits').replaceChildren(...result.limits.map(value => node('li', value)));
  renderChecks();
  enter([$('report').querySelector('.report-top'), $('report').querySelector('.summary')]);
  $('report-title').focus({preventScroll: true});
}
async function run(path, input) {
  if (busy) return;
  controls(true);
  const live = path === '/api/audit';
  document.querySelector('.evidence-map').classList.toggle('map-working', live);
  status(live ? 'Reading the permitted page with TinyFish. Access checks, Search, Fetch and rendered DOM can take several minutes.' : 'Loading a synthetic fixture. No API calls or credit use.', 'working');
  try {
    if (!session) await configure();
    if (!session) throw new Error('The local server is unavailable. Restart it and reload this page.');
    const response = await fetch(path, {method: 'POST', headers: {'Content-Type': 'application/json', 'X-Audit-Token': session.token}, body: JSON.stringify(input)});
    const result = await responseJson(response);
    show(result);
    status(result.mode === 'live' ? 'Live audit complete. Review coverage and any not-tested checks.' : 'Synthetic fixture loaded. This is separate from genuine live evidence.', 'success');
    await configure();
  } catch (error) {
    status(error.message || 'The request failed. No measurements were invented.', 'error');
  } finally {
    document.querySelector('.evidence-map').classList.remove('map-working');
    controls(false);
  }
}
$('audit-form').addEventListener('submit', event => {
  event.preventDefault();
  run('/api/audit', {url: $('url').value.trim(), query: $('query').value.trim(), permitted: $('permitted').checked});
});
for (const button of document.querySelectorAll('[data-fixture]')) button.addEventListener('click', () => run('/api/fixture', {name: button.dataset.fixture}));
$('filter').addEventListener('change', renderChecks);
$('saved').addEventListener('change', () => controls(busy));
$('open-saved').addEventListener('click', async () => {
  if (!$('saved').value || busy) return;
  const id = $('saved').value;
  controls(true);
  status('Opening the saved live receipt. No new TinyFish calls.', 'working');
  try {
    const result = await responseJson(await fetch('/api/reports/' + id + '.json'));
    show(result);
    status(result.mode === 'live' ? 'Saved genuine live receipt opened. The original measurement time is preserved; no new TinyFish calls.' : 'Synthetic fixture opened. TinyFish was not called.', 'success');
  } catch (error) {
    status(error.message || 'The saved receipt is unavailable. Choose another report.', 'error');
  } finally { controls(false); }
});
enter([$('page-title'), document.querySelector('.evidence-map'), document.querySelector('.lede'), document.querySelector('.audit-box')], 480);
configure();
