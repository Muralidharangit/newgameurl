import React, { useState, useMemo } from "react";
import { games } from "../../constants/machine";
import type { GameItem } from "../../types";
import { GameCard } from "./GameCard";
import { Modal } from "../common/Modal";

interface GameGridProps {
  balance: number;
  onBalanceChange?: (newBalance: number) => void;
  showToast?: (message: string) => void;
}

const CATEGORIES = [
  { id: "all", label: "All Games", icon: "fa-solid fa-table-cells-large" },
  { id: "slots", label: "Slots", icon: "fa-solid fa-gem text-info" },
  { id: "crash", label: "Crash", icon: "fa-solid fa-rocket text-warning", isHot: true },
  { id: "table", label: "Table Games", icon: "fa-solid fa-dice text-light" },
  { id: "live", label: "Live Casino", icon: "fa-solid fa-video text-danger" },
  { id: "sports", label: "Sports", icon: "fa-solid fa-futbol text-success" },
  { id: "instant", label: "Instant", icon: "fa-solid fa-bolt text-warning" },
];

const POPULAR_GAMES = [
  {
    id: "pop-1",
    name: "rocket crash",
    title: "ROCKET CRASH",
    subtitle: "254.3K PLAYERS • 5000X",
    category: "crash",
    categories: ["popular", "crash", "instant", "slots"],
    theme: "theme-gold" as const,
    badge: { text: "5000X", type: "gold" as const, icon: "fa-solid fa-bolt" },
    image: "/assets/games/6.png",
    actionText: "LAUNCH",
  },
  {
    id: "pop-2",
    name: "cyber mines",
    title: "CYBER MINES",
    subtitle: "198.7K PLAYERS • 98.2% RTP",
    category: "table",
    categories: ["popular", "instant", "slots", "table"],
    theme: "theme-green" as const,
    badge: { text: "VIP", type: "green" as const, icon: "fa-solid fa-shield-halved" },
    image: "/assets/games/4.png",
    actionText: "PLAY NOW",
  },
  {
    id: "pop-3",
    name: "penalty goal",
    title: "PENALTY GOAL",
    subtitle: "175.2K PLAYERS • 97.8% RTP",
    category: "sports",
    categories: ["popular", "sports", "instant", "live"],
    theme: "theme-blue" as const,
    badge: { text: "POPULAR", type: "cyan" as const, icon: "fa-solid fa-futbol" },
    image: "/assets/games/5.png",
    actionText: "KICK NOW",
  },
  {
    id: "pop-4",
    name: "plinko vip",
    title: "PLINKO VIP",
    subtitle: "162.4K PLAYERS • 1000X",
    category: "instant",
    categories: ["popular", "instant", "bingo", "slots"],
    theme: "theme-magenta" as const,
    badge: { text: "HOT", type: "hot" as const, icon: "fa-solid fa-fire" },
    image: "/assets/games/3.png",
    actionText: "DROP NOW",
  },
  {
    id: "pop-5",
    name: "aviator",
    title: "AVIATOR",
    subtitle: "289.1K PLAYERS • MULTI",
    category: "crash",
    categories: ["popular", "crash", "slots", "instant"],
    theme: "theme-red" as const,
    badge: { text: "LIVE", type: "live" as const, icon: "fa-solid fa-circle" },
    image: "/assets/games/1.png",
    actionText: "FLY NOW",
  },
  {
    id: "pop-6",
    name: "lucky dice",
    title: "LUCKY DICE",
    subtitle: "142.6K PLAYERS • 98.6% RTP",
    category: "table",
    categories: ["popular", "table", "instant", "live"],
    theme: "theme-purple" as const,
    badge: { text: "TOP", type: "cyan" as const, icon: "fa-solid fa-dice" },
    image: "/assets/games/2.png",
    actionText: "ROLL NOW",
  },
  {
    id: "pop-7",
    name: "jet flight",
    title: "JET FLIGHT",
    subtitle: "131.9K PLAYERS • HIGH WIN",
    category: "crash",
    categories: ["popular", "crash", "live", "instant"],
    theme: "theme-blue" as const,
    badge: { text: "FAST", type: "cyan" as const, icon: "fa-solid fa-plane-departure" },
    image: "/assets/games/avi.png",
    actionText: "FLY NOW",
  },
  {
    id: "pop-8",
    name: "crash royale",
    title: "CRASH ROYALE",
    subtitle: "118.5K PLAYERS • ROOM",
    category: "crash",
    categories: ["popular", "crash", "live", "table"],
    theme: "theme-red" as const,
    badge: { text: "24/7", type: "hot" as const, icon: "fa-solid fa-fire" },
    image: "/assets/games/1.png",
    actionText: "JOIN ROOM",
  },
];

