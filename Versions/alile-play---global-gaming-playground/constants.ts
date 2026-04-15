
import type { Game, MonetizationPlan, User } from './types';
import { Language, Theme, SkillLevel } from './types';
import ChessGame from './features/games/chess/ChessGame';
import CheckersGame from './features/games/checkers/CheckersGame';
import TicTacToeGame from './features/games/tic-tac-toe/TicTacToeGame';

export const GAMES: Game[] = [
  {
    id: 'chess',
    nameKey: 'game_chess_name',
    categoryKey: 'game_chess_category',
    status: 'playable',
    enabled: true,
    visible: true,
    component: ChessGame,
    descriptionKey: 'game_chess_desc',
    rulesKey: 'game_chess_rules',
    historyKey: 'game_chess_history',
    funFactsKey: ['game_chess_fact1', 'game_chess_fact2', 'game_chess_fact3'],
    options: [
      { id: 'difficulty', labelKey: 'option_difficulty', type: 'select',
        values: [
          { value: SkillLevel.BEGINNER, labelKey: 'skill_beginner' },
          { value: SkillLevel.INTERMEDIATE, labelKey: 'skill_intermediate' },
          { value: SkillLevel.ADVANCED, labelKey: 'skill_advanced' },
        ],
        defaultValue: SkillLevel.INTERMEDIATE
      }
    ],
  },
  {
    id: 'checkers',
    nameKey: 'game_checkers_name',
    categoryKey: 'game_checkers_category',
    status: 'playable',
    enabled: true,
    visible: true,
    component: CheckersGame,
    descriptionKey: 'game_checkers_desc',
    rulesKey: 'game_checkers_rules',
    historyKey: 'game_checkers_history',
    funFactsKey: ['game_checkers_fact1', 'game_checkers_fact2'],
  },
  {
    id: 'tic-tac-toe',
    nameKey: 'game_tictactoe_name',
    categoryKey: 'game_tictactoe_category',
    status: 'playable',
    enabled: true,
    visible: true,
    component: TicTacToeGame,
    descriptionKey: 'game_tictactoe_desc',
    rulesKey: 'game_tictactoe_rules',
    historyKey: 'game_tictactoe_history',
    funFactsKey: ['game_tictactoe_fact1'],
  },
  {
    id: 'sudoku',
    nameKey: 'game_sudoku_name',
    categoryKey: 'game_sudoku_category',
    status: 'coming_soon',
    enabled: true,
    visible: true,
    component: () => null,
    descriptionKey: 'game_sudoku_desc',
    rulesKey: 'game_sudoku_rules',
    historyKey: 'game_sudoku_history',
    funFactsKey: [],
  },
  {
    id: 'wordmaster',
    nameKey: 'game_wordmaster_name',
    categoryKey: 'game_wordmaster_category',
    status: 'coming_soon',
    enabled: true,
    visible: false, // For testers only
    component: () => null,
    descriptionKey: 'game_wordmaster_desc',
    rulesKey: 'game_wordmaster_rules',
    historyKey: 'game_wordmaster_history',
    funFactsKey: [],
  },
];

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  [Language.EN]: {
    // General
    'alile_play': 'Alile Play',
    'game_library': 'Game Library',
    'pricing': 'Pricing',
    'coming_soon': 'Coming Soon',
    'play_now': 'Play Now',
    'back_to_library': 'Back to Library',
    'start_game': 'Start Game',
    'game_lobby': 'Game Lobby',
    'rules': 'Rules',
    'history': 'History',
    'fun_facts': 'Fun Facts',
    'game_options': 'Game Options',
    'select_level': 'Select your level',
    'skill_beginner': 'Beginner',
    'skill_intermediate': 'Intermediate',
    'skill_advanced': 'Advanced',
    'option_difficulty': 'AI Difficulty',
    'ai_chat_placeholder': 'Ask Alile AI...',
    'ai_chat_title': 'Alile AI Assistant',
    'error_boundary_title': 'Oops! Something went wrong.',
    'error_boundary_message': 'An unexpected error occurred. Please refresh the page to continue.',

    // Chess
    'game_chess_name': 'Chess',
    'game_chess_category': 'Strategy',
    'game_chess_desc': 'The ultimate game of strategy and intellect. Checkmate the opponent\'s king to win.',
    'game_chess_rules': 'Each player starts with 16 pieces. The objective is to checkmate the opponent\'s king. Each piece type moves in a different way.',
    'game_chess_history': 'Originating in India in the 6th century, chess spread to Persia and the Muslim world before reaching Europe.',
    'game_chess_fact1': 'The longest chess game theoretically possible is 5,949 moves.',
    'game_chess_fact2': 'The word "Checkmate" comes from the Persian phrase "Shah Mat," meaning "the King is dead."',
    'game_chess_fact3': 'A grandmaster\'s brain is a marvel of pattern recognition, able to recall tens of thousands of game positions.',
    'chess_turn_your': 'Your Turn',
    'chess_turn_ai': 'AI\'s Turn',
    'chess_check': 'Check!',
    'chess_checkmate': 'Checkmate!',
    'chess_draw': 'Draw!',

    // Checkers
    'game_checkers_name': 'Checkers',
    'game_checkers_category': 'Strategy',
    'game_checkers_desc': 'A classic board game where players jump over opponent pieces to capture them.',
    'game_checkers_rules': 'Move your pieces diagonally forward. Capture opponent pieces by jumping over them. Reach the other side to become a King.',
    'game_checkers_history': 'A form of checkers was played by the ancient Egyptians.',
    'game_checkers_fact1': 'The number of possible positions in checkers is about 500 quintillion.',
    'game_checkers_fact2': 'The world\'s first checkers computer program was written in 1952.',

    // Tic-Tac-Toe
    'game_tictactoe_name': 'Tic-Tac-Toe',
    'game_tictactoe_category': 'Puzzle',
    'game_tictactoe_desc': 'A simple but classic game of getting three in a row.',
    'game_tictactoe_rules': 'Players take turns marking spaces in a 3×3 grid. The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row wins.',
    'game_tictactoe_history': 'An early variant of Tic-Tac-Toe was played in the Roman Empire, around the first century BC.',
    'game_tictactoe_fact1': 'A perfect Tic-Tac-Toe game always ends in a draw.',

    // Sudoku
    'game_sudoku_name': 'Sudoku',
    'game_sudoku_category': 'Puzzle',
    'game_sudoku_desc': 'A logic-based number-placement puzzle.',
    'game_sudoku_rules': 'Fill a 9x9 grid so that each column, each row, and each of the nine 3x3 subgrids contain all of the digits from 1 to 9.',
    'game_sudoku_history': 'The modern version of Sudoku was invented in the United States in 1979, but became popular in Japan in the 1980s.',

    // Word Master
    'game_wordmaster_name': 'Word Master',
    'game_wordmaster_category': 'Word',
    'game_wordmaster_desc': 'Guess the secret word in six tries.',
    'game_wordmaster_rules': 'Each guess must be a valid five-letter word. Hit the enter button to submit. After each guess, the color of the tiles will change to show how close your guess was to the word.',
    'game_wordmaster_history': 'Inspired by the classic pen-and-paper game Jotto and the TV game show Lingo, it exploded in popularity in the early 2020s.',

    // Pricing
    'plan_free_name': 'Free Plan',
    'plan_preview_name': 'Preview',
    'plan_a_name': 'Apprentice',
    'plan_b_name': 'Journeyman',
    'plan_c_name': 'Master',
    'plan_corp_name': 'Corporate',
    'plan_free_feat1': 'Play up to 3 games',
    'plan_free_feat2': 'Community access',
    'plan_preview_feat1': 'Test new games',
    'plan_preview_feat2': 'Provide feedback',
    'plan_a_feat1': '3 games, 25 plays/month',
    'plan_a_feat2': 'Max 10 plays per game',
    'plan_b_feat1': '20 games, 100 plays/month',
    'plan_b_feat2': 'Max 50 plays per game',
    'plan_c_feat1': '50 games, 500 plays/month',
    'plan_c_feat2': 'Max 250 plays per game',
    'plan_corp_feat1': 'Custom solutions',
    'plan_corp_feat2': 'Contact us for details',
    'btn_select_plan': 'Select Plan',
    'featured_plan': 'Featured',
  },
  [Language.ES]: {
    // General
    'alile_play': 'Alile Juega',
    'game_library': 'Biblioteca de Juegos',
    'pricing': 'Precios',
    'coming_soon': 'Próximamente',
    'play_now': 'Jugar Ahora',
    'back_to_library': 'Volver a la Biblioteca',
    'start_game': 'Empezar Juego',
    'game_lobby': 'Lobby del Juego',
    'rules': 'Reglas',
    'history': 'Historia',
    'fun_facts': 'Datos Curiosos',
    'game_options': 'Opciones de Juego',
    'select_level': 'Selecciona tu nivel',
    'skill_beginner': 'Principiante',
    'skill_intermediate': 'Intermedio',
    'skill_advanced': 'Avanzado',
    'option_difficulty': 'Dificultad de la IA',
    'ai_chat_placeholder': 'Pregúntale a Alile AI...',
    'ai_chat_title': 'Asistente Alile AI',
    'error_boundary_title': '¡Uy! Algo salió mal.',
    'error_boundary_message': 'Ocurrió un error inesperado. Por favor, actualiza la página para continuar.',

    // Chess
    'game_chess_name': 'Ajedrez',
    'game_chess_category': 'Estrategia',
    'game_chess_desc': 'El juego definitivo de estrategia e intelecto. Haz jaque mate al rey oponente para ganar.',
    'game_chess_rules': 'Cada jugador comienza con 16 piezas. El objetivo es hacer jaque mate al rey del oponente. Cada tipo de pieza se mueve de una manera diferente.',
    'game_chess_history': 'Originario de la India en el siglo VI, el ajedrez se extendió a Persia y al mundo musulmán antes de llegar a Europa.',
    'game_chess_fact1': 'La partida de ajedrez teóricamente más larga posible es de 5,949 movimientos.',
    'game_chess_fact2': 'La palabra "Jaque Mate" proviene de la frase persa "Shah Mat", que significa "el Rey ha muerto".',
    'game_chess_fact3': 'El cerebro de un gran maestro es una maravilla del reconocimiento de patrones, capaz de recordar decenas de miles de posiciones de juego.',
    'chess_turn_your': 'Tu Turno',
    'chess_turn_ai': 'Turno de la IA',
    'chess_check': '¡Jaque!',
    'chess_checkmate': '¡Jaque Mate!',
    'chess_draw': '¡Tablas!',

    // ... (Add more Spanish translations)
  },
};


