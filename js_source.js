let state = { search: '', pos: 'ALL', card: 'ALL', showAll: false, player: null, level: 1, b1: null, b2: null, posTokens: [], pts: {} };
const CATS = ['shooting', 'passing', 'dribbling', 'dexterity', 'lowerBody', 'aerial', 'defending', 'gk1', 'gk2', 'gk3'];

const BOOSTERS = [
    { id: 'strikers_instinct', name: "Striker's Instinct +1", stats: { attackingAwareness: 1, ballControl: 1, dribbling: 1, finishing: 1 } },
    { id: 'agility', name: "Agility +1", stats: { speed: 1, acceleration: 1, balance: 1, stamina: 1 } },
    { id: 'balancer', name: "Balancer +1", stats: { attackingAwareness: 1, acceleration: 1, stamina: 1, defensiveAwareness: 1 } },
    { id: 'ball_carrying', name: "Ball-carrying +1", stats: { dribbling: 1, tightPossession: 1, balance: 1, speed: 1 } },
    { id: 'duelling', name: "Duelling +1", stats: { defensiveAwareness: 1, tackling: 1, aggression: 1, physicalContact: 1 } },
    { id: 'fantasista', name: "Fantasista +1", stats: { ballControl: 1, dribbling: 1, tightPossession: 1, finishing: 1 } },
    { id: 'freekick', name: "Free-kick Taking +1", stats: { finishing: 1, placeKicking: 1, curl: 1, kickingPower: 1 } },
    { id: 'goalkeeping', name: "Goalkeeping +1", stats: { gkAwareness: 1, gkCatching: 1, gkParrying: 1, gkReflexes: 1 } },
    { id: 'passing', name: "Passing +1", stats: { lowPass: 1, loftedPass: 1, curl: 1, kickingPower: 1 } },
    { id: 'shooting', name: "Shooting +1", stats: { finishing: 1, kickingPower: 1, curl: 1, physicalContact: 1 } },
    { id: 'shutdown', name: "Shutdown +1", stats: { defensiveAwareness: 1, tackling: 1, defensiveEngagement: 1, speed: 1 } }
];

const ARCHETYPES = {
    wizard:       [87,92,93,92,85,82,86,62,86,89, 83,89,81,64,65,91,79, 48,45,50,47, 40,40,40,40,40],
    striker:      [90,84,83,82,76,71,90,84,78,80, 89,88,88,83,82,81,82, 46,44,55,48, 40,40,40,40,40],
    holePlayer:   [86,88,87,88,86,83,84,74,79,82, 84,86,83,75,76,85,86, 66,64,68,67, 40,40,40,40,40],
    orchestrator: [81,90,87,90,91,90,78,66,87,88, 78,81,83,68,71,86,85, 74,73,72,75, 40,40,40,40,40],
    destroyerDmf: [72,81,79,80,83,82,70,81,68,70, 81,80,84,84,87,77,89, 88,89,90,89, 40,40,40,40,40],
    centerBack:   [60,74,70,72,77,78,58,88,60,61, 82,79,79,89,90,73,83, 90,91,89,90, 40,40,40,40,40],
    fullback:     [77,82,83,81,81,84,69,72,75,81, 89,90,82,76,75,83,89, 82,84,82,83, 40,40,40,40,40],
    goalkeeper:   [45,58,52,54,64,72,42,56,68,48, 62,64,83,85,82,68,66, 52,48,50,50, 90,88,89,91,90]
};
const STAT_KEYS = ['attackingAwareness','ballControl','dribbling','tightPossession','lowPass','loftedPass','finishing','heading','placeKicking','curl','speed','acceleration','kickingPower','jump','physicalContact','balance','stamina','defensiveAwareness','tackling','aggression','defensiveEngagement','gkAwareness','gkCatching','gkParrying','gkReflexes','gkReach'];