const FEATURED_GAMES = games.slice(0, 8);

const SLOT_SYMBOLS = ["🍒", "🍋", "🍇", "💎", "👑", "⚡", "7️⃣"];

export const GameGrid: React.FC<GameGridProps> = ({
  balance,
  onBalanceChange,
  showToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Interactive Slot Game Theater Modal State
  const [activeTheaterGame, setActiveTheaterGame] = useState<{ title: string } | null>(null);
  const [currentBet, setCurrentBet] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState(["💎", "7️⃣", "👑"]);
  const [winAmount, setWinAmount] = useState<number | null>(null);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesCategory =
        selectedCategory === "all" || game.categories.includes(selectedCategory);
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        game.title.toLowerCase().includes(q) ||
        game.name.toLowerCase().includes(q) ||
        game.categories.some((c) => c.includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleLaunchGame = (game: { title: string }) => {
    setActiveTheaterGame(game);
    setWinAmount(null);
  };

  const handleCloseTheater = () => {
    setActiveTheaterGame(null);
    setIsSpinning(false);
    setWinAmount(null);
  };

  const handleSpinReels = () => {
    if (isSpinning) return;
    if (balance < currentBet) {
      showToast?.("Insufficient Balance! Please adjust bet.");
      return;
    }

    if (onBalanceChange) {
      onBalanceChange(balance - currentBet);
    }

    setIsSpinning(true);
    setWinAmount(null);

    // Reel 1
    setTimeout(() => {
      setReels((prev) => [
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        prev[1],
        prev[2],
      ]);
    }, 450);

    // Reel 2
    setTimeout(() => {
      setReels((prev) => [
        prev[0],
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        prev[2],
      ]);
    }, 750);

    // Reel 3 & Win Calculation
    setTimeout(() => {
      const sym1 = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
      const sym2 = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
      const sym3 =
        Math.random() < 0.4
          ? sym2
          : SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];

      setReels([sym1, sym2, sym3]);

      const isThreeMatch = sym1 === sym2 && sym2 === sym3;
      const isTwoMatch = sym1 === sym2 || sym2 === sym3;

      if (isThreeMatch) {
        const winVal = currentBet * 10;
        if (onBalanceChange) onBalanceChange(balance - currentBet + winVal);
        setWinAmount(winVal);
        showToast?.(`🎉 Jackpot Win! N$ ${winVal.toFixed(2)}`);
      } else if (isTwoMatch) {
        const winVal = currentBet * 2.5;
        if (onBalanceChange) onBalanceChange(balance - currentBet + winVal);
        setWinAmount(winVal);
        showToast?.(`🎉 Winner! N$ ${winVal.toFixed(2)}`);
      }

      setIsSpinning(false);
    }, 1100);
  };

  return (
    <>
      {/* ==============================================================
           SECTION 1: CATEGORY FILTER SECTION (GAMES BY CATEGORY)
      =============================================================== */}
      <section id="categorySection" className="mb-5 showcase-block-panel">
        <div className="section-header-bar">
          <h2 className="section-header-title">
            <i className="fa-solid fa-layer-group text-info"></i> Games by Category
          </h2>
          <div className="d-none d-sm-flex align-items-center gap-2">
            <button
              type="button"
              className="btn-view-all"
              onClick={() => setSelectedCategory("all")}
            >
              <span>View All</span> <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        {/* Category Navigation Bar & Search */}
        <div className="category-nav-bar">
          <div className="category-scroll-container" id="categoryTabs">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className={`cat-pill ${selectedCategory === cat.id ? "active" : ""}`}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSearchQuery("");
                }}
              >
                <i className={cat.icon}></i>
                <span>{cat.label}</span>
                {cat.isHot && (
                  <span className="hot-tag">
                    <i className="fa-solid fa-fire"></i> HOT
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Search Bar & Count */}
          <div className="d-flex align-items-center gap-3 ms-auto mt-2 mt-md-0">
            <div className="search-box-station">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                id="gameSearchInput"
                placeholder="Search games by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="game-count-hud d-none d-sm-inline-flex">
              <span id="gameCountBadge" className="count-num">
                {filteredGames.length}
              </span>
              <span>Games Available</span>
            </div>
          </div>
        </div>

        {/* Filtered Games Grid */}
        <div className="games-grid" id="categoryGamesGridContainer">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} onPlay={handleLaunchGame} />
          ))}
        </div>

        {/* Empty State */}
        {filteredGames.length === 0 && (
          <div id="noGamesFoundState" className="text-center py-5">
            <div className="mb-3" style={{ fontSize: "3rem", color: "#a855f7" }}>
              <i className="fa-solid fa-gamepad"></i>
            </div>
            <h3 className="fw-bold text-light mb-2">No Games Found</h3>
            <p className="text-secondary small mb-4">
              No matching games in this category. Try another filter or search term.
            </p>
            <button
              className="btn btn-outline-warning rounded-pill px-4 py-2"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* ==============================================================
           SECTION 2: FEATURED GAMES
      =============================================================== */}
      <section id="featuredSection" className="mb-5 showcase-block-panel">
        <div className="section-header-bar" id="featuredHeader">
          <h2 className="section-header-title">
            <i className="fa-solid fa-star text-warning"></i> Featured Games
          </h2>
          <a href="#categorySection" className="btn-view-all">
            <span>View All</span> <i className="fa-solid fa-arrow-right"></i>
          </a>
        </div>

        <div className="games-grid" id="gamesGridContainer">
          {FEATURED_GAMES.map((game) => (
            <GameCard key={`featured-${game.id}`} game={game} onPlay={handleLaunchGame} />
          ))}
        </div>
      </section>

      {/* ==============================================================
           SECTION 3: POPULAR GAMES (8 CARDS WITH PLAYERS COUNT)
      =============================================================== */}
      <section id="popularSection" className="mb-5 showcase-block-panel">
        <div className="section-header-bar" id="popularHeader">
          <h2 className="section-header-title">
            <i className="fa-solid fa-fire text-danger"></i> Popular Games
          </h2>
          <a href="#categorySection" className="btn-view-all">
            <span>View All</span> <i className="fa-solid fa-arrow-right"></i>
          </a>
        </div>

        <div className="games-grid" id="popularGamesGridContainer">
          {POPULAR_GAMES.map((game) => (
            <GameCard key={`popular-${game.id}`} game={game as unknown as GameItem} onPlay={handleLaunchGame} />
          ))}
        </div>
      </section>

      {/* ==============================================================
           SECTION 4: 3-COLUMN SHOWCASE (NEW & HOT, LIVE CASINO, SPORTS)
      =============================================================== */}
      <div className="tri-showcase-grid mb-5">
        {/* Block 1: New & Hot */}
        <div className="showcase-block-panel">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span
              className="fw-bold text-light text-uppercase d-flex align-items-center gap-2"
              style={{ fontSize: "0.88rem", fontFamily: "'Rajdhani', sans-serif" }}
            >
              <i className="fa-solid fa-fire text-danger"></i> New & Hot
            </span>
            <a href="javascript:void(0)" className="btn-view-all py-1 px-2" style={{ fontSize: "0.72rem" }}>
              View All <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>
          <div className="mini-showcase-grid">
            <div
              className="mini-game-card"
              onClick={() => handleLaunchGame({ title: "Sugar Rush" })}
            >
              <span className="mini-badge mini-badge-new">NEW</span>
              <div className="mini-art-thumb">
                <img
                  src="/assets/games/4.png"
                  alt="Sugar Rush"
                  onError={(e) => { e.currentTarget.src = "/assets/games/1.png"; }}
                />
              </div>
              <div className="mini-game-label">Sugar Rush</div>
            </div>
            <div
              className="mini-game-card"
              onClick={() => handleLaunchGame({ title: "Bigger Bass Bonanza" })}
            >
              <span className="mini-badge mini-badge-hot">HOT</span>
              <div className="mini-art-thumb">
                <img
                  src="/assets/games/2250e474-e3ef-4219-b65d-6770ccf51551.png"
                  alt="Bigger Bass"
                  onError={(e) => { e.currentTarget.src = "/assets/games/2.png"; }}
                />
              </div>
              <div className="mini-game-label">Bigger Bass</div>
            </div>
            <div
              className="mini-game-card"
              onClick={() => handleLaunchGame({ title: "Fortune Tiger" })}
            >
              <span className="mini-badge mini-badge-new">NEW</span>
              <div className="mini-art-thumb">
                <img
                  src="/assets/games/ec848250-71ad-4cdb-8fac-5da20a956833.png"
                  alt="Fortune Tiger"
                  onError={(e) => { e.currentTarget.src = "/assets/games/3.png"; }}
                />
              </div>
              <div className="mini-game-label">Fortune Tiger</div>
            </div>
            <div
              className="mini-game-card"
              onClick={() => handleLaunchGame({ title: "Zeus vs Hades" })}
            >
              <span className="mini-badge mini-badge-hot">HOT</span>
              <div className="mini-art-thumb">
                <img
                  src="/assets/games/3.png"
                  alt="Zeus vs Hades"
                  onError={(e) => { e.currentTarget.src = "/assets/games/6.png"; }}
                />
              </div>
              <div className="mini-game-label">Zeus vs Hades</div>
            </div>
          </div>
        </div>

        {/* Block 2: Live Casino */}
        <div className="showcase-block-panel">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span
              className="fw-bold text-light text-uppercase d-flex align-items-center gap-2"
              style={{ fontSize: "0.88rem", fontFamily: "'Rajdhani', sans-serif" }}
            >
              <i className="fa-solid fa-user-tie text-warning"></i> Live Casino
            </span>
            <a href="javascript:void(0)" className="btn-view-all py-1 px-2" style={{ fontSize: "0.72rem" }}>
              View All <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>
          <div className="mini-showcase-grid">
            <div
              className="mini-game-card"
              onClick={() => handleLaunchGame({ title: "Live Roulette" })}
            >
              <div className="mini-art-thumb">
                <img
                  src="/assets/games/5.png"
                  alt="Roulette"
                  onError={(e) => { e.currentTarget.src = "/assets/games/1.png"; }}
                />
              </div>
              <div className="mini-game-label">Roulette</div>
            </div>
            <div
              className="mini-game-card"
              onClick={() => handleLaunchGame({ title: "Live Blackjack" })}
            >
              <div className="mini-art-thumb">
                <img
                  src="/assets/games/6.png"
                  alt="Blackjack"
                  onError={(e) => { e.currentTarget.src = "/assets/games/2.png"; }}
                />
              </div>
              <div className="mini-game-label">Blackjack</div>
            </div>
            <div
              className="mini-game-card"
              onClick={() => handleLaunchGame({ title: "Live Baccarat" })}
            >
              <div className="mini-art-thumb">
                <img
                  src="/assets/games/2.png"
                  alt="Baccarat"
                  onError={(e) => { e.currentTarget.src = "/assets/games/3.png"; }}
                />
              </div>
              <div className="mini-game-label">Baccarat</div>
            </div>
            <div
              className="mini-game-card"
              onClick={() => handleLaunchGame({ title: "Live Dragon Tiger" })}
            >
              <div className="mini-art-thumb">
                <img
                  src="/assets/games/ede12845-5bed-410c-adc3-148d0d0abe79.png"
                  alt="Dragon Tiger"
                  onError={(e) => { e.currentTarget.src = "/assets/games/4.png"; }}
                />
              </div>
              <div className="mini-game-label">Dragon Tiger</div>
            </div>
          </div>
        </div>

        {/* Block 3: Sports & Virtual */}
        <div className="showcase-block-panel">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span
              className="fw-bold text-light text-uppercase d-flex align-items-center gap-2"
              style={{ fontSize: "0.88rem", fontFamily: "'Rajdhani', sans-serif" }}
            >
              <i className="fa-solid fa-futbol text-info"></i> Sports & Virtual
            </span>
            <a href="javascript:void(0)" className="btn-view-all py-1 px-2" style={{ fontSize: "0.72rem" }}>
              View All <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>
          <div className="mini-showcase-grid">
            <div
              className="mini-game-card"
              onClick={() => showToast?.("Live Sports Portal Loaded")}
            >
              <div className="mini-art-thumb">
                <img
                  src="/assets/games/5.png"
                  alt="Live Sports"
                  onError={(e) => { e.currentTarget.src = "/assets/games/1.png"; }}
                />
              </div>
              <div className="mini-game-label">Live Sports</div>
            </div>
            <div
              className="mini-game-card"
              onClick={() => showToast?.("Virtual Sports Loaded")}
            >
              <div className="mini-art-thumb">
                <img
                  src="/assets/games/fb642974-1bf3-4ae6-949e-8990bce5d661.png"
                  alt="Virtual Sports"
                  onError={(e) => { e.currentTarget.src = "/assets/games/2.png"; }}
                />
              </div>
              <div className="mini-game-label">Virtual Sports</div>
            </div>
            <div
              className="mini-game-card"
              onClick={() => showToast?.("Esports Hub Loaded")}
            >
              <div className="mini-art-thumb">
                <img
                  src="/assets/games/4.png"
                  alt="Esports"
                  onError={(e) => { e.currentTarget.src = "/assets/games/3.png"; }}
                />
              </div>
              <div className="mini-game-label">Esports</div>
            </div>
            <div
              className="mini-game-card"
              onClick={() => showToast?.("Virtual Racing Loaded")}
            >
              <div className="mini-art-thumb">
                <img
                  src="/assets/games/6.png"
                  alt="Virtual Racing"
                  onError={(e) => { e.currentTarget.src = "/assets/games/1.png"; }}
                />
              </div>
              <div className="mini-game-label">Virtual Racing</div>
            </div>
          </div>
        </div>
      </div>

      {/* ==============================================================
           SECTION 5: PROMOTIONS & JACKPOTS BANNER
      =============================================================== */}
      <div className="promo-jackpot-banner mb-5">
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "48px",
              height: "48px",
              background: "rgba(245, 179, 0, 0.18)",
              border: "2px solid #f5b300",
              boxShadow: "0 0 15px rgba(245, 179, 0, 0.4)",
            }}
          >
            <i className="fa-solid fa-trophy fs-4 text-warning"></i>
          </div>
          <div>
            <h3 className="promo-heading mb-1">PROMOTIONS & JACKPOTS</h3>
            <p className="promo-subtext">Daily Bonuses • Tournaments • Exclusive Offers</p>
          </div>
        </div>

        <div className="promo-gift-icon-wrap text-center my-2 my-lg-0">
          <div className="promo-gift-box">🎁</div>
          <div className="text-start">
            <div className="fw-bold text-light" style={{ fontSize: "0.95rem", letterSpacing: "0.5px" }}>
              BIGGER WINS. MORE REWARDS.
            </div>
            <div className="small text-warning-subtle" style={{ fontSize: "0.76rem" }}>
              Join our daily tournaments and claim your bonuses!
            </div>
          </div>
        </div>

        <div>
          <button
            type="button"
            className="btn-gold-action px-4 py-2"
            onClick={() => showToast?.("Viewing Daily Promotions & VIP Jackpots!")}
          >
            <span>View Promotions</span> <i className="fa-solid fa-arrow-right ms-1"></i>
          </button>
        </div>
      </div>

      {/* Interactive Slot Theater Modal */}
      <Modal isOpen={!!activeTheaterGame} onClose={handleCloseTheater} maxWidth="460px">
        <div className="modal-body p-4 text-center">
          <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2 border-secondary-subtle">
            <div className="text-start">
              <h4 className="fw-bold text-warning mb-0" id="theaterGameTitle">
                {activeTheaterGame?.title}
              </h4>
              <span
                className="badge border border-purple-500 text-info"
                style={{ fontSize: "0.7rem", background: "#1b0c38" }}
              >
                WINBET ARCADE
              </span>
            </div>
            <span className="badge bg-success px-2 py-1" style={{ fontSize: "0.7rem" }}>
              ONLINE
            </span>
          </div>

          {/* Slot Reels Machine Window */}
          <div className="reels-container">
            <div className={`reel-window ${isSpinning ? "reel-spinning" : ""}`}>
              {reels[0]}
            </div>
            <div className={`reel-window ${isSpinning ? "reel-spinning" : ""}`}>
              {reels[1]}
            </div>
            <div className={`reel-window ${isSpinning ? "reel-spinning" : ""}`}>
              {reels[2]}
            </div>
          </div>

          {/* Win Banner */}
          {winAmount !== null && (
            <div className="alert alert-success py-2 mb-3 bg-opacity-25 border-success text-light">
              <i className="fa-solid fa-trophy text-warning me-2"></i>
              <span>YOU WON </span>
              <strong className="text-warning">N$ {winAmount.toFixed(2)}</strong>!
            </div>
          )}

          {/* Bet Controls */}
          <div
            className="d-flex align-items-center justify-content-between p-2 rounded-3 mb-3"
            style={{ background: "#0e0524", border: "1px solid #3b1875" }}
          >
            <span className="text-dim small fw-semibold">BET PER SPIN:</span>
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary text-light px-2"
                onClick={() => setCurrentBet((prev) => Math.max(5, prev - 5))}
                disabled={isSpinning}
              >
                -
              </button>
              <span className="fw-bold text-warning" style={{ minWidth: "75px" }}>
                N$ {currentBet.toFixed(2)}
              </span>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary text-light px-2"
                onClick={() => setCurrentBet((prev) => Math.min(200, prev + 5))}
                disabled={isSpinning}
              >
                +
              </button>
            </div>
          </div>

          {/* Spin Button */}
          <button
            type="button"
            className="btn-winbet py-3 fw-bold fs-5"
            onClick={handleSpinReels}
            disabled={isSpinning}
          >
            <i className="fa-solid fa-bolt me-1"></i>
            {isSpinning ? "SPINNING..." : "SPIN REELS"}
          </button>
        </div>
      </Modal>
    </>
  );
};
