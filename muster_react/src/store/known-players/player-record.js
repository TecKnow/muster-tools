import { Record } from "immutable";

export const PlayerRecord = Record(
	{
		name: null,
		DCINumber: null,
		UUID: null
	},
	"PlayerRecord"
);

export default PlayerRecord;
