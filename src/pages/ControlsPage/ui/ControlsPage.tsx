import React, { useState } from 'react'
import { AutocompleteViewModel } from '../../../features/autocomplete/model/AutocompleteViewModel'
import { AutocompleteInput } from '../../../features/autocomplete/ui/AutocompleteInput'
import { ButtonInputViewModel } from '../../../features/button-input/model/ButtonInputViewModel'
import { ButtonInput } from '../../../features/button-input/ui/ButtonInput'
import styles from './ControlsPage.module.scss'

export const ControlsPage: React.FC = () => {
	const [buttonVM1] = useState<ButtonInputViewModel>(
		() => new ButtonInputViewModel()
	)
	const [buttonVM2] = useState<ButtonInputViewModel>(
		() => new ButtonInputViewModel()
	)
	const [autocompleteVM1] = useState<AutocompleteViewModel>(
		() => new AutocompleteViewModel(3)
	)
	const [autocompleteVM2] = useState<AutocompleteViewModel>(
		() => new AutocompleteViewModel(10)
	)

	return (
		<div className={styles.wrapper}>
			<h1>React Controls</h1>
			<section>
				<h2>Button Controls</h2>
				<div className={styles.block}>
					<h3>Button Control 1</h3>
					<ButtonInput
						viewModel={buttonVM1}
						rightButtons={[
							{
								text: 'Очистить',
								onClick: () => buttonVM1.clear(),
							},
							{
								text: 'Hello World',
								onClick: () => buttonVM1.setValue('Hello world!'),
							},
						]}
					/>
				</div>
				<div className={styles.block}>
					<h3>Button Control 2</h3>
					<ButtonInput
						viewModel={buttonVM2}
						leftButtons={[
							{
								text: 'Проверить число',
								onClick: () => {
									const value = buttonVM2.value.trim()
									const num = Number(value)
									if (value && !isNaN(num)) {
										alert(num)
									} else {
										alert('Введите число!')
									}
								},
							},
						]}
						rightButtons={[
							{
								text: 'Показать Alert',
								onClick: () => alert(buttonVM2.value || 'Вы ничего не ввели!'),
							},
						]}
					/>
				</div>
			</section>
			<section>
				<h2>Autocomplete Controls</h2>
				<div className={styles.block}>
					<h3>Autocomplete Control 1: 3 подсказки</h3>
					<AutocompleteInput
						viewModel={autocompleteVM1}
						placeholder='Введите страну...'
					/>
				</div>
				<div className={styles.block}>
					<h3>Autocomplete Control 2: 10 подсказок</h3>
					<AutocompleteInput
						viewModel={autocompleteVM2}
						placeholder='Введите страну...'
					/>
				</div>
			</section>
		</div>
	)
}
