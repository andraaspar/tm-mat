import { Draft, produce } from 'immer'
import * as React from 'react'
import { useState } from 'react'
import { getMatValues } from '../function/getMatValues'
import { matToChange } from '../function/matToChange'
import { IChange } from '../model/IChange'
import { IMat } from '../model/IMat'
import { IMutableValue } from '../model/IMutableValue'
import { ReactComponent as EnergySvg } from '../resource/energy.svg'
import { ReactComponent as GenerationSvg } from '../resource/generation.svg'
import { ReactComponent as HeatSvg } from '../resource/heat.svg'
import { ReactComponent as IronSvg } from '../resource/iron.svg'
import { ReactComponent as LeftSvg } from '../resource/left.svg'
import { ReactComponent as McSvg } from '../resource/mc.svg'
import { ReactComponent as PlantSvg } from '../resource/plant.svg'
import { ReactComponent as PlusSvg } from '../resource/plus.svg'
import { ReactComponent as RightSvg } from '../resource/right.svg'
import { ReactComponent as TitaniumSvg } from '../resource/titanium.svg'
import { ReactComponent as TrSvg } from '../resource/tr.svg'
import style from './AppComp.module.css'
import { ChangeComp } from './ChangeComp'
import { MutableValueComp } from './MutableValueComp'

export interface AppCompProps {}

const defaultMat: IMat = {
	generation: 1,
	tr: { current: 20, change: 0, isValid: true },
	amount: {
		mc: { current: 42, change: 0, isValid: true },
		iron: { current: 0, change: 0, isValid: true },
		titanium: { current: 0, change: 0, isValid: true },
		plant: { current: 0, change: 0, isValid: true },
		energy: { current: 0, change: 0, isValid: true },
		heat: { current: 0, change: 0, isValid: true },
	},
	income: {
		mc: { current: 1, change: 0, isValid: true },
		iron: { current: 1, change: 0, isValid: true },
		titanium: { current: 1, change: 0, isValid: true },
		plant: { current: 1, change: 0, isValid: true },
		energy: { current: 1, change: 0, isValid: true },
		heat: { current: 1, change: 0, isValid: true },
	},
}

