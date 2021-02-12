/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Server } from 'vs/base/parts/ipc/node/ipc.cp';
import { ProxyChannel } from 'vs/base/parts/ipc/common/ipc';
import { PtyService } from 'vs/platform/terminal/node/ptyService';
import { TerminalIpcChannels } from 'vs/platform/terminal/common/terminal';
import { ConsoleLogger, LogService } from 'vs/platform/log/common/log';
import { LogLevelChannel } from 'vs/platform/log/common/logIpc';
import { SimpleWorkspaceContextService } from 'vs/editor/standalone/browser/simpleServices';

const server = new Server('ptyHost');

const logService = new LogService(new ConsoleLogger());
const logChannel = new LogLevelChannel(logService);
const workspaceContextService = new SimpleWorkspaceContextService();
server.registerChannel(TerminalIpcChannels.Log, logChannel);

const service = new PtyService(logService, workspaceContextService);
server.registerChannel(TerminalIpcChannels.PtyHost, ProxyChannel.fromService(service));

process.once('exit', () => {
	logService.dispose();
	service.dispose();
});