export const PLANS: MonetizationPlan[] = [
    { id: 'free', nameKey: 'plan_free_name', price: 0, featuresKey: ['plan_free_feat1', 'plan_free_feat2'], isFeatured: false },
    { id: 'a', nameKey: 'plan_a_name', price: 10, featuresKey: ['plan_a_feat1', 'plan_a_feat2'], isFeatured: false, monthlyGameLimit: 25, perGameLimit: 10 },
    { id: 'b', nameKey: 'plan_b_name', price: 30, featuresKey: ['plan_b_feat1', 'plan_b_feat2'], isFeatured: true, monthlyGameLimit: 100, perGameLimit: 50 },
    { id: 'c', nameKey: 'plan_c_name', price: 50, featuresKey: ['plan_c_feat1', 'plan_c_feat2'], isFeatured: false, monthlyGameLimit: 500, perGameLimit: 250 },
    { id: 'corp', nameKey: 'plan_corp_name', price: -1, featuresKey: ['plan_corp_feat1', 'plan_corp_feat2'], isFeatured: false },
];

export const DEFAULT_USER: User = {
    name: 'PlayerOne',
    role: 'tester', // 'public', 'tester', 'admin'
    preferences: {
        theme: Theme.DARK,
        language: Language.EN,
        skillLevels: {
            'chess': SkillLevel.INTERMEDIATE,
        }
    },
    subscription: {
        planId: 'b',
        gamesPlayedThisMonth: 12,
        gamePlays: {
            'chess': 5,
            'checkers': 7,
        }
    }
};