function buildStats(type, boost = 0) {
    const arr = ARCHETYPES[type] || ARCHETYPES.wizard;
    const obj = {};
    STAT_KEYS.forEach((k, i) => obj[k] = arr[i] > 45 ? Math.min(99, arr[i] + boost) : arr[i]);
    return obj;
}

// 1. LINK ẢNH LOCAL: Đặt file ảnh PNG cùng thư mục với file HTML
const PLAYERS = [
    { id: 1, name: "Lionel Messi", eraDate: "01 Dec '09", image: "messi_2009.png", pos: "SS", baseOvr: 90, maxOvr: 107, card: "BigTime", theme: "card-bigtime", booster: "fantasista", fullPos: ["SS","RWF","AMF"], secPos: ["CF","RMF"], club: "FC Barcelona '09", nation: "Argentina", style: "Roaming Flank", maxLvl: 35, age: 22, height: 170, foot: "Left", arch: "wizard", boost: 3, skills: ["Double Touch","Marseille Turn","Long-Range Curler","First-time Shot","One-touch Pass","Through Passing"] },
    { id: 2, name: "Lamine Yamal", eraDate: "Live '26", image: "yamal_2026.png", pos: "RWF", baseOvr: 87, maxOvr: 105, card: "Trending", theme: "card-trending", booster: "ball_carrying", fullPos: ["RWF","RMF"], secPos: ["AMF","SS","LWF"], club: "FC Barcelona", nation: "Spain", style: "Prolific Winger", maxLvl: 38, age: 19, height: 180, foot: "Left", arch: "wizard", boost: 3, skills: ["Double Touch","Flip Flap","Long-Range Curler","Outside Curler","Through Passing","Pinpoint Crossing"] },
    { id: 3, name: "Cristiano Ronaldo", eraDate: "21 May '08", image: "cr7_2008.png", pos: "LWF", baseOvr: 89, maxOvr: 106, card: "BigTime", theme: "card-bigtime", booster: "shooting", fullPos: ["LWF","CF","RWF"], secPos: ["SS","LMF","RMF"], club: "Man Utd '08", nation: "Portugal", style: "Prolific Winger", maxLvl: 35, age: 23, height: 187, foot: "Right", arch: "striker", boost: 3, skills: ["Knuckle Shot","Scissors Feint","Long-Range Shooting","Heading","First-time Shot","Aerial Superiority"] },
    { id: 4, name: "Jude Bellingham", eraDate: "Live '26", image: "bellingham_2026.png", pos: "AMF", baseOvr: 87, maxOvr: 104, card: "ShowTime", theme: "card-showtime", booster: "balancer", fullPos: ["AMF","CMF"], secPos: ["SS","LMF","DMF"], club: "Madrid Chamartin", nation: "England", style: "Hole Player", maxLvl: 33, age: 23, height: 186, foot: "Right", arch: "holePlayer", boost: 2, skills: ["Double Touch","Marseille Turn","First-time Shot","One-touch Pass","Through Passing","Interception"] },
    { id: 5, name: "Thierry Henry", eraDate: "16 Nov '02", image: "henry_2002.png", pos: "CF", baseOvr: 89, maxOvr: 106, card: "BigTime", theme: "card-bigtime", booster: "strikers_instinct", fullPos: ["CF","LWF"], secPos: ["SS","LMF"], club: "Arsenal FC", nation: "France", style: "Goal Poacher", maxLvl: 35, age: 25, height: 188, foot: "Right", arch: "striker", boost: 3, skills: ["Double Touch","Long-Range Curler","First-time Shot","Outside Curler","Chip Shot Control","One-touch Pass"] },
    { id: 6, name: "Patrick Vieira", eraDate: "15 May '04", image: "vieira_2004.png", pos: "DMF", baseOvr: 88, maxOvr: 106, card: "BigTime", theme: "card-bigtime", booster: "duelling", fullPos: ["DMF","CMF"], secPos: ["CB"], club: "Arsenal FC", nation: "France", style: "Destroyer", maxLvl: 34, age: 27, height: 192, foot: "Right", arch: "destroyerDmf", boost: 3, skills: ["Man Marking","Interception","Blocker","Aerial Superiority","Sliding Tackle","Fighting Spirit"] },
    { id: 7, name: "Andrea Pirlo", eraDate: "09 Jul '06", image: "pirlo_2006.png", pos: "CMF", baseOvr: 87, maxOvr: 104, card: "Epic", theme: "card-epic", booster: "passing", fullPos: ["CMF","DMF"], secPos: ["AMF"], club: "Milano RN", nation: "Italy", style: "Orchestrator", maxLvl: 33, age: 27, height: 177, foot: "Right", arch: "orchestrator", boost: 2, skills: ["One-touch Pass","Through Passing","Weighted Pass","Low Lofted Pass","Pinpoint Crossing","Long-Range Curler"] },
    { id: 8, name: "Paolo Maldini", eraDate: "28 May '03", image: "maldini_2003.png", pos: "CB", baseOvr: 88, maxOvr: 105, card: "BigTime", theme: "card-bigtime", booster: "shutdown", fullPos: ["CB","LB"], secPos: ["RB"], club: "Milano RN", nation: "Italy", style: "Build Up", maxLvl: 34, age: 34, height: 186, foot: "Right", arch: "centerBack", boost: 3, skills: ["Man Marking","Interception","Blocker","Aerial Superiority","Sliding Tackle","Acrobatic Clearance"] },
    { id: 9, name: "Roberto Carlos", eraDate: "30 Jun '02", image: "carlos_2002.png", pos: "LB", baseOvr: 87, maxOvr: 104, card: "Legend", theme: "card-legend", booster: "freekick", fullPos: ["LB","LMF"], secPos: ["LWF"], club: "Brazil Legends", nation: "Brazil", style: "Offensive Full-back", maxLvl: 33, age: 29, height: 168, foot: "Left", arch: "fullback", boost: 2, skills: ["Knuckle Shot","Dipping Shot","Pinpoint Crossing","Long-Range Shooting","Weighted Pass","Outside Curler"] },
    { id: 10, name: "Peter Schmeichel", eraDate: "26 May '99", image: "schmeichel_1999.png", pos: "GK", baseOvr: 88, maxOvr: 105, card: "Epic", theme: "card-epic", booster: "goalkeeping", fullPos: ["GK"], secPos: [], club: "Man Utd", nation: "Denmark", style: "Defensive GK", maxLvl: 32, age: 35, height: 191, foot: "Right", arch: "goalkeeper", boost: 3, skills: ["GK Long Throw","GK Low Punt","GK High Punt","GK Penalty Saver","Captaincy"] }
].map(p => ({ ...p, baseStats: buildStats(p.arch, p.boost) }));

