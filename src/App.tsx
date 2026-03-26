import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  ShoppingBag, 
  Cat, 
  Trophy, 
  Settings, 
  HelpCircle, 
  MousePointer2, 
  Zap, 
  LayoutDashboard,
  User,
  Gamepad2,
  Star,
  Cookie,
  IceCream,
  Cake,
  Donut,
  Heart,
  RotateCcw,
  Home,
  Ghost,
  Sparkles,
  Shield,
  Magnet,
  Timer,
  Maximize,
  Zap as FeverIcon,
  Coins,
  Languages,
  Pause,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CAT_SKINS = [
  { id: 'default', name: 'Ginger Kitty', nameZh: '橘猫', url: '/assets/cat_2.PNG', spriteUrl: '/assets/cat.PNG', price: 0 },
  { id: 'cat3', name: 'Snowy Kitty', nameZh: '雪白猫', url: '/assets/cat_3.PNG', spriteUrl: '/assets/cat_3.PNG', price: 50 },
  { id: 'cat4', name: 'Midnight Kitty', nameZh: '午夜猫', url: '/assets/cat_4.PNG', spriteUrl: '/assets/cat_4.PNG', price: 100 },
  { id: 'cat5', name: 'Sakura Kitty', nameZh: '樱花猫', url: '/assets/cat_5.PNG', spriteUrl: '/assets/cat_5.PNG', price: 200 },
];

const BACKGROUNDS = [
  { id: 'default', name: 'Cream Yellow', nameZh: '奶油黄', color: 'bg-background', price: 0 },
  { id: 'pink', name: 'Classic Pink', nameZh: '经典粉', color: 'bg-rose-50', price: 50 },
  { id: 'sky', name: 'Sky Blue', nameZh: '天空蓝', color: 'bg-blue-50', price: 100 },
  { id: 'forest', name: 'Mint Forest', nameZh: '薄荷绿', color: 'bg-emerald-50', price: 150 },
  { id: 'sunset', name: 'Sunset Glow', nameZh: '夕阳红', color: 'bg-orange-50', price: 200 },
  { id: 'night', name: 'Starry Night', nameZh: '星空黑', color: 'bg-slate-900', price: 300 },
];

const TRANSLATIONS = {
  en: {
    title: "Kitty Catch",
    subtitle: "Catch the treats, don't miss a beat!",
    startGame: "Start Game",
    rankings: "Rankings",
    catShop: "Shop",
    profile: "Profile",
    points: "Points",
    level: "Level",
    fever: "FEVER!",
    gameOver: "Game Over!",
    finalScore: "Final Score:",
    totalCoins: "Total Coins",
    tryAgain: "Try Again",
    shop: "Shop",
    home: "Home",
    best: "Best:",
    selected: "Selected",
    select: "Select",
    buy: "Buy",
    owned: "Owned",
    newHighScore: "NEW HIGH SCORE!",
    language: "English",
    howToPlay: "How to Play",
    moveMouse: "Move mouse to catch treats!",
    avoidGhosts: "Avoid the spooky ghosts!",
    play: "Play",
    scores: "Scores",
    cats: "Cats",
    backgrounds: "Backgrounds",
    tutorial: "Tutorial",
    close: "Close",
    scoreHistory: "Score History",
    noScores: "No scores yet. Start playing!",
    date: "Date",
    points_short: "Pts",
    stats: "Statistics",
    totalGames: "Total Games",
    lifetimeCoins: "Lifetime Coins",
    highestLevel: "Highest Level",
    account: "Account",
    email: "Email",
    logout: "Log Out",
    pause: "Pause",
    resume: "Resume",
    leave: "Leave Game",
    paused: "Game Paused"
  },
  zh: {
    title: "猫咪接接乐",
    subtitle: "接住美味，不要错过节奏！",
    startGame: "开始游戏",
    rankings: "排行榜",
    catShop: "商店",
    profile: "个人资料",
    points: "分数",
    level: "等级",
    fever: "狂热模式！",
    gameOver: "游戏结束！",
    finalScore: "最终得分：",
    totalCoins: "金币总数",
    tryAgain: "再试一次",
    shop: "商店",
    home: "首页",
    best: "最高分：",
    selected: "已选择",
    select: "选择",
    buy: "购买",
    owned: "已拥有",
    newHighScore: "新纪录！",
    language: "中文",
    howToPlay: "游戏玩法",
    moveMouse: "移动鼠标接住美味！",
    avoidGhosts: "避开幽灵！",
    play: "开始",
    scores: "分数",
    cats: "猫咪",
    backgrounds: "背景",
    tutorial: "教程",
    close: "关闭",
    scoreHistory: "得分记录",
    noScores: "暂无记录，快去玩吧！",
    date: "日期",
    points_short: "分",
    stats: "统计数据",
    totalGames: "总场次",
    lifetimeCoins: "累计金币",
    highestLevel: "最高等级",
    account: "账户",
    email: "邮箱",
    logout: "退出登录",
    pause: "暂停",
    resume: "继续",
    leave: "离开游戏",
    paused: "游戏已暂停"
  }
};

type Language = 'en' | 'zh';

type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'SHOP' | 'SCORES' | 'PROFILE';

interface ScoreEntry {
  id: string;
  score: number;
  date: string;
  level: number;
}

interface FallingItem {
  id: string;
  type: 'dessert' | 'ghost' | 'powerup' | 'coin';
  icon: React.ReactNode;
  x: number;
  y: number;
  initialX: number;
  speed: number;
  scoreValue: number;
  pattern?: 'straight' | 'zigzag';
  phase?: number;
}

const DESSERT_URLS = [
  "/assets/IMG_4867.PNG",
  "/assets/IMG_4868.PNG",
  "/assets/IMG_4869.PNG",
  "/assets/IMG_4870.PNG",
  "/assets/IMG_4871.PNG",
  "/assets/IMG_4872.PNG",
  "/assets/IMG_4873.PNG",
  "/assets/IMG_4874.PNG",
  "/assets/IMG_4875.PNG",
  "/assets/IMG_4876.PNG",
  "/assets/IMG_4877.PNG",
  "/assets/IMG_4878.PNG",
  "/assets/IMG_4879.PNG",
  "/assets/IMG_4880.PNG",
  "/assets/IMG_4881.PNG",
  "/assets/IMG_4882.PNG",
  "/assets/IMG_4883.PNG",
];

