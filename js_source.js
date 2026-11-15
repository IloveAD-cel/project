let currentTab = 'players';
        let searchQuery = '';
        let selectedPos = 'ALL';
        let selectedCardType = 'ALL';
        let activePlayer = null;
        let currentLevel = 1;
        let activeBoosterSlot = 2;
        let selectedSlot1Booster = null;
        let selectedSlot2Booster = null;
        let activePositionTokens = []; // Up to 2 secondary positions upgraded to full
        let progressionPoints = {
            shooting: 0,
            passing: 0,
            dribbling: 0,
            dexterity: 0,
            lowerBody: 0,
            aerial: 0,
            defending: 0,
            gk1: 0,
            gk2: 0,
            gk3: 0
        };

        // ==================== EFOOTBALL BOOSTERS CATALOG ====================
        const BOOSTERS_CATALOG = [
            { id: 'strikers_instinct', name: "Striker's Instinct +1", stats: { attackingAwareness: 1, ballControl: 1, dribbling: 1, finishing: 1 }, labels: ["Offensive Awareness +1", "Ball Control +1", "Dribbling +1", "Finishing +1"] },
            { id: 'aerial_block', name: "Aerial Block +1", stats: { heading: 1, jump: 1, physicalContact: 1, defensiveAwareness: 1 }, labels: ["Heading +1", "Jumping +1", "Physical Contact +1", "Defensive Awareness +1"] },
            { id: 'agility', name: "Agility +1", stats: { speed: 1, acceleration: 1, balance: 1, stamina: 1 }, labels: ["Speed +1", "Acceleration +1", "Balance +1", "Stamina +1"] },
            { id: 'balancer', name: "Balancer +1", stats: { attackingAwareness: 1, acceleration: 1, stamina: 1, defensiveAwareness: 1 }, labels: ["Attacking Awareness +1", "Acceleration +1", "Stamina +1", "Defensive Awareness +1"] },
            { id: 'ball_carrying', name: "Ball-carrying +1", stats: { dribbling: 1, tightPossession: 1, balance: 1, speed: 1 }, labels: ["Dribbling +1", "Tight Possession +1", "Balance +1", "Speed +1"] },
            { id: 'crossing', name: "Crossing +1", stats: { loftedPass: 1, curl: 1, speed: 1, stamina: 1 }, labels: ["Lofted Pass +1", "Curl +1", "Speed +1", "Stamina +1"] },
            { id: 'duelling', name: "Duelling +1", stats: { defensiveAwareness: 1, tackling: 1, aggression: 1, physicalContact: 1 }, labels: ["Defensive Awareness +1", "Tackling +1", "Aggression +1", "Physical Contact +1"] },
            { id: 'fantasista', name: "Fantasista +1", stats: { ballControl: 1, dribbling: 1, tightPossession: 1, finishing: 1 }, labels: ["Ball Control +1", "Dribbling +1", "Tight Possession +1", "Finishing +1"] },
            { id: 'freekick', name: "Free-kick Taking +1", stats: { finishing: 1, placeKicking: 1, curl: 1, kickingPower: 1 }, labels: ["Finishing +1", "Set Piece Taking +1", "Curl +1", "Kicking Power +1"] },
            { id: 'goalkeeping', name: "Goalkeeping +1", stats: { gkAwareness: 1, gkCatching: 1, gkParrying: 1, gkReflexes: 1 }, labels: ["GK Awareness +1", "GK Catching +1", "GK Parrying +1", "GK Reflexes +1"] },
            { id: 'hard_worker', name: "Hard Worker +1", stats: { aggression: 1, stamina: 1, acceleration: 1, defensiveEngagement: 1 }, labels: ["Aggression +1", "Stamina +1", "Acceleration +1", "Defensive Engagement +1"] },
            { id: 'passing', name: "Passing +1", stats: { lowPass: 1, loftedPass: 1, curl: 1, kickingPower: 1 }, labels: ["Low Pass +1", "Lofted Pass +1", "Curl +1", "Kicking Power +1"] },
            { id: 'physicality', name: "Physicality +1", stats: { jump: 1, physicalContact: 1, balance: 1, stamina: 1 }, labels: ["Jumping +1", "Physical Contact +1", "Balance +1", "Stamina +1"] },
            { id: 'saving', name: "Saving +1", stats: { gkAwareness: 1, gkReflexes: 1, gkReach: 1, jump: 1 }, labels: ["GK Awareness +1", "GK Reflexes +1", "GK Reach +1", "Jumping +1"] },
            { id: 'shooting', name: "Shooting +1", stats: { finishing: 1, kickingPower: 1, curl: 1, physicalContact: 1 }, labels: ["Finishing +1", "Kicking Power +1", "Curl +1", "Physical Contact +1"] },
            { id: 'shutdown', name: "Shutdown +1", stats: { defensiveAwareness: 1, tackling: 1, defensiveEngagement: 1, speed: 1 }, labels: ["Defensive Awareness +1", "Tackling +1", "Defensive Engagement +1", "Speed +1"] },
            { id: 'technique', name: "Technique +1", stats: { ballControl: 1, dribbling: 1, tightPossession: 1, lowPass: 1 }, labels: ["Ball Control +1", "Dribbling +1", "Tight Possession +1", "Low Pass +1"] }
        ];

        // ==================== BASE STAT ARCHETYPE GENERATOR ====================
        function createPlayerStats(archetype, boost = 0) {
            const b = (val) => Math.min(99, Math.max(40, val + boost));
            const presets = {
                wizard: {
                    attackingAwareness: b(87), ballControl: b(92), dribbling: b(93), tightPossession: b(92),
                    lowPass: b(85), loftedPass: b(82), finishing: b(86), heading: b(62),
                    placeKicking: b(86), curl: b(89), speed: b(83), acceleration: b(89),
                    kickingPower: b(81), jump: b(64), physicalContact: b(65), balance: b(91),
                    stamina: b(79), defensiveAwareness: b(48), tackling: b(45), aggression: b(50),
                    defensiveEngagement: b(47), gkAwareness: 40, gkCatching: 40, gkParrying: 40, gkReflexes: 40, gkReach: 40
                },
                striker: {
                    attackingAwareness: b(90), ballControl: b(84), dribbling: b(83), tightPossession: b(82),
                    lowPass: b(76), loftedPass: b(71), finishing: b(90), heading: b(84),
                    placeKicking: b(78), curl: b(80), speed: b(89), acceleration: b(88),
                    kickingPower: b(88), jump: b(83), physicalContact: b(82), balance: b(81),
                    stamina: b(82), defensiveAwareness: b(46), tackling: b(44), aggression: b(55),
                    defensiveEngagement: b(48), gkAwareness: 40, gkCatching: 40, gkParrying: 40, gkReflexes: 40, gkReach: 40
                },
                holePlayer: {
                    attackingAwareness: b(86), ballControl: b(88), dribbling: b(87), tightPossession: b(88),
                    lowPass: b(86), loftedPass: b(83), finishing: b(84), heading: b(74),
                    placeKicking: b(79), curl: b(82), speed: b(84), acceleration: b(86),
                    kickingPower: b(83), jump: b(75), physicalContact: b(76), balance: b(85),
                    stamina: b(86), defensiveAwareness: b(66), tackling: b(64), aggression: b(68),
                    defensiveEngagement: b(67), gkAwareness: 40, gkCatching: 40, gkParrying: 40, gkReflexes: 40, gkReach: 40
                },
                orchestrator: {
                    attackingAwareness: b(81), ballControl: b(90), dribbling: b(87), tightPossession: b(90),
                    lowPass: b(91), loftedPass: b(90), finishing: b(78), heading: b(66),
                    placeKicking: b(87), curl: b(88), speed: b(78), acceleration: b(81),
                    kickingPower: b(83), jump: b(68), physicalContact: b(71), balance: b(86),
                    stamina: b(85), defensiveAwareness: b(74), tackling: b(73), aggression: b(72),
                    defensiveEngagement: b(75), gkAwareness: 40, gkCatching: 40, gkParrying: 40, gkReflexes: 40, gkReach: 40
                },
                destroyerDmf: {
                    attackingAwareness: b(72), ballControl: b(81), dribbling: b(79), tightPossession: b(80),
                    lowPass: b(83), loftedPass: b(82), finishing: b(70), heading: b(81),
                    placeKicking: b(68), curl: b(70), speed: b(81), acceleration: b(80),
                    kickingPower: b(84), jump: b(84), physicalContact: b(87), balance: b(77),
                    stamina: b(89), defensiveAwareness: b(88), tackling: b(89), aggression: b(90),
                    defensiveEngagement: b(89), gkAwareness: 40, gkCatching: 40, gkParrying: 40, gkReflexes: 40, gkReach: 40
                },
                centerBack: {
                    attackingAwareness: b(60), ballControl: b(74), dribbling: b(70), tightPossession: b(72),
                    lowPass: b(77), loftedPass: b(78), finishing: b(58), heading: b(88),
                    placeKicking: b(60), curl: b(61), speed: b(82), acceleration: b(79),
                    kickingPower: b(79), jump: b(89), physicalContact: b(90), balance: b(73),
                    stamina: b(83), defensiveAwareness: b(90), tackling: b(91), aggression: b(89),
                    defensiveEngagement: b(90), gkAwareness: 40, gkCatching: 40, gkParrying: 40, gkReflexes: 40, gkReach: 40
                },
                fullback: {
                    attackingAwareness: b(77), ballControl: b(82), dribbling: b(83), tightPossession: b(81),
                    lowPass: b(81), loftedPass: b(84), finishing: b(69), heading: b(72),
                    placeKicking: b(75), curl: b(81), speed: b(89), acceleration: b(90),
                    kickingPower: b(82), jump: b(76), physicalContact: b(75), balance: b(83),
                    stamina: b(89), defensiveAwareness: b(82), tackling: b(84), aggression: b(82),
                    defensiveEngagement: b(83), gkAwareness: 40, gkCatching: 40, gkParrying: 40, gkReflexes: 40, gkReach: 40
                },
                goalkeeper: {
                    attackingAwareness: 45, ballControl: 58, dribbling: 52, tightPossession: 54,
                    lowPass: 64, loftedPass: 72, finishing: 42, heading: 56,
                    placeKicking: 68, curl: 48, speed: 62, acceleration: 64,
                    kickingPower: 83, jump: b(85), physicalContact: b(82), balance: b(68),
                    stamina: 66, defensiveAwareness: 52, tackling: 48, aggression: 50,
                    defensiveEngagement: 50, gkAwareness: b(90), gkCatching: b(88), gkParrying: b(89), gkReflexes: b(91), gkReach: b(90)
                }
            };
            return presets[archetype] || presets.wizard;
        }

        /**
         * ICONIC GOAL CELEBRATION & TROPHY LIFTING MOMENTS CONFIG
         * Matches the exact 3 player eras from the user's reference photos (Messi '09 Ballon d'Or Barca, Yamal Barca UCL Dribble, Ronaldo '08 Man Utd AIG) + Henry & other positions
         */
        const CELEBRATION_MOMENTS = {
            "messi_2009": {
                moment: "🏆 '09 Ballon d'Or Barca",
                commonsFile: "Messi_Ballon_d'Or_2009.jpg",
                searchQuery: "Lionel Messi FC Barcelona 2009 Ballon d'Or",
                wikiTitle: "Lionel_Messi"
            },
            "yamal": {
                moment: "⚽ UCL Solo Dribble vs PSG",
                commonsFile: "Lamine_Yamal_2024_(cropped).jpg",
                searchQuery: "Lamine Yamal FC Barcelona dribbling Champions League",
                wikiTitle: "Lamine_Yamal"
            },
            "cr7_2008": {
                moment: "⚽ '08 Man Utd AIG Strike",
                commonsFile: "Cristiano_Ronaldo_2008.jpg",
                searchQuery: "Cristiano Ronaldo Manchester United 2008 AIG",
                wikiTitle: "Cristiano_Ronaldo"
            },
            "henry": {
                moment: "🏆 Invincibles Knee Slide",
                commonsFile: "Thierry_Henry_Arsenal.jpg",
                searchQuery: "Thierry Henry Arsenal celebration goal",
                wikiTitle: "Thierry_Henry"
            },
            "bellingham": {
                moment: "⚽ Arms Wide Celebration",
                commonsFile: "Jude_Bellingham_2022.jpg",
                searchQuery: "Jude Bellingham Real Madrid celebration",
                wikiTitle: "Jude_Bellingham"
            },
            "vieira": {
                moment: "🏆 Invincibles Captain Lift",
                commonsFile: "Patrick_Vieira_2006.jpg",
                searchQuery: "Patrick Vieira Arsenal captain",
                wikiTitle: "Patrick_Vieira"
            },
            "pirlo": {
                moment: "🏆 '06 World Cup Maestro",
                commonsFile: "Andrea_Pirlo_Euro_2012.jpg",
                searchQuery: "Andrea Pirlo Italy Milan celebration",
                wikiTitle: "Andrea_Pirlo"
            },
            "maldini": {
                moment: "🏆 5x UCL Trophy Captain",
                commonsFile: "Paolo_Maldini_AC_Milan.jpg",
                searchQuery: "Paolo Maldini AC Milan trophy",
                wikiTitle: "Paolo_Maldini"
            },
            "rcarlos": {
                moment: "⚽ Impossible Thunder Freekick",
                commonsFile: "Roberto_Carlos_2011.jpg",
                searchQuery: "Roberto Carlos Brazil Real Madrid",
                wikiTitle: "Roberto_Carlos"
            },
            "schmeichel": {
                moment: "🏆 '99 Treble Cartwheel",
                commonsFile: "Peter_Schmeichel_2012.jpg",
                searchQuery: "Peter Schmeichel Manchester United",
                wikiTitle: "Peter_Schmeichel"
            }
        };

        /**
         * 2. CURATED DATABASE OF 10 BEST PLAYERS ACROSS ALL POSITIONS
         * Includes the 3 players from the user's photos (Messi '09 Ballon d'Or, Lamine Yamal Barca, Cristiano Ronaldo '08 Man Utd AIG),
         * Thierry Henry, plus elite players covering AMF, CMF, DMF, CB, LB, and GK.
         */
        const PLAYERS_DB = [
            // --- SECTION: TRENDING (User's 3 Reference Photo Players + Bellingham) ---
            { id: 1, jersey: 10, name: "Lionel Messi", eraDate: "01 Dec '09", cardTheme: "card-epic-barca", photoKey: "messi_2009", defaultBooster: "fantasista", fullPos: ["SS", "RWF", "AMF"], secondaryPos: ["CF", "RMF"], pos: "SS", baseOvr: 90, maxOvr: 107, cardType: "BigTime", section: "TRENDING", tier: "S+", form: "B", stars: 5, club: "FC Barcelona '09", nation: "Argentina", flag: "🇦🇷", playstyle: "Roaming Flank", maxLevel: 35, age: 22, height: 170, foot: "Left", archetype: "wizard", ovrBoost: 3, skills: ["Double Touch", "Marseille Turn", "Long-Range Curler", "First-time Shot", "One-touch Pass", "Through Passing", "Chip Shot Control", "Sole Control"], imgColor: "#dc2626" },
            { id: 2, jersey: 10, name: "Lamine Yamal", eraDate: "Live '26", cardTheme: "card-showtime", photoKey: "yamal", defaultBooster: "ball_carrying", fullPos: ["RWF", "RMF"], secondaryPos: ["AMF", "SS", "LWF"], pos: "RWF", baseOvr: 87, maxOvr: 105, cardType: "ShowTime", section: "TRENDING", tier: "S+", form: "A", stars: 5, club: "FC Barcelona", nation: "Spain", flag: "🇪🇸", playstyle: "Prolific Winger", maxLevel: 38, age: 19, height: 180, foot: "Left", archetype: "wizard", ovrBoost: 3, skills: ["Double Touch", "Flip Flap", "Marseille Turn", "Long-Range Curler", "Outside Curler", "Through Passing", "Pinpoint Crossing"], imgColor: "#9333ea" },
            { id: 3, jersey: 7, name: "Cristiano Ronaldo", eraDate: "21 May '08", cardTheme: "card-bigtime", photoKey: "cr7_2008", defaultBooster: "shooting", fullPos: ["LWF", "CF", "RWF"], secondaryPos: ["SS", "LMF", "RMF"], pos: "LWF", baseOvr: 89, maxOvr: 106, cardType: "BigTime", section: "TRENDING", tier: "S+", form: "B", stars: 5, club: "Manchester United '08", nation: "Portugal", flag: "🇵🇹", playstyle: "Prolific Winger", maxLevel: 35, age: 23, height: 187, foot: "Right", archetype: "striker", ovrBoost: 3, skills: ["Knuckle Shot", "Scissors Feint", "Long-Range Shooting", "Heading", "First-time Shot", "Acrobatic Finishing", "Aerial Superiority", "Penalty Specialist"], imgColor: "#b91c1c" },
            { id: 4, jersey: 5, name: "Jude Bellingham", eraDate: "Live '26", cardTheme: "card-showtime", photoKey: "bellingham", defaultBooster: "balancer", fullPos: ["AMF", "CMF"], secondaryPos: ["SS", "LMF", "DMF"], pos: "AMF", baseOvr: 87, maxOvr: 104, cardType: "ShowTime", section: "TRENDING", tier: "S+", form: "A", stars: 5, club: "Madrid Chamartin", nation: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", playstyle: "Hole Player", maxLevel: 33, age: 23, height: 186, foot: "Right", archetype: "holePlayer", ovrBoost: 2, skills: ["Double Touch", "Marseille Turn", "First-time Shot", "One-touch Pass", "Through Passing", "Interception", "Fighting Spirit"], imgColor: "#7e22ce" },

            // --- SECTION: ARSENAL BIGTIME (Henry CF & Vieira DMF) ---
            { id: 5, jersey: 14, name: "Thierry Henry", eraDate: "16 Nov '02", cardTheme: "card-bigtime", photoKey: "henry", defaultBooster: "strikers_instinct", fullPos: ["CF", "LWF"], secondaryPos: ["SS", "LMF"], pos: "CF", baseOvr: 89, maxOvr: 106, cardType: "BigTime", section: "ARSENAL BIGTIME", tier: "S+", form: "B", stars: 5, club: "Arsenal FC", nation: "France", flag: "🇫🇷", playstyle: "Goal Poacher", maxLevel: 35, age: 25, height: 188, foot: "Right", archetype: "striker", ovrBoost: 3, skills: ["Double Touch", "Long-Range Curler", "First-time Shot", "Outside Curler", "Chip Shot Control", "One-touch Pass", "Through Passing"], imgColor: "#dc2626" },
            { id: 6, jersey: 4, name: "Patrick Vieira", eraDate: "15 May '04", cardTheme: "card-bigtime", photoKey: "vieira", defaultBooster: "duelling", fullPos: ["DMF", "CMF"], secondaryPos: ["CB"], pos: "DMF", baseOvr: 88, maxOvr: 106, cardType: "BigTime", section: "ARSENAL BIGTIME", tier: "S+", form: "B", stars: 5, club: "Arsenal FC", nation: "France", flag: "🇫🇷", playstyle: "Destroyer", maxLevel: 34, age: 27, height: 192, foot: "Right", archetype: "destroyerDmf", ovrBoost: 3, skills: ["Man Marking", "Interception", "Blocker", "Aerial Superiority", "Sliding Tackle", "One-touch Pass", "Captaincy", "Fighting Spirit"], imgColor: "#b91c1c" },

            // --- SECTION: NATIONAL LEGENDS (Pirlo CMF, Maldini CB, Roberto Carlos LB, Schmeichel GK) ---
            { id: 7, jersey: 21, name: "Andrea Pirlo", eraDate: "09 Jul '06", cardTheme: "card-epic", photoKey: "pirlo", defaultBooster: "passing", fullPos: ["CMF", "DMF"], secondaryPos: ["AMF"], pos: "CMF", baseOvr: 87, maxOvr: 104, cardType: "Epic", section: "NATIONAL LEGENDS", tier: "S+", form: "B", stars: 5, club: "Milano RN", nation: "Italy", flag: "🇮🇹", playstyle: "Orchestrator", maxLevel: 33, age: 27, height: 177, foot: "Right", archetype: "orchestrator", ovrBoost: 2, skills: ["One-touch Pass", "Through Passing", "Weighted Pass", "Low Lofted Pass", "Pinpoint Crossing", "Long-Range Curler", "Knuckle Shot"], imgColor: "#059669" },
            { id: 8, jersey: 3, name: "Paolo Maldini", eraDate: "28 May '03", cardTheme: "card-bigtime", photoKey: "maldini", defaultBooster: "shutdown", fullPos: ["CB", "LB"], secondaryPos: ["RB"], pos: "CB", baseOvr: 88, maxOvr: 105, cardType: "BigTime", section: "NATIONAL LEGENDS", tier: "S+", form: "B", stars: 5, club: "Milano RN", nation: "Italy", flag: "🇮🇹", playstyle: "Build Up", maxLevel: 34, age: 34, height: 186, foot: "Right", archetype: "centerBack", ovrBoost: 3, skills: ["Man Marking", "Interception", "Blocker", "Aerial Superiority", "Sliding Tackle", "Acrobatic Clearance", "Captaincy"], imgColor: "#2563eb" },
            { id: 9, jersey: 6, name: "Roberto Carlos", eraDate: "30 Jun '02", cardTheme: "card-legend", photoKey: "rcarlos", defaultBooster: "freekick", fullPos: ["LB", "LMF"], secondaryPos: ["LWF"], pos: "LB", baseOvr: 87, maxOvr: 104, cardType: "Legend", section: "NATIONAL LEGENDS", tier: "S+", form: "B", stars: 5, club: "Brazil Legends", nation: "Brazil", flag: "🇧🇷", playstyle: "Offensive Full-back", maxLevel: 33, age: 29, height: 168, foot: "Left", archetype: "fullback", ovrBoost: 2, skills: ["Knuckle Shot", "Dipping Shot", "Pinpoint Crossing", "Long-Range Shooting", "Weighted Pass", "Outside Curler"], imgColor: "#eab308" },
            { id: 10, jersey: 1, name: "Peter Schmeichel", eraDate: "26 May '99", cardTheme: "card-epic", photoKey: "schmeichel", defaultBooster: "goalkeeping", fullPos: ["GK"], secondaryPos: [], pos: "GK", baseOvr: 88, maxOvr: 105, cardType: "Epic", section: "NATIONAL LEGENDS", tier: "S+", form: "B", stars: 5, club: "Manchester United", nation: "Denmark", flag: "🇩🇰", playstyle: "Defensive Goalkeeper", maxLevel: 32, age: 35, height: 191, foot: "Right", archetype: "goalkeeper", ovrBoost: 3, skills: ["GK Long Throw", "GK Low Punt", "GK High Punt", "GK Penalty Saver", "Captaincy", "Fighting Spirit"], imgColor: "#10b981" }
        ].map(p => {
            const cfg = CELEBRATION_MOMENTS[p.photoKey] || {};
            const directCommonsUrl = cfg.commonsFile
                ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(cfg.commonsFile)}?width=520`
                : "";
            return {
                ...p,
                momentTitle: cfg.moment || "🏆 Iconic Match",
                searchQuery: cfg.searchQuery || `${p.name} celebration football`,
                wikiTitle: cfg.wikiTitle || p.name.replace(/\s+/g, '_'),
                image: directCommonsUrl,
                baseStats: createPlayerStats(p.archetype, p.ovrBoost)
            };
        });

        /**
         * 3. COMPLETE DATABASE OF 3 ELITE FOOTBALL MANAGERS WITH REAL-LIFE PORTRAITS
         */
        const MANAGERS_DB = [
            {
                id: 1,
                name: "Pep Guardiola",
                wikiTitle: "Pep_Guardiola",
                image: "",
                nation: "Spain",
                flag: "🇪🇸",
                club: "Manchester B",
                booster: "+1 Tight Possession",
                boosterDesc: "Increases Tight Possession by +1 for all players in the squad.",
                affinity: "Star Players (+300% EXP)",
                bestStyle: "Possession Game",
                proficiency: { possession: 88, quickCounter: 74, longBallCounter: 55, outWide: 76, longBall: 48 },
                accent: "#0ea5e9"
            },
            {
                id: 2,
                name: "Xabi Alonso",
                wikiTitle: "Xabi_Alonso",
                image: "",
                nation: "Spain",
                flag: "🇪🇸",
                club: "Leverkusen / Madrid",
                booster: "+1 Acceleration",
                boosterDesc: "Increases Acceleration by +1 for all players in the squad.",
                affinity: "Midfielders (+300% EXP)",
                bestStyle: "Quick Counter",
                proficiency: { possession: 80, quickCounter: 88, longBallCounter: 72, outWide: 78, longBall: 54 },
                accent: "#b6e619"
            },
            {
                id: 3,
                name: "Carlo Ancelotti",
                wikiTitle: "Carlo_Ancelotti",
                image: "",
                nation: "Italy",
                flag: "🇮🇹",
                club: "Madrid Chamartin",
                booster: "+1 Ball Control",
                boosterDesc: "Increases Ball Control by +1 for all players in the squad.",
                affinity: "Forwards (+300% EXP)",
                bestStyle: "Long Ball Counter",
                proficiency: { possession: 82, quickCounter: 87, longBallCounter: 88, outWide: 75, longBall: 65 },
                accent: "#eab308"
            }
        ];

        // ==================== DYNAMIC REAL-LIFE PHOTO LOADER (WIKIPEDIA & COMMONS CELEBRATION API) ====================
        const wikiPhotoCache = {};

        async function resolveCommonsCelebrationPhoto(searchQuery, wikiTitle, resultIndex = 0) {
            const cacheKey = `${searchQuery}_${resultIndex}`;
            if (wikiPhotoCache[cacheKey]) return wikiPhotoCache[cacheKey];

            // 1. Try Wikimedia Commons Search API for specific goal celebration / trophy lifting photos
            try {
                const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent('filetype:bitmap ' + searchQuery)}&gsrlimit=5&prop=imageinfo&iiprop=url&iiurlwidth=520&format=json&origin=*`;
                const cRes = await fetch(commonsUrl);
                if (cRes.ok) {
                    const cData = await cRes.json();
                    if (cData.query && cData.query.pages) {
                        const pages = Object.values(cData.query.pages)
                            .filter(pg => pg.imageinfo && pg.imageinfo[0] && pg.imageinfo[0].thumburl);
                        if (pages.length > 0) {
                            const chosen = pages[resultIndex % pages.length].imageinfo[0].thumburl;
                            wikiPhotoCache[cacheKey] = chosen;
                            return chosen;
                        }
                    }
                }
            } catch (err) {
                // Fall through to Wikipedia summary portrait
            }

            // 2. Fallback to Wikipedia REST API Page Summary High-Res Image
            if (!wikiTitle) return null;
            if (wikiPhotoCache[wikiTitle]) return wikiPhotoCache[wikiTitle];
            try {
                const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`);
                if (!res.ok) return null;
                const data = await res.json();
                const photoUrl = (data.thumbnail && data.thumbnail.source) || (data.originalimage && data.originalimage.source) || null;
                if (photoUrl) {
                    wikiPhotoCache[wikiTitle] = photoUrl;
                }
                return photoUrl;
            } catch (e) {
                return null;
            }
        }

        async function hydrateAllRealPortraits() {
            // Hydrate all 60 players with distinct era celebration/trophy photos + 10 managers
            await Promise.all(PLAYERS_DB.map(async (p) => {
                // Use different result index for duplicate players (e.g. Messi id 1, 2, 19; Ronaldo id 3, 20) so each card gets a unique celebration photo
                const variantIndex = p.id === 2 ? 1 : (p.id === 19 ? 2 : (p.id === 20 ? 1 : 0));
                const url = await resolveCommonsCelebrationPhoto(p.searchQuery, p.wikiTitle, variantIndex);
                if (url) {
                    p.image = url;
                    document.querySelectorAll(`img[data-entity="player-${p.id}"]`).forEach(imgEl => {
                        imgEl.src = url;
                        imgEl.classList.remove('hidden');
                        if (imgEl.nextElementSibling) {
                            imgEl.nextElementSibling.classList.add('hidden');
                            imgEl.nextElementSibling.classList.remove('flex');
                        }
                    });
                }
            }));

            await Promise.all(MANAGERS_DB.map(async (m) => {
                const url = await resolveCommonsCelebrationPhoto(m.name + ' football manager', m.wikiTitle, 0);
                if (url) {
                    m.image = url;
                    document.querySelectorAll(`img[data-entity="manager-${m.id}"]`).forEach(imgEl => {
                        imgEl.src = url;
                        imgEl.classList.remove('hidden');
                        if (imgEl.nextElementSibling) {
                            imgEl.nextElementSibling.classList.add('hidden');
                            imgEl.nextElementSibling.classList.remove('flex');
                        }
                    });
                }
            }));
        }

        function handlePortraitError(imgEl) {
            const entityAttr = imgEl.getAttribute('data-entity') || '';
            if (entityAttr.startsWith('player-')) {
                const pid = parseInt(entityAttr.replace('player-', ''), 10);
                const p = PLAYERS_DB.find(item => item.id === pid);
                if (p && !imgEl.dataset.retriedWiki) {
                    imgEl.dataset.retriedWiki = '1';
                    resolveCommonsCelebrationPhoto(p.name, p.wikiTitle, 0).then(fallbackUrl => {
                        if (fallbackUrl) {
                            p.image = fallbackUrl;
                            imgEl.src = fallbackUrl;
                            imgEl.classList.remove('hidden');
                        } else {
                            imgEl.classList.add('hidden');
                            const fb = imgEl.nextElementSibling;
                            if (fb) { fb.classList.remove('hidden'); fb.classList.add('flex'); }
                        }
                    });
                    return;
                }
            }
            imgEl.classList.add('hidden');
            const fallback = imgEl.nextElementSibling;
            if (fallback) {
                fallback.classList.remove('hidden');
                fallback.classList.add('flex');
            }
        }

        function getFallbackPlayerSVG(p) {
            const color = p.imgColor || '#10b981';
            return `
                <svg viewBox="0 0 120 140" class="w-full h-full drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="60" cy="36" r="20" fill="#e2e8f0"/>
                    <path d="M24 132C24 96 40 76 60 76C80 76 96 96 96 132" fill="${color}" stroke="#ffffff" stroke-width="2"/>
                    <text x="60" y="118" text-anchor="middle" fill="#ffffff" font-family="Barlow Condensed, sans-serif" font-weight="800" font-style="italic" font-size="28">${p.jersey || 10}</text>
                </svg>
            `;
        }

        // ==================== NAVIGATION & DRAWER CONTROLS ====================
        function toggleDrawer(open) {
            const overlay = document.getElementById('drawerOverlay');
            const drawer = document.getElementById('sideDrawer');
            if (open) {
                overlay.classList.remove('hidden');
                setTimeout(() => {
                    overlay.classList.remove('opacity-0');
                    drawer.classList.remove('-translate-x-full');
                }, 10);
            } else {
                overlay.classList.add('opacity-0');
                drawer.classList.add('-translate-x-full');
                setTimeout(() => {
                    overlay.classList.add('hidden');
                }, 300);
            }
        }

        function switchSection(section) {
            currentTab = section;
            const playersSec = document.getElementById('playersSection');
            const managersSec = document.getElementById('managersSection');
            const tabP = document.getElementById('tabBtnPlayers');
            const tabM = document.getElementById('tabBtnManagers');
            const indP = document.getElementById('tabIndicatorPlayers');
            const indM = document.getElementById('tabIndicatorManagers');
            const dNavP = document.getElementById('drawerNavPlayers');
            const dNavM = document.getElementById('drawerNavManagers');

            if (section === 'players') {
                playersSec.classList.remove('hidden');
                managersSec.classList.add('hidden');

                tabP.classList.replace('text-slate-400', 'text-ef-lime');
                tabM.classList.replace('text-ef-lime', 'text-slate-400');
                indP.classList.remove('hidden');
                indM.classList.add('hidden');

                dNavP.className = "w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all duration-200 bg-ef-lime/15 border-ef-lime text-ef-lime font-semibold shadow-lg shadow-ef-lime/5";
                dNavM.className = "w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-transparent hover:bg-slate-800/60 text-slate-300 font-medium transition-all duration-200";
            } else {
                playersSec.classList.add('hidden');
                managersSec.classList.remove('hidden');

                tabM.classList.replace('text-slate-400', 'text-ef-lime');
                tabP.classList.replace('text-ef-lime', 'text-slate-400');
                indM.classList.remove('hidden');
                indP.classList.add('hidden');

                dNavM.className = "w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all duration-200 bg-ef-lime/15 border-ef-lime text-ef-lime font-semibold shadow-lg shadow-ef-lime/5";
                dNavP.className = "w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-transparent hover:bg-slate-800/60 text-slate-300 font-medium transition-all duration-200";
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function focusSearch() {
            const desktopInput = document.getElementById('desktopSearchInput');
            const mobileInput = document.getElementById('mobileSearchInput');
            if (window.innerWidth >= 768) {
                desktopInput.focus();
            } else {
                mobileInput.focus();
            }
        }

        // ==================== SEARCH & FILTERS ====================
        function renderFilterBars() {
            const positions = ['ALL', 'CF', 'SS', 'RWF', 'LWF', 'AMF', 'CMF', 'DMF', 'CB', 'LB', 'RB', 'GK'];
            const cardTypes = ['ALL', 'BigTime', 'Epic', 'Legend', 'ShowTime', 'POTW', 'Trending'];

            const posBar = document.getElementById('positionFilterBar');
            posBar.innerHTML = positions.map(pos => `
                <button onclick="setPosFilter('${pos}')" class="px-3 py-1 rounded-lg text-xs font-bold transition shrink-0 ${selectedPos === pos ? 'bg-ef-lime text-ef-dark shadow-md' : 'bg-[#141d35] text-slate-300 border border-slate-700/70 hover:border-slate-500'}">
                    ${pos}
                </button>
            `).join('');

            const cardBar = document.getElementById('cardTypeFilterBar');
            cardBar.innerHTML = cardTypes.map(type => `
                <button onclick="setCardTypeFilter('${type}')" class="px-3 py-1 rounded-lg text-xs font-bold transition shrink-0 ${selectedCardType === type ? 'bg-ef-lime text-ef-dark shadow-md' : 'bg-[#141d35] text-slate-300 border border-slate-700/70 hover:border-slate-500'}">
                    ${type}
                </button>
            `).join('');
        }

        function setPosFilter(pos) {
            selectedPos = pos;
            renderFilterBars();
            renderPlayers();
        }

        function setCardTypeFilter(type) {
            selectedCardType = type;
            renderFilterBars();
            renderPlayers();
        }

        function handleSearch(val) {
            searchQuery = val.trim().toLowerCase();
            // Sync both search inputs
            document.getElementById('desktopSearchInput').value = val;
            document.getElementById('mobileSearchInput').value = val;
            renderPlayers();
            renderManagers();
        }

        function resetAllFilters() {
            searchQuery = '';
            selectedPos = 'ALL';
            selectedCardType = 'ALL';
            document.getElementById('desktopSearchInput').value = '';
            document.getElementById('mobileSearchInput').value = '';
            renderFilterBars();
            renderPlayers();
            renderManagers();
        }

        // ==================== CARD RENDERING (60 PLAYERS) ====================
        function getCardThemeClass(p) {
            if (p && p.cardTheme) return p.cardTheme;
            const cardType = typeof p === 'string' ? p : p.cardType;
            switch (cardType) {
                case 'BigTime': return 'card-bigtime';
                case 'Epic': return 'card-epic';
                case 'Legend': return 'card-legend';
                case 'ShowTime': return 'card-showtime';
                case 'POTW': return 'card-potw';
                default: return 'card-trending';
            }
        }

        function getInitials(name) {
            return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
        }

        function createPlayerCardHTML(p) {
            const cardClass = getCardThemeClass(p);
            const tierBadge = p.tier === 'S+' ? 'bg-ef-lime text-ef-dark' : (p.tier === 'S' ? 'bg-emerald-400 text-ef-dark' : 'bg-sky-400 text-ef-dark');
            const starsHTML = Array(p.stars).fill('<i class="fa-solid fa-star text-[8px] text-amber-300"></i>').join('');
            const hasImg = Boolean(p.image);

            return `
                <div onclick="openPlayerModal(${p.id})" class="ef-player-card relative overflow-hidden ${cardClass} rounded-xl p-2 sm:p-2.5 cursor-pointer select-none flex flex-col justify-between aspect-[3/4.2] group">
                    <!-- Real Footballer Celebration / Trophy Lifting Photo Layer -->
                    <div class="absolute inset-x-0 top-1 bottom-6 flex items-end justify-center pointer-events-none z-0 overflow-hidden">
                        <img
                            data-entity="player-${p.id}"
                            src="${p.image || ''}"
                            alt="${p.name} - ${p.momentTitle}"
                            loading="lazy"
                            referrerpolicy="no-referrer"
                            onerror="handlePortraitError(this)"
                            class="player-portrait-img w-full h-full object-cover object-top ${hasImg ? '' : 'hidden'}"
                        >
                        <div class="${hasImg ? 'hidden' : 'flex'} w-[82%] h-[86%] items-end justify-center">
                            ${getFallbackPlayerSVG(p)}
                        </div>
                    </div>

                    <!-- Top Row: Base OVR, Pos, Age Badge & Tier Tag -->
                    <div class="flex items-start justify-between z-20 relative">
                        <div class="leading-none bg-black/55 backdrop-blur-[2px] px-1.5 py-1 rounded-lg border border-white/15 shadow">
                            <div class="font-display font-extrabold text-xl sm:text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">${p.baseOvr}</div>
                            <div class="font-display font-bold text-[11px] sm:text-xs text-amber-300 tracking-wider uppercase drop-shadow">${p.pos}</div>
                            <div class="mt-0.5 text-xs leading-none drop-shadow">${p.flag}</div>
                        </div>

                        <div class="flex flex-col items-end gap-1">
                            <span class="text-[10px] font-black px-1.5 py-0.5 rounded shadow ${tierBadge}">${p.tier}</span>
                            <span class="text-[10px] font-bold bg-black/75 text-ef-cyan px-1.5 py-0.5 rounded border border-white/15" title="Max Trained OVR">
                                ${p.maxOvr}
                            </span>
                            <span class="text-[9px] font-bold bg-black/70 text-amber-200 px-1 py-0.2 rounded border border-white/10">
                                ${p.age}y
                            </span>
                        </div>
                    </div>

                    <!-- Bottom Nameplate, Iconic Trophy/Goal Moment Tag & Form Badge -->
                    <div class="z-20 relative bg-gradient-to-t from-black/95 via-black/90 to-transparent -mx-2 -mb-2 sm:-mx-2.5 sm:-mb-2.5 p-2 pt-5 rounded-b-xl">
                        <div class="flex items-center justify-center gap-1 mb-0.5">
                            <span class="text-[8px] font-extrabold tracking-wide px-1.5 py-0.5 rounded bg-black/80 text-amber-300 border border-amber-400/30 truncate max-w-full">
                                ${p.momentTitle}
                            </span>
                        </div>
                        <div class="text-center font-bold text-[11px] sm:text-xs text-white truncate drop-shadow">
                            ${p.name}
                        </div>
                        <div class="flex items-center justify-between mt-1 pt-1 border-t border-white/15">
                            <div class="flex items-center gap-0.5">
                                ${starsHTML}
                            </div>
                            <span class="text-[9px] font-bold text-slate-300">${p.eraDate}</span>
                            <span class="text-[10px] font-black px-1.5 rounded ${p.form === 'A' ? 'bg-emerald-500 text-white' : 'bg-lime-400 text-ef-dark'}">
                                ${p.form}
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderPlayers() {
            const isFiltering = searchQuery !== '' || selectedPos !== 'ALL' || selectedCardType !== 'ALL';
            const filteredContainer = document.getElementById('filteredPlayersContainer');
            const categorizedContainer = document.getElementById('categorizedPlayersContainer');

            if (isFiltering) {
                filteredContainer.classList.remove('hidden');
                categorizedContainer.classList.add('hidden');

                const matches = PLAYERS_DB.filter(p => {
                    const matchText = p.name.toLowerCase().includes(searchQuery) ||
                                      p.club.toLowerCase().includes(searchQuery) ||
                                      p.nation.toLowerCase().includes(searchQuery) ||
                                      p.playstyle.toLowerCase().includes(searchQuery) ||
                                      p.skills.some(s => s.toLowerCase().includes(searchQuery));
                    const matchPos = selectedPos === 'ALL' || p.pos === selectedPos;
                    const matchCard = selectedCardType === 'ALL' || p.cardType === selectedCardType;
                    return matchText && matchPos && matchCard;
                });

                document.getElementById('filteredPlayersTitle').textContent = `SEARCH RESULTS (${matches.length} / 10)`;
                const grid = document.getElementById('filteredPlayersGrid');

                if (matches.length === 0) {
                    grid.innerHTML = `
                        <div class="col-span-full bg-[#131b31] border border-slate-800 rounded-2xl p-8 text-center">
                            <i class="fa-solid fa-user-slash text-3xl text-slate-500 mb-2"></i>
                            <p class="text-slate-300 font-semibold">No players matched your filter criteria.</p>
                            <button onclick="resetAllFilters()" class="mt-3 px-4 py-2 rounded-xl bg-ef-lime text-ef-dark font-bold text-xs">Reset Filters</button>
                        </div>
                    `;
                } else {
                    grid.innerHTML = matches.map(createPlayerCardHTML).join('');
                }
            } else {
                filteredContainer.classList.add('hidden');
                categorizedContainer.classList.remove('hidden');

                const trending = PLAYERS_DB.filter(p => p.section === 'TRENDING');
                const arsenal = PLAYERS_DB.filter(p => p.section === 'ARSENAL BIGTIME');
                const legends = PLAYERS_DB.filter(p => p.section === 'NATIONAL LEGENDS');

                document.getElementById('gridTrending').innerHTML = trending.map(createPlayerCardHTML).join('');
                document.getElementById('gridArsenal').innerHTML = arsenal.map(createPlayerCardHTML).join('');
                document.getElementById('gridLegends').innerHTML = legends.map(createPlayerCardHTML).join('');
                document.getElementById('gridAllPlayers').innerHTML = PLAYERS_DB.map(createPlayerCardHTML).join('');
            }
        }

        // ==================== RENDER 10 MANAGERS ====================
        function renderManagers() {
            const grid = document.getElementById('managersGrid');
            const filtered = MANAGERS_DB.filter(m =>
                m.name.toLowerCase().includes(searchQuery) ||
                m.club.toLowerCase().includes(searchQuery) ||
                m.bestStyle.toLowerCase().includes(searchQuery) ||
                m.booster.toLowerCase().includes(searchQuery)
            );

            if (filtered.length === 0) {
                grid.innerHTML = `
                    <div class="col-span-full bg-[#131b31] border border-slate-800 rounded-2xl p-8 text-center">
                        <p class="text-slate-300 font-semibold">No managers found matching "${searchQuery}".</p>
                    </div>
                `;
                return;
            }

            grid.innerHTML = filtered.map(m => {
                const maxProf = Math.max(...Object.values(m.proficiency));
                const hasImg = Boolean(m.image);
                return `
                    <div onclick="openManagerModal(${m.id})" class="bg-gradient-to-b from-[#17213d] to-[#0f1629] border border-slate-700/80 hover:border-ef-lime rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-xl flex flex-col justify-between group">
                        <div>
                            <!-- Manager Top Header -->
                            <div class="flex items-center justify-between gap-2 mb-3">
                                <span class="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded bg-ef-lime/15 text-ef-lime border border-ef-lime/30">
                                    ${m.bestStyle}
                                </span>
                                <span class="font-display font-black text-xl text-ef-cyan">${maxProf}</span>
                            </div>

                            <!-- Avatar & Name -->
                            <div class="flex items-center gap-3.5 mb-3">
                                <div class="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/25 shrink-0 shadow-lg flex items-center justify-center" style="background: linear-gradient(135deg, ${m.accent}55, #0f172a);">
                                    <img
                                        data-entity="manager-${m.id}"
                                        src="${m.image || ''}"
                                        alt="${m.name}"
                                        referrerpolicy="no-referrer"
                                        onerror="handlePortraitError(this)"
                                        class="manager-portrait-img w-full h-full ${hasImg ? '' : 'hidden'}"
                                    >
                                    <div class="${hasImg ? 'hidden' : 'flex'} w-full h-full items-center justify-center font-display font-black italic text-lg text-white">
                                        ${getInitials(m.name)}
                                    </div>
                                </div>
                                <div class="min-w-0">
                                    <h3 class="font-bold text-base text-white truncate group-hover:text-ef-lime transition">${m.flag} ${m.name}</h3>
                                    <p class="text-xs text-slate-400 truncate">${m.club}</p>
                                    <div class="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                                        <i class="fa-solid fa-bolt text-[9px]"></i> ${m.booster}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Mini Playstyle Bars -->
                        <div class="space-y-1.5 pt-3 border-t border-slate-800/80 text-xs">
                            <div class="flex justify-between items-center">
                                <span class="text-slate-400">Possession Game</span>
                                <span class="font-bold ${m.proficiency.possession >= 85 ? 'text-ef-lime' : 'text-slate-200'}">${m.proficiency.possession}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-slate-400">Quick Counter</span>
                                <span class="font-bold ${m.proficiency.quickCounter >= 85 ? 'text-ef-lime' : 'text-slate-200'}">${m.proficiency.quickCounter}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-slate-400">Long Ball Counter</span>
                                <span class="font-bold ${m.proficiency.longBallCounter >= 85 ? 'text-ef-lime' : 'text-slate-200'}">${m.proficiency.longBallCounter}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // ==================== PLAYER MODAL & INTERACTIVE LEVEL TRAINING ====================
        function getStatColorClass(val) {
            if (val >= 90) return 'stat-90';
            if (val >= 80) return 'stat-80';
            if (val >= 70) return 'stat-70';
            return 'stat-low';
        }

        function openPlayerModal(playerId) {
            activePlayer = PLAYERS_DB.find(p => p.id === playerId);
            if (!activePlayer) return;

            // Default to Max Trained Level + Built-in Slot 1 Booster + Reset Slot 2 & Position Tokens
            currentLevel = activePlayer.maxLevel;
            selectedSlot1Booster = BOOSTERS_CATALOG.find(b => b.id === activePlayer.defaultBooster) || BOOSTERS_CATALOG[0];
            selectedSlot2Booster = null;
            activePositionTokens = [];
            resetProgressionPoints(false);
            autoAllocateOptimalPoints();

            document.getElementById('modalCardTypeBadge').textContent = `${activePlayer.cardType} • ${activePlayer.eraDate || ''}`;
            document.getElementById('modalPlayerName').textContent = `${activePlayer.name} (${activePlayer.pos} • Age ${activePlayer.age})`;

            renderPlayerModalContent();
            const modal = document.getElementById('playerModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function closePlayerModal() {
            const modal = document.getElementById('playerModal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        function getTotalAvailablePoints() {
            return (currentLevel - 1) * 2;
        }

        function getUsedPoints() {
            // Standard eFootball progressive point cost (1-4: 1pt, 5-8: 2pts, 9-12: 3pts)
            let total = 0;
            for (const key in progressionPoints) {
                const lvl = progressionPoints[key];
                for (let i = 1; i <= lvl; i++) {
                    if (i <= 4) total += 1;
                    else if (i <= 8) total += 2;
                    else total += 3;
                }
            }
            return total;
        }

        function getNextStepCost(currentAllocation) {
            const nextStep = currentAllocation + 1;
            if (nextStep <= 4) return 1;
            if (nextStep <= 8) return 2;
            return 3;
        }

        function resetProgressionPoints(rerender = true) {
            for (const key in progressionPoints) {
                progressionPoints[key] = 0;
            }
            if (rerender) renderPlayerModalContent();
        }

        function autoAllocateOptimalPoints() {
            resetProgressionPoints(false);
            if (!activePlayer) return;

            const isGK = activePlayer.pos === 'GK';
            const isDef = ['CB', 'LB', 'RB', 'DMF'].includes(activePlayer.pos);
            const priorityOrder = isGK
                ? ['gk1', 'gk2', 'gk3', 'aerial']
                : isDef
                    ? ['defending', 'lowerBody', 'aerial', 'dexterity', 'passing']
                    : ['shooting', 'dribbling', 'dexterity', 'lowerBody', 'passing', 'aerial'];

            let safety = 0;
            while (safety < 120) {
                safety++;
                let allocatedInPass = false;
                for (const cat of priorityOrder) {
                    if (progressionPoints[cat] < 12) {
                        const cost = getNextStepCost(progressionPoints[cat]);
                        if (getUsedPoints() + cost <= getTotalAvailablePoints()) {
                            progressionPoints[cat]++;
                            allocatedInPass = true;
                        }
                    }
                }
                if (!allocatedInPass) break;
            }
        }

        function changePlayerLevel(newLvl) {
            currentLevel = parseInt(newLvl, 10);
            // If used points exceed newly lowered level cap, auto-adjust cleanly
            while (getUsedPoints() > getTotalAvailablePoints()) {
                for (const key in progressionPoints) {
                    if (progressionPoints[key] > 0) {
                        progressionPoints[key]--;
                        break;
                    }
                }
            }
            renderPlayerModalContent();
        }

        function adjustProgression(category, delta) {
            if (delta > 0) {
                if (progressionPoints[category] >= 12) return;
                const cost = getNextStepCost(progressionPoints[category]);
                if (getUsedPoints() + cost > getTotalAvailablePoints()) {
                    showToast('Not enough Progression Points! Increase Level first.');
                    return;
                }
                progressionPoints[category]++;
            } else if (delta < 0) {
                if (progressionPoints[category] <= 0) return;
                progressionPoints[category]--;
            }
            renderPlayerModalContent();
        }

        function computeTrainedStats() {
            const s = { ...activePlayer.baseStats };
            const p = progressionPoints;
            const clamp = (v) => Math.min(99, v);

            // Apply authentic eFootball progression point boosts
            s.finishing = clamp(s.finishing + p.shooting);
            s.placeKicking = clamp(s.placeKicking + p.shooting);
            s.curl = clamp(s.curl + p.shooting);

            s.lowPass = clamp(s.lowPass + p.passing);
            s.loftedPass = clamp(s.loftedPass + p.passing);

            s.ballControl = clamp(s.ballControl + p.dribbling);
            s.dribbling = clamp(s.dribbling + p.dribbling);
            s.tightPossession = clamp(s.tightPossession + p.dribbling);

            s.attackingAwareness = clamp(s.attackingAwareness + p.dexterity);
            s.acceleration = clamp(s.acceleration + p.dexterity);
            s.balance = clamp(s.balance + p.dexterity);

            s.speed = clamp(s.speed + p.lowerBody);
            s.kickingPower = clamp(s.kickingPower + p.lowerBody);
            s.stamina = clamp(s.stamina + p.lowerBody);

            s.heading = clamp(s.heading + p.aerial);
            s.jump = clamp(s.jump + p.aerial + p.gk1);
            s.physicalContact = clamp(s.physicalContact + p.aerial);

            s.defensiveAwareness = clamp(s.defensiveAwareness + p.defending);
            s.tackling = clamp(s.tackling + p.defending);
            s.aggression = clamp(s.aggression + p.defending);
            s.defensiveEngagement = clamp(s.defensiveEngagement + p.defending);

            s.gkAwareness = clamp(s.gkAwareness + p.gk1);
            s.gkParrying = clamp(s.gkParrying + p.gk2);
            s.gkReach = clamp(s.gkReach + p.gk2);
            s.gkCatching = clamp(s.gkCatching + p.gk3);
            s.gkReflexes = clamp(s.gkReflexes + p.gk3);

            // Apply Booster Slot 1 & Booster Slot 2 (+1 stat bonuses)
            [selectedSlot1Booster, selectedSlot2Booster].forEach(booster => {
                if (booster && booster.stats) {
                    for (const [statKey, bonusVal] of Object.entries(booster.stats)) {
                        if (typeof s[statKey] === 'number') {
                            s[statKey] = clamp(s[statKey] + bonusVal);
                        }
                    }
                }
            });

            // Dynamic OVR calculation proportional to allocated points + active boosters
            const maxPts = (activePlayer.maxLevel - 1) * 2;
            const ratio = maxPts > 0 ? Math.min(1, getUsedPoints() / maxPts) : 1;
            const boosterOvrBonus = (selectedSlot1Booster ? 1 : 0) + (selectedSlot2Booster ? 1 : 0);
            const dynamicOvr = Math.round(activePlayer.baseOvr + (activePlayer.maxOvr - activePlayer.baseOvr) * ratio) + boosterOvrBonus;

            return { stats: s, dynamicOvr };
        }

        // ==================== 13-POSITION PROFICIENCY & RATING CALCULATOR ====================
        function getPositionProficiencyLevel(posCode) {
            if (!activePlayer) return 'none';
            if (activePlayer.fullPos.includes(posCode) || activePositionTokens.includes(posCode)) return 'full';
            if (activePlayer.secondaryPos.includes(posCode)) return 'secondary';
            return 'none';
        }

        function computePositionRating(posCode, dynamicOvr) {
            const prof = getPositionProficiencyLevel(posCode);
            if (posCode === activePlayer.pos) return dynamicOvr;
            if (prof === 'full') return Math.max(40, dynamicOvr - 1);
            if (prof === 'secondary') return Math.max(40, dynamicOvr - 4);
            // Unfamiliar penalty based on outfield vs GK
            if (activePlayer.pos === 'GK' || posCode === 'GK') return 48;
            return Math.max(52, dynamicOvr - 14);
        }

        function renderPositionPitchGrid(dynamicOvr) {
            const renderCell = (posCode, extraHeightClass = 'h-full') => {
                const prof = getPositionProficiencyLevel(posCode);
                const rating = computePositionRating(posCode, dynamicOvr);
                let cellStyle = 'bg-[#1a2030] text-slate-500 border border-slate-800/80';
                if (prof === 'full') {
                    cellStyle = 'bg-[#00d68f] text-[#051b14] shadow-[0_0_12px_rgba(0,214,143,0.35)] border border-emerald-300/60';
                } else if (prof === 'secondary') {
                    cellStyle = 'bg-[#063b2b] text-[#00d68f] border border-[#00d68f]/35';
                }
                return `
                    <div onclick="openPositionBoosterModal()" title="Click to manage Position Boosters" class="${extraHeightClass} ${cellStyle} rounded-lg flex flex-col items-center justify-center py-1.5 px-1 cursor-pointer transition-transform hover:scale-[1.03] select-none">
                        <span class="text-[10px] font-extrabold tracking-wider uppercase leading-tight">${posCode}</span>
                        <span class="font-display font-black text-base sm:text-lg leading-none mt-0.5">${rating}</span>
                    </div>
                `;
            };

            return `
                <div class="bg-[#111623] border border-slate-800/90 rounded-2xl p-3 space-y-2.5">
                    <!-- 3x3 Pitch Formation Grid matching eFHUB Screenshot 2 & 3 -->
                    <div class="grid grid-cols-3 gap-1.5">
                        <!-- Row 1: LWF | CF + SS | RWF -->
                        ${renderCell('LWF', 'min-h-[68px]')}
                        <div class="flex flex-col gap-1.5">
                            ${renderCell('CF', 'py-1')}
                            ${renderCell('SS', 'py-1')}
                        </div>
                        ${renderCell('RWF', 'min-h-[68px]')}

                        <!-- Row 2: LMF | AMF + CMF + DMF | RMF -->
                        ${renderCell('LMF', 'min-h-[96px]')}
                        <div class="flex flex-col gap-1.5">
                            ${renderCell('AMF', 'py-0.5')}
                            ${renderCell('CMF', 'py-0.5')}
                            ${renderCell('DMF', 'py-0.5')}
                        </div>
                        ${renderCell('RMF', 'min-h-[96px]')}

                        <!-- Row 3: LB | CB + GK | RB -->
                        ${renderCell('LB', 'min-h-[68px]')}
                        <div class="flex flex-col gap-1.5">
                            ${renderCell('CB', 'py-1')}
                            ${renderCell('GK', 'py-1')}
                        </div>
                        ${renderCell('RB', 'min-h-[68px]')}
                    </div>

                    <!-- Bottom Playing Style & Position Boosters Pill Buttons -->
                    <div class="grid grid-cols-2 gap-2 pt-1">
                        <div class="bg-[#18233c] border border-blue-500/25 text-[#4da6ff] font-bold text-xs py-2 px-2.5 rounded-lg text-center truncate">
                            ${activePlayer.playstyle}
                        </div>
                        <button onclick="openPositionBoosterModal()" class="bg-[#18233c] hover:bg-[#213052] border border-blue-500/35 text-[#4da6ff] font-bold text-xs py-2 px-2.5 rounded-lg text-center transition flex items-center justify-center gap-1.5">
                            <span>Position Boosters</span>
                            ${activePositionTokens.length > 0 ? `<span class="bg-ef-lime text-ef-dark text-[10px] font-black px-1.5 rounded-full">${activePositionTokens.length}/2</span>` : ''}
                        </button>
                    </div>
                </div>
            `;
        }

        // ==================== BOOSTER SELECTOR MODAL LOGIC (SLOT 1 & SLOT 2) ====================
        function openBoosterModal(slotNum) {
            activeBoosterSlot = slotNum;
            document.getElementById('boosterSlotSubtitle').textContent = `Slot ${slotNum}`;
            const searchInput = document.getElementById('boosterSearchInput');
            searchInput.value = '';
            renderBoosterList('');
            const modal = document.getElementById('boosterModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function closeBoosterModal() {
            const modal = document.getElementById('boosterModal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        function renderBoosterList(query) {
            const q = (query || '').trim().toLowerCase();
            const currentSelected = activeBoosterSlot === 1 ? selectedSlot1Booster : selectedSlot2Booster;

            const filtered = BOOSTERS_CATALOG.filter(b =>
                b.name.toLowerCase().includes(q) ||
                b.labels.some(l => l.toLowerCase().includes(q))
            );

            const removeBtnHTML = currentSelected ? `
                <button onclick="selectBoosterForSlot(null)" class="w-full py-2.5 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition">
                    <i class="fa-solid fa-trash-can"></i> Remove Current Booster from Slot ${activeBoosterSlot}
                </button>
            ` : '';

            document.getElementById('boosterListContainer').innerHTML = removeBtnHTML + filtered.map(b => {
                const isSelected = currentSelected && currentSelected.id === b.id;
                return `
                    <div onclick="selectBoosterForSlot('${b.id}')" class="p-3.5 rounded-xl cursor-pointer transition border ${isSelected ? 'bg-ef-lime/15 border-ef-lime' : 'bg-[#191f2e] hover:bg-[#22293d] border-slate-800'}">
                        <div class="flex items-center justify-between mb-2">
                            <span class="font-bold text-sm text-white">${b.name}</span>
                            ${isSelected ? '<span class="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-ef-lime text-ef-dark">Active</span>' : ''}
                        </div>
                        <div class="flex flex-wrap gap-1.5">
                            ${b.labels.map(lbl => `
                                <span class="px-2.5 py-1 rounded-md bg-[#262e42] text-slate-200 text-[11px] font-semibold">
                                    ${lbl}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        }

        function selectBoosterForSlot(boosterId) {
            const chosen = boosterId ? BOOSTERS_CATALOG.find(b => b.id === boosterId) : null;
            if (activeBoosterSlot === 1) {
                selectedSlot1Booster = chosen;
            } else {
                selectedSlot2Booster = chosen;
            }
            closeBoosterModal();
            renderPlayerModalContent();
            showToast(chosen ? `Applied ${chosen.name} to Slot ${activeBoosterSlot}` : `Cleared Slot ${activeBoosterSlot}`);
        }

        // ==================== POSITION BOOSTERS MODAL LOGIC ====================
        function openPositionBoosterModal() {
            if (!activePlayer) return;
            renderPositionBoosterContent();
            const modal = document.getElementById('positionBoosterModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function closePositionBoosterModal() {
            const modal = document.getElementById('positionBoosterModal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        function togglePositionToken(posCode) {
            const idx = activePositionTokens.indexOf(posCode);
            if (idx > -1) {
                activePositionTokens.splice(idx, 1);
            } else {
                if (activePositionTokens.length >= 2) {
                    showToast('Maximum 2 Position Booster tokens allowed!');
                    return;
                }
                activePositionTokens.push(posCode);
            }
            renderPositionBoosterContent();
            renderPlayerModalContent();
        }

        function renderPositionBoosterContent() {
            const upgradable = activePlayer.secondaryPos || [];
            document.getElementById('positionBoosterContent').innerHTML = `
                <div class="flex items-center justify-between bg-[#182034] px-3.5 py-2.5 rounded-xl border border-slate-700/70 text-xs">
                    <span class="text-slate-300 font-semibold">Position Tokens Used:</span>
                    <span class="font-black text-ef-lime text-sm">${activePositionTokens.length} / 2</span>
                </div>
                ${upgradable.length === 0 ? `
                    <p class="text-xs text-slate-400 text-center py-4">This player has no Secondary positions available to boost.</p>
                ` : `
                    <div class="space-y-2">
                        <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Secondary Positions (Tap to Upgrade to Full):</p>
                        <div class="grid grid-cols-2 gap-2">
                            ${upgradable.map(pos => {
                                const isBoosted = activePositionTokens.includes(pos);
                                return `
                                    <button onclick="togglePositionToken('${pos}')" class="p-3 rounded-xl border text-left flex items-center justify-between transition ${isBoosted ? 'bg-[#00d68f]/20 border-[#00d68f] text-white' : 'bg-[#182034] border-slate-700 text-slate-300 hover:border-slate-500'}">
                                        <span class="font-display font-extrabold text-base">${pos}</span>
                                        <span class="text-[11px] font-bold px-2 py-0.5 rounded ${isBoosted ? 'bg-[#00d68f] text-[#051b14]' : 'bg-slate-800 text-slate-400'}">
                                            ${isBoosted ? 'Full (Boosted)' : 'Partial'}
                                        </span>
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `}
                <button onclick="closePositionBoosterModal()" class="w-full py-2.5 rounded-xl bg-ef-lime text-ef-dark font-bold text-xs hover:bg-ef-limeHover transition">
                    Done
                </button>
            `;
        }

        function renderPlayerModalContent() {
    // 1. Lưu lại vị trí cuộn của modal chính VÀ khung danh sách chỉ số (training list)
    const modalContentEl = document.getElementById('playerModalContent');
    const modalScrollPos = modalContentEl ? modalContentEl.scrollTop : 0;

    const trainingListEl = document.getElementById('trainingListContainer');
    const trainingScrollPos = trainingListEl ? trainingListEl.scrollTop : 0;

    const { stats, dynamicOvr } = computeTrainedStats();
    const availPts = getTotalAvailablePoints();
    const usedPts = getUsedPoints();
    const remPts = availPts - usedPts;

    const statGroups = [
        {
            title: "Attacking & Dribbling",
            items: [
                ["Attacking Awareness", stats.attackingAwareness],
                ["Ball Control", stats.ballControl],
                ["Dribbling", stats.dribbling],
                ["Tight Possession", stats.tightPossession],
                ["Low Pass", stats.lowPass],
                ["Lofted Pass", stats.loftedPass],
                ["Finishing", stats.finishing],
                ["Heading", stats.heading],
                ["Place Kicking", stats.placeKicking],
                ["Curl", stats.curl]
            ]
        },
        {
            title: "Athleticism & Physical",
            items: [
                ["Speed", stats.speed],
                ["Acceleration", stats.acceleration],
                ["Kicking Power", stats.kickingPower],
                ["Jump", stats.jump],
                ["Physical Contact", stats.physicalContact],
                ["Balance", stats.balance],
                ["Stamina", stats.stamina]
            ]
        },
        {
            title: "Defending & Goalkeeping",
            items: [
                ["Defensive Awareness", stats.defensiveAwareness],
                ["Tackling", stats.tackling],
                ["Aggression", stats.aggression],
                ["Defensive Engagement", stats.defensiveEngagement],
                ["GK Awareness", stats.gkAwareness],
                ["GK Catching", stats.gkCatching],
                ["GK Parrying", stats.gkParrying],
                ["GK Reflexes", stats.gkReflexes],
                ["GK Reach", stats.gkReach]
            ]
        }
    ];

    const trainingCategories = activePlayer.pos === 'GK'
        ? [
            { key: 'gk1', label: 'GK 1 (Jump, GK Awareness)', icon: 'fa-hands' },
            { key: 'gk2', label: 'GK 2 (GK Parrying, GK Reach)', icon: 'fa-shield-halved' },
            { key: 'gk3', label: 'GK 3 (GK Catching, GK Reflexes)', icon: 'fa-bolt' },
            { key: 'aerial', label: 'Aerial Strength (Physical, Jump)', icon: 'fa-arrow-up' }
        ]
        : [
            { key: 'shooting', label: 'Shooting (Finishing, Curl, Set Piece)', icon: 'fa-futbol' },
            { key: 'passing', label: 'Passing (Low Pass, Lofted Pass)', icon: 'fa-share' },
            { key: 'dribbling', label: 'Dribbling (Ball Control, Tight Poss.)', icon: 'fa-person-running' },
            { key: 'dexterity', label: 'Dexterity (Off. Aware, Accel, Balance)', icon: 'fa-wand-magic-sparkles' },
            { key: 'lowerBody', label: 'Lower Body (Speed, Kick Power, Stamina)', icon: 'fa-gauge-high' },
            { key: 'aerial', label: 'Aerial Strength (Heading, Jump, Phys.)', icon: 'fa-up-long' },
            { key: 'defending', label: 'Defending (Def. Aware, Tackling, Aggr.)', icon: 'fa-shield' }
        ];

    document.getElementById('playerModalContent').innerHTML = `
        <!-- Top Player Card, Era Bio & Booster Slots 1 & 2 -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-[#141d36] border border-slate-700/70 rounded-2xl p-4">
            <div class="lg:col-span-5 flex flex-col justify-between gap-3">
                <div class="flex items-center gap-4">
                    <div class="${getCardThemeClass(activePlayer)} relative overflow-hidden w-28 h-36 rounded-xl p-2 flex flex-col justify-between shrink-0 shadow-lg">
                        <!-- Real Footballer Celebration / Trophy Photo -->
                        <div class="absolute inset-x-0 top-1 bottom-4 flex items-end justify-center pointer-events-none z-0 overflow-hidden">
                            <img
                                data-entity="player-${activePlayer.id}"
                                src="${activePlayer.image || ''}"
                                alt="${activePlayer.name}"
                                referrerpolicy="no-referrer"
                                onerror="handlePortraitError(this)"
                                class="player-portrait-img w-full h-full object-cover object-top ${activePlayer.image ? '' : 'hidden'}"
                            >
                            <div class="${activePlayer.image ? 'hidden' : 'flex'} w-[84%] h-[88%] items-end justify-center">
                                ${getFallbackPlayerSVG(activePlayer)}
                            </div>
                        </div>
                        <div class="relative z-10 leading-none bg-black/55 backdrop-blur-[2px] px-1.5 py-0.5 rounded self-start border border-white/15">
                            <div class="font-display font-extrabold text-2xl text-white">${dynamicOvr}</div>
                            <div class="font-display font-bold text-xs text-amber-300">${activePlayer.pos}</div>
                        </div>
                        <div class="relative z-10 text-[8px] text-center font-bold text-amber-200 truncate bg-black/85 rounded px-1 py-0.5 border border-amber-400/30">${activePlayer.momentTitle}</div>
                    </div>
                    <div class="space-y-1 text-xs">
                        <div class="inline-block px-2 py-0.5 rounded bg-ef-lime/15 text-ef-lime font-bold">${activePlayer.cardType} • ${activePlayer.eraDate || '2026'}</div>
                        <div class="text-amber-300 font-bold text-[11px]">${activePlayer.momentTitle}</div>
                        <p class="text-slate-300"><span class="text-slate-400">Club:</span> ${activePlayer.club}</p>
                        <p class="text-slate-300"><span class="text-slate-400">Nation:</span> ${activePlayer.flag} ${activePlayer.nation}</p>
                        <p class="text-slate-300"><span class="text-slate-400">Age / Height:</span> <strong class="text-white">${activePlayer.age} yrs</strong> • ${activePlayer.height}cm</p>
                        <p class="text-slate-300"><span class="text-slate-400">Foot / Form:</span> ${activePlayer.foot} • <span class="text-ef-lime font-bold">${activePlayer.form}</span></p>
                    </div>
                </div>

                <!-- Booster Slot 1 & Booster Slot 2 Controls -->
                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                    <button onclick="openBoosterModal(1)" class="bg-[#0d1324] hover:bg-[#192340] border ${selectedSlot1Booster ? 'border-amber-400/60' : 'border-slate-700'} rounded-xl p-2 text-left transition">
                        <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                            <span>Booster Slot 1</span>
                            <i class="fa-solid fa-bolt text-amber-400"></i>
                        </div>
                        <div class="text-xs font-bold text-white truncate mt-0.5">
                            ${selectedSlot1Booster ? selectedSlot1Booster.name : '+ Select Booster'}
                        </div>
                    </button>

                    <button onclick="openBoosterModal(2)" class="bg-[#0d1324] hover:bg-[#192340] border ${selectedSlot2Booster ? 'border-ef-lime' : 'border-dashed border-slate-600'} rounded-xl p-2 text-left transition">
                        <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                            <span>Booster Slot 2</span>
                            <i class="fa-solid fa-plus text-ef-lime"></i>
                        </div>
                        <div class="text-xs font-bold ${selectedSlot2Booster ? 'text-ef-lime' : 'text-slate-300'} truncate mt-0.5">
                            ${selectedSlot2Booster ? selectedSlot2Booster.name : '+ Add Booster'}
                        </div>
                    </button>
                </div>
            </div>

            <!-- Center: 13-Position Proficiency Grid + Position Boosters -->
            <div class="lg:col-span-4">
                ${renderPositionPitchGrid(dynamicOvr)}
            </div>

            <!-- Right: Interactive Level Training & Progression Point Allocator -->
            <div class="lg:col-span-3 bg-[#0c1224] border border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-2.5">
                <div>
                    <div class="flex items-center justify-between gap-1 mb-1">
                        <span class="text-[11px] font-extrabold uppercase tracking-wider text-ef-lime"><i class="fa-solid fa-sliders mr-1"></i> Progression</span>
                        <span class="text-[11px] font-bold text-slate-300">Lv.${currentLevel}/${activePlayer.maxLevel}</span>
                    </div>
                    <div class="text-[11px] text-slate-400 mb-2">
                        Pts Left: <strong class="${remPts > 0 ? 'text-ef-lime' : 'text-ef-cyan'}">${remPts}</strong> (${usedPts}/${availPts})
                    </div>

                    <!-- Level Slider -->
                    <input type="range" min="1" max="${activePlayer.maxLevel}" value="${currentLevel}" oninput="changePlayerLevel(this.value)" class="ef-slider mb-2">

                    <div class="flex items-center gap-1.5 mb-2">
                        <button onclick="autoAllocateOptimalPoints(); renderPlayerModalContent();" class="flex-1 py-1 rounded-lg bg-ef-lime text-ef-dark font-bold text-[11px] hover:bg-ef-limeHover transition">
                            Auto
                        </button>
                        <button onclick="resetProgressionPoints(true)" class="flex-1 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white font-semibold text-[11px] transition">
                            Reset
                        </button>
                    </div>
                </div>

                <!-- Compact Progression Category Steppers (Có ID trainingListContainer để giữ vị trí cuộn) -->
                <div id="trainingListContainer" class="space-y-1.5 overflow-y-auto max-h-44 pr-0.5">
                    ${trainingCategories.map(cat => `
                        <div class="flex items-center justify-between bg-[#141d36] px-2 py-1 rounded-lg border border-slate-800/80 text-[11px]">
                            <span class="text-slate-200 truncate pr-1" title="${cat.label}">${cat.label.split(' (')[0]}</span>
                            <div class="flex items-center gap-1 shrink-0">
                                <button onclick="adjustProgression('${cat.key}', -1)" class="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center">-</button>
                                <span class="w-4 text-center font-extrabold text-ef-lime">${progressionPoints[cat.key]}</span>
                                <button onclick="adjustProgression('${cat.key}', 1)" class="w-5 h-5 rounded bg-slate-800 hover:bg-ef-lime hover:text-ef-dark text-white font-bold flex items-center justify-center">+</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <!-- All 26 eFootball Attributes Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${statGroups.map(group => `
                <div class="bg-[#131b31] border border-slate-800 rounded-xl p-3.5">
                    <h3 class="font-display font-bold uppercase tracking-wider text-sm text-ef-lime border-b border-slate-800 pb-2 mb-2.5">${group.title}</h3>
                    <div class="space-y-1.5">
                        ${group.items.map(([label, val]) => `
                            <div class="flex items-center justify-between text-xs py-0.5 border-b border-slate-800/40 last:border-none">
                                <span class="text-slate-300">${label}</span>
                                <span class="font-mono text-sm ${getStatColorClass(val)}">${val}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>

        <!-- Player Skills Badges -->
        <div class="bg-[#131b31] border border-slate-800 rounded-xl p-4">
            <h3 class="font-display font-bold uppercase tracking-wider text-sm text-ef-lime mb-2.5">
                <i class="fa-solid fa-star mr-1"></i> Player Skills (${activePlayer.skills.length})
            </h3>
            <div class="flex flex-wrap gap-2">
                ${activePlayer.skills.map(skill => `
                    <span class="px-3 py-1 rounded-lg bg-[#1c2747] border border-slate-700 text-xs font-semibold text-white">
                        ${skill}
                    </span>
                `).join('')}
            </div>
        </div>
    `;

    // 2. Khôi phục lại đúng vị trí scroll cũ cho cả modal chính VÀ khung danh sách chỉ số
    const updatedModalEl = document.getElementById('playerModalContent');
    if (updatedModalEl) {
        updatedModalEl.scrollTop = modalScrollPos;
    }

    const updatedTrainingListEl = document.getElementById('trainingListContainer');
    if (updatedTrainingListEl) {
        updatedTrainingListEl.scrollTop = trainingScrollPos;
    }
}

        // ==================== MANAGER MODAL ====================
        function openManagerModal(managerId) {
            const m = MANAGERS_DB.find(item => item.id === managerId);
            if (!m) return;

            document.getElementById('modalManagerName').textContent = `${m.flag} ${m.name}`;

            const styles = [
                { name: "Possession Game", val: m.proficiency.possession },
                { name: "Quick Counter", val: m.proficiency.quickCounter },
                { name: "Long Ball Counter", val: m.proficiency.longBallCounter },
                { name: "Out Wide", val: m.proficiency.outWide },
                { name: "Long Ball", val: m.proficiency.longBall }
            ];

            document.getElementById('managerModalContent').innerHTML = `
                <div class="flex items-center gap-4 bg-[#141d36] border border-slate-700/70 rounded-2xl p-4">
                    <div class="relative w-20 h-20 rounded-2xl overflow-hidden border border-white/25 shrink-0 shadow-lg flex items-center justify-center" style="background: linear-gradient(135deg, ${m.accent}66, #0f172a);">
                        <img
                            data-entity="manager-${m.id}"
                            src="${m.image || ''}"
                            alt="${m.name}"
                            referrerpolicy="no-referrer"
                            onerror="handlePortraitError(this)"
                            class="manager-portrait-img w-full h-full ${m.image ? '' : 'hidden'}"
                        >
                        <div class="${m.image ? 'hidden' : 'flex'} w-full h-full items-center justify-center font-display font-black italic text-2xl text-white">
                            ${getInitials(m.name)}
                        </div>
                    </div>
                    <div class="space-y-1 text-xs sm:text-sm">
                        <div class="text-slate-300"><span class="text-slate-400">Club / Team:</span> <strong class="text-white">${m.club}</strong></div>
                        <div class="text-slate-300"><span class="text-slate-400">Coaching Affinity:</span> <strong class="text-ef-cyan">${m.affinity}</strong></div>
                        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold text-xs mt-1">
                            <i class="fa-solid fa-bolt"></i> Booster: ${m.booster}
                        </div>
                    </div>
                </div>

                <div class="bg-[#131b31] border border-slate-800 rounded-xl p-4">
                    <h3 class="font-display font-bold uppercase tracking-wider text-sm text-ef-lime mb-1">Booster Effect</h3>
                    <p class="text-xs text-slate-300">${m.boosterDesc}</p>
                </div>

                <div class="bg-[#131b31] border border-slate-800 rounded-xl p-4 space-y-3">
                    <h3 class="font-display font-bold uppercase tracking-wider text-sm text-ef-lime">Team Playstyle Proficiency</h3>
                    ${styles.map(st => `
                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1">
                                <span class="text-slate-200">${st.name}</span>
                                <span class="${st.val >= 85 ? 'text-ef-lime' : 'text-slate-300'}">${st.val}</span>
                            </div>
                            <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div class="h-full rounded-full ${st.val >= 85 ? 'bg-ef-lime' : 'bg-sky-500'}" style="width: ${st.val}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            const modal = document.getElementById('managerModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function closeManagerModal() {
            const modal = document.getElementById('managerModal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        // ==================== TOAST HELPER ====================
        function showToast(msg) {
            const box = document.getElementById('toastBox');
            document.getElementById('toastMessage').textContent = msg;
            box.classList.remove('translate-y-20', 'opacity-0');
            setTimeout(() => {
                box.classList.add('translate-y-20', 'opacity-0');
            }, 2600);
        }

        // ==================== INITIALIZATION ON WINDOW LOAD ====================
        window.onload = function () {
		            renderFilterBars();
            renderPlayers();
            renderManagers();
            hydrateAllRealPortraits();
        };