const MANAGERS = [
    { id: 1, name: "Pep Guardiola", image: "pep.png", club: "Manchester B", booster: "+1 Tight Possession", desc: "Increases Tight Possession by +1 for all players.", style: "Possession Game", prof: { Possession: 88, QuickCounter: 74, LongBallCounter: 55, OutWide: 76, LongBall: 48 } },
    { id: 2, name: "Xabi Alonso", image: "alonso.png", club: "Leverkusen", booster: "+1 Acceleration", desc: "Increases Acceleration by +1 for all players.", style: "Quick Counter", prof: { Possession: 80, QuickCounter: 88, LongBallCounter: 72, OutWide: 78, LongBall: 54 } },
    { id: 3, name: "Carlo Ancelotti", image: "ancelotti.png", club: "Madrid Chamartin", booster: "+1 Ball Control", desc: "Increases Ball Control by +1 for all players.", style: "Long Ball Counter", prof: { Possession: 82, QuickCounter: 87, LongBallCounter: 88, OutWide: 75, LongBall: 65 } }
];

// ==================== RENDER UI ====================
function renderFilters() {
    const positions = ['ALL', 'CF', 'SS', 'RWF', 'LWF', 'AMF', 'CMF', 'DMF', 'CB', 'LB', 'GK'];
    const cards = ['ALL', 'BigTime', 'Epic', 'Legend', 'ShowTime', 'Trending'];
    document.getElementById('filterBars').innerHTML = `
        <select onchange="state.pos=this.value; renderPlayers()" class="bg-ef-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs outline-none">
            ${positions.map(p => `<option value="${p}" ${state.pos===p?'selected':''}>POS: ${p}</option>`).join('')}
        </select>
        <select onchange="state.card=this.value; renderPlayers()" class="bg-ef-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs outline-none">
            ${cards.map(c => `<option value="${c}" ${state.card===c?'selected':''}>CARD: ${c}</option>`).join('')}
        </select>
    `;
}

