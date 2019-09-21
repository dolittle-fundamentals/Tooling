/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { contentBoilerplates, scriptRunner, templatesBoilerplates } from "@dolittle/tooling.common.boilerplates";
import { fileSystem, folders } from "@dolittle/tooling.common.files";
import { loggers } from "@dolittle/tooling.common.logging";
import { dependencyResolvers } from "@dolittle/tooling.common.dependencies";
import { DefaultCommandGroupsProvider, DefaultCommandsProvider, NamespaceProvider, FundamentalNamespace, ConsoleCommand } from "./index";
import { dolittleConfig } from "@dolittle/tooling.common.configurations";

export let defaultCommandGroupsProvider = new DefaultCommandGroupsProvider([
    
]);

export let defaultCommandsProvider = new DefaultCommandsProvider([
    new ConsoleCommand(loggers)
]);
export let namespaceProvider = new NamespaceProvider([new FundamentalNamespace()]);
