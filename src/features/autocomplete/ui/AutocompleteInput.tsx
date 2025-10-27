import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'
import { useDebounce } from '../../../shared/hooks/useDebounce'
import { Flag } from '../../../shared/ui/Flag'
import { AutocompleteViewModel } from '../model/AutocompleteViewModel'
import styles from './AutocompleteInput.module.scss'

interface AutocompleteInputProps {
	viewModel: AutocompleteViewModel
	placeholder?: string
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = observer(
	({ viewModel, placeholder = 'Введите страну...' }) => {
		const wrapperRef = useRef<HTMLDivElement>(null)
		const inputRef = useRef<HTMLInputElement>(null)

		const debouncedValue = useDebounce(viewModel.value, 300)

		useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				if (
					wrapperRef.current &&
					!wrapperRef.current.contains(event.target as Node)
				) {
					viewModel.closeSuggestions()
				}
			}

			document.addEventListener('mousedown', handleClickOutside)
			return () => document.removeEventListener('mousedown', handleClickOutside)
		}, [viewModel])

		useEffect(() => {
			if (
				debouncedValue !== viewModel.value &&
				viewModel.value.trim().length > 0
			) {
				viewModel.setLoading(true)
			}
		}, [viewModel.value, debouncedValue, viewModel])

		useEffect(() => {
			viewModel.fetchSuggestions(debouncedValue)
		}, [debouncedValue, viewModel])

		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			viewModel.setValue(e.target.value)
		}

		const handleFocus = () => {
			if (viewModel.value.trim().length > 0) {
				viewModel.fetchSuggestions(viewModel.value)
			}
		}

		return (
			<div ref={wrapperRef} className={styles.wrapper}>
				<input
					ref={inputRef}
					type='text'
					value={viewModel.value}
					onFocus={handleFocus}
					onChange={handleInputChange}
					placeholder={placeholder}
					className={styles.input}
				/>

				{viewModel.isLoading && (
					<div className={styles.loading}>Loading...</div>
				)}

				{viewModel.isOpen && viewModel.visibleSuggestions.length > 0 && (
					<div className={styles.suggestions}>
						{viewModel.visibleSuggestions.map((suggestion, idx) => (
							<div
								key={`${suggestion.name}-${idx}`}
								onClick={() => viewModel.selectSuggestion(suggestion)}
								className={styles.suggestion}
							>
								<div className={styles.suggestionColumns}>
									<Flag
										src={suggestion.flag}
										alt={suggestion.name}
										width={20}
									/>
									<div>
										<div className={styles.suggestionName}>
											{suggestion.name}
										</div>
										<div className={styles.suggestionFullName}>
											{suggestion.fullName}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		)
	}
)
