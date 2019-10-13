import { IFacets } from './IFacets'
import { IMutableValue } from './IMutableValue'

export interface IMat {
	readonly generation: number
	readonly tr: IMutableValue
	readonly amount: IFacets
	readonly income: IFacets
}
