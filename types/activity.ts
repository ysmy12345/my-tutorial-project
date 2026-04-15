export interface ServerAction {
  id: string;
  serverId: string;
  userId: string;
  type: string;
  status: string;
  title: string;
  description: string;
  createdDate: string;
}

export interface ServerActionsResponse {
  items: ServerAction[];
  total: number;
}

export interface ServerStatus {
  title: string;
  value: string;
}

export interface ServerActivityType {
  title: string;
  value: string;
}



export function parseActivityMetadata(
  activity: ServerAction,
  tMyVps: any,
  tPayment: any,
  tCommon: any,
  tUpgradeServer?: any,
  tActivity?:any,
) {
  let title = activity.title;
  let description = activity.description;
  let match;
  //console.log(activity);
  switch (activity.type) {
    case "POWER_OFF":
      title = tActivity('powerOff');
      match = description.match(/Power Off Server (.+)/);

      if (match) {
        const [, vpsId] = match;

        description = tActivity('powerOffDes', {
          vpsId: vpsId,
        });
      }
      break;
    case "POWER_ON":
      title = tActivity('start');
      match = description.match(/Power On Server (.+)/);

      if (match) {
        const [, vpsId] = match;

        description = tActivity('startDes', {
          vpsId: vpsId,
        });
      }
      break;
    case "REBOOT":
      title = tActivity('reboot');
      match = description.match(/Reboot Server (.+)/);

      if (match) {
        const [, vpsId] = match;

        description = tActivity('rebootDes', {
          vpsId: vpsId,
        });
      }
      break;
    case "START":
    case "START_SERVER":
      title = tActivity('start');
      match = description.match(/Start Server (.+)/);

      if (match) {
        const [, vpsId] = match;

        description = tActivity('startDes', {
          vpsId: vpsId,
        });
      }
      break;
    case "STOP":
    case "STOP_SERVER":
      title = tActivity('shutdown');
      match = description.match(/Stop Server (.+)/);

      if (match) {
        const [, vpsId] = match;

        description = tActivity('shutdownDes', {
          vpsId: vpsId,
        });
      }
      break;
    case "ENABLE_RESCUE_MODE":
      // "Enable" + "Rescue Mode"
      title = tActivity('enableRescueMode');
      match = description.match(/Enable Rescue Mode (.+)/);

      if (match) {
        const [, vpsId] = match;

        description = tActivity('enableRescueModeDes', {
          vpsId: vpsId,
        });
      }
      break;
    case "DISABLE_RESCUE_MODE":
      title = tActivity('disableRescueMode');
      match = description.match(/Disable Rescue Mode (.+)/);

      if (match) {
        const [, vpsId] = match;

        description = tActivity('disableRescueModeDes', {
          vpsId: vpsId,
        });
      }
      break;
    case "ENABLE_CONSOLE_ACCESS":
      title = tActivity('enableConsoleAccess');
      match = description.match(/Enable Console Access (.+)/);

      if (match) {
        const [, vpsId] = match;

        description = tActivity('enableConsoleAccessDes', {
          vpsId: vpsId,
        });
      }
      break;
    case "DISABLE_CONSOLE_ACCESS":
      title = tActivity('disableConsoleAccess');
      match = description.match(/Disable Console Access (.+)/);

      if (match) {
        const [, vpsId] = match;

        description = tActivity('disableConsoleAccessDes', {
          vpsId: vpsId,
        });
      }
      break;
    case "LAUNCH_SERVER":
      title = tActivity('newServerCreation');
      match = description.match(/Launch New Server (.+)/);

      if (match) {
        const [, vpsId] = match;

        description = tActivity('newServerCreationDes', {
          vpsId: vpsId,
        });
      }
      break;
    case "TERMINATE_SERVER":
      title = tMyVps('terminate');
      match = description.match(/Terminate Server (.+)/);

      if (match) {
        const [, vpsId] = match;

        description = tActivity('terminateServerDes', {
          vpsId: vpsId,
        });
      }
      break;
    case "UPGRADE_SERVER":
      title = tUpgradeServer ? tActivity('upgrade'): "Upgrade Server";
      match = description.match(/Upgrade from (.+) to (.+)/);

      if (match) {
        const [, fromPlan, toPlan] = match;

        description = tActivity('serverUpgradeDes', {
          from: fromPlan,
          to: toPlan,
        });
      }
      break;
  }
  return { title, description };
}