export default function App() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(10);
  const [catX, setCatX] = useState(50); // percentage
  const [isMoving, setIsMoving] = useState(false);
  const [items, setItems] = useState<FallingItem[]>([]);
  const itemsRef = useRef<FallingItem[]>([]);
  const [particles, setParticles] = useState<{ id: string, x: number, y: number, color: string, size?: number }[]>([]);
  const particlesRef = useRef<{ id: string, x: number, y: number, color: string, size?: number }[]>([]);
  const [floatingScores, setFloatingScores] = useState<{ id: string, x: number, y: number, value: number, timestamp: number }[]>([]);
  const floatingScoresRef = useRef<{ id: string, x: number, y: number, value: number, timestamp: number }[]>([]);
  const [combo, setCombo] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [isShaking, setIsShaking] = useState(false);
  const [activePowerup, setActivePowerup] = useState<'shield' | 'double' | 'magnet' | 'slow' | 'giant' | null>(null);
  const [isCatching, setIsCatching] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('kitty-catch-highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isFeverMode, setIsFeverMode] = useState(false);
  const [showFeverAnnouncement, setShowFeverAnnouncement] = useState(false);
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('kitty-catch-coins');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [selectedCat, setSelectedCat] = useState(() => {
    return localStorage.getItem('kitty-catch-selected-cat') || 'default';
  });
  const [selectedBackground, setSelectedBackground] = useState(() => {
    return localStorage.getItem('kitty-catch-selected-bg') || 'default';
  });
  const [ownedCats, setOwnedCats] = useState<string[]>(() => {
    const saved = localStorage.getItem('kitty-catch-owned-cats');
    return saved ? JSON.parse(saved) : ['default'];
  });
  const [ownedBackgrounds, setOwnedBackgrounds] = useState<string[]>(() => {
    const saved = localStorage.getItem('kitty-catch-owned-bgs');
    return saved ? JSON.parse(saved) : ['default'];
  });
  const [scoreHistory, setScoreHistory] = useState<ScoreEntry[]>(() => {
    const saved = localStorage.getItem('kitty-catch-history');
    return saved ? JSON.parse(saved) : [];
  });
  const [lifetimeCoins, setLifetimeCoins] = useState(() => {
    const saved = localStorage.getItem('kitty-catch-lifetime-coins');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('kitty-catch-language') as Language) || 'en';
  });
  const [shopTab, setShopTab] = useState<'cats' | 'backgrounds'>('cats');
  const [showTutorial, setShowTutorial] = useState(false);

  const t = (key: keyof typeof TRANSLATIONS['en']) => TRANSLATIONS[language][key];

  const currentCatSkin = CAT_SKINS.find(s => s.id === selectedCat) || CAT_SKINS[0];
  const currentBackground = BACKGROUNDS.find(b => b.id === selectedBackground) || BACKGROUNDS[0];
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = (type: 'catch' | 'ghost' | 'powerup' | 'miss' | 'coin') => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'catch') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'coin') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'ghost') {
        // Softer ghost sound: triangle instead of sawtooth, lower volume
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.4);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'miss') {
        // Gentle miss sound: soft sine wave descending
        osc.type = 'sine';
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.exponentialRampToValueAtTime(165, now + 0.3);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'powerup') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      console.warn('Audio not supported or blocked');
    }
  };
  const requestRef = useRef<number>(null);
  const lastItemTimeRef = useRef<number>(0);
  const nextIdRef = useRef(0);
  const moveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const generateId = useCallback(() => {
    return `${Date.now()}-${nextIdRef.current++}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const spawnItem = useCallback(() => {
    // Difficulty scaling: spawn rate adjusted for a more relaxed pace
    let spawnInterval = Math.max(450, 1300 - (score / 100) * 45);
    
    // Fever mode: less items falling to make it manageable
    if (isFeverMode) spawnInterval = 1000;

    const now = performance.now();
    if (now - lastItemTimeRef.current < spawnInterval) return;
    lastItemTimeRef.current = now;

    let types: ('dessert' | 'ghost' | 'powerup' | 'coin')[] = ['dessert', 'dessert', 'dessert', 'ghost'];
    
    // Fever mode: make it a reward - fewer ghosts, more powerups, more coins
    if (isFeverMode) {
      types = ['dessert', 'dessert', 'dessert', 'dessert', 'dessert', 'ghost', 'powerup', 'coin', 'coin'];
    } else {
      // Rare power-up and coin chance in normal mode
      if (Math.random() < 0.05) types.push('powerup');
      if (Math.random() < 0.1) types.push('coin');
    }
    
    const type = types[Math.floor(Math.random() * types.length)];
    
    let icon: React.ReactNode;
    let scoreValue = 1;
    let speed = (0.3 + Math.random() * 0.7) + (score / 1200); // Reduced base speed and scaling
    
    if (isFeverMode && type === 'dessert') speed *= 1.8; // Faster in fever mode

    if (type === 'ghost') {
      icon = <Ghost size={64} className="text-purple-400 fill-purple-100 drop-shadow-sm" />;
      scoreValue = 0;
    } else if (type === 'coin') {
      icon = <div className="w-12 h-12 rounded-full bg-yellow-400 border-4 border-yellow-600 flex items-center justify-center shadow-lg animate-pulse">
        <span className="text-yellow-800 font-bold text-xl">$</span>
      </div>;
      scoreValue = 0; // Coins give currency, not score
    } else if (type === 'powerup') {
      const rand = Math.random();
      if (rand < 0.2) {
        icon = <Shield size={64} className="text-blue-400 fill-blue-100 animate-pulse" />;
        scoreValue = 0;
      } else if (rand < 0.4) {
        icon = <Sparkles size={64} className="text-yellow-400 fill-yellow-100 animate-bounce" />;
        scoreValue = 5;
      } else if (rand < 0.6) {
        icon = <Magnet size={64} className="text-red-400 fill-red-100 animate-bounce" />;
        scoreValue = 3;
      } else if (rand < 0.8) {
        icon = <Timer size={64} className="text-emerald-400 fill-emerald-100 animate-pulse" />;
        scoreValue = 2;
      } else {
        icon = <Maximize size={64} className="text-indigo-400 fill-indigo-100 animate-bounce" />;
        scoreValue = 4;
      }
    } else {
      if (DESSERT_URLS.length > 0) {
        const randomDessertUrl = DESSERT_URLS[Math.floor(Math.random() * DESSERT_URLS.length)];
        icon = (
          <img 
            src={randomDessertUrl} 
            alt="dessert" 
            className="w-20 h-20 object-contain pixel-art mix-multiply" 
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const fallback = document.createElement('div');
                fallback.innerHTML = '🍪';
                fallback.className = 'text-4xl';
                parent.appendChild(fallback);
              }
            }}
          />
        );
      } else {
        const dessertIcons = [
          <Cookie size={64} className="text-amber-600 fill-amber-200" />,
          <IceCream size={64} className="text-pink-400 fill-pink-100" />,
          <Cake size={64} className="text-purple-400 fill-purple-100" />,
          <Donut size={64} className="text-rose-400 fill-rose-100" />
        ];
        icon = dessertIcons[Math.floor(Math.random() * dessertIcons.length)];
      }
    }

    const phase = Math.random() * Math.PI * 2;
    const pattern = type === 'ghost' && Math.random() < 0.15 ? 'zigzag' : 'straight';

    let x = Math.random() * 90 + 5;
    const minDistance = 25; // 25% horizontal distance
    
    // Try to find a position that isn't too close to a conflicting item at the top
    let attempts = 0;
    while (attempts < 10) {
      const conflict = itemsRef.current.some(item => 
        item.y < 30 && 
        Math.abs(item.x - x) < minDistance &&
        ((item.type === 'ghost' && type !== 'ghost') || (item.type !== 'ghost' && type === 'ghost'))
      );
      
      if (!conflict) break;
      x = Math.random() * 90 + 5;
      attempts++;
    }

    const newItem: FallingItem = {
      id: generateId(),
      type,
      icon,
      x,
      y: -10,
      initialX: x,
      speed, 
      scoreValue,
      pattern,
      phase
    };

    itemsRef.current = [...itemsRef.current, newItem];
    setItems(itemsRef.current);
  }, [score, isFeverMode, generateId]);

  useEffect(() => {
    if (floatingScores.length > 0) {
      const timer = setTimeout(() => {
        floatingScoresRef.current = floatingScoresRef.current.filter(score => {
          return Date.now() - (score.timestamp || 0) < 1000;
        });
        setFloatingScores(floatingScoresRef.current);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [floatingScores.length]);

  useEffect(() => {
    localStorage.setItem('kitty-catch-coins', coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('kitty-catch-selected-cat', selectedCat);
  }, [selectedCat]);

  useEffect(() => {
    localStorage.setItem('kitty-catch-selected-bg', selectedBackground);
  }, [selectedBackground]);

  useEffect(() => {
    localStorage.setItem('kitty-catch-owned-cats', JSON.stringify(ownedCats));
  }, [ownedCats]);

  useEffect(() => {
    localStorage.setItem('kitty-catch-owned-bgs', JSON.stringify(ownedBackgrounds));
  }, [ownedBackgrounds]);

  useEffect(() => {
    localStorage.setItem('kitty-catch-history', JSON.stringify(scoreHistory));
  }, [scoreHistory]);

  useEffect(() => {
    localStorage.setItem('kitty-catch-lifetime-coins', lifetimeCoins.toString());
  }, [lifetimeCoins]);

  useEffect(() => {
    localStorage.setItem('kitty-catch-language', language);
  }, [language]);

  useEffect(() => {
    if (gameState === 'GAMEOVER' && score > 0) {
      const newEntry: ScoreEntry = {
        id: generateId(),
        score,
        level,
        date: new Date().toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setScoreHistory(prev => [newEntry, ...prev].slice(0, 20));
    }
  }, [gameState]);

  useEffect(() => {
    const newLevel = Math.floor(score / 500) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      // Visual feedback for level up could go here
    }
  }, [score, level]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('kitty-catch-highscore', score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    if (combo >= 15 && !isFeverMode) {
      setIsFeverMode(true);
      setShowFeverAnnouncement(true);
      setTimeout(() => setShowFeverAnnouncement(false), 1000);
    } else if (combo < 15 && isFeverMode) {
      setIsFeverMode(false);
    }
  }, [combo, isFeverMode]);

  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        particlesRef.current = [];
        setParticles([]);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [particles.length]);

  const getNewParticles = (x: number, y: number, color: string, count = 12, size = 8) => {
    return Array.from({ length: count }).map(() => ({
      id: generateId(),
      x: x + (Math.random() - 0.5) * 5,
      y: y + (Math.random() - 0.5) * 5,
      color,
      size: Math.random() * size + 4
    }));
  };

  const createParticles = (x: number, y: number, color: string, count = 12, size = 8) => {
    const newParticles = getNewParticles(x, y, color, count, size);
    particlesRef.current = [...particlesRef.current.slice(-40), ...newParticles];
    setParticles(particlesRef.current);
  };

  const updateGame = useCallback((_time: number) => {
    if (gameState !== 'PLAYING') return;

    // Spawn items
    spawnItem();

    let totalScoreGained = 0;
    let totalLivesLost = 0;
    let totalCoinsGained = 0;
    let hitGhost = false;
    const newFloatingScores: { id: string, x: number, y: number, value: number, timestamp: number }[] = [];
    const allNewParticles: { id: string, x: number, y: number, color: string, size?: number }[] = [];
    let powerupToSet: string | null = null;
    let shouldClearPowerup = false;

    const currentItems = itemsRef.current;
    const nextItems: FallingItem[] = [];

    for (const item of currentItems) {
      let newY = item.y + (activePowerup === 'slow' ? item.speed * 0.5 : item.speed);
      let newX = item.x;

      // Zig-zag pattern for ghosts
      if (item.pattern === 'zigzag') {
        newX = item.initialX + Math.sin(item.y * 0.1 + (item.phase || 0)) * 10;
      }

      // Magnet effect: pull desserts and coins towards cat
      if (activePowerup === 'magnet' && (item.type === 'dessert' || item.type === 'coin')) {
        const dx = catX - item.x;
        newX += dx * 0.15;
      }
      
      // Keep items in bounds
      newX = Math.max(0, Math.min(100, newX));
      
      const isGhost = item.type === 'ghost';
      const baseWidth = isGhost ? 6 : 12;
      const collisionWidth = activePowerup === 'giant' ? baseWidth * 2 : baseWidth;
      
      // More generous vertical range for desserts/powerups to catch at the head
      const minY = isGhost ? 78 : 68;
      const maxY = isGhost ? 88 : 92;
      
      const isCaught = newY > minY && newY < maxY && Math.abs(newX - catX) < collisionWidth;

      if (isCaught) {
        if (item.type === 'ghost') {
          if (activePowerup === 'shield') {
            shouldClearPowerup = true;
            allNewParticles.push(...getNewParticles(newX, newY, '#a855f7', 20, 15));
            playSound('powerup');
          } else {
            totalLivesLost += 0.5;
            hitGhost = true;
            allNewParticles.push(...getNewParticles(newX, newY, '#a855f7', 25, 18));
            playSound('ghost');
          }
        } else if (item.type === 'powerup') {
          setIsCatching(true);
          setTimeout(() => setIsCatching(false), 200);
          allNewParticles.push(...getNewParticles(newX, newY, '#fbbf24', 15, 10));
          playSound('powerup');
          
          if (item.icon && React.isValidElement(item.icon)) {
            if (item.icon.type === Shield) powerupToSet = 'shield';
            else if (item.icon.type === Sparkles) {
              setActivePowerup('double');
              setTimeout(() => setActivePowerup(prev => prev === 'double' ? null : prev), 8000);
            } else if (item.icon.type === Magnet) {
              setActivePowerup('magnet');
              setTimeout(() => setActivePowerup(prev => prev === 'magnet' ? null : prev), 8000);
            } else if (item.icon.type === Timer) {
              setActivePowerup('slow');
              setTimeout(() => setActivePowerup(prev => prev === 'slow' ? null : prev), 8000);
            } else if (item.icon.type === Maximize) {
              setActivePowerup('giant');
              setTimeout(() => setActivePowerup(prev => prev === 'giant' ? null : prev), 8000);
            }
          }
          totalScoreGained += item.scoreValue;
        } else if (item.type === 'coin') {
          setIsCatching(true);
          setTimeout(() => setIsCatching(false), 200);
          allNewParticles.push(...getNewParticles(newX, newY, '#facc15', 15, 10));
          playSound('coin');
          totalCoinsGained += 1;
          setLifetimeCoins(prev => prev + 1);
          newFloatingScores.push({ id: generateId(), x: newX, y: newY, value: 1, timestamp: Date.now() });
        } else {
          setIsCatching(true);
          setTimeout(() => setIsCatching(false), 200);
          allNewParticles.push(...getNewParticles(newX, newY, '#feb6c4'));
          playSound('catch');
          const finalValue = item.scoreValue * multiplier * (activePowerup === 'double' ? 2 : 1);
          totalScoreGained += finalValue;
          newFloatingScores.push({ id: generateId(), x: newX, y: newY, value: finalValue, timestamp: Date.now() });
          setCombo(c => {
            const newCombo = c + 1;
            if (newCombo % 5 === 0) setMultiplier(m => Math.min(5, m + 0.5));
            return newCombo;
          });
        }
        continue;
      }

      if (newY > 105) {
        if (item.type === 'dessert') {
          totalLivesLost += 0.5;
          hitGhost = true;
          allNewParticles.push(...getNewParticles(newX, 100, '#a855f7', 15, 12));
          playSound('miss');
        }
        continue;
      }

      nextItems.push({ ...item, x: newX, y: newY });
    }

    itemsRef.current = nextItems;
    setItems(nextItems);

    if (powerupToSet) setActivePowerup(powerupToSet);
    if (shouldClearPowerup) setActivePowerup(null);

    if (allNewParticles.length > 0) {
      particlesRef.current = [...particlesRef.current.slice(-40), ...allNewParticles];
      setParticles(particlesRef.current);
    }

    if (newFloatingScores.length > 0) {
      floatingScoresRef.current = [...floatingScoresRef.current, ...newFloatingScores];
      setFloatingScores(floatingScoresRef.current);
    }

    if (hitGhost) {
      setCombo(0);
      setMultiplier(1);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }

    if (totalLivesLost > 0) {
      setLives(l => {
        const newLives = l - totalLivesLost;
        if (newLives <= 0) {
          setGameState('GAMEOVER');
          return 0;
        }
        return newLives;
      });
    }

    if (totalScoreGained > 0) {
      setScore(s => s + totalScoreGained);
    }

    if (totalCoinsGained > 0) {
      setCoins(c => c + totalCoinsGained);
    }

    requestRef.current = requestAnimationFrame(updateGame);
  }, [gameState, spawnItem, catX, multiplier, activePowerup, generateId, getNewParticles, playSound]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      requestRef.current = requestAnimationFrame(updateGame);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
    };
  }, [gameState, updateGame]);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameState !== 'PLAYING' || !gameAreaRef.current) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const x = ((clientX - rect.left) / rect.width) * 100;
    setCatX(Math.max(5, Math.min(95, x)));
    
    setIsMoving(true);
    if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
    moveTimeoutRef.current = setTimeout(() => setIsMoving(false), 300);
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setLives(10);
    itemsRef.current = [];
    setItems([]);
    floatingScoresRef.current = [];
    setFloatingScores([]);
    setCombo(0);
    setMultiplier(1);
    setActivePowerup(null);
    setIsFeverMode(false);
    setShowFeverAnnouncement(false);
    particlesRef.current = [];
    setParticles([]);
    setGameState('PLAYING');
    lastItemTimeRef.current = performance.now();
  };

  return (
    <div className={`min-h-screen flex flex-col overflow-hidden selection:bg-primary-container selection:text-primary ${isShaking ? 'animate-shake' : ''} transition-colors duration-1000 ${isFeverMode ? 'bg-rose-50' : currentBackground.color}`}>
      {/* Fever Mode Background Effect */}
      {isFeverMode && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="fixed inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 z-0"
        />
      )}
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-background/85 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black text-primary tracking-tight font-headline">Kitty Catch</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => setGameState('START')}
            className={`font-headline transition-all ${gameState === 'START' ? 'text-primary font-bold scale-105' : 'text-secondary hover:text-primary'}`}
          >
            {t('home')}
          </button>
          <button 
            onClick={() => setGameState('SHOP')}
            className={`font-headline transition-all ${gameState === 'SHOP' ? 'text-primary font-bold scale-105' : 'text-secondary hover:text-primary'}`}
          >
            {t('shop')}
          </button>
          <button 
            onClick={() => setGameState('SCORES')}
            className={`font-headline transition-all ${gameState === 'SCORES' ? 'text-primary font-bold scale-105' : 'text-secondary hover:text-primary'}`}
          >
            {t('scores')}
          </button>
        </nav>

        <div className="flex items-center gap-4">
          {gameState === 'PLAYING' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setGameState('PAUSED')}
              className="p-2 rounded-full bg-white border-2 border-primary-container text-primary shadow-sm"
            >
              <Pause size={20} />
            </motion.button>
          )}
          <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-primary/20 shadow-sm">
            <Coins size={18} className="text-yellow-500 fill-yellow-200" />
            <span className="font-headline font-bold text-primary text-sm">{coins}</span>
          </div>
          <button 
            onClick={() => setLanguage(l => l === 'en' ? 'zh' : 'en')}
            className="flex items-center gap-2 text-primary px-3 py-1.5 rounded-full hover:bg-primary-container/20 transition-all border border-primary/20"
          >
            <Languages size={20} />
            <span className="font-headline font-bold text-sm">{t('language')}</span>
          </button>
          <button className="text-primary p-2 rounded-full hover:bg-primary-container/20 transition-colors">
            <Settings size={24} />
          </button>
          <button 
            onClick={() => setShowTutorial(true)}
            className="text-primary p-2 rounded-full hover:bg-primary-container/20 transition-colors"
          >
            <HelpCircle size={24} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-4 border-primary-container relative"
            >
              <button 
                onClick={() => setShowTutorial(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-secondary transition-colors"
              >
                <Home size={24} />
              </button>
              
              <h3 className="font-headline font-black text-primary text-3xl mb-8 tracking-tight">{t('howToPlay')}</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center text-primary shrink-0">
                    <MousePointer2 size={28} />
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-lg text-secondary mb-1">Movement</h4>
                    <p className="text-secondary/70 leading-relaxed">{t('moveMouse')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-tertiary-container flex items-center justify-center text-tertiary shrink-0">
                    <Ghost size={28} />
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-lg text-secondary mb-1">Enemies</h4>
                    <p className="text-secondary/70 leading-relaxed">{t('avoidGhosts')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-600 shrink-0">
                    <Coins size={28} />
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-lg text-secondary mb-1">Currency</h4>
                    <p className="text-secondary/70 leading-relaxed">Collect gold coins to buy new cats and backgrounds in the shop!</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowTutorial(false)}
                className="w-full mt-12 py-4 bg-primary text-white font-headline font-bold rounded-2xl shadow-lg hover:opacity-90 transition-opacity"
              >
                {t('close')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main 
        ref={gameAreaRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        className="relative flex-1 flex flex-col items-center justify-center bg-transparent overflow-hidden pt-16 touch-none"
      >
        <AnimatePresence mode="wait">
          {gameState === 'START' && (
            <motion.div 
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center z-10"
            >
              <div className="relative mb-8">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-24 -bottom-4 z-20 chibi-cat-container"
                >
                  <div className="relative w-48 h-48 rounded-2xl bg-white/40 backdrop-blur-sm border-4 border-primary-container flex items-center justify-center pixel-shadow">
                    <img 
                      alt="Chibi pixel art cat" 
                      className="w-full h-full object-contain" 
                      src={currentCatSkin.url}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </motion.div>

                <h1 className="text-7xl md:text-9xl font-headline font-black text-primary leading-none tracking-tighter drop-shadow-sm">
                  {t('title')}
                </h1>
                
                {highScore > 0 && (
                  <div className="mt-4 bg-primary-container/30 px-6 py-2 rounded-full border border-primary-container/50 flex items-center gap-3">
                    <Trophy size={20} className="text-primary" />
                    <span className="font-headline font-bold text-primary">{t('best')} {highScore}</span>
                  </div>
                )}

                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-16 top-0 z-20"
                >
                  <Star size={64} className="text-primary-container fill-primary-container drop-shadow-md" />
                </motion.div>
              </div>

              <p className="text-2xl md:text-3xl font-headline text-secondary mb-16 tracking-wide max-w-lg">
                {t('subtitle')}
              </p>

              <div className="flex flex-col items-center gap-12">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetGame}
                  className="macaron-button group relative flex items-center justify-center px-16 py-6 rounded-xl text-white font-headline text-2xl font-extrabold tracking-widest uppercase shadow-[0_20px_50px_rgba(141,84,96,0.3)]"
                >
                  <span className="relative z-10">{t('startGame')}</span>
                  <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </motion.button>

                <div className="flex gap-12">
                  <QuickLink icon={<LayoutDashboard size={32} />} label={t('rankings')} onClick={() => setGameState('SCORES')} />
                  <QuickLink icon={<ShoppingBag size={32} />} label={t('catShop')} onClick={() => setGameState('SHOP')} />
                  <QuickLink icon={<HelpCircle size={32} />} label={t('tutorial')} onClick={() => setShowTutorial(true)} />
                  <QuickLink icon={<User size={32} />} label={t('profile')} onClick={() => setGameState('PROFILE')} />
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'PLAYING' && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col"
            >
              {/* Game HUD */}
              <div className="absolute top-20 left-0 w-full px-8 flex justify-between items-center z-30">
                <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border-b-4 border-surface-container-highest pixel-shadow flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-headline font-black text-primary text-2xl">{score}</span>
                    <span className="text-secondary font-bold text-xs uppercase tracking-widest">{t('points')}</span>
                  </div>
                  <div className="w-px h-6 bg-outline-variant mx-1" />
                  <div className="flex items-center gap-2">
                    <Coins size={20} className="text-yellow-500 fill-yellow-200" />
                    <span className="font-headline font-black text-yellow-600 text-2xl">{coins}</span>
                  </div>
                  <div className="w-px h-6 bg-outline-variant mx-1" />
                  <span className="font-headline font-black text-secondary text-xl tracking-tighter">{t('level')} {level}</span>
                </div>
                
                <div className="flex gap-2">
                  <AnimatePresence>
                    {isFeverMode && (
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1.2, rotate: 0 }}
                        exit={{ scale: 0 }}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-2 rounded-full text-white font-black text-lg shadow-xl flex items-center gap-2 animate-bounce"
                      >
                        <FeverIcon size={20} className="fill-white" />
                        {t('fever')}
                      </motion.div>
                    )}
                    {activePowerup && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className={`px-4 py-2 rounded-full flex items-center gap-2 text-white font-bold text-sm shadow-lg ${
                          activePowerup === 'shield' ? 'bg-blue-500' : 
                          activePowerup === 'double' ? 'bg-yellow-500' :
                          activePowerup === 'magnet' ? 'bg-red-500' :
                          activePowerup === 'slow' ? 'bg-emerald-500' :
                          'bg-indigo-500'
                        }`}
                      >
                        {activePowerup === 'shield' && <Shield size={16} />}
                        {activePowerup === 'double' && <Sparkles size={16} />}
                        {activePowerup === 'magnet' && <Magnet size={16} />}
                        {activePowerup === 'slow' && <Timer size={16} />}
                        {activePowerup === 'giant' && <Maximize size={16} />}
                        
                        {activePowerup === 'shield' && 'SHIELD'}
                        {activePowerup === 'double' && '2X POINTS'}
                        {activePowerup === 'magnet' && 'MAGNET'}
                        {activePowerup === 'slow' && 'SLOW-MO'}
                        {activePowerup === 'giant' && 'GIANT CAT'}
                      </motion.div>
                    )}
                    {combo > 1 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-primary px-4 py-2 rounded-full text-white font-bold text-sm shadow-lg flex items-center gap-2"
                      >
                        <Star size={16} className="fill-white" />
                        {combo} COMBO (x{multiplier.toFixed(1)})
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => {
                      const isFull = i < Math.floor(lives);
                      const isHalf = i === Math.floor(lives) && lives % 1 !== 0;
                      return (
                        <motion.div
                          key={`heart-${i}`}
                          animate={{ 
                            scale: (isFull || isHalf) ? 1 : 0.8, 
                            opacity: (isFull || isHalf) ? 1 : 0.3 
                          }}
                        >
                          <div className="relative">
                            <Heart 
                              size={24} 
                              className={`transition-colors ${isFull || isHalf ? 'text-primary fill-primary' : 'text-outline-variant'}`} 
                            />
                            {isHalf && (
                              <div className="absolute inset-0 overflow-hidden w-1/2 bg-background">
                                <Heart 
                                  size={24} 
                                  className="text-outline-variant" 
                                />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Fever Mode Announcement */}
              <AnimatePresence>
                {showFeverAnnouncement && (
                  <motion.div
                    initial={{ scale: 0, y: 100, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 2, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
                  >
                    <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl border-4 border-white/50 shadow-2xl">
                      <h2 className="text-8xl font-black text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)] italic tracking-tighter">
                        {t('fever')}
                      </h2>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Particles */}
              {particles.map(p => (
                <motion.div
                  key={p.id}
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 0, opacity: 0, x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100 }}
                  className="absolute rounded-full z-50 pointer-events-none"
                  style={{ 
                    left: `${p.x}%`, 
                    top: `${p.y}%`, 
                    backgroundColor: p.color,
                    width: p.size || 8,
                    height: p.size || 8
                  }}
                />
              ))}

              {/* Falling Items */}
              {items.map(item => (
                <motion.div
                  key={item.id}
                  className="absolute z-20"
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                >
                  <div className="animate-wobble">
                    {item.icon}
                  </div>
                </motion.div>
              ))}
              
              {/* Floating Scores */}
              <AnimatePresence>
                {floatingScores.map(score => (
                  <motion.div
                    key={score.id}
                    initial={{ opacity: 1, y: `${score.y}%` }}
                    animate={{ opacity: 0, y: `${score.y - 15}%` }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute z-40 font-headline font-black text-primary text-2xl pointer-events-none"
                    style={{ left: `${score.x}%` }}
                  >
                    +{score.value}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Player Cat */}
              <motion.div 
                className="absolute bottom-10 z-30 chibi-cat-container"
                animate={{ 
                  left: `${catX}%`,
                  y: isCatching ? -20 : (isMoving ? 0 : [0, -4, 0]),
                  scale: activePowerup === 'giant' ? 2 : (isCatching ? 1.2 : (isMoving ? 1 : [1, 1.02, 1])),
                  rotate: isCatching ? [0, 10, -10, 0] : (isMoving ? 0 : [0, 1, -1, 0])
                }}
                transition={{ 
                  left: { type: 'spring', stiffness: 300, damping: 30 },
                  y: { repeat: isCatching ? 0 : Infinity, duration: 2, ease: "easeInOut" },
                  scale: { repeat: isCatching ? 0 : Infinity, duration: 2, ease: "easeInOut" },
                  rotate: { repeat: isCatching ? 0 : Infinity, duration: 3, ease: "easeInOut" }
                }}
                style={{ transform: 'translateX(-50%)' }}
              >
                <div className="relative w-32 h-32 flex items-center justify-center">
                  {activePowerup === 'shield' && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.4, opacity: 0.4 }}
                      className="absolute inset-0 bg-blue-400 rounded-full blur-2xl"
                    />
                  )}
                  {activePowerup === 'double' && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="absolute inset-0 bg-yellow-400 rounded-full blur-xl"
                    />
                  )}
                  <img 
                    alt="Player Cat" 
                    className="w-full h-full object-contain mix-multiply" 
                    src={currentCatSkin.spriteUrl}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>

              {/* Game Background Decorations */}
              <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="absolute top-1/4 left-1/4"><Cookie size={200} /></div>
                <div className="absolute bottom-1/4 right-1/4"><Cake size={200} /></div>
              </div>
            </motion.div>
          )}

          {gameState === 'SCORES' && (
            <motion.div
              key="scores"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-50 bg-surface-container-low flex flex-col p-8 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto w-full">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setGameState('START')}
                  className="p-4 rounded-full bg-white border-2 border-primary-container text-primary shadow-sm"
                >
                  <Home size={24} />
                </motion.button>
                <h2 className="text-4xl font-headline font-black text-primary">{t('scoreHistory')}</h2>
                <div className="w-14" /> {/* Spacer */}
              </div>

              <div className="max-w-4xl mx-auto w-full bg-white rounded-[2.5rem] p-8 border-4 border-primary-container shadow-xl">
                {scoreHistory.length === 0 ? (
                  <div className="text-center py-20">
                    <Trophy size={64} className="mx-auto text-primary-container mb-4 opacity-50" />
                    <p className="text-secondary font-headline text-xl">{t('noScores')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 px-6 py-2 text-secondary/50 font-headline font-bold text-sm uppercase tracking-widest">
                      <div className="col-span-2">{t('date')}</div>
                      <div className="text-center">{t('level')}</div>
                      <div className="text-right">{t('points')}</div>
                    </div>
                    {scoreHistory.map((entry, idx) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="grid grid-cols-4 items-center bg-surface-container-low/50 px-6 py-4 rounded-2xl border-2 border-transparent hover:border-primary-container transition-all"
                      >
                        <div className="col-span-2 font-headline font-bold text-secondary truncate">
                          {entry.date}
                        </div>
                        <div className="text-center font-headline font-black text-primary">
                          {entry.level}
                        </div>
                        <div className="text-right font-headline font-black text-primary text-xl">
                          {entry.score} <span className="text-xs font-bold text-secondary/50">{t('points_short')}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {gameState === 'PROFILE' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 z-50 bg-surface-container-low flex flex-col p-8 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto w-full">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setGameState('START')}
                  className="p-4 rounded-full bg-white border-2 border-primary-container text-primary shadow-sm"
                >
                  <Home size={24} />
                </motion.button>
                <h2 className="text-4xl font-headline font-black text-primary">{t('profile')}</h2>
                <div className="w-14" />
              </div>

              <div className="max-w-2xl mx-auto w-full space-y-6">
                {/* User Info Card */}
                <div className="bg-white rounded-[2.5rem] p-8 border-4 border-primary-container shadow-xl flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full bg-primary-container flex items-center justify-center text-primary mb-4 border-4 border-white shadow-lg">
                    <User size={64} />
                  </div>
                  <h3 className="text-2xl font-headline font-black text-secondary mb-1">Player</h3>
                  <p className="text-secondary/60 font-medium mb-6">qianchunwu070@gmail.com</p>
                  
                  <div className="grid grid-cols-3 gap-4 w-full">
                    <div className="bg-surface-container-low p-4 rounded-2xl border-2 border-primary-container/20">
                      <div className="text-primary mb-1 flex justify-center"><Gamepad2 size={20} /></div>
                      <div className="text-xl font-headline font-black text-secondary leading-none">{scoreHistory.length}</div>
                      <div className="text-[10px] uppercase tracking-widest text-secondary/50 font-bold mt-1">{t('totalGames')}</div>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-2xl border-2 border-primary-container/20">
                      <div className="text-yellow-600 mb-1 flex justify-center"><Coins size={20} /></div>
                      <div className="text-xl font-headline font-black text-secondary leading-none">{lifetimeCoins}</div>
                      <div className="text-[10px] uppercase tracking-widest text-secondary/50 font-bold mt-1">{t('lifetimeCoins')}</div>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-2xl border-2 border-primary-container/20">
                      <div className="text-tertiary mb-1 flex justify-center"><Trophy size={20} /></div>
                      <div className="text-xl font-headline font-black text-secondary leading-none">
                        {scoreHistory.length > 0 ? Math.max(...scoreHistory.map(s => s.level)) : 0}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-secondary/50 font-bold mt-1">{t('highestLevel')}</div>
                    </div>
                  </div>
                </div>

                {/* Stats Detail */}
                <div className="bg-white rounded-[2.5rem] p-8 border-4 border-primary-container shadow-xl">
                  <h4 className="font-headline font-black text-primary text-xl mb-6 uppercase tracking-wider">{t('stats')}</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-secondary font-bold">{t('best')}</span>
                      <span className="text-primary font-black text-xl">{highScore}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-secondary font-bold">{t('owned')} {t('cats')}</span>
                      <span className="text-primary font-black text-xl">{ownedCats.length} / {CAT_SKINS.length}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-secondary font-bold">{t('owned')} {t('backgrounds')}</span>
                      <span className="text-primary font-black text-xl">{ownedBackgrounds.length} / {BACKGROUNDS.length}</span>
                    </div>
                  </div>
                </div>

                <button 
                  className="w-full py-5 bg-rose-100 text-rose-600 font-headline font-black text-xl rounded-3xl border-4 border-rose-200 shadow-lg hover:bg-rose-200 transition-all flex items-center justify-center gap-3"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset all progress?')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                >
                  <Settings size={24} />
                  RESET PROGRESS
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'SHOP' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="absolute inset-0 z-50 bg-surface-container-low flex flex-col p-8 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setGameState('START')}
                  className="p-4 rounded-full bg-white border-2 border-primary-container text-primary shadow-sm"
                >
                  <Home size={24} />
                </motion.button>
                <h2 className="text-4xl font-headline font-black text-primary">{t('catShop')}</h2>
                <div className="flex items-center gap-2 bg-yellow-400/20 px-4 py-2 rounded-full border border-yellow-400/30">
                  <Coins size={20} className="text-yellow-500 fill-yellow-200" />
                  <span className="text-yellow-700 font-bold text-xl">{coins}</span>
                </div>
              </div>

              <div className="flex gap-4 mb-8 max-w-6xl mx-auto w-full">
                <button
                  onClick={() => setShopTab('cats')}
                  className={`px-8 py-3 rounded-2xl font-headline font-bold transition-all ${
                    shopTab === 'cats' 
                      ? 'bg-primary text-white shadow-md scale-105' 
                      : 'bg-white text-secondary hover:bg-primary-container/20'
                  }`}
                >
                  {t('cats')}
                </button>
                <button
                  onClick={() => setShopTab('backgrounds')}
                  className={`px-8 py-3 rounded-2xl font-headline font-bold transition-all ${
                    shopTab === 'backgrounds' 
                      ? 'bg-primary text-white shadow-md scale-105' 
                      : 'bg-white text-secondary hover:bg-primary-container/20'
                  }`}
                >
                  {t('backgrounds')}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto w-full">
                {shopTab === 'cats' ? CAT_SKINS.map(skin => {
                  const isOwned = ownedCats.includes(skin.id);
                  const isSelected = selectedCat === skin.id;
                  const canAfford = coins >= skin.price;

                  return (
                    <motion.div
                      key={skin.id}
                      whileHover={{ y: -5 }}
                      className={`relative bg-white rounded-3xl p-6 border-4 flex flex-col items-center gap-4 transition-all ${
                        isSelected ? 'border-primary shadow-lg ring-4 ring-primary/20' : 'border-primary-container/30'
                      }`}
                    >
                      <div className="w-32 h-32 relative">
                        <img
                          src={skin.url}
                          alt={skin.name}
                          className={`w-full h-full object-contain ${!isOwned ? 'grayscale opacity-50' : ''}`}
                          referrerPolicy="no-referrer"
                        />
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 bg-primary text-white p-1.5 rounded-full shadow-md">
                            <Star size={16} fill="white" />
                          </div>
                        )}
                      </div>

                      <div className="text-center">
                        <h3 className="font-headline font-bold text-xl text-secondary">
                          {language === 'zh' ? skin.nameZh : skin.name}
                        </h3>
                        {!isOwned && (
                          <div className="flex items-center justify-center gap-1 text-yellow-600 font-bold">
                            <Coins size={14} />
                            <span>{skin.price}</span>
                          </div>
                        )}
                      </div>

                      {isOwned ? (
                        <button
                          onClick={() => setSelectedCat(skin.id)}
                          disabled={isSelected}
                          className={`w-full py-3 rounded-xl font-headline font-bold uppercase tracking-wider transition-all ${
                            isSelected
                              ? 'bg-primary/10 text-primary cursor-default'
                              : 'bg-primary text-white hover:bg-primary/90'
                          }`}
                        >
                          {isSelected ? t('selected') : t('select')}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (canAfford) {
                              setCoins(c => c - skin.price);
                              setOwnedCats(prev => [...prev, skin.id]);
                              setSelectedCat(skin.id);
                              playSound('powerup');
                            }
                          }}
                          disabled={!canAfford}
                          className={`w-full py-3 rounded-xl font-headline font-bold uppercase tracking-wider transition-all ${
                            canAfford
                              ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {t('buy')}
                        </button>
                      )}
                    </motion.div>
                  );
                }) : BACKGROUNDS.map(bg => {
                  const isOwned = ownedBackgrounds.includes(bg.id);
                  const isSelected = selectedBackground === bg.id;
                  const canAfford = coins >= bg.price;

                  return (
                    <motion.div
                      key={bg.id}
                      whileHover={{ y: -5 }}
                      className={`relative bg-white rounded-3xl p-6 border-4 flex flex-col items-center gap-4 transition-all ${
                        isSelected ? 'border-primary shadow-lg ring-4 ring-primary/20' : 'border-primary-container/30'
                      }`}
                    >
                      <div className={`w-32 h-32 rounded-2xl border-2 border-gray-100 shadow-inner ${bg.color} relative overflow-hidden`}>
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 bg-primary text-white p-1.5 rounded-full shadow-md z-10">
                            <Star size={16} fill="white" />
                          </div>
                        )}
                      </div>

                      <div className="text-center">
                        <h3 className="font-headline font-bold text-xl text-secondary">
                          {language === 'zh' ? bg.nameZh : bg.name}
                        </h3>
                        {!isOwned && (
                          <div className="flex items-center justify-center gap-1 text-yellow-600 font-bold">
                            <Coins size={14} />
                            <span>{bg.price}</span>
                          </div>
                        )}
                      </div>

                      {isOwned ? (
                        <button
                          onClick={() => setSelectedBackground(bg.id)}
                          disabled={isSelected}
                          className={`w-full py-3 rounded-xl font-headline font-bold uppercase tracking-wider transition-all ${
                            isSelected
                              ? 'bg-primary/10 text-primary cursor-default'
                              : 'bg-primary text-white hover:bg-primary/90'
                          }`}
                        >
                          {isSelected ? t('selected') : t('select')}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (canAfford) {
                              setCoins(c => c - bg.price);
                              setOwnedBackgrounds(prev => [...prev, bg.id]);
                              setSelectedBackground(bg.id);
                              playSound('powerup');
                            }
                          }}
                          disabled={!canAfford}
                          className={`w-full py-3 rounded-xl font-headline font-bold uppercase tracking-wider transition-all ${
                            canAfford
                              ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {t('buy')}
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {gameState === 'PAUSED' && (
            <motion.div
              key="paused"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center z-[60] bg-white/95 backdrop-blur-md p-12 rounded-[3rem] border-4 border-primary-container shadow-2xl max-w-sm w-full mx-4"
            >
              <h2 className="text-5xl font-headline font-black text-primary mb-8">{t('paused')}</h2>
              
              <div className="flex flex-col gap-4 w-full">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameState('PLAYING')}
                  className="w-full py-5 bg-primary text-white font-headline font-black text-2xl rounded-3xl border-4 border-primary-container shadow-lg flex items-center justify-center gap-3"
                >
                  <Play size={24} fill="white" />
                  {t('resume')}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameState('START')}
                  className="w-full py-5 bg-white text-secondary font-headline font-black text-xl rounded-3xl border-4 border-primary-container shadow-lg flex items-center justify-center gap-3"
                >
                  <LogOut size={24} />
                  {t('leave')}
                </motion.button>
              </div>
            </motion.div>
          )}

          {gameState === 'GAMEOVER' && (
            <motion.div 
              key="gameover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center z-40 bg-white/90 backdrop-blur-md p-12 rounded-xl border-4 border-primary-container pixel-shadow"
            >
              <h2 className="text-6xl font-headline font-black text-primary mb-4">{t('gameOver')}</h2>
              <div className="text-3xl font-headline text-secondary mb-4">
                {t('finalScore')} <span className="text-primary font-bold">{score}</span>
              </div>
              
              <div className="flex items-center gap-3 bg-yellow-400/20 px-6 py-3 rounded-2xl border border-yellow-400/30 mb-8">
                <Coins size={32} className="text-yellow-500 fill-yellow-200" />
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-widest text-secondary font-bold">{t('totalCoins')}</div>
                  <div className="text-2xl font-headline font-black text-yellow-600 leading-none">{coins}</div>
                </div>
              </div>
              
              {score >= highScore && score > 0 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mb-8 bg-yellow-100 text-yellow-700 px-6 py-2 rounded-full font-bold flex items-center gap-2 border-2 border-yellow-200"
                >
                  <Trophy size={20} />
                  {t('newHighScore')}
                </motion.div>
              )}
              
              <div className="flex gap-4">
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-headline font-bold rounded-full hover:opacity-90 transition-opacity shadow-lg"
                >
                  <RotateCcw size={24} />
                  {t('tryAgain')}
                </button>
                <button 
                  onClick={() => setGameState('SHOP')}
                  className="flex items-center gap-2 px-8 py-4 bg-yellow-400 text-yellow-900 font-headline font-bold rounded-full hover:opacity-90 transition-opacity shadow-lg"
                >
                  <ShoppingBag size={24} />
                  {t('shop')}
                </button>
                <button 
                  onClick={() => setGameState('START')}
                  className="flex items-center gap-2 px-8 py-4 bg-secondary text-white font-headline font-bold rounded-full hover:opacity-90 transition-opacity shadow-lg"
                >
                  <Home size={24} />
                  {t('home')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Background Decorations (Always visible) */}
        <div className="absolute top-[60%] left-[5%] opacity-5 -rotate-12">
          <Donut size={180} />
        </div>

        {/* Tutorial Card (Only on Start) */}
        {gameState === 'START' && (
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="absolute -bottom-8 -right-8 w-80 bg-surface-container-highest p-10 rounded-tl-[4rem] rounded-br-[2rem] shadow-2xl rotate-2 hidden lg:block"
          >
            <h3 className="font-headline font-black text-primary text-xl mb-4 tracking-tight">{t('howToPlay')}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary">
                  <MousePointer2 size={20} />
                </div>
                <p className="text-sm font-medium text-secondary">{t('moveMouse')}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-tertiary">
                  <Zap size={20} />
                </div>
                <p className="text-sm font-medium text-secondary">{t('avoidGhosts')}</p>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-white/80 backdrop-blur-md rounded-t-[3rem] shadow-lg border-t border-primary-container/20">
        <MobileNavItem 
          icon={<Gamepad2 size={24} />} 
          label={t('play')} 
          active={gameState === 'PLAYING'} 
          onClick={() => setGameState('START')}
        />
        <MobileNavItem icon={<ShoppingBag size={24} />} label={t('shop')} onClick={() => setGameState('SHOP')} active={gameState === 'SHOP'} />
        <MobileNavItem icon={<Trophy size={24} />} label={t('scores')} onClick={() => setGameState('SCORES')} active={gameState === 'SCORES'} />
        <MobileNavItem icon={<User size={24} />} label={t('profile')} onClick={() => setGameState('PROFILE')} active={gameState === 'PROFILE'} />
      </nav>
    </div>
  );
}

function QuickLink({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group"
    >
      <div className="p-4 rounded-full bg-surface-container-highest group-hover:bg-primary-container transition-all">
        {icon}
      </div>
      <span className="font-headline font-bold text-xs tracking-widest uppercase">{label}</span>
    </button>
  );
}

function MobileNavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center transition-all ${active ? 'bg-primary-container text-primary rounded-full px-6 py-2 shadow-inner' : 'text-secondary opacity-70'}`}
    >
      {icon}
      <span className="font-body text-[10px] font-bold uppercase tracking-widest mt-1">{label}</span>
    </button>
  );
}
