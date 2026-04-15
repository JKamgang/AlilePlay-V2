export interface PlayerState {
    id: number;
    name: string;
    money: number;
    position: number;
    properties: number[];
    inJail: boolean;
    jailTurns: number;
    token: string;
}

interface BaseSpace {
    id: number;
    name: string;
    position: { row: number, col: number };
    corner?: string;
}

export interface PropertySpace extends BaseSpace {
    type: 'property';
    price: number;
    rent: number[];
    houseCost: number;
    mortgage: number;
    color: string;
    group: string;
}

export interface RailroadSpace extends BaseSpace {
    type: 'railroad';
    price: number;
}

export interface UtilitySpace extends BaseSpace {
    type: 'utility';
    price: number;
}

export interface GoSpace extends BaseSpace { type: 'go'; }
export interface JailSpace extends BaseSpace { type: 'jail'; }
export interface FreeParkingSpace extends BaseSpace { type: 'free-parking'; }
export interface GoToJailSpace extends BaseSpace { type: 'go-to-jail'; }
export interface CommunityChestSpace extends BaseSpace { type: 'community-chest'; }
export interface ChanceSpace extends BaseSpace { type: 'chance'; }
export interface TaxSpace extends BaseSpace {
    type: 'tax';
    amount: number;
}

export type BoardSpace =
    | PropertySpace
    | RailroadSpace
    | UtilitySpace
    | GoSpace
    | JailSpace
    | FreeParkingSpace
    | GoToJailSpace
    | CommunityChestSpace
    | ChanceSpace
    | TaxSpace;

export interface Card {
    description: string;
    action: 'get_money' | 'pay_money' | 'move' | 'go_to_jail' | 'get_out_of_jail' | 'repairs' | 'pay_players';
    amount?: number;
    position?: number;
    special?: 'nearest_railroad' | 'nearest_utility';
}