function renderPlayers() {
    const list = PLAYERS.filter(p =>
        (state.pos === 'ALL' || p.pos === state.pos) &&
        (state.card === 'ALL' || p.card === state.card) &&
        (!state.search || [p.name, p.club, p.pos, p.style, p.eraDate].some(v => v.toLowerCase().includes(state.search)))
    );
    const isFiltering = state.search || state.pos !== 'ALL' || state.card !== 'ALL';
    const displayed = (state.showAll || isFiltering) ? list : list.slice(0, 5);

    const btn = document.getElementById('toggleAllBtn');
    btn.style.display = isFiltering ? 'none' : 'inline-block';
    btn.innerHTML = state.showAll ? 'Show less <i class="fa-solid fa-arrow-up ml-1"></i>' : `See all new players (${list.length}) <i class="fa-solid fa-arrow-right ml-1"></i>`;

    document.getElementById('playersGrid').innerHTML = displayed.length ? displayed.map(p => `
        <div onclick="openPlayer(${p.id})" class="ef-card ${p.theme} rounded-xl p-2.5 cursor-pointer aspect-[3/4.2] flex flex-col justify-between select-none">
            <!-- NẾU CHƯA TẢI ẢNH, DÒNG ONERROR SẼ ẨN ẢNH ĐI ĐỂ KHÔNG HIỆN ICON LỖI, BẠN CẦN LƯU ẢNH VÀO MÁY NHÉ -->
            <img src="${p.image}" onerror="this.classList.add('hidden')" class="portrait-mask absolute inset-0 w-full h-full">
            <div class="relative z-10 flex justify-between items-start">
                <div class="bg-black/60 backdrop-blur-sm px-1.5 py-1 rounded leading-none">
                    <div class="font-display font-extrabold text-2xl">${p.baseOvr}</div>
                    <div class="font-display font-bold text-xs text-amber-300">${p.pos}</div>
                </div>
                <div class="flex flex-col items-end gap-1">
                    <span class="text-[10px] font-black bg-black/70 text-ef-lime px-1.5 py-0.5 rounded border border-white/10">MAX ${p.maxOvr}</span>
                    <span class="text-[9px] font-bold bg-black/75 text-amber-200 px-1.5 py-0.5 rounded border border-white/10">${p.eraDate}</span>
                </div>
            </div>
            <div class="relative z-10 bg-gradient-to-t from-black/95 via-black/80 to-transparent -mx-2.5 -mb-2.5 p-2.5 pt-6 text-center">
                <div class="font-bold text-xs truncate">${p.name}</div>
                <div class="flex justify-center gap-1 mt-1">
                    <span class="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400 text-[9px] flex items-center justify-center text-emerald-300"><i class="fa-solid fa-bolt"></i></span>
                    <span class="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400 text-[9px] flex items-center justify-center text-emerald-300"><i class="fa-solid fa-plus"></i></span>
                </div>
            </div>
        </div>
    `).join('') : `<p class="col-span-full text-center text-slate-400 py-8 text-sm">No players found.</p>`;
}

