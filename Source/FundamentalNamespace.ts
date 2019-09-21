/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { Namespace } from "@dolittle/tooling.common.commands";

const name = 'fundamental';
const description = 'The fundamental namespace';

export class FundamentalNamespace extends Namespace {

    constructor() {
        super(name, [], [], description)
    }
}