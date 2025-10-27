export type MinerType = {
	id: string;
	name: string;
	type: string;
	imageBase64: string;
	hashPower: number;
	dailyOutput: number;
	price: number;
	description: string;
	features: string[];
	bonusFeature: string;
};