function renderManagers() {
    const list = MANAGERS.filter(m => !state.search || [m.name, m.club, m.style].some(v => v.toLowerCase().includes(state.search)));
    document.getElementById('managersGrid').innerHTML = list.map(m => `
        <div onclick="openManager(${m.id})" class="group cursor-pointer text-center space-y-2">
            <div class="relative aspect-square rounded-2xl bg-ef-surface border-2 border-white/15 group-hover:border-ef-lime overflow-hidden transition">
                <img src="${m.image}" onerror="this.classList.add('hidden')" class="w-full h-full object-cover object-top">
                <div class="absolute bottom-1.5 inset-x-0 flex justify-center gap-1">
                    <span class="px-2 py-0.5 rounded bg-black/80 border border-emerald-400 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                        <i class="fa-solid fa-bolt text-[9px]"></i> ${Math.max(...Object.values(m.prof))}
                    </span>
                </div>
            </div>
            <div class="text-xs font-semibold text-slate-200 group-hover:text-ef-lime truncate">${m.name}</div>
        </div>
    `).join('');
}

// ==================== PROGRESSION & STATS ENGINE ====================
function resetPts() { CATS.forEach(c => state.pts[c] = 0); }
const getAvailPts = () => (state.level - 1) * 2;
const getStepCost = (lvl) => lvl <= 4 ? 1 : lvl <= 8 ? 2 : 3;
const getUsedPts = () => CATS.reduce((sum, c) => { for (let i = 1; i <= (state.pts[c] || 0); i++) sum += getStepCost(i); return sum; }, 0);

function autoAllocate() {
    resetPts();
    const p = state.player;
    const order = p.pos === 'GK' ? ['gk1','gk2','gk3','aerial'] : ['CB','LB','RB','DMF'].includes(p.pos) ? ['defending','lowerBody','aerial','dexterity','passing'] : ['shooting','dribbling','dexterity','lowerBody','passing','aerial'];
    while (true) {
        let added = false;
        for (const c of order) {
            if (state.pts[c] < 12 && getUsedPts() + getStepCost(state.pts[c] + 1) <= getAvailPts()) { state.pts[c]++; added = true; }
        }
        if (!added) break;
    }
}

function calcStats() {
    const p = state.player, pt = state.pts, s = { ...p.baseStats };
    const add = (keys, val) => keys.forEach(k => s[k] = Math.min(99, s[k] + val));
    add(['finishing','placeKicking','curl'], pt.shooting); add(['lowPass','loftedPass'], pt.passing);
    add(['ballControl','dribbling','tightPossession'], pt.dribbling); add(['attackingAwareness','acceleration','balance'], pt.dexterity);
    add(['speed','kickingPower','stamina'], pt.lowerBody); add(['heading','jump','physicalContact'], pt.aerial);
    add(['defensiveAwareness','tackling','aggression','defensiveEngagement'], pt.defending);
    add(['gkAwareness','jump'], pt.gk1); add(['gkParrying','gkReach'], pt.gk2); add(['gkCatching','gkReflexes'], pt.gk3);
    [state.b1, state.b2].forEach(b => { if (b) Object.entries(b.stats).forEach(([k, v]) => s[k] = Math.min(99, s[k] + v)); });
    const maxPts = (p.maxLvl - 1) * 2;
    const ratio = maxPts ? Math.min(1, getUsedPts() / maxPts) : 1;
    const ovr = Math.round(p.baseOvr + (p.maxOvr - p.baseOvr) * ratio) + (state.b1 ? 1 : 0) + (state.b2 ? 1 : 0);
    return { s, ovr };
}

// ==================== MODALS ====================
function openPlayer(id) {
    state.player = PLAYERS.find(p => p.id === id);
    state.level = state.player.maxLvl;
    state.b1 = BOOSTERS.find(b => b.id === state.player.booster) || null;
    state.b2 = null; state.posTokens = [];
    autoAllocate();
    document.getElementById('modalBadge').textContent = `${state.player.card} • ${state.player.eraDate}`;
    document.getElementById('modalTitle').textContent = `${state.player.name} (${state.player.pos})`;
    renderPlayerModal();
    toggleEl('mainModal', true);
}

