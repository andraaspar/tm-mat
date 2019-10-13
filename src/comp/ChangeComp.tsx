import * as React from 'react'
import { formatChange } from '../function/formatChange'
import { IChange } from '../model/IChange'
import { ReactComponent as EnergySvg } from '../resource/energy.svg'
import { ReactComponent as GenerationSvg } from '../resource/generation.svg'
import { ReactComponent as HeatSvg } from '../resource/heat.svg'
import { ReactComponent as IronSvg } from '../resource/iron.svg'
import { ReactComponent as McSvg } from '../resource/mc.svg'
import { ReactComponent as PlantSvg } from '../resource/plant.svg'
import { ReactComponent as TitaniumSvg } from '../resource/titanium.svg'
import { ReactComponent as TrSvg } from '../resource/tr.svg'
import style from './AppComp.module.css'

export interface ChangeCompProps {
	_change: IChange
}

export function ChangeComp({ _change }: ChangeCompProps) {
	return (
		<>
			{_change.generation !== 0 && (
				<>
					<GenerationSvg width={16} height={16} />{' '}
					{_change.generation}{' '}
				</>
			)}
			{_change.tr !== 0 && (
				<>
					<TrSvg width={16} height={16} /> {_change.tr}{' '}
				</>
			)}
			{/* prettier-ignore */ _change.amount.mc !== 0 && <><McSvg width={16} height={16} /> <span className={style.historyValue}>{formatChange(_change.amount.mc)}</span>{' '}</>}
			{/* prettier-ignore */ _change.amount.iron !== 0 && <><IronSvg width={16} height={16} /> <span className={style.historyValue}>{formatChange(_change.amount.iron)}</span>{' '}</>}
			{/* prettier-ignore */ _change.amount.titanium !== 0 && <><TitaniumSvg width={16} height={16} /> <span className={style.historyValue}>{formatChange(_change.amount.titanium)}</span>{' '}</>}
			{/* prettier-ignore */ _change.amount.plant !== 0 && <><PlantSvg width={16} height={16} /> <span className={style.historyValue}>{formatChange(_change.amount.plant)}</span>{' '}</>}
			{/* prettier-ignore */ _change.amount.energy !== 0 && <><EnergySvg width={16} height={16} /> <span className={style.historyValue}>{formatChange(_change.amount.energy)}</span>{' '}</>}
			{/* prettier-ignore */ _change.amount.heat !== 0 && <><HeatSvg width={16} height={16} /> <span className={style.historyValue}>{formatChange(_change.amount.heat)}</span>{' '}</>}
			{/* prettier-ignore */ _change.income.mc !== 0 && <><McSvg width={16} height={16} /> <span className={[style.historyValue, style.income].join(' ')}>{formatChange(_change.income.mc)}</span>{' '}</>}
			{/* prettier-ignore */ _change.income.iron !== 0 && <><IronSvg width={16} height={16} /> <span className={[style.historyValue, style.income].join(' ')}>{formatChange(_change.income.iron)}</span>{' '}</>}
			{/* prettier-ignore */ _change.income.titanium !== 0 && <><TitaniumSvg width={16} height={16} /> <span className={[style.historyValue, style.income].join(' ')}>{formatChange(_change.income.titanium)}</span>{' '}</>}
			{/* prettier-ignore */ _change.income.plant !== 0 && <><PlantSvg width={16} height={16} /> <span className={[style.historyValue, style.income].join(' ')}>{formatChange(_change.income.plant)}</span>{' '}</>}
			{/* prettier-ignore */ _change.income.energy !== 0 && <><EnergySvg width={16} height={16} /> <span className={[style.historyValue, style.income].join(' ')}>{formatChange(_change.income.energy)}</span>{' '}</>}
			{/* prettier-ignore */ _change.income.heat !== 0 && <><HeatSvg width={16} height={16} /> <span className={[style.historyValue, style.income].join(' ')}>{formatChange(_change.income.heat)}</span>{' '}</>}
		</>
	)
}
