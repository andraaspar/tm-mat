import { IFacets } from './IFacets'

export interface IChange {
	readonly generation: number
	readonly tr: number
	readonly amount: IFacets<number>
	readonly income: IFacets<number>
}
