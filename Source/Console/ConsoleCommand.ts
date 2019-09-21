/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { Command } from "@dolittle/tooling.common.commands";
import { IDependencyResolvers, PromptDependency, argumentUserInputType } from "@dolittle/tooling.common.dependencies";
import { ILoggers } from "@dolittle/tooling.common.logging";
import { ICanOutputMessages, NullMessageOutputter, IBusyIndicator, NullBusyIndicator } from "@dolittle/tooling.common.utilities";

import { ContainerClient } from '@dolittle/fundamentals.dependencyinversion.grpc/dolittle/dependencyinversion/management/container_grpc_pb';
import { GetBindingsRequest, Bindings } from "@dolittle/fundamentals.dependencyinversion.grpc/dolittle/dependencyinversion/management/container_pb";

import grpc from '@dolittle/fundamentals.dependencyinversion.grpc';

import readline from 'readline';


const name = 'console';
const description = 'Starts a console on a running Dolittle instance';

const hostDependency = new PromptDependency(
    'host',
    'Host to connect console to',
    argumentUserInputType,
    'Host to connect console to'
);

function makeShortName(type:any) {
    let index = type.indexOf(',');
    return type.substr(0,index);
}


/**
 * Represents an implementation of {ICommand} for creating a dolittle application
 *
 * @export
 * @class ApplicationCommand
 * @extends {Command}
 */
export class ConsoleCommand extends Command {

    /**
     * Instantiates an instance of {ApplicationCommand}.
     * @param {IApplicationsManager} _applicationsManager
     * @param {IDependencyResolvers} _dependencyResolvers
     */
    constructor(private _logger: ILoggers) {
        super(name, description, false, undefined, [hostDependency]);
    }

    async action(dependencyResolvers: IDependencyResolvers, cwd: string, coreLanguage: string, commandArguments?: string[], options?: Map<string, any>, namespace?: string,
        outputter: ICanOutputMessages = new NullMessageOutputter(), busyIndicator: IBusyIndicator = new NullBusyIndicator()) {
        let context = await dependencyResolvers.resolve({}, this.dependencies, cwd, coreLanguage, commandArguments, options);
        let host = context[hostDependency.name];

        outputter.print(`Connecting console to ${host}`);
        let credentials = grpc.credentials.createInsecure();

        let client = new ContainerClient(host, credentials);
        /*
        client.getBindings(new GetBindingsRequest(), (error, bindings) => {
            let formatted: any[] = [];
            if (bindings) {
                let bindingsObject = bindings.toObject();
               
                bindingsObject.bindingsList.forEach((binding: any) => {
                    formatted.push({
                        'Service': makeShortName(binding.service),
                        'Strategy': binding.strategy,
                        'Scope': binding.scope
                    })
                });
            }
            outputter.table(formatted);

        });
        */

        
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        });

        function prompt() {
            process.stdout.write(`\x1b[32m${host} \x1b[33m$> \x1b[37m`);
        }

        prompt();

        rl.on('line', function (cmd) {
            if( cmd == 'bindings') {
                client.getBindings(new GetBindingsRequest(), (error, bindings) => {
                    let formatted: any[] = [];
                    if (bindings) {
                        let bindingsObject = bindings.toObject();
                       
                        bindingsObject.bindingsList.forEach((binding: any) => {
                            formatted.push({
                                'Service': makeShortName(binding.service),
                                'Strategy': binding.strategy,
                                'Scope': binding.scope
                            })
                        });
                    }
                    outputter.table(formatted);
                    prompt();
                });
            } else {
                if( cmd != '') console.log('Unknown command');

                prompt();
            }
            
        });

        // Stdin -> [Magic Translation] -> Grpc -> Stdout       
    }

    getAllDependencies(cwd: string, coreLanguage: string, commandArguments?: string[], commandOptions?: Map<string, any>, namespace?: string) {
        return this.dependencies;
    }
}