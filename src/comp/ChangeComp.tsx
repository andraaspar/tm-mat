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
import style from './ChangeComp.module.css'

export interface ChangeCompProps {
	_change: IChange
}

export function ChangeComp({ _change }: ChangeCompProps) {
	return (
		<div className={style.wrapper}>
			<div className={style.inner}>
				{_change.generation !== 0 && (
					<span className={style.valueWrapper}>
						<GenerationSvg className={style.icon} />{' '}
						<span className={style.value}>
							{_change.generation}
						</span>
					</span>
				)}
				{_change.tr !== 0 && (
					<span className={style.valueWrapper}>
						<TrSvg className={style.icon} />{' '}
						<span className={style.value}>{_change.tr}</span>
					</span>
				)}
				{/* prettier-ignore */ _change.amount.mc !== 0 && <span className={style.valueWrapper}><McSvg className={style.icon} /> <span className={style.value}>{formatChange(_change.amount.mc)}</span> </span>}
				{/* prettier-ignore */ _change.amount.iron !== 0 && <span className={style.valueWrapper}><IronSvg className={style.icon} /> <span className={style.value}>{formatChange(_change.amount.iron)}</span> </span>}
				{/* prettier-ignore */ _change.amount.titanium !== 0 && <span className={style.valueWrapper}><TitaniumSvg className={style.icon} /> <span className={style.value}>{formatChange(_change.amount.titanium)}</span> </span>}
				{/* prettier-ignore */ _change.amount.plant !== 0 && <span className={style.valueWrapper}><PlantSvg className={style.icon} /> <span className={style.value}>{formatChange(_change.amount.plant)}</span> </span>}
				{/* prettier-ignore */ _change.amount.energy !== 0 && <span className={style.valueWrapper}><EnergySvg className={style.icon} /> <span className={style.value}>{formatChange(_change.amount.energy)}</span> </span>}
				{/* prettier-ignore */ _change.amount.heat !== 0 && <span className={style.valueWrapper}><HeatSvg className={style.icon} /> <span className={style.value}>{formatChange(_change.amount.heat)}</span> </span>}
				{/* prettier-ignore */ _change.income.mc !== 0 && <span className={style.valueWrapper}><McSvg className={style.icon} /> <span className={[style.value, style.income].join(' ')}>{formatChange(_change.income.mc)}</span> </span>}
				{/* prettier-ignore */ _change.income.iron !== 0 && <span className={style.valueWrapper}><IronSvg className={style.icon} /> <span className={[style.value, style.income].join(' ')}>{formatChange(_change.income.iron)}</span> </span>}
				{/* prettier-ignore */ _change.income.titanium !== 0 && <span className={style.valueWrapper}><TitaniumSvg className={style.icon} /> <span className={[style.value, style.income].join(' ')}>{formatChange(_change.income.titanium)}</span> </span>}
				{/* prettier-ignore */ _change.income.plant !== 0 && <span className={style.valueWrapper}><PlantSvg className={style.icon} /> <span className={[style.value, style.income].join(' ')}>{formatChange(_change.income.plant)}</span> </span>}
				{/* prettier-ignore */ _change.income.energy !== 0 && <span className={style.valueWrapper}><EnergySvg className={style.icon} /> <span className={[style.value, style.income].join(' ')}>{formatChange(_change.income.energy)}</span> </span>}
				{/* prettier-ignore */ _change.income.heat !== 0 && <span className={style.valueWrapper}><HeatSvg className={style.icon} /> <span className={[style.value, style.income].join(' ')}>{formatChange(_change.income.heat)}</span> </span>}
			</div>
		</div>
	)
}
