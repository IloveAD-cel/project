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
    { id: 1, name: "Lionel Messi", eraDate: "01 Dec '09", image: "messi_2009.png", pos: "SS", baseOvr: 90, maxOvr: 107, card: "BigTime", theme: "card-bigtime", booster: "fantasista", fullPos: ["SS","RWF","AMF"], secPos: ["CF","RMF"], club: "FC Barcelona '09", league: "Spanish League", nation: "Argentina", flag: "🇦🇷", style: "Roaming Flank", maxLvl: 35, age: 22, height: 170, weight: 72, foot: "Left", condition: "B", arch: "wizard", boost: 3, skills: ["Double Touch","Marseille Turn","Long-Range Curler","First-time Shot","One-touch Pass","Through Passing"] },
    { id: 2, name: "Lamine Yamal", eraDate: "Live '26", image: "yamal_2026.png", pos: "RWF", baseOvr: 87, maxOvr: 105, card: "Trending", theme: "card-trending", booster: "ball_carrying", fullPos: ["RWF","RMF"], secPos: ["AMF","SS","LWF"], club: "FC Barcelona", league: "Spanish League", nation: "Spain", flag: "🇪🇸", style: "Prolific Winger", maxLvl: 38, age: 19, height: 180, weight: 72, foot: "Left", condition: "A", arch: "wizard", boost: 3, skills: ["Double Touch","Flip Flap","Long-Range Curler","Outside Curler","Through Passing","Pinpoint Crossing"] },
    { id: 3, name: "Cristiano Ronaldo", eraDate: "21 May '08", image: "cr7_2008.png", pos: "LWF", baseOvr: 89, maxOvr: 106, card: "BigTime", theme: "card-bigtime", booster: "shooting", fullPos: ["LWF","CF","RWF"], secPos: ["SS","LMF","RMF"], club: "Man Utd '08", league: "English League", nation: "Portugal", flag: "🇵🇹", style: "Prolific Winger", maxLvl: 35, age: 23, height: 187, weight: 83, foot: "Right", condition: "B", arch: "striker", boost: 3, skills: ["Knuckle Shot","Scissors Feint","Long-Range Shooting","Heading","First-time Shot","Aerial Superiority"] },
    { id: 4, name: "Jude Bellingham", eraDate: "Live '26", image: "bellingham_2026.png", pos: "AMF", baseOvr: 87, maxOvr: 104, card: "ShowTime", theme: "card-showtime", booster: "balancer", fullPos: ["AMF","CMF"], secPos: ["SS","LMF","DMF"], club: "Madrid Chamartin", league: "Spanish League", nation: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", style: "Hole Player", maxLvl: 33, age: 23, height: 186, weight: 75, foot: "Right", condition: "A", arch: "holePlayer", boost: 2, skills: ["Double Touch","Marseille Turn","First-time Shot","One-touch Pass","Through Passing","Interception"] },
    { id: 5, name: "Thierry Henry", eraDate: "16 Nov '02", image: "henry_2002.png", pos: "CF", baseOvr: 89, maxOvr: 106, card: "BigTime", theme: "card-bigtime", booster: "strikers_instinct", fullPos: ["CF","LWF"], secPos: ["SS","LMF"], club: "Arsenal FC", league: "English League", nation: "France", flag: "🇫🇷", style: "Goal Poacher", maxLvl: 35, age: 25, height: 188, weight: 83, foot: "Right", condition: "B", arch: "striker", boost: 3, skills: ["Double Touch","Long-Range Curler","First-time Shot","Outside Curler","Chip Shot Control","One-touch Pass"] },
    { id: 6, name: "Patrick Vieira", eraDate: "15 May '04", image: "vieira_2004.png", pos: "DMF", baseOvr: 88, maxOvr: 106, card: "BigTime", theme: "card-bigtime", booster: "duelling", fullPos: ["DMF","CMF"], secPos: ["CB"], club: "Arsenal FC", league: "English League", nation: "France", flag: "🇫🇷", style: "Destroyer", maxLvl: 34, age: 27, height: 192, weight: 82, foot: "Right", condition: "B", arch: "destroyerDmf", boost: 3, skills: ["Man Marking","Interception","Blocker","Aerial Superiority","Sliding Tackle","Fighting Spirit"] },
    { id: 7, name: "Andrea Pirlo", eraDate: "09 Jul '06", image: "pirlo_2006.png", pos: "CMF", baseOvr: 87, maxOvr: 104, card: "Epic", theme: "card-epic", booster: "passing", fullPos: ["CMF","DMF"], secPos: ["AMF"], club: "Milano RN", league: "Italian League", nation: "Italy", flag: "🇮🇹", style: "Orchestrator", maxLvl: 33, age: 27, height: 177, weight: 68, foot: "Right", condition: "B", arch: "orchestrator", boost: 2, skills: ["One-touch Pass","Through Passing","Weighted Pass","Low Lofted Pass","Pinpoint Crossing","Long-Range Curler"] },
    { id: 8, name: "Paolo Maldini", eraDate: "28 May '03", image: "maldini_2003.png", pos: "CB", baseOvr: 88, maxOvr: 105, card: "BigTime", theme: "card-bigtime", booster: "shutdown", fullPos: ["CB","LB"], secPos: ["RB"], club: "Milano RN", league: "Italian League", nation: "Italy", flag: "🇮🇹", style: "Build Up", maxLvl: 34, age: 34, height: 186, weight: 85, foot: "Right", condition: "B", arch: "centerBack", boost: 3, skills: ["Man Marking","Interception","Blocker","Aerial Superiority","Sliding Tackle","Acrobatic Clearance"] },
    { id: 9, name: "Roberto Carlos", eraDate: "30 Jun '02", image: "carlos_2002.png", pos: "LB", baseOvr: 87, maxOvr: 104, card: "Legend", theme: "card-legend", booster: "freekick", fullPos: ["LB","LMF"], secPos: ["LWF"], club: "Brazil Legends", league: "National", nation: "Brazil", flag: "🇧🇷", style: "Offensive Full-back", maxLvl: 33, age: 29, height: 168, weight: 70, foot: "Left", condition: "B", arch: "fullback", boost: 2, skills: ["Knuckle Shot","Dipping Shot","Pinpoint Crossing","Long-Range Shooting","Weighted Pass","Outside Curler"] },
    { id: 10, name: "Peter Schmeichel", eraDate: "26 May '99", image: "schmeichel_1999.png", pos: "GK", baseOvr: 88, maxOvr: 105, card: "Epic", theme: "card-epic", booster: "goalkeeping", fullPos: ["GK"], secPos: [], club: "Man Utd", league: "English League", nation: "Denmark", flag: "🇩🇰", style: "Defensive GK", maxLvl: 32, age: 35, height: 191, weight: 92, foot: "Right", condition: "B", arch: "goalkeeper", boost: 3, skills: ["GK Long Throw","GK Low Punt","GK High Punt","GK Penalty Saver","Captaincy"] }
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
    window.location.href = `player.html?id=${id}`;
}

