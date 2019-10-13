import produce, { Draft } from 'immer'
import { IFacets } from './IFacets'

const defaultChange = {
	generation: 0,
	tr: 0,
	amount: {
		mc: 0,
		iron: 0,
		titanium: 0,
		plant: 0,
		energy: 0,
		heat: 0,
	},
	income: {
		mc: 0,
		iron: 0,
		titanium: 0,
		plant: 0,
		energy: 0,
		heat: 0,
	},
}

export interface IChange {
	readonly generation: number
	readonly tr: number
	readonly amount: IFacets<number>
	readonly income: IFacets<number>
}

export function makeChange(fn: (o: Draft<IChange>) => void): IChange {
	return produce(defaultChange, fn)
}
