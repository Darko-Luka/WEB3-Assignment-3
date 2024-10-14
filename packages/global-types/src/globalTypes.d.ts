export type CardType = "SKIP" | "NUMBERED" | "REVERSE" | "DRAW" | "WILD" | "WILD DRAW";
export type CardColor = "BLUE" | "GREEN" | "RED" | "YELLOW";

export interface Card {
	type: CardType;
	color?: CardColor;
	number?: number;
}

export type UnoFailure = {
	accuser: number;
	accused: number;
};

export type Player = {
	index: number;
	name: string;
};
