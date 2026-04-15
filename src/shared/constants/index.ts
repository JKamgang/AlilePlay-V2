import { Game, LeaderboardPlayer, Tournament } from '@/shared/types';
import { SudokuIcon, TetrisIcon, ScrabbleIcon, ChessIcon, CardIcon, CheckersIcon, MonopolyIcon, LudoIcon } from '@/shared/ui/Icons/Icons';

export const GAMES: Game[] = [
  { id: 'scrabble', nameKey: 'game_word_master', descriptionKey: 'desc_word_master', icon: ScrabbleIcon, status: 'playable', categoryKey: 'cat_strategy' },
  { id: 'chess', nameKey: 'game_chess', descriptionKey: 'desc_chess', icon: ChessIcon, status: 'playable', categoryKey: 'cat_strategy', modes: [{ labelKey: 'mode_pvp', value: 'player' }, { labelKey: 'mode_pva', value: 'ai' }, { labelKey: 'mode_team', value: 'team' }] },
  { id: 'checkers', nameKey: 'game_checkers', descriptionKey: 'desc_checkers', icon: CheckersIcon, status: 'playable', categoryKey: 'cat_board' },
  { id: 'monopoly', nameKey: 'game_monopoly', descriptionKey: 'desc_monopoly', icon: MonopolyIcon, status: 'playable', categoryKey: 'cat_board' },
  { id: 'sudoku', nameKey: 'game_sudoku', descriptionKey: 'desc_sudoku', icon: SudokuIcon, status: 'playable', categoryKey: 'cat_puzzle', options: [{ labelKey: 'difficulty_easy', value: '9x9_easy' }, { labelKey: 'difficulty_medium', value: '9x9_medium' }, { labelKey: 'difficulty_hard', value: '9x9_hard' }] },
  { id: 'tetris', nameKey: 'game_tetris', descriptionKey: 'desc_tetris', icon: TetrisIcon, status: 'playable', categoryKey: 'cat_puzzle' },
  { id: 'tictactoe', nameKey: 'game_tictactoe', descriptionKey: 'desc_tictactoe', icon: LudoIcon, status: 'playable', categoryKey: 'cat_board' },
  { id: 'poker', nameKey: 'game_poker', descriptionKey: 'desc_poker', icon: CardIcon, status: 'coming_soon', categoryKey: 'cat_card' },
  { id: 'uno', nameKey: 'game_uno', descriptionKey: 'desc_uno', icon: CardIcon, status: 'coming_soon', categoryKey: 'cat_card' },
  { id: 'solitaire', nameKey: 'game_solitaire', descriptionKey: 'desc_solitaire', icon: CardIcon, status: 'coming_soon', categoryKey: 'cat_card' },
  { id: 'ludo', nameKey: 'game_ludo', descriptionKey: 'desc_ludo', icon: LudoIcon, status: 'coming_soon', categoryKey: 'cat_board' },
];

export const MOCK_ANALYTICS_DATA = [
  { time: '10:00', value: 120 }, { time: '11:00', value: 200 },
  { time: '12:00', value: 150 }, { time: '13:00', value: 220 },
  { time: '14:00', value: 180 }, { time: '15:00', value: 250 },
  { time: '16:00', value: 230 },
];

export const MOCK_LEADERBOARD: LeaderboardPlayer[] = [
    { id: 'p1', name: 'Alex', avatar: 'https://i.pravatar.cc/40?u=alex', overallScore: 1580, scores: { scrabble: 1200, chess: 380, tetris: 15800 } },
    { id: 'p2', name: 'Brenda', avatar: 'https://i.pravatar.cc/40?u=brenda', overallScore: 1450, scores: { scrabble: 950, chess: 500, tetris: 11200 } },
    { id: 'p3', name: 'Charlie', avatar: 'https://i.pravatar.cc/40?u=charlie', overallScore: 1300, scores: { scrabble: 600, chess: 700, tetris: 9500 } },
];

export const MOCK_TOURNAMENTS: Tournament[] = [
    { id: 't1', gameKey: 'tourn_wm_challenge', prize: '$500', startsInKey: 'starts_2_hours' },
    { id: 't2', gameKey: 'tourn_chess_champ', prize: '$2,500', startsInKey: 'starts_3_days' },
    { id: 't3', gameKey: 'tourn_sudoku_speed', prize: '$250', startsInKey: 'starts_5_days' },
];

export const LETTER_SCORES: { [key: string]: number } = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3,
  N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
};

export const TILE_BAG = 'AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRRSSSSTTTTTTUUUUVVWWXYYZ';

export const BOARD_LAYOUT = [
    ['3W', null, null, '2L', null, null, null, '3W', null, null, null, '2L', null, null, '3W'],
    [null, '2W', null, null, null, '3L', null, null, null, '3L', null, null, null, '2W', null],
    [null, null, '2W', null, null, null, '2L', null, '2L', null, null, null, '2W', null, null],
    ['2L', null, null, '2W', null, null, null, '2L', null, null, null, '2W', null, null, '2L'],
    [null, null, null, null, '2W', null, null, null, null, null, '2W', null, null, null, null],
    [null, '3L', null, null, null, '3L', null, null, null, '3L', null, null, null, '3L', null],
    [null, null, '2L', null, null, null, '2L', null, '2L', null, null, null, '2L', null, null],
    ['3W', null, null, '2L', null, null, null, 'STAR', null, null, null, '2L', null, null, '3W'],
    [null, null, '2L', null, null, null, '2L', null, '2L', null, null, null, '2L', null, null],
    [null, '3L', null, null, null, '3L', null, null, null, '3L', null, null, null, '3L', null],
    [null, null, null, null, '2W', null, null, null, null, null, '2W', null, null, null, null],
    ['2L', null, null, '2W', null, null, null, '2L', null, null, null, '2W', null, null, '2L'],
    [null, null, '2W', null, null, null, '2L', null, '2L', null, null, null, '2W', null, null],
    [null, '2W', null, null, null, '3L', null, null, null, '3L', null, null, null, '2W', null],
    ['3W', null, null, '2L', null, null, null, '3W', null, null, null, '2L', null, null, '3W'],
];

export const PUZZLES = {
    '9x9_easy': {
        puzzle: '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79',
        solution: '534678912672195348198342567859761423426853791713924856961537284287419635345286179'
    },
    '9x9_medium': {
        puzzle: '..9.7...5.6.3...8..1.2.6...8....4..7.......6..1....4...5.8.3..2...9.4...1..6.2',
        solution: '48967231536731528951298674389524167..etc' // Example, not a full solution
    },
    '9x9_hard': {
        puzzle: '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..',
        solution: '812753649943682175675491283154237896369845721287169534521974368438526917796318452'
    }
};