import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { getCountryByName } from '../../../entities/country/model/api'
import { CountryInfo } from '../../../entities/country/model/country.types'
import { BaseInputViewModel } from '../../../entities/input/model/BaseInputViewModel'

export class AutocompleteViewModel extends BaseInputViewModel {
	suggestions: CountryInfo[] = []
	isLoading: boolean = false
	isOpen: boolean = false
	maxSuggestions: number = 10
	private currentRequestId: number = 0

	constructor(maxSuggestions: number = 10) {
		super()
		this.maxSuggestions = maxSuggestions

		makeObservable(this, {
			suggestions: observable,
			isLoading: observable,
			isOpen: observable,
			visibleSuggestions: computed,
			fetchSuggestions: action,
			selectSuggestion: action,
			closeSuggestions: action,
			setLoading: action,
		})
	}

	get visibleSuggestions(): CountryInfo[] {
		const seen = new Set<string>()

		return this.suggestions
			.filter(s => {
				const key = `${s.name}-${s.fullName}`
				if (seen.has(key)) return false
				seen.add(key)
				return true
			})
			.slice(0, this.maxSuggestions)
	}

	setLoading(loading: boolean): void {
		this.isLoading = loading
	}

	async fetchSuggestions(query: string): Promise<void> {
		if (!query || query.trim().length === 0) {
			runInAction(() => {
				this.suggestions = []
				this.isOpen = false
				this.isLoading = false
			})
			return
		}

		const requestId = ++this.currentRequestId

		runInAction(() => {
			this.isLoading = true
		})

		try {
			const results = await getCountryByName(query)

			if (requestId === this.currentRequestId) {
				runInAction(() => {
					this.suggestions = results
					this.isOpen = results.length > 0
					this.isLoading = false
				})
			}
		} catch (error) {
			if (requestId === this.currentRequestId) {
				runInAction(() => {
					this.suggestions = []
					this.isLoading = false
					this.isOpen = false
				})
			}
		}
	}

	selectSuggestion(suggestion: CountryInfo): void {
		this.value = suggestion.name
		this.suggestions = []
		this.isOpen = false
		this.isLoading = false
	}

	closeSuggestions(): void {
		this.isOpen = false
	}
}