function renderPlayerModal() {
    const p = state.player, { s, ovr } = calcStats(), avail = getAvailPts(), used = getUsedPts();
    const posCell = (code) => {
        const isFull = p.fullPos.includes(code) || state.posTokens.includes(code), isSec = p.secPos.includes(code);
        const r = code === p.pos ? ovr : isFull ? ovr - 1 : isSec ? ovr - 4 : (p.pos === 'GK' || code === 'GK' ? 48 : ovr - 14);
        const cls = isFull ? 'bg-emerald-400 text-black font-extrabold' : isSec ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-white/5 text-slate-500';
        return `<div onclick="openPosModal()" class="${cls} rounded py-1 text-center cursor-pointer"><div class="text-[9px]">${code}</div><div class="font-display text-sm leading-none">${r}</div></div>`;
    };
    const cats = p.pos === 'GK' ? [['gk1','GK 1'],['gk2','GK 2'],['gk3','GK 3'],['aerial','Aerial']] : [['shooting','Shooting'],['passing','Passing'],['dribbling','Dribbling'],['dexterity','Dexterity'],['lowerBody','Lower Body'],['aerial','Aerial'],['defending','Defending']];
    const groups = [
        ['Attacking', ['attackingAwareness','ballControl','dribbling','tightPossession','lowPass','loftedPass','finishing','heading','placeKicking','curl']],
        ['Physical',  ['speed','acceleration','kickingPower','jump','physicalContact','balance','stamina']],
        ['Def & GK',  ['defensiveAwareness','tackling','aggression','defensiveEngagement','gkAwareness','gkCatching','gkParrying','gkReflexes','gkReach']]
    ];
    document.getElementById('modalBody').innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 bg-ef-panel/60 p-4 rounded-xl border border-white/5">
            <div class="md:col-span-5 space-y-3">
                <div class="flex gap-3 items-center">
                    <div class="${p.theme} w-20 h-28 rounded-lg p-1.5 flex flex-col justify-between shrink-0 relative overflow-hidden">
                        <img src="${p.image}" onerror="this.classList.add('hidden')" class="portrait-mask absolute inset-0 w-full h-full">
                        <div class="relative z-10 bg-black/60 px-1 rounded self-start font-display font-extrabold text-lg leading-none">${ovr}<div class="text-[10px] text-amber-300">${p.pos}</div></div>
                    </div>
                    <div class="text-xs space-y-1 text-slate-300">
                        <div class="text-ef-lime font-bold">${p.style} (${p.eraDate})</div>
                        <div>Club: <b class="text-white">${p.club}</b></div>
                        <div>Nation: ${p.nation} • ${p.age}y • ${p.height}cm</div>
                        <div>Foot: ${p.foot}</div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <button onclick="openBoosterPicker(1)" class="bg-ef-bg border border-white/10 hover:border-ef-lime p-2 rounded-lg text-left"><div class="text-[10px] text-slate-400">Booster 1</div><div class="text-xs font-bold truncate">${state.b1 ? state.b1.name : '+ Select'}</div></button>
                    <button onclick="openBoosterPicker(2)" class="bg-ef-bg border border-dashed border-white/20 hover:border-ef-lime p-2 rounded-lg text-left"><div class="text-[10px] text-slate-400">Booster 2</div><div class="text-xs font-bold text-ef-lime truncate">${state.b2 ? state.b2.name : '+ Add'}</div></button>
                </div>
            </div>
            <div class="md:col-span-4 bg-ef-bg p-2.5 rounded-xl border border-white/5 space-y-2">
                <div class="grid grid-cols-3 gap-1">
                    ${posCell('LWF')} <div class="space-y-1">${posCell('CF')}${posCell('SS')}</div> ${posCell('RWF')}
                    ${posCell('LMF')} <div class="space-y-1">${posCell('AMF')}${posCell('CMF')}${posCell('DMF')}</div> ${posCell('RMF')}
                    ${posCell('LB')}  <div class="space-y-1">${posCell('CB')}${posCell('GK')}</div> ${posCell('RB')}
                </div>
                <button onclick="openPosModal()" class="w-full py-1.5 rounded bg-white/5 hover:bg-white/10 text-xs font-semibold text-ef-lime">Position Boosters (${state.posTokens.length}/2)</button>
            </div>
            <div class="md:col-span-3 bg-ef-bg p-3 rounded-xl border border-white/5 flex flex-col justify-between space-y-2">
                <div>
                    <div class="flex justify-between text-xs font-bold mb-1"><span class="text-ef-lime">Lv.${state.level}/${p.maxLvl}</span><span>Pts: <b class="text-ef-lime">${avail - used}</b>/${avail}</span></div>
                    <input type="range" min="1" max="${p.maxLvl}" value="${state.level}" oninput="changeLevel(this.value)" class="ef-slider">
                    <div class="flex gap-1.5 mt-2">
                        <button onclick="autoAllocate(); renderPlayerModal()" class="flex-1 py-1 rounded bg-ef-lime text-black font-bold text-[11px]">Auto</button>
                        <button onclick="resetPts(); renderPlayerModal()" class="flex-1 py-1 rounded bg-white/10 text-[11px]">Reset</button>
                    </div>
                </div>
                <div class="space-y-1">
                    ${cats.map(([k, lbl]) => `<div class="flex justify-between items-center text-[11px] bg-ef-surface px-2 py-1 rounded"><span>${lbl}</span><div class="flex items-center gap-1.5"><button onclick="stepPt('${k}',-1)" class="w-4 h-4 bg-white/10 rounded">-</button><b class="w-3 text-center text-ef-lime">${state.pts[k]}</b><button onclick="stepPt('${k}',1)" class="w-4 h-4 bg-white/10 rounded">+</button></div></div>`).join('')}
                </div>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            ${groups.map(([title, keys]) => `<div class="bg-ef-bg p-3 rounded-xl border border-white/5"><h4 class="font-display font-bold text-sm text-ef-lime uppercase border-b border-white/10 pb-1.5 mb-2">${title}</h4>${keys.map(k => { const v = s[k], cls = v>=90?'stat-90':v>=80?'stat-80':v>=70?'stat-70':'stat-low', label = k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()); return `<div class="flex justify-between text-xs py-0.5"><span class="text-slate-400">${label}</span><span class="font-mono ${cls}">${v}</span></div>`; }).join('')}</div>`).join('')}
        </div>
        <div class="flex flex-wrap gap-1.5">${p.skills.map(sk => `<span class="px-2.5 py-1 rounded-md bg-ef-panel text-xs font-medium">${sk}</span>`).join('')}</div>
    `;
}

function changeLevel(val) { state.level = +val; while (getUsedPts() > getAvailPts()) { const k = CATS.find(c => state.pts[c] > 0); if (k) state.pts[k]--; else break; } renderPlayerModal(); }
function stepPt(cat, delta) { if (delta > 0) { if (state.pts[cat] >= 12 || getUsedPts() + getStepCost(state.pts[cat] + 1) > getAvailPts()) return toast('Not enough points!'); state.pts[cat]++; } else if (state.pts[cat] > 0) state.pts[cat]--; renderPlayerModal(); }

function openBoosterPicker(slot) {
    const cur = slot === 1 ? state.b1 : state.b2;
    document.getElementById('subModalTitle').textContent = `Select Booster (Slot ${slot})`;
    document.getElementById('subModalBody').innerHTML = `${cur ? `<button onclick="setBooster(${slot}, null)" class="w-full py-2 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold">Remove Booster</button>` : ''}${BOOSTERS.map(b => `<div onclick="setBooster(${slot}, '${b.id}')" class="p-3 rounded-xl cursor-pointer border ${cur?.id===b.id ? 'border-ef-lime bg-ef-lime/10' : 'border-white/10 bg-ef-panel hover:border-white/30'}"><div class="font-bold text-xs mb-1">${b.name}</div><div class="text-[11px] text-slate-400">${Object.keys(b.stats).map(k => k.replace(/([A-Z])/g,' $1') + ' +1').join(' • ')}</div></div>`).join('')}`;
    toggleEl('subModal', true);
}
function setBooster(slot, id) { const b = id ? BOOSTERS.find(x => x.id === id) : null; if (slot === 1) state.b1 = b; else state.b2 = b; toggleEl('subModal', false); renderPlayerModal(); }

function openPosModal() {
    const sec = state.player.secPos;
    document.getElementById('subModalTitle').textContent = `Position Boosters (${state.posTokens.length}/2)`;
    document.getElementById('subModalBody').innerHTML = sec.length ? sec.map(pos => { const active = state.posTokens.includes(pos); return `<button onclick="togglePosToken('${pos}')" class="w-full p-3 rounded-xl border flex justify-between items-center ${active ? 'border-emerald-400 bg-emerald-400/15' : 'border-white/10 bg-ef-panel'}"><span class="font-bold text-sm">${pos}</span><span class="text-xs font-bold ${active ? 'text-emerald-400' : 'text-slate-400'}">${active ? 'Full (Boosted)' : 'Secondary'}</span></button>`; }).join('') : `<p class="text-xs text-slate-400 text-center py-4">No secondary positions available.</p>`;
    toggleEl('subModal', true);
}
function togglePosToken(pos) { const idx = state.posTokens.indexOf(pos); if (idx > -1) state.posTokens.splice(idx, 1); else if (state.posTokens.length < 2) state.posTokens.push(pos); else return toast('Max 2 Position tokens!'); openPosModal(); renderPlayerModal(); }

function openManager(id) {
    const m = MANAGERS.find(x => x.id === id);
    document.getElementById('modalBadge').textContent = 'MANAGER'; document.getElementById('modalTitle').textContent = m.name;
    document.getElementById('modalBody').innerHTML = `<div class="flex items-center gap-4 bg-ef-panel p-4 rounded-xl"><img src="${m.image}" onerror="this.classList.add('hidden')" class="w-16 h-16 rounded-xl object-cover bg-ef-bg"><div class="space-y-1 text-xs"><div>Club: <b>${m.club}</b></div><div class="text-ef-lime font-bold">Booster: ${m.booster}</div><div class="text-slate-400">${m.desc}</div></div></div><div class="space-y-2.5 bg-ef-bg p-4 rounded-xl">${Object.entries(m.prof).map(([k, v]) => `<div><div class="flex justify-between text-xs font-bold mb-1"><span>${k.replace(/([A-Z])/g,' $1')}</span><span class="${v>=85?'text-ef-lime':''}">${v}</span></div><div class="h-1.5 bg-ef-panel rounded-full overflow-hidden"><div class="h-full ${v>=85?'bg-ef-lime':'bg-sky-500'}" style="width:${v}%"></div></div></div>`).join('')}</div>`;
    toggleEl('mainModal', true);
}

function handleSearch(val) { state.search = val.trim().toLowerCase(); document.getElementById('topSearch').value = val; document.getElementById('heroSearch').value = val; renderPlayers(); renderManagers(); }
function resetAll() { state.search = ''; state.pos = 'ALL'; state.card = 'ALL'; state.showAll = false; document.getElementById('topSearch').value = ''; document.getElementById('heroSearch').value = ''; renderFilters(); renderPlayers(); renderManagers(); }
function toggleEl(id, show) { const el = document.getElementById(id); el.classList.toggle('hidden', !show); el.classList.toggle('flex', show); }
function toast(msg) { const t = document.getElementById('toast'); document.getElementById('toastMsg').textContent = msg; t.classList.remove('translate-y-20', 'opacity-0'); setTimeout(() => t.classList.add('translate-y-20', 'opacity-0'), 2200); }

// RENDER NGAY LẬP TỨC
renderFilters(); renderPlayers(); renderManagers();