export function AppComp(props: AppCompProps) {
	const [$historyPage, set$historyPage] = useState(0)
	const [$history, set$history] = useState<readonly IChange[]>(
		() => loadHistory() || [],
	)
	const [$mat, set$mat] = useState<IMat>(() => historyToMat($history))
	const lastPage = Math.max(0, Math.ceil($history.length / 10) - 1)
	function persistHistory(history: readonly IChange[]) {
		localStorage.setItem('history', JSON.stringify(history))
	}
	function loadHistory(): readonly IChange[] | null {
		return JSON.parse(localStorage.getItem('history') || 'null')
	}
	function addChangeToHistory(change: IChange) {
		const newHistory = [change, ...$history]
		set$historyPage(0)
		set$history(newHistory)
		persistHistory(newHistory)
		set$mat(historyToMat(newHistory))
	}
	function makeHistory(oldMat: IMat, newMat: IMat) {
		addChangeToHistory(matToChange(oldMat, newMat))
	}
	function nextGeneration() {
		const newMat = produce($mat, mat => {
			mat.generation++

			mat.amount.heat.current += mat.amount.energy.current
			mat.amount.energy.current = 0

			mat.amount.mc.current += mat.tr.current + mat.income.mc.current
			mat.amount.iron.current += mat.income.iron.current
			mat.amount.titanium.current += mat.income.titanium.current
			mat.amount.plant.current += mat.income.plant.current
			mat.amount.energy.current += mat.income.energy.current
			mat.amount.heat.current += mat.income.heat.current
		})
		set$mat(newMat)
		makeHistory($mat, newMat)
	}
	function applyChanges() {
		const newMat = produce($mat, mat => {
			for (const value of getMatValues(mat) as Draft<IMutableValue>[]) {
				value.current += value.change
				value.change = 0
			}
		})
		makeHistory($mat, newMat)
	}
	function cancelChanges() {
		const newMat = produce($mat, mat => {
			for (const value of getMatValues(mat) as Draft<IMutableValue>[]) {
				value.change = 0
				value.isValid = true
			}
		})
		set$mat(newMat)
	}
	function historyToMat(history: readonly IChange[]): IMat {
		return produce(defaultMat, mat => {
			for (const change of history) {
				mat.generation += change.generation

				mat.tr.current += change.tr

				mat.amount.mc.current += change.amount.mc
				mat.amount.iron.current += change.amount.iron
				mat.amount.titanium.current += change.amount.titanium
				mat.amount.plant.current += change.amount.plant
				mat.amount.energy.current += change.amount.energy
				mat.amount.heat.current += change.amount.heat

				mat.income.mc.current += change.income.mc
				mat.income.iron.current += change.income.iron
				mat.income.titanium.current += change.income.titanium
				mat.income.plant.current += change.income.plant
				mat.income.energy.current += change.income.energy
				mat.income.heat.current += change.income.heat
			}
		})
	}
	function isValid() {
		return !getMatValues($mat).find(_ => !_.isValid)
	}
	function hasChange() {
		return !!getMatValues($mat).find(_ => _.change)
	}
	return (
		<div className={style.appWrapper}>
			<div className={style.contentWrapper}>
				<div>
					<button
						type='button'
						onClick={() => {
							if (window.confirm('Biztos új játékot kezdesz?')) {
								set$historyPage(0)
								const newHistory: readonly IChange[] = []
								set$history(newHistory)
								persistHistory(newHistory)
								set$mat(historyToMat(newHistory))
							}
						}}
						disabled={$history.length === 0}
					>
						Új játék
					</button>
				</div>
				<div className={style.generationWrapper}>
					<GenerationSvg className={style.generationIcon} />{' '}
					<span className={style.generationCount}>
						{$mat.generation}. generáció{' '}
					</span>
					<button
						type='button'
						className={style.generationNext}
						onClick={() => {
							nextGeneration()
						}}
						disabled={hasChange()}
					>
						<PlusSvg className='smallIcon' />
					</button>
				</div>
				<div className={style.table}>
					<TrSvg className={style.tableIcon} />
					<div className={style.tableAmount}>
						<MutableValueComp
							_value={$mat.tr}
							_setValue={tr => {
								set$mat({ ...$mat, tr })
							}}
							_min={20}
						/>
					</div>
					<McSvg className={style.tableIcon} />
					<div className={style.tableAmount}>
						<MutableValueComp
							_value={$mat.amount.mc}
							_setValue={mc => {
								set$mat(
									produce($mat, mat => {
										mat.amount.mc = mc as Draft<
											IMutableValue
										>
									}),
								)
							}}
							_min={0}
						/>
					</div>
					<div className={style.tableIncome}>
						<MutableValueComp
							_value={$mat.income.mc}
							_setValue={mc => {
								set$mat(
									produce($mat, mat => {
										mat.income.mc = mc as Draft<
											IMutableValue
										>
									}),
								)
							}}
							_min={-5}
							_isIncome
						/>
					</div>
					<IronSvg className={style.tableIcon} />
					<div className={style.tableAmount}>
						<MutableValueComp
							_value={$mat.amount.iron}
							_setValue={iron => {
								set$mat(
									produce($mat, mat => {
										mat.amount.iron = iron as Draft<
											IMutableValue
										>
									}),
								)
							}}
							_min={0}
						/>
					</div>
					<div className={style.tableIncome}>
						<MutableValueComp
							_value={$mat.income.iron}
							_setValue={iron => {
								set$mat(
									produce($mat, mat => {
										mat.income.iron = iron as Draft<
											IMutableValue
										>
									}),
								)
							}}
							_min={0}
							_isIncome
						/>
					</div>
					<TitaniumSvg className={style.tableIcon} />
					<div className={style.tableAmount}>
						<MutableValueComp
							_value={$mat.amount.titanium}
							_setValue={titanium => {
								set$mat(
									produce($mat, mat => {
										mat.amount.titanium = titanium as Draft<
											IMutableValue
										>
									}),
								)
							}}
							_min={0}
						/>
					</div>
					<div className={style.tableIncome}>
						<MutableValueComp
							_value={$mat.income.titanium}
							_setValue={titanium => {
								set$mat(
									produce($mat, mat => {
										mat.income.titanium = titanium as Draft<
											IMutableValue
										>
									}),
								)
							}}
							_min={0}
							_isIncome
						/>
					</div>
					<PlantSvg className={style.tableIcon} />
					<div className={style.tableAmount}>
						<MutableValueComp
							_value={$mat.amount.plant}
							_setValue={plant => {
								set$mat(
									produce($mat, mat => {
										mat.amount.plant = plant as Draft<
											IMutableValue
										>
									}),
								)
							}}
							_min={0}
						/>
					</div>
					<div className={style.tableIncome}>
						<MutableValueComp
							_value={$mat.income.plant}
							_setValue={plant => {
								set$mat(
									produce($mat, mat => {
										mat.income.plant = plant as Draft<
											IMutableValue
										>
									}),
								)
							}}
							_min={0}
							_isIncome
						/>
					</div>
					<EnergySvg className={style.tableIcon} />
					<div className={style.tableAmount}>
						<MutableValueComp
							_value={$mat.amount.energy}
							_setValue={energy => {
								set$mat(
									produce($mat, mat => {
										mat.amount.energy = energy as Draft<
											IMutableValue
										>
									}),
								)
							}}
							_min={0}
						/>
					</div>
					<div className={style.tableIncome}>
						<MutableValueComp
							_value={$mat.income.energy}
							_setValue={energy => {
								set$mat(
									produce($mat, mat => {
										mat.income.energy = energy as Draft<
											IMutableValue
										>
									}),
								)
							}}
							_min={0}
							_isIncome
						/>
					</div>
					<HeatSvg className={style.tableIcon} />
					<div className={style.tableAmount}>
						<MutableValueComp
							_value={$mat.amount.heat}
							_setValue={heat => {
								set$mat(
									produce($mat, mat => {
										mat.amount.heat = heat as Draft<
											IMutableValue
										>
									}),
								)
							}}
							_min={0}
						/>
					</div>
					<div className={style.tableIncome}>
						<MutableValueComp
							_value={$mat.income.heat}
							_setValue={heat => {
								set$mat(
									produce($mat, mat => {
										mat.income.heat = heat as Draft<
											IMutableValue
										>
									}),
								)
							}}
							_min={0}
							_isIncome
						/>
					</div>
				</div>
				<div className={style.okCancelWrapper}>
					<button
						type='button'
						onClick={() => {
							applyChanges()
						}}
						disabled={!isValid() || !hasChange()}
					>
						OK
					</button>
					<button
						type='button'
						onClick={() => {
							cancelChanges()
						}}
						disabled={!hasChange()}
					>
						Mégse
					</button>{' '}
				</div>
				{$history.length > 0 && (
					<>
						<div className={style.historyWrapper}>
							{$history
								.slice(
									$historyPage * 10,
									$historyPage * 10 + 10,
								)
								.map((change, index) => (
									<ChangeComp key={index} _change={change} />
								))}
						</div>
						<div className={style.pagingWrapper}>
							<button
								type='button'
								onClick={() => {
									set$historyPage($historyPage - 1)
								}}
								disabled={$historyPage === 0}
							>
								<LeftSvg className='smallIcon' />
							</button>{' '}
							<button
								type='button'
								onClick={() => {
									if (window.confirm('Biztos visszavonod?')) {
										set$historyPage(0)
										const newHistory = $history.slice(1)
										set$history(newHistory)
										persistHistory(newHistory)
										set$mat(historyToMat(newHistory))
									}
								}}
								disabled={$history.length === 0}
							>
								Visszavonom
							</button>{' '}
							<button
								type='button'
								onClick={() => {
									set$historyPage($historyPage + 1)
								}}
								disabled={$historyPage === lastPage}
							>
								<RightSvg className='smallIcon' />
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	)
}