function getActiveBoosterStatBonuses() {
    const bonuses = {};
    [state.b1, state.b2].forEach(b => {
        if (b && b.stats) {
            Object.entries(b.stats).forEach(([k, val]) => {
                bonuses[k] = (bonuses[k] || 0) + val;
            });
        }
    });
    return bonuses;
}

function renderPlayerModal(isSliding = false) {
    const p = state.player, { s, ovr } = calcStats(), avail = getAvailPts(), used = getUsedPts();
    
    const posCell = (code) => {
        const isFull = p.fullPos.includes(code) || state.posTokens.includes(code), isSec = p.secPos.includes(code);
        const r = code === p.pos ? ovr : isFull ? ovr - 1 : isSec ? ovr - 4 : (p.pos === 'GK' || code === 'GK' ? 48 : ovr - 14);
        const cls = isFull ? 'bg-emerald-400 text-black font-extrabold' : isSec ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-white/5 text-slate-500';
        return `<div onclick="openPosModal()" class="${cls} rounded py-1 text-center cursor-pointer"><div class="text-[9px]">${code}</div><div class="font-display text-sm leading-none">${r}</div></div>`;
    };
    const cats = p.pos === 'GK' ? [['gk1','GK 1'],['gk2','GK 2'],['gk3','GK 3'],['aerial','Aerial']] : [['shooting','Shooting'],['passing','Passing'],['dribbling','Dribbling'],['dexterity','Dexterity'],['lowerBody','Lower Body'],['aerial','Aerial'],['defending','Defending']];
    const boosterBonuses = getActiveBoosterStatBonuses();

    const groups = [
        ['Attacking', ['attackingAwareness','ballControl','dribbling','tightPossession','lowPass','loftedPass','finishing','heading','placeKicking','curl']],
        ['Physical',  ['speed','acceleration','kickingPower','jump','physicalContact','balance','stamina']],
        ['Def & GK',  ['defensiveAwareness','tackling','aggression','defensiveEngagement','gkAwareness','gkCatching','gkParrying','gkReflexes','gkReach']]
    ];
    document.getElementById('modalBody').innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 bg-ef-panel/60 p-4 rounded-xl border border-white/5">
            <div class="md:col-span-5 flex flex-col justify-between gap-3">
                <div class="grid grid-cols-12 gap-2 items-stretch">
                    
                    <!-- Left Column: Nation -> Club -> League -->
                    <div class="col-span-3 flex flex-col justify-between gap-1.5">
                        <div title="${p.nation}" class="flex-1 bg-ef-bg border border-white/10 rounded-xl p-1.5 flex flex-col items-center justify-center text-center">
                            <span class="text-xl leading-none">${p.flag || '🏳️'}</span>
                            <span class="text-[9px] font-bold text-slate-300 truncate w-full mt-1">${p.nation}</span>
                        </div>
                        <div title="${p.club}" class="flex-1 bg-ef-bg border border-white/10 rounded-xl p-1.5 flex flex-col items-center justify-center text-center">
                            <i class="fa-solid fa-shield-halved text-base text-ef-lime"></i>
                            <span class="text-[9px] font-bold text-slate-300 truncate w-full mt-1">${p.club}</span>
                        </div>
                        <div title="${p.league}" class="flex-1 bg-ef-bg border border-white/10 rounded-xl p-1.5 flex flex-col items-center justify-center text-center">
                            <i class="fa-solid fa-trophy text-sm text-amber-400"></i>
                            <span class="text-[9px] font-bold text-slate-300 truncate w-full mt-1">${p.league || 'League'}</span>
                        </div>
                    </div>

                    <!-- Center Column: Player Card Picture -->
                    <div class="col-span-6">
                        <div class="${p.theme} w-full aspect-[3/4.3] rounded-xl p-2 flex flex-col justify-between relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.6)]">
                            <img src="${p.image}" onerror="this.classList.add('hidden')" class="portrait-mask absolute inset-0 w-full h-full">
                            
                            <!-- Top OVR, Pos & Tier -->
                            <div class="relative z-10 flex justify-between items-start">
                                <div class="bg-black/60 backdrop-blur-sm px-1.5 py-1 rounded leading-none">
                                    <div id="ovrText" class="font-display font-extrabold text-2xl text-white">${ovr}</div>
                                    <div class="font-display font-bold text-xs text-amber-300">${p.pos}</div>
                                </div>
                                <span class="bg-black/75 text-ef-lime font-black text-[10px] px-1.5 py-0.5 rounded border border-white/10">S</span>
                            </div>

                            <!-- Bottom Nameplate, Booster Hex Icons & Stars -->
                            <div class="relative z-10 bg-gradient-to-t from-black/95 via-black/80 to-transparent -mx-2 -mb-2 p-2 pt-5 text-center">
                                <div class="font-bold text-xs text-white truncate drop-shadow">${p.name}</div>
                                <div class="flex items-center justify-center gap-1.5 mt-1">
                                    <span class="w-4 h-4 rounded-full ${state.b1 ? 'bg-cyan-400/20 border-cyan-400 text-cyan-300' : 'bg-white/5 border-white/15 text-slate-500'} border text-[8px] flex items-center justify-center">
                                        <i class="fa-solid fa-bolt"></i>
                                    </span>
                                    <span class="w-4 h-4 rounded-full ${state.b2 ? 'bg-ef-lime/20 border-ef-lime text-ef-lime' : 'bg-white/5 border-white/15 text-slate-500'} border text-[8px] flex items-center justify-center">
                                        <i class="fa-solid fa-plus"></i>
                                    </span>
                                </div>
                                <div class="flex justify-center gap-0.5 mt-1 text-[8px] text-amber-400">
                                    <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Height -> Weight -> Age -> Foot -> Condition -->
                    <div class="col-span-3 flex flex-col justify-between gap-1">
                        <div class="bg-ef-bg border border-white/10 rounded-lg py-1 px-1.5 text-center">
                            <div class="text-[9px] text-slate-400 leading-tight">Height</div>
                            <div class="text-[11px] font-bold text-white leading-tight">${p.height}cm</div>
                        </div>
                        <div class="bg-ef-bg border border-white/10 rounded-lg py-1 px-1.5 text-center">
                            <div class="text-[9px] text-slate-400 leading-tight">Weight</div>
                            <div class="text-[11px] font-bold text-white leading-tight">${p.weight || 75}kg</div>
                        </div>
                        <div class="bg-ef-bg border border-white/10 rounded-lg py-1 px-1.5 text-center">
                            <div class="text-[9px] text-slate-400 leading-tight">Age</div>
                            <div class="text-[11px] font-bold text-white leading-tight">${p.age}</div>
                        </div>
                        <div class="bg-ef-bg border border-white/10 rounded-lg py-1 px-1.5 text-center">
                            <div class="text-[9px] text-slate-400 leading-tight">Foot</div>
                            <div class="text-[11px] font-bold text-white leading-tight">${p.foot}</div>
                        </div>
                        <div class="bg-ef-bg border border-white/10 rounded-lg py-1 px-1.5 text-center">
                            <div class="text-[9px] text-slate-400 leading-tight">Condition</div>
                            <div class="text-[11px] font-extrabold ${p.condition === 'A' ? 'text-emerald-400' : 'text-ef-lime'} leading-tight">${p.condition || 'B'}</div>
                        </div>
                    </div>
                </div>

                <!-- Bottom Row: Booster 1 Dropdown | Dual Hex Icons | Booster 2 Dropdown -->
                <div class="flex items-center gap-1.5 pt-1">
                    <button onclick="openBoosterPicker(1)" class="flex-1 min-w-0 bg-ef-bg hover:bg-white/5 border border-white/10 hover:border-cyan-400 px-2.5 py-2 rounded-xl flex items-center justify-between gap-1 transition">
                        <span class="text-[11px] font-bold text-cyan-400 truncate">${state.b1 ? state.b1.name : 'Booster 1'}</span>
                        <i class="fa-solid fa-chevron-down text-[9px] text-slate-400 shrink-0"></i>
                    </button>

                    <div class="flex items-center gap-1 shrink-0 px-1">
                        <span class="w-6 h-6 rounded-lg ${state.b1 ? 'bg-cyan-400/20 border-cyan-400 text-cyan-300' : 'bg-ef-bg border-white/10 text-slate-600'} border flex items-center justify-center text-xs">
                            <i class="fa-solid fa-hexagon-nodes"></i>
                        </span>
                        <span class="w-6 h-6 rounded-lg ${state.b2 ? 'bg-ef-lime/20 border-ef-lime text-ef-lime' : 'bg-ef-bg border-white/10 text-slate-600'} border flex items-center justify-center text-xs">
                            <i class="fa-solid fa-hexagon-nodes"></i>
                        </span>
                    </div>

                    <button onclick="openBoosterPicker(2)" class="flex-1 min-w-0 bg-ef-bg hover:bg-white/5 border border-white/10 hover:border-ef-lime px-2.5 py-2 rounded-xl flex items-center justify-between gap-1 transition">
                        <span class="text-[11px] font-bold ${state.b2 ? 'text-ef-lime' : 'text-slate-400'} truncate">${state.b2 ? state.b2.name : 'Booster 2'}</span>
                        <i class="fa-solid fa-chevron-down text-[9px] text-slate-400 shrink-0"></i>
                    </button>
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
        <div class="flex justify-between text-xs font-bold mb-1">
            <span id="lvlText" class="text-ef-lime">Lv.${state.level}/${p.maxLvl}</span>
            <span>Pts: <b id="ptsText" class="text-ef-lime">${avail - used}</b>/${avail}</span>
        </div>
        
        <!-- Thanh trượt mượt mà không bị mất focus -->
        <input type="range" min="1" max="${p.maxLvl}" value="${state.level}" 
            oninput="handleLevelSliderInput(this.value)" 
            onchange="renderPlayerModal()" 
            class="ef-slider">
            
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
            ${groups.map(([title, keys]) => `
                <div class="bg-ef-bg p-3 rounded-xl border border-white/5">
                    <h4 class="font-display font-bold text-sm text-ef-lime uppercase border-b border-white/10 pb-1.5 mb-2">${title}</h4>
                    ${keys.map(k => {
                        const v = s[k];
                        const bVal = boosterBonuses[k] || 0;
                        const cls = v >= 90 ? 'stat-90' : v >= 80 ? 'stat-80' : v >= 70 ? 'stat-70' : 'stat-low';
                        const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        
                        return `
                            <div class="flex justify-between items-center text-xs py-0.5">
                                <span class="text-slate-400">${label}</span>
                                <div class="flex items-center gap-1.5">
                                    ${bVal > 0 ? `<span class="text-[10px] font-bold text-ef-lime bg-ef-lime/10 px-1 rounded">+${bVal}</span>` : ''}
                                    <span class="font-mono ${cls}">${v}</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `).join('')}
        </div>
        <div class="flex flex-wrap gap-1.5">${p.skills.map(sk => `<span class="px-2.5 py-1 rounded-md bg-ef-panel text-xs font-medium">${sk}</span>`).join('')}</div>
    `;
}

// Hàm xử lý khi đang kéo thanh trượt (Cập nhật số liệu trực tiếp, không làm mất focus hay render lại modal)
function handleLevelSliderInput(val) {
    state.level = parseInt(val, 10);
    
    // Tự động điều chỉnh điểm cộng nếu vượt quá giới hạn cấp độ mới
    while (getUsedPts() > getAvailPts()) {
        const k = CATS.find(c => state.pts[c] > 0);
        if (k) state.pts[k]--;
        else break;
    }

    const { ovr } = calcStats();
    const avail = getAvailPts();
    const used = getUsedPts();

    // Cập nhật trực tiếp các text bằng ID
    const lvlEl = document.getElementById('lvlText');
    const ptsEl = document.getElementById('ptsText');
    const ovrEl = document.getElementById('ovrText');

    if (lvlEl) lvlEl.textContent = `Lv.${state.level}/${state.player.maxLvl}`;
    if (ptsEl) ptsEl.textContent = `${avail - used}`;
    if (ovrEl) ovrEl.textContent = ovr;
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

// ==================== MODAL TOGGLE & CLOSE HELPERS ====================
function toggleEl(id, show) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('hidden', !show);
    el.classList.toggle('flex', show);
}

function closeModal() {
    toggleEl('mainModal', false);
}

function closeSubModal() {
    toggleEl('subModal', false);
}

function loadPlayerProfile(id) {
    const found = PLAYERS.find(p => p.id === id);
    if (!found) return;
    
    state.player = found;
    state.level = found.maxLvl;
    state.b1 = BOOSTERS.find(b => b.id === found.booster) || null;
    state.b2 = null; 
    state.posTokens = [];
    autoAllocate();

    // Render thẳng nội dung chi tiết vào container của trang player.html
    document.getElementById('playerDetailContainer').innerHTML = `
        <div class="flex items-center justify-between bg-ef-panel px-5 py-3.5 rounded-2xl border border-white/10">
            <span class="text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-ef-lime text-black">${state.player.card} • ${state.player.eraDate}</span>
            <h1 class="font-display font-extrabold italic text-2xl uppercase">${state.player.name} (${state.player.pos})</h1>
        </div>
        <div id="modalBody" class="space-y-5"></div>
    `;
    renderPlayerModal(); // Hàm này sẽ tự động điền các chỉ số vào #modalBody
}

function handleSearch(val) { state.search = val.trim().toLowerCase(); document.getElementById('topSearch').value = val; document.getElementById('heroSearch').value = val; renderPlayers(); renderManagers(); }

// ==================== AUTHENTICATION (SIGN IN & SIGN UP WITH VALIDATION) ====================
let currentUser = localStorage.getItem('efhub_user') || null;
let currentAuthMode = 'signup'; // 'signup' hoặc 'signin'

// Lấy danh sách tài khoản đã đăng ký từ localStorage (nếu chưa có thì tạo mảng trống)
function getRegisteredUsers() {
    try {
        return JSON.parse(localStorage.getItem('efhub_registered_users')) || [];
    } catch(e) {
        return [];
    }
}

function updateAuthUI() {
    const container = document.getElementById('authNavContainer');
    if (!container) return;

    if (currentUser) {
        container.innerHTML = `
            <div class="flex items-center gap-2 bg-ef-panel px-3 py-1 rounded-full border border-ef-lime/40">
                <i class="fa-solid fa-user-check text-ef-lime text-xs"></i>
                <span class="text-xs font-bold text-white">${currentUser}</span>
                <button onclick="handleSignOut()" title="Sign Out" class="text-slate-400 hover:text-rose-400 ml-1 transition">
                    <i class="fa-solid fa-right-from-bracket text-xs"></i>
                </button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <button onclick="openAuthModal('signin')" class="bg-ef-surface hover:bg-white/10 text-white font-bold text-xs px-3.5 py-1.5 rounded-full border border-white/10 transition">
                Sign In
            </button>
            <button onclick="openAuthModal('signup')" class="bg-ef-lime hover:bg-ef-limeHover text-black font-bold text-xs px-3.5 py-1.5 rounded-full transition shadow-md">
                Sign Up
            </button>
        `;
    }
}

function openAuthModal(mode) {
    currentAuthMode = mode;
   
    const emailGroup = document.getElementById('emailFieldGroup');
    const subtitle = document.getElementById('authSubtitle');
    const submitBtn = document.getElementById('authSubmitBtn');
    const toggleText = document.getElementById('authToggleText');
    const toggleBtn = document.getElementById('authToggleBtn');

    // Reset form input mỗi khi mở modal
    document.getElementById('authUsername').value = '';
    document.getElementById('authPassword').value = '';
    if(document.getElementById('authEmail')) document.getElementById('authEmail').value = '';

    if (mode === 'signup') {
        emailGroup.classList.remove('hidden');
        subtitle.textContent = "Create an account to save your builds";
        submitBtn.textContent = "Create Account";
        toggleText.textContent = "Already have an account?";
        toggleBtn.textContent = "Sign In";
    } else {
        emailGroup.classList.add('hidden');
        subtitle.textContent = "Sign in to access your saved squads";
        submitBtn.textContent = "Sign In";
        toggleText.textContent = "Don't have an account?";
        toggleBtn.textContent = "Sign Up";
    }

    toggleEl('authModal', true);
}

function switchAuthMode() {
    openAuthModal(currentAuthMode === 'signup' ? 'signin' : 'signup');
}

function handleAuthSubmit(e) {
    e.preventDefault();
    const username = document.getElementById('authUsername').value.trim();
    const password = document.getElementById('authPassword').value.trim();
    const email = document.getElementById('authEmail') ? document.getElementById('authEmail').value.trim() : '';

    if (!username || !password) {
        toast('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    // Kiểm tra định dạng email cơ bản nếu ở chế độ Sign Up
    if (currentAuthMode === 'signup' && email && !email.includes('@')) {
        toast('Email không hợp lệ!');
        return;
    }

    let users = getRegisteredUsers();

    if (currentAuthMode === 'signup') {
        // Kiểm tra xem tên tài khoản đã tồn tại chưa
        const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (existingUser) {
            toast('Tên tài khoản đã tồn tại!');
            return;
        }

        // Đăng ký thành công
        users.push({ username, email, password });
        localStorage.setItem('efhub_registered_users', JSON.stringify(users));

        currentUser = username;
        localStorage.setItem('efhub_user', currentUser);

        toggleEl('authModal', false);
        updateAuthUI();
        toast(`Đăng ký thành công! Chào mừng ${currentUser}!`);

    } else {
        // --- CHẾ ĐỘ SIGN IN ---
        const inputVal = username.toLowerCase(); // Lấy giá trị nhập vào ô Username/Email

        // Tìm xem có user nào khớp với Tên tài khoản HOẶC Email không
        const foundUser = users.find(u => 
            u.username.toLowerCase() === inputVal || 
            (u.email && u.email.toLowerCase() === inputVal)
        );

        // Kiểm tra xem có phải người dùng nhập dạng email mà không tồn tại không
        const isEmailFormat = inputVal.includes('@');

        if (!foundUser) {
            if (isEmailFormat) {
                toast('Email không tồn tại!');
            } else {
                toast('Tài khoản không tồn tại!');
            }
            return;
        }

        // Kiểm tra sai mật khẩu
        if (foundUser.password !== password) {
            toast('Sai mật khẩu!');
            return;
        }

        // Đăng nhập thành công
        currentUser = foundUser.username;
        localStorage.setItem('efhub_user', currentUser);

        toggleEl('authModal', false);
        updateAuthUI();
        toast(`Đăng nhập thành công, chào ${currentUser}!`);
    }
}

function handleSignOut() {
    localStorage.removeItem('efhub_user');
    currentUser = null;
    updateAuthUI();
    toast('Signed out successfully!');
}

// Khởi chạy trạng thái tài khoản khi load trang
updateAuthUI();

function toast(msg) { const t = document.getElementById('toast'); document.getElementById('toastMsg').textContent = msg; t.classList.remove('translate-y-20', 'opacity-0'); setTimeout(() => t.classList.add('translate-y-20', 'opacity-0'), 2200); }



// RENDER NGAY LẬP TỨC
renderFilters(); renderPlayers(); renderManagers();
