/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { ITerminalConfigurationService } from 'vs/workbench/contrib/terminal/browser/terminal';
import { DEFAULT_BOLD_FONT_WEIGHT, DEFAULT_FONT_WEIGHT, FontWeight, ITerminalConfiguration, MAXIMUM_FONT_WEIGHT, MINIMUM_FONT_WEIGHT, TERMINAL_CONFIG_SECTION } from 'vs/workbench/contrib/terminal/common/terminal';

export class TerminalConfigurationService implements ITerminalConfigurationService {
	declare _serviceBrand: undefined;

	config: any;

	// private readonly _onConfigChanged = new Emitter<void>();
	// get onConfigChanged(): Event<void> { return this._onConfigChanged.event; }

	constructor(
		@IConfigurationService private readonly _configurationService: IConfigurationService,
	) {
		this._updateConfig();
		this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TERMINAL_CONFIG_SECTION)) {
				this._updateConfig();
			}
		});
	}

	private _updateConfig(): void {
		const configValues = { ...this._configurationService.getValue<ITerminalConfiguration>(TERMINAL_CONFIG_SECTION) };
		configValues.fontWeight = this._normalizeFontWeight(configValues.fontWeight, DEFAULT_FONT_WEIGHT);
		configValues.fontWeightBold = this._normalizeFontWeight(configValues.fontWeightBold, DEFAULT_BOLD_FONT_WEIGHT);
		this.config = configValues;
	}

	private _normalizeFontWeight(input: any, defaultWeight: FontWeight): FontWeight {
		if (input === 'normal' || input === 'bold') {
			return input;
		}
		return clampInt(input, MINIMUM_FONT_WEIGHT, MAXIMUM_FONT_WEIGHT, defaultWeight);
	}
}


function clampInt<T>(source: any, minimum: number, maximum: number, fallback: T): number | T {
	let r = parseInt(source, 10);
	if (isNaN(r)) {
		return fallback;
	}
	if (typeof minimum === 'number') {
		r = Math.max(minimum, r);
	}
	if (typeof maximum === 'number') {
		r = Math.min(maximum, r);
	}
	return r;
}